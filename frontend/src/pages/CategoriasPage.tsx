import React, { useEffect, useState } from "react";
import type { Categoria } from "../types";
import { getCategorias, deleteCategoria } from "../api";
import {
  Box, Button, Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper, IconButton, Tooltip
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from "@mui/icons-material/Restore";
import { useNavigate } from "react-router-dom";

const finalidadeLabel = (f: number) => (f === 1 ? "Despesa" : f === 2 ? "Receita" : "Ambas");

const CategoriasPage: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [showDeleted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { carregarCategorias(); }, [showDeleted]);

  const carregarCategorias = async () => {
    const res = await getCategorias();
    // filtra categorias deletadas e adiciona label de finalidade
    const data = (res.data as Categoria[])
      .filter((c) => !c.isDeleted)
      .map((c) => ({ ...c, finalidadeLabel: finalidadeLabel(c.finalidade) }));
    setCategorias(data);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Deseja realmente excluir esta categoria?")) return;
    await deleteCategoria(id);
    await carregarCategorias();
  };

  const handleRestore = async () => {

    await carregarCategorias();
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">CATEGORIAS</Typography>
        <Box display="flex" gap={2} alignItems="center">
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => navigate("/categorias/new")}>ADICIONAR</Button>
        </Box>
      </Box>

      <Paper elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Descrição</TableCell>
              <TableCell>Finalidade</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categorias.map(c => (
              <TableRow key={c.id} hover selected={c.isDeleted}>
                <TableCell>{c.descricao}</TableCell>
                <TableCell>{c.finalidadeLabel}</TableCell>
                <TableCell align="right">
                  {!c.isDeleted ? (
                    <>
                      <Tooltip title="Editar"><IconButton color="info" onClick={() => navigate(`/categorias/${c.id}`)}><EditIcon/></IconButton></Tooltip>
                      <Tooltip title="Excluir"><IconButton color="error" onClick={() => handleDelete(c.id)}><DeleteIcon/></IconButton></Tooltip>
                    </>
                  ) : (
                    <Tooltip title="Restaurar"><IconButton onClick={() => handleRestore()}><RestoreIcon/></IconButton></Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default CategoriasPage;
