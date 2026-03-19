import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Paper, Typography, Grid, Button, TextField,
    MenuItem, CircularProgress, IconButton, Stack, Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { orderService } from '../../../services/orderService.js';

const STATUS_OPTIONS = [
    { value: 'NEW', label: 'Нове' },
    { value: 'CONFIRMED', label: 'В обробці' },
    { value: 'SHIPPED', label: 'Відправлено' },
    { value: 'DONE', label: 'Виконано' },
    { value: 'CANCELED', label: 'Скасовано' }
];

const PAYMENT_STATUS_OPTIONS = [
    { value: 'PENDING', label: 'Очікує оплати' },
    { value: 'SUCCESS', label: 'Оплачено' },
    { value: 'FAILED', label: 'Помилка оплати' },
    { value: 'REFUNDED', label: 'Повернення коштів' },
    { value: 'DUMMY_STATUS', label: 'Помилка' }
];

const DELIVERY_TYPES = [
    { value: 'NOVA_POSHTA', label: 'Нова Пошта' },
    { value: 'UKR_POSHTA', label: 'Укрпошта' }
];

const PAYMENT_TYPES = [
    { value: 'CASH', label: 'Готівка' },
    { value: 'CARD', label: 'На картку' }
];

const AdminOrderEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        email: '',
        orderNumber: '',
        phoneNumber: '',
        firstName: '',
        secondName: '',
        deliveryType: '',
        paymentType: '',
        orderStatus: '',
        paymentStatus: '',
        addressDTO: {
            city: '',
            region: '',
            department: '',
            street: '',
            houseNumber: '',
            apartment: ''
        }
    });

    useEffect(() => {
        loadOrder();
    }, [id]);

    const loadOrder = async () => {
        try {
            const data = await orderService.getById(id);

            setFormData({
                email: data.email || '',
                orderNumber: data.orderNumber,
                phoneNumber: data.phoneNumber || '',
                firstName: data.firstName || '',
                secondName: data.secondName || '',
                deliveryType: data.deliveryType,
                paymentType: data.paymentType,
                orderStatus: data.orderStatus,
                paymentStatus: data.paymentStatus,
                addressDTO: {
                    city: data.addressDTO?.city || '',
                    region: data.addressDTO?.region || '',
                    department: data.addressDTO?.department || '',
                    street: data.addressDTO?.street || '',
                    houseNumber: data.addressDTO?.houseNumber || '',
                    apartment: data.addressDTO?.apartment || ''
                }
            });
        } catch (error) {
            console.error("Failed to load order", error);
            alert("Помилка завантаження замовлення");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            addressDTO: {
                ...prev.addressDTO,
                [name]: value
            }
        }));
    };

    const handleSubmit = async () => {
        try {
            await orderService.update(id, formData);
            alert("Замовлення успішно оновлено!");
            navigate(`/admin-ui/orders/view/${id}`);
        } catch (error) {
            console.error("Update failed", error);
            alert("Помилка при збереженні змін");
        }
    };

    if (loading) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;

    return (
        <Box sx={{ pb: 5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton onClick={() => navigate(`/admin-ui/orders/view/${id}`)} sx={{ border: '1px solid #E5E7EB', borderRadius: 2 }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#111827' }}>
                        Редагування замовлення № {formData.orderNumber}
                    </Typography>
                </Box>
            </Box>

            <Grid container spacing={3}>

                <Grid size={{ xs: 12, md: 7 }}>

                    <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E5E7EB', boxShadow: 'none' }}>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Дані клієнта</Typography>

                        <Grid container spacing={2} sx={{ mb: 4 }}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth label="Ім'я" name="firstName"
                                    value={formData.firstName} onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth label="Прізвище" name="secondName"
                                    value={formData.secondName} onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth label="Телефон" name="phoneNumber"
                                    value={formData.phoneNumber} onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth label="Email" name="email"
                                    value={formData.email} onChange={handleChange}
                                />
                            </Grid>
                        </Grid>

                        <Divider sx={{ mb: 3 }} />

                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Адреса доставки</Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth label="Місто" name="city"
                                    value={formData.addressDTO.city} onChange={handleAddressChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth label="Область" name="region"
                                    value={formData.addressDTO.region} onChange={handleAddressChange}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth label="Відділення / Поштомат" name="department"
                                    helperText="Заповніть, якщо обрана доставка на відділення"
                                    value={formData.addressDTO.department} onChange={handleAddressChange}
                                />
                            </Grid>

                            <Grid item xs={12} md={8}>
                                <TextField
                                    fullWidth label="Вулиця" name="street"
                                    value={formData.addressDTO.street} onChange={handleAddressChange}
                                />
                            </Grid>
                            <Grid item xs={6} md={2}>
                                <TextField
                                    fullWidth label="Буд." name="houseNumber"
                                    value={formData.addressDTO.houseNumber} onChange={handleAddressChange}
                                />
                            </Grid>
                            <Grid item xs={6} md={2}>
                                <TextField
                                    fullWidth label="Кв." name="apartment"
                                    value={formData.addressDTO.apartment} onChange={handleAddressChange}
                                />
                            </Grid>
                        </Grid>
                    </Paper>

                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<SaveIcon />}
                        onClick={handleSubmit}
                        sx={{
                            bgcolor: '#111827',
                            mt: 3,
                            height: 56,
                            borderRadius: 2,
                            fontSize: '18px',
                            '&:hover': { bgcolor: '#374151' }
                        }}
                    >
                        Зберегти зміни
                    </Button>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E5E7EB', boxShadow: 'none' }}>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Налаштування замовлення</Typography>

                        <Stack spacing={3}>
                            <TextField
                                select fullWidth label="Статус замовлення"
                                name="orderStatus"
                                value={formData.orderStatus}
                                onChange={handleChange}
                            >
                                {STATUS_OPTIONS.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                select fullWidth label="Статус оплати"
                                name="paymentStatus"
                                value={formData.paymentStatus}
                                onChange={handleChange}
                            >
                                {PAYMENT_STATUS_OPTIONS.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <Divider />

                            <TextField
                                select fullWidth label="Тип доставки"
                                name="deliveryType"
                                value={formData.deliveryType}
                                onChange={handleChange}
                            >
                                {DELIVERY_TYPES.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                select fullWidth label="Тип оплати"
                                name="paymentType"
                                value={formData.paymentType}
                                onChange={handleChange}
                            >
                                {PAYMENT_TYPES.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Stack>
                    </Paper>
                </Grid>

            </Grid>
        </Box>
    );
};

export default AdminOrderEdit;