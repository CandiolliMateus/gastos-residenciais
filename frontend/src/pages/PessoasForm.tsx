// src/pages/PessoasForm.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createPessoa, updatePessoa, getPessoaById, deletePessoa } from "../api";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";

const PessoasForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState<string>("");
  const [erro, setErro] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id && id !== "new") {
      carregarPessoa(Number(id));
    }
  }, [id]);

  const carregarPessoa = async (pessoaId: number) => {
    try {
      setLoading(true);
      const res = await getPessoaById(pessoaId);
      setNome(res.data.nome ?? "");
      setIdade(res.data.idade != null ? String(res.data.idade) : "");
    } catch (error: any) {
      const msg = extractApiErrorMessage(error) ?? "Erro ao carregar pessoa";
      setErro(msg);
      if (error?.response?.status === 404) {
        navigate("/pessoas");
      }
    } finally {
      setLoading(false);
    }
  };

  // utilitário para extrair mensagem legível do response do backend
  function extractApiErrorMessage(error: any): string {
    const resp = error?.response?.data;
    if (!resp) {
      return error?.message ?? "Erro desconhecido";
    }

    // ASP.NET ProblemDetails com campo errors: { Nome: ["..."], Outro: ["..."] }
    if (resp.errors && typeof resp.errors === "object") {
      try {
        const msgs = Object.values(resp.errors)
          .flatMap((v: any) => (Array.isArray(v) ? v : [v]))
          .filter(Boolean)
          .map((m: any) => String(m));
        if (msgs.length) return msgs.join(" ; ");
      } catch {
        // fallback
      }
    }

    // Campo customizado "erro"
    if (typeof resp.erro === "string" && resp.erro.trim()) return resp.erro;

    // ProblemDetails.detail
    if (typeof resp.detail === "string" && resp.detail.trim()) return resp.detail;

    // title / message
    if (typeof resp.title === "string" && resp.title.trim()) return resp.title;

    try {
      return JSON.stringify(resp);
    } catch {
      return "Erro ao processar resposta do servidor";
    }
  }

  const isNew = !id || id === "new";

  const handleSave = async () => {
    const idadeNum = Number(idade);
    if (!nome || isNaN(idadeNum) || idadeNum <= 0) {
      setErro("Nome e idade válidos são obrigatórios (idade > 0).");
      return;
    }

    try {
      setLoading(true);
      const payload = { nome, idade: idadeNum };
      console.log("PessoasForm: id param =", id, "isNew =", isNew, "payload =", payload);

      if (isNew) {
        const res = await createPessoa(payload);
        console.log("createPessoa:", res.status, res.data);
        setSuccess("Pessoa criada com sucesso.");
      } else {
        const parsedId = Number(id);
        if (!Number.isFinite(parsedId)) throw new Error(`ID inválido para update: ${id}`);
        const res = await updatePessoa(parsedId, { id: parsedId, nome, idade: idadeNum });
        console.log("updatePessoa:", res.status, res.data);
        setSuccess("Pessoa atualizada com sucesso.");
      }

      navigate("/pessoas");
    } catch (error: any) {
      console.error("Erro ao salvar pessoa:", error);
      const mensagem = extractApiErrorMessage(error);
      setErro(mensagem);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id || id === "new") return;
    const parsedId = Number(id);
    if (!Number.isFinite(parsedId)) {
      setErro("ID inválido para exclusão.");
      return;
    }
    if (!confirm("Deseja realmente excluir esta pessoa?")) return;

    try {
      setLoading(true);
      await deletePessoa(parsedId);
      setSuccess("Pessoa excluída.");
      navigate("/pessoas");
    } catch (error: any) {
      console.error("Erro ao excluir pessoa:", error);
      const mensagem = extractApiErrorMessage(error);
      setErro(mensagem ?? "Erro ao excluir pessoa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        {id === "new" ? "Nova Pessoa" : "Editar Pessoa"}
      </Typography>

      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: "none",
          boxSizing: "border-box",
          p: { xs: 2, md: 3 },
          mx: 0,
        }}
      >
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Nome"
            variant="outlined"
            value={nome}
            onChange={(e) => {
              const value = e.target.value;
              if (/^[^0-9]*$/.test(value)) {
                setNome(value);
              }
            }}
            fullWidth
            disabled={loading}
          />

          <TextField
            label="Idade"
            type="text"
            variant="outlined"
            value={idade}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                setIdade(value);
              }
            }}
            fullWidth
            disabled={loading}
            sx={{
              "& input": {
                MozAppearance: "textfield",
              },
              "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                WebkitAppearance: "none",
                margin: 0,
              },
            }}
          />

          <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
            <Button variant="outlined" onClick={() => navigate("/pessoas")} disabled={loading}>
              CANCELAR
            </Button>

            {id && id !== "new" && (
              <Button variant="contained" color="error" onClick={handleDelete} disabled={loading}>
                EXCLUIR
              </Button>
            )}

            <Button variant="contained" color="primary" onClick={handleSave} disabled={loading}>
              SALVAR
            </Button>
          </Box>
        </Box>
      </Paper>

      <Snackbar open={!!erro} autoHideDuration={6000} onClose={() => setErro(null)}>
        <Alert severity="error" onClose={() => setErro(null)}>
          {erro?.split(" ; ").map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </Alert>
      </Snackbar>

      <Snackbar open={!!success} autoHideDuration={3000} onClose={() => setSuccess(null)}>
        <Alert severity="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PessoasForm;
