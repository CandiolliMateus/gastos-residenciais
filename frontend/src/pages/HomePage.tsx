import { Box, Typography, Paper } from "@mui/material";

const HomePage: React.FC = () => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="70vh">
      <Paper elevation={3} sx={{ p: 6, textAlign: "center", borderRadius: 3 }}>
        <Typography variant="h3" fontWeight="bold" color="primary">
          Bem vindo ao sistema de Controle Gastos Residenciais
        </Typography>
      </Paper>
    </Box>
  );
};

export default HomePage;