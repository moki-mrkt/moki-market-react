import React, {useEffect, useState} from 'react';
import {useNavigate, useParams, useLocation} from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import {
    Box, Button, CircularProgress, FormControl, Grid, IconButton,
    InputLabel, MenuItem, Paper, Select, TextField, Typography,
    Alert, AlertTitle, Checkbox, FormControlLabel
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import ImageUploader from './ImageUploader.jsx';

import {productService} from '../../../services/productService.js';

import {CATEGORY_CONFIG} from '../../../constants/categories.js';
import {mapErrorMessage} from '../../../constants/productErrorMessages.js';

const AdminProductCreate = () => {

    const { id } = useParams();
    const isEditMode = !!id;

    const navigate = useNavigate();
    const location = useLocation();

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);

    const [error, setError] = useState(null);

    const [selectedImages, setSelectedImages] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        nameRu: '',
        productCategory: 'DRIED_FRUITS',
        description: '',
        descriptionRu: '',
        price: '',
        purchasePrice: '',
        discount: 0,
        availability: 'IN_STOCK',
        manufacturerOfTheProduct: '',
        subcategory: '',
        subcategoryRu: '',
        initOfMeasure: 'шт',
        valueOfInitOfMeasure: '',
        productType: 'SIMPLE',
        minCustomWeight: '',
        groupId: '',
        variantName: '',
        variantValue: ''
    });

    const [characteristics, setCharacteristics] = useState([
        { key: '', value: '' }
    ]);

    const [characteristicsRu, setCharacteristicsRu] = useState([
        { key: '', value: '' }
    ]);

    const [weightOptions, setWeightOptions] = useState([]);

    const [isGenerating, setIsGenerating] = useState(false);
    const [isTranslating , setIsTranslating] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        if (isEditMode) {
            loadProductData();
        }
    }, [id]);

    const loadProductData = async () => {
        setFetching(true);
        try {
            const product = await productService.getByIdForAdmin(id);

            setFormData({
                name: product.name,
                nameRu: product.nameRu,
                productCategory: product.productCategory,
                price: product.price,
                purchasePrice: product.purchasePrice || '',
                discount: product.discount,
                description: product.description || '',
                descriptionRu: product.descriptionRu || '',
                availability: product.availability,
                subcategory: product.subcategory,
                subcategoryRu: product.subcategoryRu,
                manufacturerOfTheProduct: product.manufacturerOfTheProduct,
                initOfMeasure: product.initOfMeasure,
                valueOfInitOfMeasure: product.valueOfInitOfMeasure,
                productType: product.productType || 'SIMPLE',
                minCustomWeight: product.minCustomWeight || '',
                groupId: product.groupId || '',
                variantName: product.variantName || '',
                variantValue: product.variantValue || ''
            });

            if (product.characteristics) {
                setCharacteristics(Object.entries(product.characteristics).map(([key, val]) => ({ key, value: val })));
            }
            if (product.characteristicsRu) {
                setCharacteristicsRu(Object.entries(product.characteristicsRu).map(([key, val]) => ({ key, value: val })));
            }
            if (product.weightOptions) {
                setWeightOptions(product.weightOptions.map(opt => ({
                    weightValue: opt.weightValue, price: opt.price, isDefault: opt.isDefault
                })));
            }

            if (product.images) {
                const formattedImages = product.images.map(img => ({
                    file: null,
                    imageId: img.imageId,
                    preview: img.imageUrl,
                    uploadedUrl: img.imageUrl,
                    loading: false,
                    error: false
                }));

                setSelectedImages(formattedImages);
            }

        } catch (error) {
            alert("Не вдалося завантажити товар");
            navigate('/admin-ui/products');
        } finally {
            setFetching(false);
        }
    };

    const handleGenerateDescription = async () => {
        if (!formData.name) {
            toast.error("Будь ласка, введіть назву товару для генерації опису");
            return;
        }

        setIsGenerating(true);
        try {
            const charsString = characteristics
                .filter(c => c.key && c.value)
                .map(c => `${c.key}: ${c.value}`)
                .join(', ');

            const generatedText = await productService.generateDescription({
                nameProduct: formData.name,
                attributes: charsString
            });

            setFormData(prev => ({
                ...prev,
                description: generatedText
            }));

            toast.success("Опис успішно згенеровано!");
        } catch (error) {
            console.error("Помилка генерації опису:", error);
            toast.error("Не вдалося згенерувати опис. Перевірте підключення.");
        } finally {
            setIsGenerating(false);
        }
    };

    const translateToRu = async () => {
        if (!formData.name) {
            toast.error("Будь ласка, введіть назву товару для перекладу");
            return;
        }

        if (!formData.description) {
            toast.error("Будь ласка, введіть опис товару для перекладу");
            return;
        }

        if (!formData.subcategory) {
            toast.error("Будь ласка, введіть підкатегорію товару для перекладу");
            return;
        }

        setIsTranslating(true);

        try {

            const charMap = {};
            characteristics.forEach(c => {
                const k = c.key?.trim();
                const v = c.value?.trim();
                if(k && v) charMap[k] = v;
            });

            const translatedContent = await productService.translateToRu({
                name: formData.name,
                subcategory: formData.subcategory,
                description: formData.description,
                characteristics: charMap
            });

            setFormData(prev => ({
                ...prev,
                nameRu: translatedContent.name,
                subcategoryRu: translatedContent.subcategory,
                descriptionRu: translatedContent.description
            }));

            if (translatedContent.characteristics) {
                const translatedCharsArray = Object.entries(translatedContent.characteristics).map(([k, v]) => ({
                    key: k, value: v
                }));

                setCharacteristicsRu(translatedCharsArray.length > 0 ? translatedCharsArray : [{ key: '', value: '' }]);
            }

            toast.success("Переклад успіший!");
        } catch (error) {
            console.error("Помилка перекладу:", error);
            toast.error("Не вдалося згенерувати опис. Перевірте підключення.");
        } finally {
            setIsTranslating(false);
        }
    }


    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => {
            const updatedData = { ...prev, [name]: value };

            if (name === 'productType' && value === 'WEIGHT_BASED') {
                if (weightOptions.length === 0) {
                    setWeightOptions([
                        {
                            weightValue: 1000,
                            price: prev.price || 0,
                            isDefault: true
                        }
                    ]);
                }
            }

            if (name === 'price' && prev.productType === 'WEIGHT_BASED') {
                const newPrice = Number(value);
                setWeightOptions(prevOpts => {
                    let newOpts = [...prevOpts];
                    const oneKgIndex = newOpts.findIndex(opt => Number(opt.weightValue) === 1000);

                    if (oneKgIndex !== -1) {
                        newOpts[oneKgIndex].price = newPrice;
                    } else {
                        newOpts.push({
                            weightValue: 1000,
                            price: newPrice,
                            isDefault: newOpts.length === 0
                        });
                    }
                    return newOpts;
                });
            }

            return updatedData;
        });

        if (error) setError(null);
    };

    const handleCharChange = (isRu, index, field, value) => {
        const setChars = isRu ? setCharacteristicsRu : setCharacteristics;
        setChars(prev => { const newArr = [...prev]; newArr[index][field] = value; return newArr; });
    };

    const addCharacteristic = (isRu) => {
        (isRu ? setCharacteristicsRu : setCharacteristics)(prev => [...prev, { key: '', value: '' }]);
    };

    const removeCharacteristic = (isRu, index) => {
        (isRu ? setCharacteristicsRu : setCharacteristics)(prev => prev.filter((_, i) => i !== index));
    };

    const handleWeightChange = (index, field, value) => {
        setWeightOptions(prev => {
            const newOpts = [...prev];
            if (field === 'isDefault' && value === true) {
                newOpts.forEach(opt => opt.isDefault = false);
            }
            newOpts[index][field] = value;

            if (Number(newOpts[index].weightValue) === 1000) {
                setFormData(currentForm => ({ ...currentForm, price: newOpts[index].price }));
            }
            return newOpts;
        });
    };
    const addWeightOption = () => setWeightOptions(prev => [...prev, { weightValue: '', price: '', isDefault: false }]);
    const removeWeightOption = (index) => setWeightOptions(prev => prev.filter((_, i) => i !== index));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const pendingUploads = selectedImages.some(img => img.loading);
        if (pendingUploads) {
            toast.error("Будь ласка, зачекайте завершення завантаження фото!");
            return;
        }

        setLoading(true);

        try {

            const validImages = selectedImages
                .filter(img => img.imageId && !img.error)
                .map((img, index) => ({
                    imageId: img.imageId,
                    isMain: index === 0,
                    sortOrder: 0,
                    altText: 'photo'
                }));

            const charMap = {};
            characteristics.forEach(c => {
                const k = c.key?.trim();
                const v = c.value?.trim();
                if(k && v) charMap[k] = v;
            });

            const charMapRu = {};
            characteristicsRu.forEach(c => {
                const k = c.key?.trim();
                const v = c.value?.trim();
                if(k && v) charMapRu[k] = v;
            });

            const productPayload = {
                ...formData,
                price: parseFloat(formData.price) || 0,
                purchasePrice: parseFloat(formData.purchasePrice) || 0,
                discount: parseInt(formData.discount) || 0,
                images: validImages,
                characteristics: charMap,
                characteristicsRu: charMapRu,
                minCustomWeight: formData.productType === 'WEIGHT_BASED' ? parseInt(formData.minCustomWeight) : null,
                weightOptions: formData.productType === 'WEIGHT_BASED' ? weightOptions.map(w => ({
                    weightValue: parseInt(w.weightValue), price: parseFloat(w.price), isDefault: w.isDefault
                })) : null,
                groupId: formData.productType === 'VARIANT' ? formData.groupId : null,
                variantName: formData.productType === 'VARIANT' ? formData.variantName : null,
                variantValue: formData.productType === 'VARIANT' ? formData.variantValue : null,
            };

            if (isEditMode) {
                await productService.updateProduct(id, productPayload);
                toast.success('Товар успішно оновлено!');
            } else {
                await productService.createProduct(productPayload);
                toast.success('Товар успішно створено!');
            }

            if (location.state?.from) {
                navigate(location.state.from);
            } else {
                navigate('/admin-ui/products');
            }

        } catch (error) {
            if (error && error.status === 400) {
                if (error.info) {
                    const allErrors = Object.values(error.info)
                        .map(msg => mapErrorMessage(msg))
                        .join('\n');
                    setError(allErrors);
                } else {
                    setError("Перевірте введені дані");
                }
                toast.error("Помилка у формі. Перевірте введені дані.");
            } else {
                const serverMessage = error.response?.data?.message || "Проблема на стороні сервера. Спробуйте пізніше.";
                toast.error(serverMessage);
            }
        } finally {
            setLoading(false);
        }

        window.scrollTo(0, 0);
    };

    if (fetching) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ pb: 5, gap: 2 }}>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
                <IconButton onClick={() => navigate('/admin-ui/products')}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {isEditMode ? 'Редагування товару' : 'Новий товар'}
                </Typography>
            </Box>

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                    onClose={() => setError(null)}
                    style={{ whiteSpace: 'pre-line' }}
                >
                    <AlertTitle>Помилка</AlertTitle>
                    {error}
                </Alert>
            )}

            <Grid container spacing={2}>

                <Grid size={{ xs: 12, md: 7 }}>
                    <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 'none', border: '1px solid #E5E7EB', gap: '10px'}}>

                        <Typography variant="h6" sx={{ mb: 2 }}>Загальна інформація</Typography>

                        <Grid item xs={12} sm={4} sx={{mb: 3, width: '40%'}}>
                            <FormControl fullWidth>
                                <InputLabel>Тип товару</InputLabel>
                                <Select name="productType" value={formData.productType} label="Тип товару" onChange={handleChange} variant={}>
                                    <MenuItem value="SIMPLE">Звичайний</MenuItem>
                                    <MenuItem value="WEIGHT_BASED">На вагу (Фасування)</MenuItem>
                                    <MenuItem value="VARIANT">Варіація (Група)</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between',  mb: 3, gap: 2 }}>
                            <Box sx={{ width: '60%' }}>
                                <TextField
                                    fullWidth
                                    label="Назва товару"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </Box>
                            <Button
                                variant="outlined"
                                onClick={translateToRu}
                                disabled={isTranslating}
                                sx={{
                                    borderColor: '#2563EB',
                                    color: '#2563EB',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    borderRadius: 2,
                                     height: 40,
                                    whiteSpace: 'nowrap',
                                    '&:hover': {
                                        borderColor: '#1D4ED8',
                                        bgcolor: '#EFF6FF'
                                    }
                                }}
                            >
                                {isTranslating ? (
                                    <><CircularProgress size={16} sx={{ mr: 1 }} />Виконується переклад</>
                                ) : (
                                    'Перекласти російською'
                                )}
                            </Button>

                        </Box>

                        <Grid sx={{ mb: 8, width: '60%' }} sm={6}>
                            <TextField
                                fullWidth
                                label="Назва товару російською"
                                name="nameRu"
                                value={formData.nameRu}
                                onChange={handleChange} required
                            />
                        </Grid>

                        <Grid container  sx={{ mb: 3 }}  spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Категорія</InputLabel>
                                    <Select
                                        name="productCategory"
                                        value={formData.productCategory}
                                        label="Категорія"
                                        onChange={handleChange}
                                    >
                                        {Object.entries(CATEGORY_CONFIG).map(([slug, cat]) => (
                                            <MenuItem key={cat.enum} value={cat.enum}>
                                                {t(`category.${slug}`, { lng: 'uk' })}
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
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth label="Підкатегорія російською" name="subcategoryRu"
                                    value={formData.subcategoryRu} onChange={handleChange}
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

                        {formData.productType === 'WEIGHT_BASED' && (
                            <Box sx={{ p: 2, mb: 3, bgcolor: '#F3F4F6', borderRadius: 2 }}>
                                <Typography variant="subtitle1" fontWeight={600} mb={2}>Налаштування вагового товару</Typography>
                                <Grid container spacing={2} mb={2}>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            size="medium"
                                            label={formData.productType === 'WEIGHT_BASED' ? "Базова ціна (за 1 кг)" : "Базова ціна"}
                                            name="price"
                                            type="number"
                                            value={formData.price}
                                            onChange={handleChange}
                                            required
                                            InputProps={{ endAdornment: <Typography variant="caption">₴</Typography> }}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField fullWidth label="Мін. кастомна вага (г)" name="minCustomWeight" type="number" value={formData.minCustomWeight} onChange={handleChange} />
                                    </Grid>
                                </Grid>
                                <Typography variant="subtitle2" mb={1}>Фіксовані фасування:</Typography>
                                {weightOptions.map((opt, index) => (
                                    <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                                        <TextField label="Вага (г)" size="small" type="number" value={opt.weightValue} onChange={(e) => handleWeightChange(index, 'weightValue', e.target.value)} />
                                        <TextField label="Ціна (₴)" size="small" type="number" value={opt.price} onChange={(e) => handleWeightChange(index, 'price', e.target.value)} />
                                        <FormControlLabel control={<Checkbox checked={opt.isDefault} onChange={(e) => handleWeightChange(index, 'isDefault', e.target.checked)} />} label="За замовч." />
                                        <IconButton onClick={() => removeWeightOption(index)} color="error"><DeleteIcon /></IconButton>
                                    </Box>
                                ))}
                                <Button startIcon={<AddIcon />} onClick={addWeightOption} size="small">Додати фасування</Button>
                            </Box>
                        )}

                        {formData.productType === 'VARIANT' && (
                            <Box sx={{ p: 2, mb: 3, bgcolor: '#EFF6FF', borderRadius: 2 }}>
                                <Typography variant="subtitle1" fontWeight={600} mb={2}>Налаштування варіацій</Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}><TextField fullWidth label="Group ID (Спільний для всіх варіантів)" name="groupId" value={formData.groupId} onChange={handleChange} helperText="Наприклад: Цукерки Amanti" /></Grid>
                                    <Grid item xs={6}><TextField fullWidth label="Назва параметра (Напр: Вага)" name="variantName" value={formData.variantName} onChange={handleChange} /></Grid>
                                    <Grid item xs={6}><TextField fullWidth label="Значення (Напр: 250г)" name="variantValue" value={formData.variantValue} onChange={handleChange} /></Grid>
                                </Grid>
                            </Box>
                        )}


                        <Grid item xs={12}>

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                                <Button
                                    variant="outlined"
                                    onClick={handleGenerateDescription}
                                    disabled={isGenerating || !formData.name}
                                    sx={{
                                        borderColor: '#2563EB',
                                        color: '#2563EB',
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        borderRadius: 2,
                                        '&:hover': {
                                            borderColor: '#1D4ED8',
                                            bgcolor: '#EFF6FF'
                                        }
                                    }}
                                >
                                    {isGenerating ? (
                                        <><CircularProgress size={16} sx={{ mr: 1 }} /> Генерація...</>
                                    ) : (
                                        '✨ Згенерувати опис'
                                    )}
                                </Button>
                            </Box>

                            <TextField
                                fullWidth label="Опис" name="description" multiline rows={8}  sx = {{mb: 3}}
                                value={formData.description} onChange={handleChange}
                            />

                            <TextField
                                fullWidth label="Опис російською" name="descriptionRu" multiline rows={8}
                                value={formData.descriptionRu} onChange={handleChange}
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


                <Grid size={{ xs: 12, md: 4 }}>

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

                    {/* УКРАЇНСЬКИЙ БЛОК */}
                    <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 'none', border: '1px solid #E5E7EB' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6">Характеристики</Typography>
                            {/* Передаємо false */}
                            <Button startIcon={<AddIcon />} onClick={() => addCharacteristic(false)}>Додати</Button>
                        </Box>

                        {characteristics.map((char, index) => (
                            <Box key={`ua-${index}`} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                                <TextField
                                    label="Назва (ключ)" size="small" fullWidth
                                    value={char.key}
                                    onChange={(e) => handleCharChange(false, index, 'key', e.target.value)}
                                    placeholder="напр. Країна"
                                />
                                <TextField
                                    label="Значення" size="small" fullWidth
                                    value={char.value}
                                    onChange={(e) => handleCharChange(false, index, 'value', e.target.value)}
                                    placeholder="напр. Україна"
                                />
                                <IconButton onClick={() => removeCharacteristic(false, index)} color="error">
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        ))}
                    </Paper>

                    {/* РОСІЙСЬКИЙ БЛОК */}
                    <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 'none', border: '1px solid #E5E7EB' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6">Характеристики російською</Typography>
                            {/* Передаємо true */}
                            <Button startIcon={<AddIcon />} onClick={() => addCharacteristic(true)}>Додати</Button>
                        </Box>

                        {characteristicsRu.map((char, index) => (
                            <Box key={`ru-${index}`} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                                <TextField
                                    label="Назва (ключ) RU" size="small" fullWidth
                                    value={char.key}
                                    onChange={(e) => handleCharChange(true, index, 'key', e.target.value)}
                                    placeholder="напр. Страна"
                                />
                                <TextField
                                    label="Значення RU" size="small" fullWidth
                                    value={char.value}
                                    onChange={(e) => handleCharChange(true, index, 'value', e.target.value)}
                                    placeholder="напр. Украина"
                                />
                                <IconButton onClick={() => removeCharacteristic(true, index)} color="error">
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