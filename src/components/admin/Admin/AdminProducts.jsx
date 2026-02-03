import React from 'react';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, Button, IconButton, Paper, TextField, InputAdornment, useTheme, useMediaQuery } from '@mui/material';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

// Тестові дані
const rows = [
    { id: 1, name: 'Сухофрукти мікс', price: 120, category: 'Сухофрукти', discount: 50, status: 'Active' },
    { id: 2, name: 'Кеш’ю смажений', price: 450, category: 'Горіхи', discount: 12, status: 'Active' },
    { id: 3, name: 'Манго сушене', price: 300, category: 'Сухофрукти', discount: 0, status: 'Out of stock' },
    { id: 4, name: 'Фісташкова паста', price: 200, category: 'Пасти', discount: 5, status: 'Active' },
    { id: 5, name: 'Фініки королівські', price: 250, category: 'Сухофрукти', discount: 20, status: 'Active' },
];

const AdminProducts = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 70, // ID залишаємо вузьким
            minWidth: 50,
            align: 'center',      // Центрування тексту
            headerAlign: 'center' // Центрування заголовка
        },
        {
            field: 'name',
            headerName: 'Назва товару',
            flex: 1.5, // flex: 1.5 означає, що ця колонка займе в 1.5 рази більше місця, ніж інші з flex: 1
            minWidth: 200,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'category',
            headerName: 'Категорія',
            flex: 1,
            minWidth: 120,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'price',
            headerName: 'Ціна (грн)',
            flex: 0.8,
            minWidth: 100,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'discount',
            headerName: 'Знижка (%)',
            flex: 0.8,
            minWidth: 100,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'subcategory',
            headerName: 'Підкатегорія',
            flex: 0.8,
            minWidth: 100,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'status',
            headerName: 'Статус',
            flex: 1,
            minWidth: 110,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <span style={{
                    color: params.value === 'Active' ? '#059669' : '#DC2626',
                    background: params.value === 'Active' ? '#D1FAE5' : '#FEE2E2',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                }}>
                {params.value}
            </span>
            )
        },
        {
            field: 'actions',
            headerName: 'Дії',
            flex: 1, // Теж розтягується
            minWidth: 100,
            sortable: false,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                    <IconButton size="small" sx={{ border: '1px solid #E5E7EB', borderRadius: 1 }}>
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" sx={{ border: '1px solid #E5E7EB', borderRadius: 1 }}>
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Box>
            ),
        },
    ];

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

    return (
        <Box>
            {/* Заголовок і кнопка */}
            <Box sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'flex-start' : 'center',
                mb: 4,
                gap: 2
            }}>
                <Box>
                    <Typography variant="h5" sx={{ color: '#111827', mb: 1, fontWeight: 800 }}>Товари</Typography>
                    <Typography variant="body2" sx={{ color: '#6B7280' }}>Керування асортиментом магазину</Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    component={Link}
                    to="/admin/products/create"
                    sx={{
                        bgcolor: '#111827',
                        color: 'white',
                        '&:hover': { bgcolor: '#374151' },
                        height: 48,
                        px: 3,
                        width: isMobile ? '100%' : 'auto',
                        textDecoration: 'none',
                        '&:visited': {
                            color: 'white',
                        },
                        '&:active': {
                            color: 'white',
                        }
                    }}
                >
                    Додати товар
                </Button>
            </Box>

            <Paper sx={{
                width: '100%',
                overflow: 'hidden',
                border: '1px solid #E5E7EB',
                borderRadius: 3,
                boxShadow: 'none'
            }}>
                <Box sx={{ p: 2, display: 'flex', gap: 2, borderBottom: '1px solid #E5E7EB' }}>
                    <TextField
                        size="small"
                        placeholder="Пошук..."
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: '#9CA3AF' }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ width: isMobile ? '100%' : 300, bgcolor: '#F9FAFB' }}
                    />
                </Box>

                <Box sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        initialState={{
                            pagination: { paginationModel: { pageSize: 10 } },
                        }}
                        pageSizeOptions={[5, 10, 25]}
                        disableRowSelectionOnClick
                        sx={{
                            border: 'none',
                            '& .MuiDataGrid-columnHeaders': {
                                borderBottom: '1px solid #E5E7EB',
                            },
                            '& .MuiDataGrid-cell': {
                                borderBottom: '1px solid #F3F4F6',
                            },
                            '& .MuiDataGrid-virtualScroller': {
                                overflowX: 'auto',
                            }
                        }}
                    />
                </Box>
            </Paper>
        </Box>
    );
};

export default AdminProducts;