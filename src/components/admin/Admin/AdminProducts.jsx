import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, Button, IconButton, Paper, TextField, InputAdornment, useTheme, useMediaQuery } from '@mui/material';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import {productService} from "../../../services/productService.js";

const AdminProducts = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [rows, setRows] = useState([]); // Дані таблиці
    const [loading, setLoading] = useState(false); // Спінер завантаження
    const [rowCount, setRowCount] = useState(0);

    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });

    const loadProducts = async () => {
        setLoading(true);
        try {
            // Передаємо page і size. Spring Pageable починає сторінки з 0, DataGrid теж.
            const response = await productService.getAllProducts(paginationModel.page, paginationModel.pageSize);

            // Spring повертає об'єкт Page: { content: [], totalElements: 123, ... }
            setRows(response.content || []);
            setRowCount(response.totalElements || 0);

        } catch (error) {
            console.error("Помилка при завантаженні товарів:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, [paginationModel]);

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
            field: 'productCategory',
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
            field: 'availability',
            headerName: 'Статус',
            flex: 1,
            minWidth: 110,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <span style={{
                    color: params.value === 'IN_STOCK' ? '#059669' : '#DC2626',
                    background: params.value === 'IN_STOCK' ? '#D1FAE5' : '#FEE2E2',
                    height: '80%',
                    padding: '1px 4px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center'
                }}>
                {params.value === 'IN_STOCK' ? 'В наявності' : 'Немає'}
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
                    <IconButton size="small" onClick={() => handleEdit(params.row.id)} sx={{ border: '1px solid #E5E7EB', borderRadius: 1 }}>
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(params.row.id)} sx={{ border: '1px solid #E5E7EB', borderRadius: 1 }}>
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Box>
            ),
        },
    ];

    const handleEdit = (id) => {
        navigate(`/admin/products/edit/${id}`);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Ви впевнені, що хочете видалити цей товар?')) {
            try {
                await productService.deleteProduct(id);
                await loadProducts(); // Перезавантажуємо таблицю після видалення
            } catch (error) {
                console.error("Не вдалося видалити:", error);
                alert("Помилка видалення");
            }
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

                        // === ВАЖЛИВІ НАЛАШТУВАННЯ ДЛЯ БЕКЕНДУ ===
                        loading={loading}
                        rowCount={rowCount} // Повідомляємо таблиці, скільки всього записів у БД
                        paginationMode="server" // Вмикаємо серверну пагінацію
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                        pageSizeOptions={[5, 10, 25]}

                        disableRowSelectionOnClick
                        sx={{
                            border: 'none',
                            '& .MuiDataGrid-columnHeaders': {
                                borderBottom: '1px solid #E5E7EB',
                            },
                            '& .MuiDataGrid-cell': {
                                borderBottom: '1px solid #F3F4F6',
                                display: 'flex',
                                alignItems: 'center'
                            },
                        }}
                    />
                </Box>
            </Paper>
        </Box>
    );
};

export default AdminProducts;