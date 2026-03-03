import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../utils/cropImages'; // Ваш існуючий файл!
import './UserRoom.css'; // Використовуємо існуючі стилі

const AvatarCropperModal = ({ imageSrc, onClose, onSave }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSave = async () => {
        setIsProcessing(true);
        try {
            // Використовуємо вашу функцію (вона за замовчуванням підставить білий фон '#FFFFFF')
            const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
            onSave(croppedImageBlob);
        } catch (e) {
            console.error('Помилка обрізки:', e);
        } finally {
            setIsProcessing(false);
        }
    };

    if (!imageSrc) return null;

    return (
        <div className="auth-modal-overlay" onClick={onClose}>
            <div className="modal-content cropper-modal" onClick={(e) => e.stopPropagation()}>
                <h2 className="cropper-title" >Обрізати фото</h2>

                <div className="cropper-wrapper">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        cropShape="round"
                        showGrid={false}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                        restrictPosition={false}
                        minZoom={0.5}
                        objectFit="contain"
                        tyle={{ containerStyle: { background: '#fff' } }}
                    />
                </div>

                <div className="cropper-slider-container">
                    <span className="cropper-slider-label">Масштаб</span>
                    <input
                        type="range"
                        value={zoom}
                        min={0.5}
                        max={3}
                        step={0.1}
                        onChange={(e) => setZoom(e.target.value)}
                        className="cropper-slider"
                    />
                </div>

                <div className="cropper-actions">
                    <button
                        className="save-btn cancel-btn"
                        style={{ backgroundColor: '#7B8CC6', width: '45%', margin: 0 }}
                        onClick={onClose}
                        disabled={isProcessing}
                    >
                        Скасувати
                    </button>
                    <button
                        className="save-btn confirm-btn"
                        style={{ width: '45%', margin: 0 }}
                        onClick={handleSave}
                        disabled={isProcessing}
                    >
                        {isProcessing ? 'Обробка...' : 'Зберегти'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AvatarCropperModal;