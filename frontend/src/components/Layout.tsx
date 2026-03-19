// src/components/Layout.tsx
import { Outlet, Link, useLocation } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    Typography,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Box,
    IconButton,
    Divider,
    useTheme,
    useMediaQuery,
    Avatar,
    Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PeopleIcon from "@mui/icons-material/People";
import CategoryIcon from "@mui/icons-material/Category";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BarChartIcon from "@mui/icons-material/BarChart";

const drawerWidth = 240;

const navItems = [
    { to: "/pessoas", label: "Pessoas", icon: <PeopleIcon color="primary" /> },
    { to: "/categorias", label: "Categorias", icon: <CategoryIcon color="primary" /> },
    { to: "/transacoes", label: "Transações", icon: <AttachMoneyIcon color="primary" /> },
    { to: "/relatorios", label: "Relatórios", icon: <BarChartIcon color="primary" /> },
];

export default function Layout() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const location = useLocation();

    const drawerContent = (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Toolbar sx={{ px: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    GASTOS RESIDENCIAIS
                </Typography>
            </Toolbar>

            <Divider />

            <List>
                {navItems.map((item) => (
                    <ListItemButton
                        key={item.to}
                        component={Link}
                        to={item.to}
                        selected={location.pathname.startsWith(item.to)}
                    >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.label} />
                    </ListItemButton>
                ))}
            </List>

            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "primary.main", width: 36, height: 36 }}>M</Avatar>
                <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Mateus
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Versão 1.0
                    </Typography>
                </Box>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            <AppBar
                position="fixed"
                sx={{
                    zIndex: theme.zIndex.drawer + 1,
                    backgroundColor: "#1976d2",
                    boxShadow: "none",
                }}
            >
                <Toolbar>
                    {isMobile && (
                        <IconButton color="inherit" edge="start" sx={{ mr: 2 }}>
                            <MenuIcon />
                        </IconButton>
                    )}

                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
                        GASTOS RESIDENCIAIS
                    </Typography>

                    <Tooltip title="Perfil">
                        <IconButton component={Link} to="/pessoas">
                            <Avatar sx={{ bgcolor: "secondary.main" }}>M</Avatar>
                        </IconButton>
                    </Tooltip>
                </Toolbar>
            </AppBar>

            {/* nav: Drawer permanente com largura fixa */}
            <Box component="nav" sx={{ width: 0, flexShrink: 0 }}>
                <Drawer
                    variant="permanent"
                    open
                    sx={{
                        "& .MuiDrawer-paper": {
                            width: drawerWidth,
                            boxSizing: "border-box",
                            border: "none",
                            backgroundColor: "#f5f5f5",
                        },
                    }}
                >
                    <Toolbar />
                    {drawerContent}
                </Drawer>
            </Box>

            {/* main: usa flexGrow para preencher o espaço restante */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    // padding responsivo: mantém offset para AppBar e remove padding lateral em desktop
                    p: { xs: 2, md: 2 },
                    px: { xs: 2, md: 0 },   // remove padding horizontal em md+
                    pt: { xs: 10, md: 8 },  // offset para AppBar
                    backgroundColor: "#fafafa",
                    minHeight: "100vh",
                    boxSizing: "border-box",
                }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
}
