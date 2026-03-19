import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import ClearIcon from '@mui/icons-material/Clear';
import {
    Box, Typography, IconButton, Paper, TextField,
    InputAdornment, useTheme, useMediaQuery, Avatar, Chip, Tooltip
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import BlockIcon from '@mui/icons-material/Block';
import SearchIcon from '@mui/icons-material/Search';
import { userService } from "../../../services/userService.js";

const AdminUsers = () => {
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

    const loadUsers = async () => {
        setLoading(true);
        try {
            const response = await userService.getUsers(
                paginationModel.page,
                paginationModel.size
            );

            setRows(response.content || []);
            setRowCount(response.page.totalElements || 0);

        } catch (error) {
            console.error("Помилка при завантаженні користувачів:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, [paginationModel]);

    const handleSearchSubmit = () => {
        setPaginationModel(prev => ({ ...prev, page: 0 }));
        loadUsers();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearchSubmit();
        }
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        setPaginationModel(prev => ({ ...prev, page: 0 }));
        loadUsers();
    };

    const handleToggleBlock = async (user) => {
        const newStatus = !user.blocked;
        const actionText = newStatus ? 'заблокувати' : 'розблокувати';

        if (window.confirm(`Ви впевнені, що хочете ${actionText} цього користувача?`)) {
            try {
                await userService.switchBlockStatus(user.id, newStatus);
                setRows(rows.map(r => r.id === user.id ? { ...r, blocked: newStatus } : r));
                alert(`Користувача успішно ${newStatus ? 'заблоковано' : 'розблоковано'}`);
            } catch (error) {
                console.error("Не вдалося змінити статус блокування:", error);
                alert("Помилка при зміні статусу");
            }
        }
    };

    const columns = [
        {
            field: 'id',
            headerName: 'Id',
            flex: 1.5,
            minWidth: 200
        },
        {
            field: 'imageUrl',
            headerName: 'Фото',
            width: 100,
            align: 'center',
            sortable: false,
            renderCell: (params) => (
                <Avatar
                    src={params.value}
                    sx={{ width: 35, height: 35, bgcolor: '#E5E7EB' }}
                >
                    {params.row.firstName?.charAt(0)}
                </Avatar>
            )
        },
        {
            field: 'fullName',
            headerName: 'Повне ім\'я',
            width: 100,
            flex: 1.5,
            valueGetter: (value, row) => {
                if (!row) return '';
                return `${row.secondName || ''} ${row.firstName || ''}`.trim();
            }
        },
        {
            field: 'email',
            headerName: 'Email',
            flex: 1,
            width: 100,
        },
        {
            field: 'phoneNumber',
            headerName: 'Телефон',
            flex: 1,
            width: 100,
        },
        {
            field: 'roleType',
            headerName: 'Роль',
            flex: 1,
            width: 100,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <Chip
                    label={params.value === 'ADMIN' ? 'Адмін' : 'Клієнт'}
                    size="small"
                    sx={{
                        bgcolor: params.value === 'ADMIN' ? '#EEF2FF' : '#F9FAFB',
                        color: params.value === 'ADMIN' ? '#4338CA' : '#374151',
                        fontWeight: 600,
                        border: '1px solid',
                        borderColor: params.value === 'ADMIN' ? '#C7D2FE' : '#E5E7EB'
                    }}
                />
            )
        },
        {
            field: 'actions',
            headerName: 'Дії',
            flex: 1,
            minWidth: 100,
            sortable: false,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Переглянути">
                        <IconButton
                            size="small"
                            onClick={() => navigate(`/admin-ui/users/view/${params.row.id}`)}
                            sx={{ border: '1px solid #E5E7EB', borderRadius: 1 }}
                        >
                            <VisibilityIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={params.row.blocked ? "Розблокувати" : "Заблокувати"}>
                        <IconButton
                            size="small"
                            onClick={() => handleToggleBlock(params.row)}
                            sx={{
                                border: '1px solid #E5E7EB',
                                borderRadius: 1,
                                // Якщо заблокований — іконка червона, якщо ні — звичайна
                                color: params.row.blocked ? '#DC2626' : '#9CA3AF',
                                '&:hover': { bgcolor: params.row.blocked ? '#FEF2F2' : '#F9FAFB' }
                            }}
                        >
                            <BlockIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
    ];

    return (
        <Box>
            <Box sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'flex-start' : 'center',
                mb: 4,
                gap: 2
            }}>
                <Box>
                    <Typography variant="h5" sx={{ color: '#111827', mb: 1, fontWeight: 800 }}>Користувачі</Typography>
                    <Typography variant="body2" sx={{ color: '#6B7280' }}>Керування базою клієнтів та персоналом</Typography>
                </Box>
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
                        placeholder="Пошук за ім'ям або email..."
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
                                    <IconButton onClick={handleClearSearch} edge="end" size="small">
                                        <ClearIcon fontSize="small" sx={{ color: '#9CA3AF' }} />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={{ width: isMobile ? '100%' : 350, bgcolor: '#F9FAFB' }}
                    />
                </Box>

                <Box sx={{ height: 600, width: '100%' }}>
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
                        sx={{
                            border: 'none',
                            '& .MuiDataGrid-columnHeaders': {
                                borderBottom: '1px solid #E5E7EB',
                                bgcolor: '#F9FAFB'
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

export default AdminUsers;