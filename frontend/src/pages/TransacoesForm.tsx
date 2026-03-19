// src/pages/TransacoesForm.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  createTransacao,
  getTransacaoById,
  updateTransacao,
  deleteTransacao,
  getPessoas,
  getCategorias,
} from "../api";
import type { Pessoa, Categoria } from "../types";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  MenuItem,
} from "@mui/material";

type ApiErrors = Record<string, string>;

const TransacoesForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState<string>("");
  const [tipo, setTipo] = useState<"despesa" | "receita">("despesa");
  const [pessoaId, setPessoaId] = useState<string>("");
  const [categoriaId, setCategoriaId] = useState<string>("");

  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ApiErrors>({});

  useEffect(() => {
    carregarDados();
    if (id && id !== "new") carregarTransacao(Number(id));
  }, [id]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [resPessoas, resCategorias] = await Promise.all([getPessoas(), getCategorias()]);
      setPessoas(resPessoas.data);
      setCategorias(resCategorias.data);
    } catch (err: any) {
      console.error("Erro ao carregar pessoas/categorias", err);
      alert(err?.response?.data?.detail ?? "Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  const carregarTransacao = async (transacaoId: number) => {
    try {
      setLoading(true);
      const res = await getTransacaoById(transacaoId);
      const t = res.data;
      setDescricao(t.descricao ?? "");
      setValor(t.valor != null ? String(t.valor) : "");
      setTipo(t.tipo === 2 ? "receita" : "despesa");
      setPessoaId(t.pessoaId != null ? String(t.pessoaId) : "");
      setCategoriaId(t.categoriaId != null ? String(t.categoriaId) : "");
    } catch (err: any) {
      console.error("Erro ao carregar transação", err);
      if (err.response?.status === 404) {
        navigate("/transacoes");
        return;
      }
      alert(err?.response?.data?.detail ?? "Erro ao carregar transação");
    } finally {
      setLoading(false);
    }
  };

  const tipoMap: Record<"despesa" | "receita", number> = {
    despesa: 1,
    receita: 2,
  };

  const isCreate = !id || id === "new";

  const validateClient = (): boolean => {
    const v: ApiErrors = {};
    if (!descricao.trim()) v["descricao"] = "Descrição é obrigatória.";
    if (!valor.trim()) v["valor"] = "Valor é obrigatório.";
    else if (isNaN(Number(valor))) v["valor"] = "Valor inválido.";
    if (!pessoaId) v["pessoaid"] = "Pessoa é obrigatória.";
    if (!categoriaId) v["categoriaid"] = "Categoria é obrigatória.";
    setErrors(v);
    return Object.keys(v).length === 0;
  };

  const mapApiErrors = (apiErrors: any) => {
    const flat: ApiErrors = {};
    Object.keys(apiErrors).forEach((k) => {
      const key = k.toLowerCase();
      flat[key] = apiErrors[k].join ? apiErrors[k].join(", ") : String(apiErrors[k]);
    });
    setErrors(flat);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    console.log("handleSave called", { id, descricao, valor, tipo, pessoaId, categoriaId, isCreate });

    if (!validateClient()) {
      console.log("Validação cliente falhou");
      return;
    }

    const transacao = {
      descricao,
      valor: Number(valor),
      tipo: tipoMap[tipo],
      pessoaId: Number(pessoaId),
      categoriaId: Number(categoriaId),
    };

    try {
      setLoading(true);
      setErrors({});
      if (isCreate) {
        await createTransacao(transacao);
      } else {
        // inclui id no payload caso o backend espere
        const payload = { id: Number(id), ...transacao };
        await updateTransacao(Number(id), payload);
      }
      navigate("/transacoes");
    } catch (err: any) {
      console.error("Erro ao salvar transação", err);
      if (err.response?.data?.errors) {
        mapApiErrors(err.response.data.errors);
      } else {
        alert(err?.response?.data?.detail ?? "Erro ao salvar transação");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id || id === "new") return;
    if (!confirm("Deseja realmente excluir esta transação?")) return;

    try {
      setLoading(true);
      await deleteTransacao(Number(id)); // backend deve realizar soft delete
      navigate("/transacoes");
    } catch (err: any) {
      console.error("Erro ao excluir transação", err);
      alert(err?.response?.data?.detail ?? "Erro ao excluir transação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        {isCreate ? "Nova Transação" : "Editar Transação"}
      </Typography>

      <Paper elevation={3} sx={{ width: "100%", maxWidth: "none", boxSizing: "border-box", p: { xs: 2, md: 3 }, mx: 0 }}>
        {/* usar form onSubmit garante que o botão type="submit" dispare o handler */}
        <form onSubmit={handleSave} noValidate>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Descrição"
              variant="outlined"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              fullWidth
              disabled={loading}
              error={!!errors["descricao"]}
              helperText={errors["descricao"]}
            />

            <TextField
              label="Valor"
              variant="outlined"
              value={valor}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, "");
                if (!raw) {
                  setValor("");
                  return;
                }
                const number = parseFloat(raw) / 100;
                const formatted = new Intl.NumberFormat("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(number);

                setValor(formatted);
              }}
              fullWidth
              disabled={loading}
              error={!!errors["valor"]}
              helperText={errors["valor"]}
            />

            <TextField
              select
              label="Tipo"
              value={tipo}
              onChange={(e) => setTipo(e.target.value as "despesa" | "receita")}
              fullWidth
              disabled={loading}
              error={!!errors["tipo"]}
              helperText={errors["tipo"]}
            >
              <MenuItem value="despesa">Despesa</MenuItem>
              <MenuItem value="receita">Receita</MenuItem>
            </TextField>

            <TextField
              select
              label="Pessoa"
              value={pessoaId}
              onChange={(e) => setPessoaId(e.target.value)}
              fullWidth
              disabled={loading}
              error={!!errors["pessoaid"] || !!errors["pessoa"]}
              helperText={errors["pessoaid"] ?? errors["pessoa"]}
            >
              {pessoas.map((p) => (
                <MenuItem key={p.id} value={String(p.id)}>
                  {p.nome}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Categoria"
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              fullWidth
              disabled={loading}
              error={!!errors["categoriaid"] || !!errors["categoria"]}
              helperText={errors["categoriaid"] ?? errors["categoria"]}
            >
              {categorias.map((c) => (
                <MenuItem key={c.id} value={String(c.id)}>
                  {c.descricao}
                </MenuItem>
              ))}
            </TextField>

            <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
              <Button variant="outlined" onClick={() => navigate("/transacoes")} disabled={loading} type="button">
                CANCELAR
              </Button>

              {!isCreate && (
                <Button variant="contained" color="error" onClick={handleDelete} disabled={loading} type="button">
                  EXCLUIR
                </Button>
              )}

              {/* botão submit: dispara onSubmit do form */}
              <Button variant="contained" color="primary" type="submit" disabled={loading}>
                SALVAR
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default TransacoesForm;
