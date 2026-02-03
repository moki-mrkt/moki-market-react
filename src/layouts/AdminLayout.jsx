import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import {
    Box, Drawer, List, ListItem, ListItemButton, ListItemIcon,
    ListItemText, CssBaseline, ThemeProvider, createTheme, Typography, AppBar, Toolbar
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';

// Темна тема, як на скріншоті
const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#111827', // Чорний/Темно-сірий колір для основних кнопок (Create)
        },
        background: {
            default: '#F9FAFB', // Дуже світло-сірий фон для основної області
            paper: '#FFFFFF',   // Білий фон для карток і сайдбару
        },
        text: {
            primary: '#111827', // Темний текст
            secondary: '#6B7280', // Сірий текст для підписів
        },
    },
    typography: {

        fontFamily: 'Nunito, sans-serif',
        allVariants: {
            fontWeight: 600, // 600 - напівжирний, 700 - жирний. Змініть на 600, якщо 700 забагато.
        },
        h5: { fontWeight: 700 },
        h6: { fontWeight: 600, fontSize: '18px' },
    },
    components: {
        // Кастомізація кнопок (щоб були більш округлі)
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 8,
                    fontWeight: 600,
                },
            },
        },
        // Кастомізація таблиці (DataGrid)
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    border: 'none', // Прибираємо зовнішню рамку самого грід
                },
                columnHeaders: {
                    backgroundColor: '#F9FAFB', // Світлий фон заголовків колонок
                    color: '#6B7280',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    fontSize: '16px',
                },
                row: {
                    '&:hover': {
                        backgroundColor: '#F3F4F6', // Колір при наведенні
                    }
                }
            }
        }
    },
});

const drawerWidth = 260;

const linkStyle = {
    color: 'text.primary',
    textDecoration: 'none',
    '&:visited': {
        color: 'text.primary', // Запобігає фіолетовому кольору відвіданих посилань
    },
    '&:active': {
        color: 'text.primary',
    },
    '&:hover': {
        color: 'text.primary',
        // При наведенні ListItemButton сам додасть легкий сірий фон,
        // але текст залишимо чорним
    }
};

const AdminLayout = () => {
    return (
        <ThemeProvider theme={lightTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />

                {/* Sidebar */}
                <Drawer
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E5E7EB',
                            borderRadius: '20px',
                            margin: '10px',
                            height: 'calc(100% - 30px)',
                            padding: '10px'
                        },
                    }}
                    variant="permanent"
                    anchor="left"
                >
                    <Toolbar>
                        <Typography variant="h6" >
                            <img src="/icon.svg" alt="logo" style={{height: 50, width: 50}}/>
                            <span style={{marginLeft: 20}}>Адмін панель </span>
                        </Typography>
                    </Toolbar>
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton component={Link} to="/admin/products" sx={linkStyle}>
                                <ListItemIcon><InventoryIcon /></ListItemIcon>
                                <ListItemText primary="Товари" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton component={Link} to="/admin/users" sx={linkStyle}>
                                <ListItemIcon><PeopleIcon /></ListItemIcon>
                                <ListItemText primary="Користувачі" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Drawer>

                {/* Content Area */}
                <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: 'background.default', minHeight: '100vh' }}>
                    <Outlet />
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default AdminLayout;