// src/pages/PessoasPage.tsx
import React, { useEffect, useState } from "react";
import { getPessoas, deletePessoa } from "../api";
import type { Pessoa } from "../types";
import {
  Box,
  Button,
  IconButton,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";

const PessoasPage: React.FC = () => {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    carregarPessoas();
  }, []);

  const carregarPessoas = async () => {
    const res = await getPessoas();
    setPessoas(res.data);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Deseja realmente excluir esta pessoa? Esta ação é irreversível.")) return;
    await deletePessoa(id);
    await carregarPessoas();
  };

  const handleEdit = (id: number) => {
    navigate(`/pessoas/${id}`);
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">PESSOAS</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate("/pessoas/new")}
        >
          Adicionar
        </Button>
      </Box>

      <Paper elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Idade</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {pessoas.map((p: Pessoa) => (
              <TableRow key={p.id} hover>
                <TableCell>{p.nome}</TableCell>
                <TableCell>{p.idade}</TableCell>

                <TableCell align="right">
                  <Tooltip title="Editar">
                    <IconButton color="info" onClick={() => handleEdit(p.id)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Excluir">
                    <IconButton color="error" onClick={() => handleDelete(p.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default PessoasPage;
