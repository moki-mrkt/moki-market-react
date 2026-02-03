import React, { useState } from 'react';
import { Box, Paper, TextField, Button, Typography,
    Grid, MenuItem, Select, FormControl, InputLabel,
    IconButton, Checkbox, FormControlLabel,
    Divider,
    FormHelperText
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

import ImageUploader from './ImageUploader';


import { productService } from '../../../services/productService';
import { imageService } from '../../../services/imageService';

import { CATEGORY_CONFIG } from '../../../constants/categories';

const AdminProductCreate = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [selectedImages, setSelectedImages] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        productCategory: 'DRIED_FRUITS',
        description: '',
        price: '',
        purchasePrice: '',
        discount: 0,
        availability: 'IN_STOCK',
        manufacturerOfTheProduct: '',
        subcategory: '',
        initOfMeasure: 'шт',
        valueOfInitOfMeasure: '',
    });

    // --- Стан для динамічних полів ---
    // Характеристики (масив пар ключ-значення, який потім перетворимо в об'єкт)
    const [characteristics, setCharacteristics] = useState([
        { key: '', value: '' }
    ]);

    // Зображення
    const [images, setImages] = useState([
        { imageId: '', isMain: true, sortOrder: 0, altText: '' }
    ]);

    // --- Обробники змін ---

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Обробка характеристик
    const handleCharChange = (index, field, value) => {
        const newChars = [...characteristics];
        newChars[index][field] = value;
        setCharacteristics(newChars);
    };

    const addCharacteristic = () => {
        setCharacteristics([...characteristics, { key: '', value: '' }]);
    };

    const removeCharacteristic = (index) => {
        const newChars = characteristics.filter((_, i) => i !== index);
        setCharacteristics(newChars);
    };

    // Обробка зображень
    const handleImageChange = (index, field, value) => {
        const newImages = [...images];
        newImages[index][field] = value;

        // Якщо це поле isMain і воно true, скидаємо isMain у інших
        if (field === 'isMain' && value === true) {
            newImages.forEach((img, i) => {
                if (i !== index) img.isMain = false;
            });
        }

        setImages(newImages);
    };

    const addImage = () => {
        setImages([...images, { imageId: '', isMain: false, sortOrder: images.length, altText: '' }]);
    };

    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
    };

    // --- SUBMIT ---
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Перевірка: чи всі фото завантажились?
        const pendingUploads = selectedImages.some(img => img.loading);
        if (pendingUploads) {
            alert("Будь ласка, зачекайте завершення завантаження фото!");
            return;
        }

        setLoading(true);

        try {
            // 1. Беремо тільки ті фото, які успішно завантажились (мають uploadedUrl)
            const validImages = selectedImages
                .filter(img => img.uploadedUrl && !img.error)
                .map((img, index) => ({
                    imageUrl: img.uploadedUrl,
                    isMain: index === 0 // Перше фото в списку робимо головним
                }));

            // 2. Формуємо об'єкт
            const productPayload = {
                ...formData,
                price: parseFloat(formData.price),
                images: validImages
            };

            // 3. Відправляємо
            await productService.createProduct(productPayload);
            navigate('/admin/products');

        } catch (error) {
            console.error("Помилка створення:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ pb: 5, gap: 2 }}>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
                <IconButton onClick={() => navigate('/admin/products')}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>Створити новий товар</Typography>
            </Box>

            <Grid container spacing={2}>

                {/* ЛІВА КОЛОНКА - Основна інформація */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 'none', border: '1px solid #E5E7EB', gap: '10px'}}>

                        <Typography variant="h6" sx={{ mb: 2 }}>Загальна інформація</Typography>
                        <Grid sx={{ mb: 3, width: '40%' }} sm={6}>
                            <TextField
                                fullWidth
                                label="Назва товару" name="name"
                                value={formData.name} onChange={handleChange} required
                            />
                        </Grid>

                        <Grid container sx={{ mb: 3 }} spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Категорія</InputLabel>
                                    <Select
                                        name="productCategory"
                                        value={formData.productCategory}
                                        label="Категорія"
                                        onChange={handleChange}
                                    >
                                        {Object.values(CATEGORY_CONFIG).map((cat) => (
                                            <MenuItem key={cat.enum} value={cat.enum}>
                                                {cat.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth label="Підкатегорія" name="subcategory"
                                    value={formData.subcategory} onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth label="Виробник" name="manufacturerOfTheProduct"
                                    value={formData.manufacturerOfTheProduct} onChange={handleChange}
                                />
                            </Grid>
                        </Grid>

                        <Grid container sx={{ mb: 2 }} spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth label="Значення (вага/об'єм)" name="valueOfInitOfMeasure" type="number"
                                    value={formData.valueOfInitOfMeasure} onChange={handleChange}
                                    helperText="Наприклад: 100 (для 100г) "
                                />
                            </Grid>
                                <Grid item xs={12} sx={{width: '20%'}}>
                                    <FormControl fullWidth>
                                        <InputLabel>Одиниця</InputLabel>
                                        <Select
                                            name="initOfMeasure"
                                            value={formData.initOfMeasure}
                                            label="Одиниця"
                                            onChange={handleChange}
                                        >
                                            <MenuItem value="шт">шт</MenuItem>
                                            <MenuItem value="г">г</MenuItem>
                                            <MenuItem value="кг">кг</MenuItem>
                                            <MenuItem value="мл">мл</MenuItem>
                                            <MenuItem value="л">л</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth label="Опис" name="description" multiline rows={6}
                                value={formData.description} onChange={handleChange}
                            />
                        </Grid>
                    </Paper>

                    {/* Зображення */}
                    <Paper sx={{ p: 1, mb: 2  }}>
                        <ImageUploader
                            selectedImages={selectedImages}
                            setSelectedImages={setSelectedImages}
                        />
                    </Paper>

                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<SaveIcon />}
                        type="submit"
                        sx={{
                            bgcolor: '#111827',
                            height: 56,
                            borderRadius: 2,
                            fontSize: '18px',
                            '&:hover': { bgcolor: '#374151' }
                        }}
                    >
                        Зберегти товар
                    </Button>
                </Grid>


                <Grid item xs={12} md={4}>

                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>Ціна та статус</Typography>

                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>

                            <TextField
                                fullWidth
                                size="medium"
                                label="Ціна"
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                InputProps={{ endAdornment: <Typography variant="caption" color="text.secondary">₴</Typography> }}
                            />

                            <TextField
                                fullWidth
                                size="medium"
                                label="Закупка"
                                name="purchasePrice"
                                type="number"
                                value={formData.purchasePrice}
                                onChange={handleChange}
                                InputProps={{ endAdornment: <Typography variant="caption" color="text.secondary">₴</Typography> }}
                            />

                            <FormControl fullWidth size="medium">
                                <InputLabel id="status-label">Статус</InputLabel>
                                <Select
                                    labelId="status-label"
                                    name="availability"
                                    value={formData.availability}
                                    label="Статус"
                                    onChange={handleChange}
                                >
                                    <MenuItem value="IN_STOCK">В наявності</MenuItem>
                                    <MenuItem value="OUT_OF_STOCK">Немає</MenuItem>
                                    <MenuItem value="PRE_ORDER">Під замовлення</MenuItem>
                                    <MenuItem value="ARCHIVED">Архів</MenuItem>
                                </Select>
                            </FormControl>

                            <TextField
                                fullWidth
                                size="medium"
                                label="Знижка"
                                name="discount"
                                type="number"
                                value={formData.discount}
                                onChange={handleChange}
                                InputProps={{ endAdornment: <Typography variant="caption" color="text.secondary">%</Typography> }}
                            />
                        </Box>
                    </Paper>

                    <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 'none', border: '1px solid #E5E7EB' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6">Характеристики</Typography>
                            <Button startIcon={<AddIcon />} onClick={addCharacteristic}>Додати</Button>
                        </Box>

                        {characteristics.map((char, index) => (
                            <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                                <TextField
                                    label="Назва (ключ)" size="small" fullWidth
                                    value={char.key}
                                    onChange={(e) => handleCharChange(index, 'key', e.target.value)}
                                    placeholder="напр. Країна"
                                />
                                <TextField
                                    label="Значення" size="small" fullWidth
                                    value={char.value}
                                    onChange={(e) => handleCharChange(index, 'value', e.target.value)}
                                    placeholder="напр. Україна"
                                />
                                <IconButton onClick={() => removeCharacteristic(index)} color="error">
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        ))}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminProductCreate;