// src/pages/RelatoriosPage.tsx
import React, { useEffect, useState } from "react";
import type { TotaisItem, RelatorioResponse } from "../types";
import { getRelatorioPorPessoa, getRelatorioPorCategoria } from "../api";
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

const RelatoriosPage: React.FC = () => {
  const [relatorio, setRelatorio] = useState<RelatorioResponse | null>(null);
  const [tipo, setTipo] = useState<"pessoa" | "categoria">("pessoa");

  useEffect(() => {
    carregarRelatorio("pessoa");
  }, []);

  const carregarRelatorio = async (tipo: "pessoa" | "categoria") => {
    setTipo(tipo);
    const res =
      tipo === "pessoa"
        ? await getRelatorioPorPessoa() // chama /api/relatorios/pessoas
        : await getRelatorioPorCategoria(); // chama /api/relatorios/categoria
    setRelatorio(res.data);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Relatórios por {tipo === "pessoa" ? "Pessoa" : "Categoria"}
      </Typography>

      <Box display="flex" gap={2} mb={3}>
        <Button
          variant={tipo === "pessoa" ? "contained" : "outlined"}
          onClick={() => carregarRelatorio("pessoa")}
        >
          POR PESSOA
        </Button>
        <Button
          variant={tipo === "categoria" ? "contained" : "outlined"}
          onClick={() => carregarRelatorio("categoria")}
        >
          POR CATEGORIA
        </Button>
      </Box>

      {relatorio && (
        <Paper elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{tipo === "pessoa" ? "Pessoa" : "Categoria"}</TableCell>
                <TableCell>Total Receitas</TableCell>
                <TableCell>Total Despesas</TableCell>
                <TableCell>Saldo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {relatorio.itens.map((r: TotaisItem) => (
                <TableRow key={r.id}>
                  <TableCell>{r.nome}</TableCell>
                  <TableCell>R$ {r.receitas.toFixed(2)}</TableCell>
                  <TableCell>R$ {r.despesas.toFixed(2)}</TableCell>
                  <TableCell
                    sx={{
                      color: r.saldo >= 0 ? "green" : "red",
                      fontWeight: "bold",
                    }}
                  >
                    R$ {r.saldo.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
              {/* Linha de totais gerais */}
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>TOTAL GERAL</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  R$ {relatorio.totalReceitas.toFixed(2)}
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  R$ {relatorio.totalDespesas.toFixed(2)}
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: relatorio.saldoLiquido >= 0 ? "green" : "red",
                  }}
                >
                  R$ {relatorio.saldoLiquido.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
};

export default RelatoriosPage;
