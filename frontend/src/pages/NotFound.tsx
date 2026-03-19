// src/pages/NotFound.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Paper, Typography, Button } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "70vh",
        px: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 720,
          width: "100%",
          textAlign: "center",
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
          <ErrorOutlineIcon color="error" sx={{ fontSize: 56, mr: 1 }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
            Página não encontrada
          </Typography>
        </Box>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          A rota que você tentou acessar não existe ou foi removida. Verifique o endereço ou volte para a página inicial.
        </Typography>

        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          <Button variant="contained" color="primary" onClick={() => navigate("/pessoas")}>
            Ir para Pessoas
          </Button>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Voltar
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default NotFound;
