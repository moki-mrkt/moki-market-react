import React, { useRef, useState } from 'react';
import {Box, Typography, IconButton, Grid, Paper, CircularProgress, FormHelperText} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'; // Іконка "+"
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

import { imageService } from '../../../services/imageService.js';

const ImageUploader = ({ selectedImages, setSelectedImages }) => {
    const fileInputRef = useRef(null);
    const MAX_IMAGES = 4;

    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const currentCount = selectedImages.length;
        const availableSlots = MAX_IMAGES - currentCount;

        if (files.length > availableSlots) {
            alert(`Можна завантажити максимум ${MAX_IMAGES} фото. Вибрано забагато файлів.`);
            return;
        }

        const filesToUpload = files.slice(0, availableSlots);

        const newPlaceholders = filesToUpload.map(file => ({
            file: file,
            preview: URL.createObjectURL(file),
            loading: true,
            error: false,
            key: null,
            uploadedUrl: null,
            imageId: null
        }));

        // file: null,
        //     imageId: img.imageId, // Файлу немає, бо це вже на сервері
        //     preview: img.imageUrl, // Використовуємо URL як прев'ю
        //     uploadedUrl: img.imageUrl, // URL вже є
        //     loading: false,
        //     error: false

        setSelectedImages(prev => [...prev, ...newPlaceholders]);

        e.target.value = '';

        for (let i = 0; i < newPlaceholders.length; i++) {
            const currentImg = newPlaceholders[i];

            try {
                const response = await imageService.uploadImage(currentImg.file);

                setSelectedImages(prev => prev.map(item => {
                    if (item.preview === currentImg.preview) {
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
                    if (item.preview === currentImg.preview) {
                        return { ...item, loading: false, error: true };
                    }
                    return item;
                }));
            }
        }
    };

    const handleRemoveImage = async (index) => {
        const imageToRemove = selectedImages[index];

        if (imageToRemove.uploadedUrl) {
            try {
                console.log(imageToRemove);
                await imageService.deleteImage(imageToRemove.key);
                console.log("Файл видалено з сервера:", imageToRemove.uploadedUrl);
            } catch (error) {
                console.error("Помилка видалення файлу з сервера:", error);
                alert("Не вдалося видалити файл з сервера, але ми приберемо його зі списку.");
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
                        {!img.loading && img.error && (
                            <ErrorIcon color="error" sx={{ position: 'absolute', bottom: 4, right: 4, bgcolor: 'white', borderRadius: '50%', fontSize: 20 }} />
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
                            multiple
                            accept="image/*"
                            hidden
                            ref={fileInputRef}
                            onChange={handleImageChange}
                        />
                    </Box>
                )}
            </Box>

            <FormHelperText sx={{ mt: 1 }}>
                Перше фото буде головним. Максимум {MAX_IMAGES} фото.
            </FormHelperText>
        </Box>
    );
};

export default ImageUploader;