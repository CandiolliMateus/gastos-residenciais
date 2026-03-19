// src/pages/CategoriaForm.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, TextField, MenuItem, Paper, Typography } from "@mui/material";
import { createCategoria, getCategoria, updateCategoria, deleteCategoria } from "../api";
import type { Categoria } from "../types";

const finalidadeOptions = [
  { value: 1, label: "Despesa" },
  { value: 2, label: "Receita" },
  { value: 3, label: "Ambas" }
];

type FormState = {
  id?: number;
  descricao: string;
  finalidade: number;
};

type ApiErrors = Record<string, string>;

const CategoriaForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({ descricao: "", finalidade: 1 });
  const [errors, setErrors] = useState<ApiErrors>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id && id !== "new") carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const carregar = async () => {
    try {
      setLoading(true);
      const res = await getCategoria(Number(id));
      const c: Categoria = res.data;
      setForm({ id: c.id, descricao: c.descricao, finalidade: c.finalidade });
    } catch (err: any) {
      if (err.response?.status === 404) {
        navigate("/categorias");
        return;
      }
      alert(err.response?.data?.detail ?? "Erro ao carregar categoria");
    } finally {
      setLoading(false);
    }
  };

  const isCreate = !id || id === "new";

  const validateClient = (): boolean => {
    const v: ApiErrors = {};
    if (!form.descricao.trim()) v["descricao"] = "Descrição é obrigatória.";
    if (form.descricao.trim() && form.descricao.trim().length > 400) v["descricao"] = "Descrição deve ter no máximo 400 caracteres.";
    if (![1, 2, 3].includes(form.finalidade)) v["finalidade"] = "Finalidade inválida. Use 1 (Despesa), 2 (Receita) ou 3 (Ambas).";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateClient()) return;

    try {
      setLoading(true);
      if (isCreate) {
        await createCategoria({ descricao: form.descricao, finalidade: form.finalidade });
      } else {
        const payload = { id: Number(id), descricao: form.descricao, finalidade: form.finalidade };
        await updateCategoria(Number(id), payload);
      }
      navigate("/categorias");
    } catch (err: any) {
      if (err.response?.data?.errors) {
        mapApiErrors(err.response.data.errors);
      } else {
        alert(err.response?.data?.detail ?? "Erro ao salvar categoria");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id || id === "new") return;
    if (!confirm("Deseja realmente excluir esta categoria?")) return;

    try {
      setLoading(true);
      await deleteCategoria(Number(id));
      navigate("/categorias");
    } catch (err: any) {
      alert(err.response?.data?.detail ?? "Erro ao excluir categoria");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3}>
      <Paper elevation={3} sx={{ width: "100%", maxWidth: "none", boxSizing: "border-box", p: { xs: 2, md: 3 }, mx: 0 }}>
        <Typography variant="h5" mb={2}>
          {isCreate ? "Nova Categoria" : "Editar Categoria"}
        </Typography>

        <form onSubmit={handleSubmit} noValidate>
          <TextField
            label="Descrição"
            fullWidth
            margin="normal"
            value={form.descricao}
            onChange={e => setForm(s => ({ ...s, descricao: e.target.value }))}
            error={!!errors["descricao"]}
            helperText={errors["descricao"]}
            disabled={loading}
          />

          <TextField
            select
            label="Finalidade"
            fullWidth
            margin="normal"
            value={form.finalidade}
            onChange={e => setForm(s => ({ ...s, finalidade: Number(e.target.value) }))}
            error={!!errors["finalidade"]}
            helperText={errors["finalidade"]}
            disabled={loading}
          >
            {finalidadeOptions.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
          </TextField>

          <Box mt={2} display="flex" gap={2} justifyContent="flex-end">
            <Button variant="outlined" onClick={() => navigate("/categorias")} disabled={loading}>
              CANCELAR
            </Button>

            {!isCreate && (
              <Button variant="contained" color="error" onClick={handleDelete} disabled={loading}>
                EXCLUIR
              </Button>
            )}

            <Button variant="contained" type="submit" disabled={loading}>
              SALVAR
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default CategoriaForm;
