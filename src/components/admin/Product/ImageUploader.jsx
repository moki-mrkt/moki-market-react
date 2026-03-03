import React, { useRef, useState } from 'react';
import {Box, Typography, IconButton, Grid, Paper, CircularProgress, FormHelperText,
    Dialog, DialogTitle, DialogContent, DialogActions, Button, Slider
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'; // Іконка "+"
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

import { imageService } from '../../../services/imageService.js';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../../utils/cropImages.js';

const ImageUploader = ({ selectedImages, setSelectedImages }) => {
    const fileInputRef = useRef(null);
    const MAX_IMAGES = 4;

    const [isCropOpen, setIsCropOpen] = useState(false);
    const [imageSrc, setImageSrc] = useState(null); // URL картинки для редагування
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [currentFileName, setCurrentFileName] = useState('');

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (selectedImages.length >= MAX_IMAGES) {
            alert(`Максимум ${MAX_IMAGES} фото.`);
            return;
        }

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
        try {
            setIsCropOpen(false);

            const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels, '#FFFFFF');
            const croppedFile = new File([croppedBlob], currentFileName, { type: "image/jpeg" });

            const previewUrl = URL.createObjectURL(croppedFile);
            const newPlaceholder = {
                file: croppedFile,
                preview: previewUrl,
                loading: true,
                error: false,
                key: null,
                uploadedUrl: null,
                imageId: null
            };

            setSelectedImages(prev => [...prev, newPlaceholder]);

            try {
                const response = await imageService.uploadImage('products', croppedFile);

                setSelectedImages(prev => prev.map(item => {
                    if (item.preview === previewUrl) {
                        return {
                            ...item,
                            loading: false,
                            key: response.key,
                            uploadedUrl: response.url,
                            imageId: response.key
                        };
                    }
                    return item;
                }));
            } catch (error) {
                console.error("Upload failed", error);
                setSelectedImages(prev => prev.map(item => {
                    if (item.preview === previewUrl) {
                        return { ...item, loading: false, error: true };
                    }
                    return item;
                }));
            }

        } catch (e) {
            console.error("Crop failed", e);
        } finally {
            setImageSrc(null);
        }
    };

    const handleRemoveImage = async (index) => {
        const imageToRemove = selectedImages[index];

        if (imageToRemove.uploadedUrl) {
            try {
                await imageService.deleteImage(imageToRemove.key);
            } catch (error) {
                console.error("Помилка видалення:", error);
            }
        }

        setSelectedImages(prev => {
            const newImages = [...prev];
            if (newImages[index].preview) {
                URL.revokeObjectURL(newImages[index].preview);
            }
            newImages.splice(index, 1);
            return newImages;
        });
    };

    return (
        <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Фотографії товару ({selectedImages.length}/{MAX_IMAGES})
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>

                {selectedImages.map((img, index) => (
                    <Box
                        key={index}
                        sx={{
                            width: 120,
                            height: 120,
                            position: 'relative',
                            borderRadius: 2,
                            overflow: 'hidden',
                            border: img.error ? '2px solid red' : '1px solid #e0e0e0',
                            backgroundColor: '#f5f5f5'
                        }}
                    >
                        <img
                            src={img.preview}
                            alt="preview"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                opacity: img.loading ? 0.6 : 1
                            }}
                        />

                        {img.loading && (
                            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                                <CircularProgress size={24} />
                            </Box>
                        )}

                        {!img.loading && !img.error && (
                            <CheckCircleIcon color="success" sx={{ position: 'absolute', bottom: 4, right: 4, bgcolor: 'white', borderRadius: '50%', fontSize: 20 }} />
                        )}

                        <IconButton
                            size="small"
                            onClick={() => handleRemoveImage(index)}
                            sx={{
                                position: 'absolute',
                                top: 4,
                                right: 4,
                                backgroundColor: 'rgba(255,255,255,0.8)',
                                padding: '2px',
                                '&:hover': { backgroundColor: '#fff', color: 'red' }
                            }}
                        >
                            <DeleteIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                    </Box>
                ))}

                {selectedImages.length < MAX_IMAGES && (
                    <Box
                        onClick={() => fileInputRef.current.click()}
                        sx={{
                            width: 120,
                            height: 120,
                            border: '2px dashed #ccc',
                            borderRadius: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: '#9e9e9e',
                            transition: 'all 0.2s',
                            '&:hover': {
                                borderColor: '#1976d2',
                                color: '#1976d2',
                                backgroundColor: '#f0f7ff'
                            }
                        }}
                    >
                        <AddPhotoAlternateIcon sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="caption">Додати</Typography>

                        <input
                            type="file"
                            // multiple
                            accept="image/*"
                            hidden
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                        />
                    </Box>
                )}
            </Box>

            <FormHelperText sx={{ mt: 1 }}>
                Перше фото буде головним. Максимум {MAX_IMAGES} фото.
            </FormHelperText>

            <Dialog
                open={isCropOpen}
                onClose={() => setIsCropOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Редагування фото</DialogTitle>
                <DialogContent>
                    <Box sx={{ position: 'relative', width: '100%', height: 400, backgroundColor: '#333', mb: 2 }}>
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={1} // Змінюйте пропорції за потребою (наприклад 1 для квадрата)
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                            restrictPosition={false} // Картинка може бути меншою за рамку
                            minZoom={0.5}
                            objectFit="contain"     // Показувати всю картинку
                            style={{
                                containerStyle: { background: '#fff' }, // Білий фон для порожніх місць
                                mediaStyle: {  }
                            }}
                        />
                    </Box>
                    <Box sx={{ px: 2 }}>
                        <Typography gutterBottom>Масштаб</Typography>
                        <Slider
                            value={zoom}
                            min={0.5}
                            max={3}
                            step={0.1}
                            onChange={(e, zoom) => setZoom(zoom)}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsCropOpen(false)} color="inherit">
                        Скасувати
                    </Button>
                    <Button onClick={handleCropConfirm} variant="contained" color="primary">
                        Обрізати та Завантажити
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
};

export default ImageUploader;