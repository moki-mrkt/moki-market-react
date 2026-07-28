import React, { useRef, useState } from 'react';
import {
    Box, Paper, Typography, Button, Dialog, DialogTitle,
    DialogContent, DialogActions, Slider, CircularProgress
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

// Імпортуємо кропер та вашу утиліту для обрізки
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../../utils/cropImages.js';
import {imageService} from "../../../services/imageService.js";

const AdminTools = () => {
    const fileInputRef = useRef(null);

    // Стан для відображення поточного логотипу на сторінці
    const [logoPreview, setLogoPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    // Стан для модального вікна та кропера
    const [isCropOpen, setIsCropOpen] = useState(false);
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [currentFileName, setCurrentFileName] = useState('');

    // Обробник вибору файлу
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setCurrentFileName(file.name);

        const reader = new FileReader();
        reader.addEventListener('load', () => {
            setImageSrc(reader.result);
            setIsCropOpen(true);
            setZoom(1);
            setCrop({ x: 0, y: 0 });
        });
        reader.readAsDataURL(file);

        e.target.value = '';
    };

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const handleCropConfirm = async () => {
        setLoading(true);
        try {

            const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels, '#FFFFFF');
            const croppedFile = new File([croppedBlob], currentFileName, { type: "image/webp" });

            const previewUrl = URL.createObjectURL(croppedFile);
            setLogoPreview(previewUrl);

            await imageService.addWatermark(croppedFile);

            alert('Зображення успішно відправлено!');
            setIsCropOpen(false);
            setImageSrc(null);

        } catch (error) {
            console.error("Помилка:", error);

            if (error.response) {
                const status = error.response.status;

                const serverMessage = error.response.data?.message || 'Невідома помилка сервера';

                if (status === 400) {
                    alert(`Неправильний запит: ${serverMessage}`);
                } else if (status === 401) {
                    alert('Помилка авторизації. Спробуйте увійти знову.');
                } else if (status === 403) {
                    alert('У вас немає прав для виконання цієї дії.');
                } else {
                    alert(`Помилка сервера (${status}): ${serverMessage}`);
                }
            } else if (error.request) {
                alert("Немає зв'язку з сервером. Перевірте підключення до інтернету.");
            } else {
                alert("Сталася локальна помилка при обробці зображення.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCloseCrop = () => {
        setIsCropOpen(false);
        setImageSrc(null);
    };

    return (
        <Box sx={{ pb: 5 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ color: '#111827', mb: 1, fontWeight: 800 }}>
                    Додаткові інструменти
                </Typography>
                <Typography variant="body2" sx={{ color: '#6B7280' }}>
                    Налаштування загальних параметрів сайту
                </Typography>
            </Box>

            <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E5E7EB', boxShadow: 'none', maxWidth: 600 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Інструменти для фото</Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>

                    {/*/!* Область прев'ю логотипу *!/*/}
                    {/*<Box sx={{*/}
                    {/*    width: 200,*/}
                    {/*    height: 200,*/}
                    {/*    border: '2px dashed #E5E7EB',*/}
                    {/*    borderRadius: 2,*/}
                    {/*    display: 'flex',*/}
                    {/*    alignItems: 'center',*/}
                    {/*    justifyContent: 'center',*/}
                    {/*    overflow: 'hidden',*/}
                    {/*    bgcolor: '#F9FAFB'*/}
                    {/*}}>*/}
                    {/*    {logoPreview ? (*/}
                    {/*        <img src={logoPreview} alt="Logo Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />*/}
                    {/*    ) : (*/}
                    {/*        <Typography variant="body2" color="text.secondary">Логотип не обрано</Typography>*/}
                    {/*    )}*/}
                    {/*</Box>*/}

                    {/* Кнопка та прихований інпут */}
                    <input
                        type="file"
                        accept="image/*"
                        hidden
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                    />

                    <Button
                        variant="contained"
                        startIcon={<AddPhotoAlternateIcon />}
                        onClick={() => fileInputRef.current.click()}
                        sx={{
                            bgcolor: '#111827',
                            '&:hover': { bgcolor: '#374151' },
                            borderRadius: 2
                        }}
                    >
                        Додати лого
                    </Button>
                </Box>
            </Paper>

            {/* Модальне вікно з кропером */}
            <Dialog
                open={isCropOpen}
                onClose={handleCloseCrop}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ fontWeight: 600 }}>Редагування логотипу</DialogTitle>
                <DialogContent>
                    <Box sx={{ position: 'relative', width: '100%', height: 400, backgroundColor: '#333', mb: 2, borderRadius: 2, overflow: 'hidden' }}>
                        {imageSrc && (
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1} // Можете змінити пропорції, наприклад на 16/9, якщо лого прямокутне
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                                restrictPosition={false}
                                minZoom={0.5}
                                objectFit="contain"
                                style={{ containerStyle: { background: '#fff' } }}
                            />
                        )}
                    </Box>
                    <Box sx={{ px: 2 }}>
                        <Typography gutterBottom variant="body2" color="text.secondary">Масштаб</Typography>
                        <Slider
                            value={zoom}
                            min={0.5}
                            max={3}
                            step={0.1}
                            onChange={(e, zoom) => setZoom(zoom)}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleCloseCrop} color="inherit" disabled={loading}>
                        Відміна
                    </Button>
                    <Button
                        onClick={handleCropConfirm}
                        variant="contained"
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
                        disabled={loading}
                        sx={{ bgcolor: '#111827', '&:hover': { bgcolor: '#374151' } }}
                    >
                        {loading ? 'Відправка...' : 'Відправити'}
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
};

export default AdminTools;