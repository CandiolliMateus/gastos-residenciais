// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import PessoasPage from "./pages/PessoasPage";
import PessoasForm from "./pages/PessoasForm";
import CategoriasPage from "./pages/CategoriasPage";
import CategoriaForm from "./pages/CategoriasForm";
import TransacoesPage from "./pages/TransacoesPage";
import TransacoesForm from "./pages/TransacoesForm";
import RelatoriosPage from "./pages/RelatoriosPage";
import NotFound from "./pages/NotFound";

const theme = createTheme({
  typography: {
    fontFamily: "'Inter', sans-serif",
    fontWeightRegular: 400,
    fontWeightBold: 600,
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />

            <Route path="pessoas" element={<PessoasPage />} />
            <Route path="pessoas/new" element={<PessoasForm />} />
            <Route path="pessoas/:id" element={<PessoasForm />} />

            <Route path="categorias" element={<CategoriasPage />} />
            <Route path="categorias/new" element={<CategoriaForm />} />
            <Route path="categorias/:id" element={<CategoriaForm />} />
            <Route path="categorias/:id/edit" element={<CategoriaForm />} />

            <Route path="transacoes" element={<TransacoesPage />} />
            <Route path="transacoes/new" element={<TransacoesForm />} />
            <Route path="transacoes/:id" element={<TransacoesForm />} />

            <Route path="relatorios" element={<RelatoriosPage />} />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
