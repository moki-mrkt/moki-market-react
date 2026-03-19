import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Paper, Typography, Grid, Button, Chip,
    Divider, CircularProgress, IconButton, Stack,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import { orderService } from '../../../services/orderService.js';

const AdminOrderInfo = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrder();
    }, [id]);

    const loadOrder = async () => {
        try {
            const data = await orderService.getById(id);
            setOrder(data);
        } catch (error) {
            console.error("Failed to load order", error);
            alert("Не вдалося завантажити інформацію про замовлення");
            navigate('/admin-ui/orders');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;
    }

    if (!order) return null;

    const getOrderStatusChip = (status) => {
        const statusMap = {
            'NEW': { label: 'Нове', bg: '#DBEAFE', text: '#1E40AF' },
            'CONFIRMED': { label: 'В обробці', bg: '#FEF3C7', text: '#92400E' },
            'SHIPPED': { label: 'Відправлено', bg: 'rgb(255,231,184)', text: '#D97706' },
            'DONE': { label: 'Виконано', bg: '#D1FAE5', text: '#065F46' },
            'CANCELED': { label: 'Скасовано', bg: '#FEE2E2', text: '#991B1B' }
        };
        const s = statusMap[status] || { label: status, bg: '#F3F4F6', text: '#374151' };

        return (
            <Chip
                label={s.label}
                sx={{ bgcolor: s.bg, color: s.text, fontWeight: 600, borderRadius: '8px' }}
            />
        );
    };

    const getPaymentStatusChip = (status) => {
        const isSuccess = status === 'SUCCESS';
        return (
            <Chip
                label={isSuccess ? 'Оплачено' : 'Не оплачено'}
                size="small"
                sx={{
                    bgcolor: isSuccess ? '#D1FAE5' : '#FEE2E2',
                    color: isSuccess ? '#065F46' : '#991B1B',
                    fontWeight: 600,
                    borderRadius: '6px'
                }}
            />
        );
    };

    const getPaymentTypeString = (paymentType) => {
        switch (paymentType) {
            case 'CASH': return 'Готівка';
            case 'CARD': return 'На рахунок';
        }
    }

    const getDeliveryTypeString = (paymentType) => {
        switch (paymentType) {
            case 'NOVA_POSHTA': return 'Нова пошта';
            case 'UKR_POSHTA': return 'Укр пошта';
        }
    }


    return (
        <Box sx={{ pb: 5 }}>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton onClick={() => navigate('/admin-ui/orders')} sx={{ border: '1px solid #E5E7EB', borderRadius: 2 }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#111827' }}>
                            Замовлення №{order.orderNumber}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            ID: {order.id}
                        </Typography>
                    </Box>
                </Box>

            </Box>

            <Grid container spacing={3}>

                <Grid item xs={12} md={8}>

                    <Grid container  mb={2}  spacing={3}>
                        <Grid item xs={12} md={6} sx={{ width: '100%'}}>
                            <Paper sx={{ p: 3, mb: 3, borderRadius: 3, border: '1px solid #E5E7EB', boxShadow: 'none' }}>
                                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Дані клієнта та доставка</Typography>

                                <Grid container spacing={0}>

                                    <Grid item xs={12} md={6} sx={{ pr: { md: 3 }, mb: { xs: 3, md: 0 } }}>
                                        <Typography
                                            variant="subtitle2"
                                            color="text.secondary"
                                            sx={{ mb: 2, textTransform: 'uppercase', fontSize: '12px', fontWeight: 700, letterSpacing: '0.5px' }}
                                        >
                                            Особисті дані
                                        </Typography>

                                        <Stack spacing={2}>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">ПІБ</Typography>
                                                <Typography variant="body1" fontWeight={500}>{order.firstName} {order.secondName}</Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">Телефон</Typography>
                                                <Typography variant="body1">{order.phoneNumber}</Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">Email</Typography>
                                                <Typography variant="body1">{order.email || '—'}</Typography>
                                            </Box>
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={12} md={6} sx={{ pl: { md: 3 }, borderLeft: { md: '1px solid #E5E7EB' } }}>
                                        <Typography
                                            variant="subtitle2"
                                            color="text.secondary"
                                            sx={{ mb: 2, textTransform: 'uppercase', fontSize: '12px', fontWeight: 700, letterSpacing: '0.5px' }}
                                        >
                                            Адреса доставки
                                        </Typography>

                                        <Stack spacing={2}>
                                            {order.addressDTO?.region && (
                                                <Box>
                                                    <Typography variant="caption" color="text.secondary">Область</Typography>
                                                    <Typography variant="body1">{order.addressDTO.region}</Typography>
                                                </Box>
                                            )}
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">Місто</Typography>
                                                <Typography variant="body1" fontWeight={500}>{order.addressDTO?.city || '—'}</Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">Відділення</Typography>
                                                <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                                                    {order.addressDTO?.department
                                                        ? order.addressDTO.department
                                                        : `${order.addressDTO?.street || ''} ${order.addressDTO?.houseNumber || ''}`.trim() || '—'}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Grid>

                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>

                    <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E5E7EB', boxShadow: 'none' }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Товари в замовленні</Typography>

                        <TableContainer>
                            <Table sx={{ minWidth: 400 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Назва</TableCell>
                                        <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 600 }}>Ціна</TableCell>
                                        <TableCell align="center" sx={{ color: 'text.secondary', fontWeight: 600 }}>Кількість</TableCell>
                                        <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 600 }}>Сума</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {order.items.map((item, index) => (
                                        <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                                                {item.itemName}
                                                <Typography variant="caption" display="block" color="text.secondary">ID: {item.productId}</Typography>
                                            </TableCell>
                                            <TableCell align="right">{item.finalPricePerUnit} ₴</TableCell>
                                            <TableCell align="center">{item.quantity}</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 600 }}> {item.totalAmount} ₴</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>

                </Grid>

                <Grid item xs={12} md={4}>

                    <Paper sx={{ p: 3, mb: 3, borderRadius: 3, border: '1px solid #E5E7EB', boxShadow: 'none' }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Оплата</Typography>

                        <Stack spacing={2}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography color="text.secondary">Сума товарів</Typography>
                                <Typography variant="h6" fontSize='18px'>{order.itemsTotal} ₴</Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography color="text.secondary">Знижка</Typography>
                                <Typography fontSize='18px' color="error">-{order.discountTotal} ₴</Typography>
                            </Box>

                            <Divider />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6">Всього: </Typography>
                                <Typography variant="h4" fontSize='20px' fontWeight={700}>{order.total} ₴</Typography>
                            </Box>
                        </Stack>
                    </Paper>

                    <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E5E7EB', boxShadow: 'none' }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Деталі замовлення</Typography>

                        <Stack spacing={2}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography color="text.secondary" mr={1}>Статус замовлення</Typography>
                                {getOrderStatusChip(order.orderStatus)}
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography color="text.secondary" mr={1}>Статус оплати</Typography>
                                {getPaymentStatusChip(order.paymentStatus)}
                            </Box>

                            <Divider />

                            <Box>
                                <Typography variant="caption" color="text.secondary">Тип оплати</Typography>
                                <Typography variant="body1" fontWeight={500}>{getPaymentTypeString(order.paymentType)}</Typography>
                            </Box>

                            <Box>
                                <Typography variant="caption" color="text.secondary">Тип доставки</Typography>
                                <Typography variant="body1" fontWeight={500}>{getDeliveryTypeString(order.deliveryType)}</Typography>
                            </Box>

                            <Box>
                                <Typography variant="caption" color="text.secondary">Дата створення</Typography>
                                <Typography variant="body2">
                                    {new Date(order.createAt).toLocaleString('uk-UA')}
                                </Typography>
                            </Box>
                        </Stack>
                    </Paper>

                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminOrderInfo;