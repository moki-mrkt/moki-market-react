import React from 'react';
import {Link, Outlet} from 'react-router-dom';
import {
    Box, Button, createTheme,
    CssBaseline,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ThemeProvider,
    Toolbar,
    Typography
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import {authService} from "../services/authService.js";
import {CalendarIcon} from "@mui/x-date-pickers";
import InsertCommentTwoToneIcon from '@mui/icons-material/InsertCommentTwoTone';

const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#111827',
        },
        background: {
            default: '#F9FAFB',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#111827',
            secondary: '#6B7280',
        },
    },
    typography: {

        fontFamily: 'Nunito, sans-serif',
        allVariants: {
            fontWeight: 600,
        },
        h5: { fontWeight: 700 },
        h6: { fontWeight: 600, fontSize: '18px' },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 8,
                    fontWeight: 600,
                },
            },
        },

        MuiDataGrid: {
            styleOverrides: {
                root: {
                    border: 'none',
                },
                columnHeaders: {
                    backgroundColor: '#F9FAFB',
                    color: '#6B7280',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    fontSize: '16px',
                },
                row: {
                    '&:hover': {
                        backgroundColor: '#F3F4F6',
                    }
                }
            }
        }
    },
});

const drawerWidth = 280;

const linkStyle = {
    color: 'text.primary',
    textDecoration: 'none',
    '&:visited': {
        color: 'text.primary',
    },
    '&:active': {
        color: 'text.primary',
    },
    '&:hover': {
        color: 'text.primary',
    }
};

const AdminLayout = () => {

    const handleLogout = () => {
        authService.logoutAdmin();
    };

    return (
        <ThemeProvider theme={lightTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />

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
                    <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 10px' }}>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <img src="/img/icon.svg" alt="logo" style={{ height: 40, width: 40 }} />
                        </Box>
                        <Typography variant="h6" sx={{ fontSize: '16px', fontWeight: 'bold' }}>
                            Адмін панель
                        </Typography>

                        <Button
                            onClick={handleLogout}
                            sx={{
                                minWidth: 'auto',
                            }}
                        >
                            <img src="/img/logout.svg" alt="logout" style={{ height: 20, width: 20 }} />
                        </Button>

                    </Toolbar>
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton component={Link} to="/admin-ui/products" sx={linkStyle}>
                                <ListItemIcon><InventoryIcon /></ListItemIcon>
                                <ListItemText primary="Товари" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton component={Link} to="/admin-ui/users" sx={linkStyle}>
                                <ListItemIcon><PeopleIcon /></ListItemIcon>
                                <ListItemText primary="Користувачі" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton component={Link} to="/admin-ui/orders" sx={linkStyle}>
                                <ListItemIcon><CalendarIcon /></ListItemIcon>
                                <ListItemText primary="Замовлення" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton component={Link} to="/admin-ui/feedbacks" sx={linkStyle}>
                                <ListItemIcon><InsertCommentTwoToneIcon /></ListItemIcon>
                                <ListItemText primary="Відгуки" />
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