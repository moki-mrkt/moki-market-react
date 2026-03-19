import React, { useEffect, useState } from 'react';
import {
    Box, Paper, Typography, Button, IconButton, Rating,
    Chip, Dialog, DialogTitle, DialogContent, TextField, DialogActions,
    Avatar, Stack
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import ReplyIcon from '@mui/icons-material/Reply';
import StarIcon from '@mui/icons-material/Star';
import { feedbackService } from '../../../services/feedbackService.js'; // Ваш шлях

const AdminFeedbacks = () => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [rowCount, setRowCount] = useState(0);
    const [storeRating, setStoreRating] = useState(0);

    const [openReplyDialog, setOpenReplyDialog] = useState(false);
    const [currentFeedback, setCurrentFeedback] = useState(null);
    const [replyText, setReplyText] = useState('');

    const [paginationModel, setPaginationModel] = useState({
        page: 0, pageSize: 10,
    });

    const loadFeedbacks = async () => {
        setLoading(true);
        try {
            const data = await feedbackService.getAll(paginationModel.page, paginationModel.pageSize);

            setRows(data.feedbacks?.content || []);
            setRowCount(data.feedbacks?.page?.totalElements || 0);
            setStoreRating(data.storeRating || 0);

        } catch (error) {
            console.error("Помилка завантаження відгуків:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFeedbacks();
    }, [paginationModel]);

    const handleDelete = async (id) => {
        if (window.confirm('Видалити цей відгук?')) {
            try {
                await feedbackService.delete(id);
                loadFeedbacks();
            } catch (error) {
                alert('Помилка видалення');
            }
        }
    };

    const handleOpenReply = (row) => {
        setCurrentFeedback(row);
        setReplyText(row.answer || '');
        setOpenReplyDialog(true);
    };

    const handleSendReply = async () => {
        if (!currentFeedback) return;
        try {
            await feedbackService.reply(currentFeedback.id, replyText);
            setOpenReplyDialog(false);
            loadFeedbacks();
        } catch (error) {
            alert('Не вдалося надіслати відповідь');
        }
    };

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 70,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'clientName',
            headerName: 'Користувач',
            flex: 1,
            minWidth: 180,
            valueGetter: (value, row) => {
                if (!row) return '';
                return `${row.secondNameUser || ''} ${row.firstNameUser || ''}`.trim();
            }
        },
        {
            field: 'rating',
            headerName: 'Оцінка',
            width: 140,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                    <Rating value={params.value} readOnly size="small" />
                </Box>
            )
        },
        {
            field: 'comment',
            headerName: 'Коментар',
            flex: 1.5,
            minWidth: 250,
            renderCell: (params) => (
                <Typography variant="body2" sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: '100%'
                }}>
                    {params.value}
                </Typography>
            )
        },
        {
            field: 'createdAt',
            headerName: 'Дата',
            width: 150,
            valueFormatter: (value, row) => {
                if (!row) return '';
                return new Date(value).toLocaleString('uk-UA', {
                    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                });
            }
        },
        {
            field: 'status',
            headerName: 'Статус',
            width: 130,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => {
                const hasAnswer = !!params.row.answer;
                return (
                    <Chip
                        label={hasAnswer ? 'Відповіли' : 'Очікує'}
                        size="small"
                        sx={{
                            bgcolor: hasAnswer ? '#D1FAE5' : '#FEF3C7',
                            color: hasAnswer ? '#065F46' : '#92400E',
                            fontWeight: 600,
                            borderRadius: '6px'
                        }}
                    />
                );
            }
        },
        {
            field: 'actions',
            headerName: 'Дії',
            width: 120,
            sortable: false,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <Box>
                    <IconButton
                        size="small"
                        onClick={() => handleOpenReply(params.row)}
                        title={params.row.answer ? "Редагувати відповідь" : "Відповісти"}
                        sx={{ color: '#2563EB', mr: 1 }}
                    >
                        <ReplyIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={() => handleDelete(params.row.id)}
                        sx={{ color: '#DC2626' }}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Box>
            ),
        },
    ];

    return (
        <Box sx={{ width: '100%' }}>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h5" sx={{ color: '#111827', mb: 1, fontWeight: 800 }}>Відгуки</Typography>
                    <Typography variant="body2" sx={{ color: '#6B7280' }}>Думки та оцінки користувачів</Typography>
                </Box>

                <Paper sx={{
                    p: 2, display: 'flex', alignItems: 'center', gap: 2,
                    borderRadius: 3, border: '1px solid #E5E7EB', boxShadow: 'none'
                }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" fontWeight={800} color="#F59E0B">
                            {storeRating.toFixed(1)}
                        </Typography>
                    </Box>
                    <Box>
                        <Rating value={storeRating} readOnly precision={0.1} size="small" />
                        <Typography variant="caption" display="block" color="text.secondary">
                            Рейтинг магазину
                        </Typography>
                    </Box>
                </Paper>
            </Box>

            <Paper sx={{
                width: '100%',
                border: '1px solid #E5E7EB',
                borderRadius: 3,
                boxShadow: 'none',
                overflow: 'hidden'
            }}>
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
                                backgroundColor: '#F9FAFB',
                            },
                            '& .MuiDataGrid-cell': {
                                borderBottom: '1px solid #F3F4F6',
                            },
                        }}
                    />
                </Box>
            </Paper>

            <Dialog open={openReplyDialog} onClose={() => setOpenReplyDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 600 }}>
                    Відповідь для {currentFeedback?.secondNameUser} {currentFeedback?.firstNameUser}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mb: 2, p: 2, bgcolor: '#F3F4F6', borderRadius: 2 }}>
                        <Typography variant="caption" color="text.secondary">Відгук клієнта:</Typography>
                        <Typography variant="body2" sx={{ mt: 0.5, fontStyle: 'italic' }}>
                            "{currentFeedback?.comment}"
                        </Typography>
                    </Box>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Ваша відповідь"
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenReplyDialog(false)} color="inherit">Скасувати</Button>
                    <Button
                        onClick={handleSendReply}
                        variant="contained"
                        sx={{ bgcolor: '#111827', '&:hover': { bgcolor: '#374151' } }}
                    >
                        Надіслати
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
};

export default AdminFeedbacks;