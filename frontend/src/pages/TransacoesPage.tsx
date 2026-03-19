// src/pages/TransacoesPorPessoa.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  CircularProgress,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import type { Transacao, TransacoesPorPessoa } from "../types";

const formatCurrency = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const TransacoesPorPessoaPage: React.FC = () => {
  const [groups, setGroups] = useState<TransacoesPorPessoa[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    carregar();
  }, []);

  const carregar = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get<TransacoesPorPessoa[]>("http://localhost:5077/api/transacoes");
      setGroups(res.data ?? []);
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? "Erro ao carregar transações");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Deseja realmente excluir esta transação?")) return;
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5077/api/transacoes/${id}`);
      await carregar();
    } catch (err: any) {
      alert(err?.response?.data?.detail ?? "Erro ao excluir transação");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: number) => navigate(`/transacoes/${id}`);

  if (loading) return <Box p={3}><CircularProgress /></Box>;
  if (error) return <Box p={3}><Typography color="error">{error}</Typography></Box>;
  if (groups.length === 0) return <Box p={3}><Typography>Nenhuma transação encontrada.</Typography></Box>;

  return (
    <Box p={2}>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate("/transacoes/new")}
        >
          Adicionar Transação
        </Button>
      </Box>

      {groups.map(group => (
        <Paper key={group.pessoaId} sx={{ mb: 3, p: 2 }}>
          {/* Cabeçalho com nome da pessoa */}
          <Typography variant="h6" fontWeight="bold" gutterBottom align="left">
            {group.pessoaNome ?? "(Pessoa não informada)"}
          </Typography>

          <List dense>
            {group.transacoes.map((t: Transacao) => (
              <React.Fragment key={t.id}>
                <ListItem
                  secondaryAction={
                    <Box>
                      <IconButton edge="end" aria-label="edit" color="info" onClick={() => handleEdit(t.id)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton edge="end" aria-label="delete" color="error" onClick={() => handleDelete(t.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={`${t.descricao ?? "(sem descrição)"} — ${formatCurrency(t.valor)}`}
                    secondary={`${t.categoriaDescricao ?? ""} • ${t.tipo === 2 ? "Receita" : "Despesa"}`}
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        </Paper>
      ))}
    </Box>
  );
};

export default TransacoesPorPessoaPage;
