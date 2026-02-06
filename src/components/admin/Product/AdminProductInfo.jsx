import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Paper, Typography, Grid, Button, Chip,
    Divider, CircularProgress, IconButton, Stack
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import { productService } from '../../../services/productService.js';
import { CATEGORY_CONFIG } from '../../../constants/categories.js'; // Припускаю, що цей файл існує, як в AdminProductCreate

const AdminProductInfo = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProduct();
    }, [id]);

    const loadProduct = async () => {
        try {
            const data = await productService.getById(id);
            console.log(data);
            setProduct(data);
        } catch (error) {
            console.error("Failed to load product", error);
            alert("Не вдалося завантажити інформацію про товар");
            navigate('/admin-ui/products');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;
    }

    if (!product) return null;

    // Хелпер для статусу (копія логіки з таблиці)
    const getStatusChip = (status) => {
        const statusMap = {
            'IN_STOCK': { label: 'В наявності', color: 'success', bg: '#D1FAE5', text: '#065F46' },
            'OUT_OF_STOCK': { label: 'Немає', color: 'error', bg: '#FEE2E2', text: '#991B1B' },
            'PRE_ORDER': { label: 'Під замовлення', color: 'warning', bg: '#FEF3C7', text: '#92400E' },
            'ARCHIVED': { label: 'Архів', color: 'default', bg: '#F3F4F6', text: '#374151' }
        };
        const s = statusMap[status] || statusMap['ARCHIVED'];

        return (
            <Chip
                label={s.label}
                sx={{
                    bgcolor: s.bg,
                    color: s.text,
                    fontWeight: 600,
                    borderRadius: '8px'
                }}
            />
        );
    };

    // Отримання назви категорії
    const getCategoryLabel = (catEnum) => {
        // Якщо у вас є CATEGORY_CONFIG, шукаємо там. Якщо ні - просто повертаємо enum
        const cat = Object.values(CATEGORY_CONFIG || {}).find(c => c.enum === catEnum);
        return cat ? cat.label : catEnum;
    };

    return (
        <Box sx={{ pb: 5 }}>

            {/* ЗАГОЛОВОК І КНОПКИ */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton onClick={() => navigate('/admin-ui/products')} sx={{ border: '1px solid #E5E7EB', borderRadius: 2 }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#111827' }}>
                            {product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            ID: {product.id}
                        </Typography>
                    </Box>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/admin-ui/products/edit/${id}`)}
                    sx={{ bgcolor: '#111827', '&:hover': { bgcolor: '#374151' } }}
                >
                    Редагувати
                </Button>
            </Box>

            <Grid container spacing={3}>

                {/* ЛІВА КОЛОНКА (Основне інфо + Фото) */}
                <Grid size={{ xs: 12, md: 8 }}>

                    {/* Основна інформація */}
                    <Paper sx={{ p: 3, mb: 3, borderRadius: 3, border: '1px solid #E5E7EB', boxShadow: 'none' }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Загальна інформація</Typography>

                        <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid item xs={6} md={4}>
                                <Typography variant="caption" color="text.secondary">Категорія</Typography>
                                <Typography variant="body1" fontWeight={500}>{getCategoryLabel(product.productCategory)}</Typography>
                            </Grid>
                            <Grid item xs={6} md={4}>
                                <Typography variant="caption" color="text.secondary">Підкатегорія</Typography>
                                <Typography variant="body1">{product.subcategory || '—'}</Typography>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Typography variant="caption" color="text.secondary">Виробник</Typography>
                                <Typography variant="body1">{product.manufacturerOfTheProduct || '—'}</Typography>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Typography variant="caption" color="text.secondary">Рейтинг</Typography>
                                <Typography variant="body1">{product.rating }</Typography>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Typography variant="caption" color="text.secondary">Кіл-сть відгуків</Typography>
                                <Typography variant="body1">{product.reviewsCount}</Typography>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Typography variant="caption" color="text.secondary">Кіл-сть продажів</Typography>
                                <Typography variant="body1">{product.salesCount}</Typography>
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="caption" color="text.secondary">Опис</Typography>
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mt: 0.5 }}>
                                {product.description || 'Опис відсутній'}
                            </Typography>
                        </Box>

                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography variant="caption" color="text.secondary">Одиниця виміру</Typography>
                                <Typography variant="body1">{product.valueOfInitOfMeasure} {product.initOfMeasure}</Typography>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Галерея зображень */}
                    <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E5E7EB', boxShadow: 'none' }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Фотографії</Typography>

                        {product.images && product.images.length > 0 ? (
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                {product.images.map((img, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            width: 150,
                                            height: 150,
                                            borderRadius: 2,
                                            overflow: 'hidden',
                                            border: '1px solid #E5E7EB',
                                            position: 'relative'
                                        }}
                                    >
                                        <img
                                            src={img.imageUrl}
                                            alt={`Product ${index}`}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                        {img.isMain && (
                                            <Chip
                                                label="Головне"
                                                size="small"
                                                color="primary"
                                                sx={{ position: 'absolute', bottom: 5, right: 5, fontSize: '10px', height: '20px' }}
                                            />
                                        )}
                                    </Box>
                                ))}
                            </Box>
                        ) : (
                            <Typography color="text.secondary">Фото відсутні</Typography>
                        )}
                    </Paper>
                </Grid>

                {/* ПРАВА КОЛОНКА (Ціна, Статус, Характеристики) */}
                <Grid size={{ xs: 12, md: 4 }}>
                    {/* Ціна та Статус */}
                    <Paper sx={{ p: 3, mb: 3, borderRadius: 3, border: '1px solid #E5E7EB', boxShadow: 'none' }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Ціна та статус</Typography>

                        <Stack spacing={2}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography >Ціна продажу</Typography>
                                <Typography variant="h5" fontSize='20px' fontWeight={600}>{product.price} ₴</Typography>
                            </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography>Знижка</Typography>
                                    <Typography fontSize='20px' fontWeight={600}>{product.discount}%</Typography>
                                </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography>Поточна ціна</Typography>
                                <Typography variant="h5" fontSize='20px' fontWeight={600}>{product.priceWithDiscount} ₴</Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography fontSize='20px'>Статус</Typography>
                                <Box  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>{getStatusChip(product.availability)}</Box>
                            </Box>


                            <Divider />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography color="text.secondary">Ціна закупки</Typography>
                                <Typography variant="h6">{product.purchasePrice || 0} ₴</Typography>
                            </Box>
                        </Stack>
                    </Paper>

                    {/* Характеристики */}
                    <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E5E7EB', boxShadow: 'none' }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Характеристики</Typography>

                        {product.characteristics && Object.keys(product.characteristics).length > 0 ? (
                            <Stack spacing={1.5}>
                                {Object.entries(product.characteristics).map(([key, value]) => (
                                    <Box key={key} sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #E5E7EB', pb: 1 }}>
                                        <Typography variant="body2" color="text.secondary">{key}</Typography>
                                        <Typography variant="body2" fontWeight={500}>{value}</Typography>
                                    </Box>
                                ))}
                            </Stack>
                        ) : (
                            <Typography variant="body2" color="text.secondary">Характеристики не вказані</Typography>
                        )}
                    </Paper>

                    {/* Метадані */}
                    <Box sx={{ mt: 2, px: 1 }}>
                        <Typography color="text.secondary" display="block">
                            Створено: {new Date(product.creationTime).toLocaleString('uk-UA')}
                        </Typography>
                    </Box>

                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminProductInfo;