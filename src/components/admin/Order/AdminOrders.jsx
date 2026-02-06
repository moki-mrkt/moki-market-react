import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import ClearIcon from '@mui/icons-material/Clear';
import { Box, Typography, Button, IconButton, Paper, TextField, InputAdornment, useTheme, useMediaQuery, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/EditOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { orderService } from "../../../services/orderService.js";

const AdminOrders = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [rowCount, setRowCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    const [paginationModel, setPaginationModel] = useState({
        page: 0, pageSize: 10,
    });

    const loadOrders = async (query = searchTerm) => {
        setLoading(true);
        try {
            const response = await orderService.getAllOrders(paginationModel.page, paginationModel.pageSize);

            setRows(response.content || []);
            setRowCount(response.page?.totalElements || 0);

        } catch (error) {
            console.error("Помилка при завантаженні замовлень:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, [paginationModel]);

    const handleSearchSubmit = () => {
        setPaginationModel(prev => ({ ...prev, page: 0 }));
        loadOrders(searchTerm);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearchSubmit();
        }
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        setPaginationModel(prev => ({ ...prev, page: 0 }));
        loadOrders('');
    };

    const handleDelete = async (id) => {
        if (window.confirm('Ви впевнені, що хочете відмінити це замовлення?')) {
            try {
                await orderService.deleteOrder(id);
                await loadOrders();
            } catch (error) {
                console.error("Не вдалося видалити:", error);
                alert("Помилка видалення");
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'NEW': return { color: '#2563EB', bg: '#DBEAFE', label: 'Нове' };
            case 'CONFIRMED': return { color: '#92400E', bg: '#FEF3C7', label: 'В обробці' };
            case 'SHIPPED': return { color: '#D97706', bg: 'rgb(255,231,184)', label: 'Відправлено' };
            case 'DONE': return { color: '#059669', bg: '#D1FAE5', label: 'Виконано' };
            case 'CANCELED': return { color: '#DC2626', bg: '#FEE2E2', label: 'Скасовано' };
            default: return { color: '#4B5563', bg: '#F3F4F6', label: status };
        }
    };

    const getPaymentStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return { color: '#2563EB', bg: '#DBEAFE', label: 'Нове' };
            case 'REFUNDED': return { color: '#D97706', bg: '#FEF3C7', label: 'В обробці' };
            case 'SUCCESS': return { color: '#059669', bg: '#D1FAE5', label: 'Виконано' };
            case 'FAILED': return { color: '#DC2626', bg: '#FEE2E2', label: 'Скасовано' };
            default: return { color: '#4B5563', bg: '#F3F4F6', label: status };
        }
    };

    const getPaymentStatusString = (paymentStatus) => {
        switch (paymentStatus) {
            case 'SUCCESS': return 'Успішно';
            case 'PENDING': return 'Очікується';
            case 'FAILED': return 'Не пройшла';
            case 'REFUNDED': return 'Повернення';
            case 'DUMMY_STATUS': return 'Помилка';
        }
    }

    const getPaymentTypeString = (paymentType) => {
        switch (paymentType) {
            case 'CASH': return 'Готівка';
            case 'CARD': return 'На рахунок';

        }
    }

    const columns = [
        {
            field: 'orderNumber',
            headerName: '№ Замовлення',
            width: 140,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {params.value}
                </Typography>
            )
        },
        {
            field: 'createAt',
            headerName: 'Дата',
            flex: 1,
            minWidth: 150,
            align: 'center',
            headerAlign: 'center',
            valueFormatter: (value, row) => {
                if (!row) return '';
                return new Date(value).toLocaleString('uk-UA', {
                    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                });
            }
        },
        {
            field: 'clientName', // Віртуальне поле
            headerName: 'Клієнт',
            flex: 1.2,
            minWidth: 180,
            align: 'center',
            headerAlign: 'center',
            valueGetter: (value, row) => {
                if (!row) return '';
                return `${row.firstName || ''} ${row.secondName || ''}`.trim();
            }
        },
        {
            field: 'phoneNumber',
            headerName: 'Телефон',
            flex: 1,
            minWidth: 140,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'total',
            headerName: 'Сума (грн)',
            flex: 0.8,
            minWidth: 100,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {params.value?.toLocaleString()} ₴
                </Typography>
            )
        },
        {
            field: 'paymentType',
            headerName: 'Оплата',
            flex: 0.8,
            minWidth: 110,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
                    <Typography variant="caption" sx={{ fontSize: '14px' }}>
                        {getPaymentTypeString(params.value)}
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{
                            fontSize: '14px',
                            color: getPaymentStatusColor(params.row.paymentStatus),
                            fontWeight: 'bold'
                        }}
                    >
                        {getPaymentStatusString(params.row.paymentStatus)}
                    </Typography>
                </Box>
            )
        },
        {
            field: 'orderStatus',
            headerName: 'Статус',
            flex: 1,
            minWidth: 130,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => {
                const style = getStatusColor(params.value);
                return (
                    <span style={{
                        height: '80%',
                        color: style.color,
                        background: style.bg,
                        padding: '0 8px',
                        borderRadius: '10px',
                        fontSize: '12px',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        whiteSpace: 'nowrap'
                    }}>
                        {style.label}
                    </span>
                );
            }
        },
        {
            field: 'actions',
            headerName: 'Дії',
            flex: 0.8,
            minWidth: 120,
            sortable: false,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                    <IconButton
                        size="small"
                        onClick={() => navigate(`/admin-ui/orders/view/${params.row.id}`)}
                        sx={{ border: '1px solid #E5E7EB', borderRadius: 1, color: '#4B5563' }}
                        title="Деталі"
                    >
                        <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={() => navigate(`/admin-ui/orders/edit/${params.row.id}`)}
                        sx={{ border: '1px solid #E5E7EB', borderRadius: 1 }}
                        title="Редагувати"
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={() => handleDelete(params.row.id)}
                        sx={{ border: '1px solid #E5E7EB', borderRadius: 1 }}
                        title="Видалити"
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Box>
            ),
        },
    ];

    return (
        <Box sx={{ width: '100%', height: '100vh' }}>
            {/* Заголовок */}
            <Box sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'flex-start' : 'center',
                mb: 4,
                gap: 2
            }}>
                <Box>
                    <Typography variant="h5" sx={{ color: '#111827', mb: 1, fontWeight: 800 }}>Замовлення</Typography>
                    <Typography variant="body2" sx={{ color: '#6B7280' }}>Керування замовленнями клієнтів</Typography>
                </Box>
            </Box>

            <Paper sx={{
                width: '100%',
                overflow: 'hidden',
                border: '1px solid #E5E7EB',
                borderRadius: 3,
                boxShadow: 'none'
            }}>
                {/* Панель пошуку */}
                <Box sx={{ p: 2, display: 'flex', gap: 2, borderBottom: '1px solid #E5E7EB' }}>
                    <TextField
                        size="small"
                        placeholder="Пошук (№, телефон, ім'я)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleKeyDown}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <IconButton onClick={handleSearchSubmit} edge="start" size="small">
                                        <SearchIcon sx={{ color: '#9CA3AF' }} />
                                    </IconButton>
                                </InputAdornment>
                            ),
                            endAdornment: searchTerm && (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleClearSearch} edge="end" size="small" sx={{ color: '#9CA3AF' }}>
                                        <ClearIcon fontSize="small" />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={{ width: isMobile ? '100%' : 350, bgcolor: '#F9FAFB' }}
                    />
                </Box>

                <Box sx={{ height: 650, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}

                        loading={loading}
                        rowCount={rowCount}
                        paginationMode="server"
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                        pageSizeOptions={[10, 25, 50]}

                        disableRowSelectionOnClick
                        getRowId={(row) => row.id}
                        sx={{
                            border: 'none',
                            '& .MuiDataGrid-columnHeaders': {
                                borderBottom: '1px solid #E5E7EB',
                                backgroundColor: '#F9FAFB',
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

export default AdminOrders;