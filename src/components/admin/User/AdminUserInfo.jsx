import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Typography, Paper, Grid, Avatar,
    Chip, Divider, CircularProgress, IconButton, Stack, Button, TextField, Switch
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CakeIcon from '@mui/icons-material/Cake';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SecurityIcon from '@mui/icons-material/Security';
import HistoryIcon from '@mui/icons-material/History';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { userService } from "../../../services/userService.js";
import {URLS} from "../../../constants/urls.js";

const AdminUserInfo = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    // Стан для редагування (UserUpdateDTO)
    const [editData, setEditData] = useState({
        phoneNumber: '',
        dateOfBirth: '',
        activated: false,
        accessToAccount: false,
        subscribedToNews: false,
        numberOfFailedAttempts: 0
    });

    useEffect(() => {
        fetchUser();
    }, [id]);

    const fetchUser = async () => {
        setLoading(true);
        try {
            const data = await userService.getUserByIdForAdmin(id);
            setUser(data);
            setEditData({
                phoneNumber: data.phoneNumber || '',
                dateOfBirth: data.dateOfBirth || '',
                activated: data.activated || false,
                accessToAccount: data.accessToAccount || false,
                subscribedToNews: data.subscribedToNews || false,
                numberOfFailedAttempts: data.numberOfFailedAttempts || 0
            });
        } catch (error) {
            console.error("Помилка завантаження користувача:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        const phoneRegex = /^\+[0-9]+$/;
        if (editData.phoneNumber && !phoneRegex.test(editData.phoneNumber)) {
            alert("Номер телефону має починатися з '+' та містити лише цифри");
            return;
        }

        try {
            setLoading(true);
            await userService.updateUserByAdmin(id, editData);
            setUser({ ...user, ...editData });
            setIsEditing(false);
            alert("Профіль успішно оновлено");
        } catch (error) {
            console.error("Помилка оновлення:", error);
            alert("Не вдалося зберегти зміни. Перевірте валідність даних.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setEditData({
            phoneNumber: user.phoneNumber || '',
            dateOfBirth: user.dateOfBirth || '',
            activated: user.activated || false,
            accessToAccount: user.accessToAccount || false,
            subscribedToNews: user.subscribedToNews || false,
            numberOfFailedAttempts: user.numberOfFailedAttempts || 0
        });
        setIsEditing(false);
    };

    if (loading && !user) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress sx={{ color: '#111827' }} />
            </Box>
        );
    }

    if (!user) return <Typography>Користувача не знайдено</Typography>;

    const delivery = user.deliveryInfo || {};

    const getDeliveryTypeString = (type) => {
        switch (type) {
            case 'NOVA_POSHTA': return 'Нова пошта';
            case 'UKR_POSHTA': return 'Укр пошта';
            default: return 'Не вказано';
        }
    }

    const getRoleTypeString = (type) => {
        switch (type) {
            case 'ADMIN': return 'Адмін';
            case 'MANAGER': return 'Менеджер';
            case 'CUSTOMER': return 'Клієнт';
            default: return type;
        }
    }

    return (
        <Box sx={{ pb: 5 }}>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton onClick={() => navigate('/admin-ui/users')} sx={{ border: '1px solid #E5E7EB' }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#111827' }}> Профіль користувача </Typography>
                        <Typography variant="body2" sx={{ color: '#6B7280' }}> ID: {user.id} </Typography>
                    </Box>
                </Box>

                <Stack direction="row" spacing={2}>
                    {!isEditing ? (
                        <Button
                            variant="contained"
                            startIcon={<EditIcon />}
                            onClick={() => setIsEditing(true)}
                            sx={{ bgcolor: '#111827', '&:hover': { bgcolor: '#374151' } }}
                        >
                            Редагувати
                        </Button>
                    ) : (
                        <>
                            <Button variant="outlined" startIcon={<CloseIcon />} onClick={handleCancel}>
                                Скасувати
                            </Button>
                            <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} color="success">
                                Зберегти
                            </Button>
                        </>
                    )}
                </Stack>
            </Box>

            <Grid container spacing={3}>
                {/* Ліва колонка: Профіль та Контакти */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E5E7EB', boxShadow: 'none' }}>
                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                            <Avatar
                                src={`${URLS.s3_bucket}${user.imageUrl}`}
                                sx={{ width: 100, height: 100, mx: 'auto', mb: 2, border: '3px solid #F3F4F6' }}
                            >
                                {user.firstName?.charAt(0)}
                            </Avatar>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                {user.firstName} {user.secondName}
                            </Typography>

                            <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 1, flexWrap: 'wrap', gap: 1 }}>
                                <Chip
                                    label={getRoleTypeString(user.roleType)}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                    sx={{ fontWeight: 600 }}
                                />
                                {editData.blocked && (
                                    <Chip label="Заблокований" size="small" color="error" icon={<CancelIcon />} />
                                )}
                            </Stack>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ mt: 2 }}>
                            <ContactItem icon={<EmailIcon />} label="Email" value={user.email} />

                            <ContactItem
                                icon={<PhoneIcon />}
                                label="Телефон"
                                value={editData.phoneNumber}
                                isEditing={isEditing}
                                onChange={(val) => setEditData({...editData, phoneNumber: val})}
                            />

                            <ContactItem
                                icon={<CakeIcon />}
                                label="Дата народження"
                                value={editData.dateOfBirth}
                                isEditing={isEditing}
                                type="date"
                                onChange={(val) => setEditData({...editData, dateOfBirth: val})}
                            />

                            <ContactItem icon={<HistoryIcon />} label="Створено" value={user.creationTime} isDate />
                        </Box>
                    </Paper>
                </Grid>

                {/* Права колонка: Доставка, Статус, Безпека */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Stack spacing={3}>
                        {/* Адреса доставки (тільки перегляд, бо немає в DTO) */}
                        <Paper sx={{ p: 3, borderRadius: 3, border: 'none', boxShadow: 'none' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                <LocalShippingIcon sx={{ color: '#111827' }} />
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>Адреса доставки</Typography>
                            </Box>
                            <Grid container spacing={2}>
                                <InfoField label="Область" value={delivery.region} />
                                <InfoField label="Місто" value={delivery.city} />
                                <InfoField label="Перевізник" value={getDeliveryTypeString(delivery.deliveryType)} />
                                <InfoField label="Відділення" value={delivery.postOffice ? `№ ${delivery.postOffice}` : '—'} />
                                <InfoField label="Вулиця" value={delivery.street} />
                                <InfoField label="Будинок" value={delivery.house} />
                            </Grid>
                        </Paper>

                        {/* Статус акаунту */}
                        <Paper sx={{ p: 3, borderRadius: 3, border: 'none', boxShadow: 'none' }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Статус акаунту</Typography>
                            <Grid container spacing={2}>
                                <StatusRow
                                    label="Активований"
                                    value={editData.activated}
                                    isEditing={isEditing}
                                    onChange={(val) => setEditData({...editData, activated: val})}
                                    icon={editData.activated ? <CheckCircleIcon color="success" fontSize="small" /> : <CancelIcon color="disabled" fontSize="small" />}
                                />
                                <StatusRow
                                    label="Підписка на новини"
                                    value={editData.subscribedToNews}
                                    isEditing={isEditing}
                                    onChange={(val) => setEditData({...editData, subscribedToNews: val})}
                                    icon={<NotificationsIcon sx={{ color: editData.subscribedToNews ? '#3B82F6' : '#9CA3AF' }} fontSize="small" />}
                                />
                                <InfoField
                                    label="Блокування"
                                    value={user.blocked ? "Заблоковано" : "Активний"}
                                />
                            </Grid>
                        </Paper>

                        {/* Безпека */}
                        <Paper sx={{ p: 3, borderRadius: 3, border: 'none', boxShadow: 'none' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <SecurityIcon sx={{ color: '#111827' }} />
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>Безпека</Typography>
                            </Box>
                            <Grid container spacing={2}>
                                <InfoField
                                    label="Невдалі спроби входу"
                                    value={editData.numberOfFailedAttempts}
                                    isEditing={isEditing}
                                    type="number"
                                    onChange={(val) => setEditData({...editData, numberOfFailedAttempts: parseInt(val) || 0})}
                                    color={editData.numberOfFailedAttempts > 3 ? 'error.main' : 'text.primary'}
                                />
                                <StatusRow
                                    label="Доступ до кабінету"
                                    value={editData.accessToAccount}
                                    isEditing={isEditing}
                                    onChange={(val) => setEditData({...editData, accessToAccount: val})}
                                    icon={editData.accessToAccount ? <CheckCircleIcon color="success" fontSize="small" /> : <CancelIcon color="error" fontSize="small" />}
                                />
                            </Grid>
                        </Paper>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};

const ContactItem = ({ icon, label, value, isDate, isEditing, onChange, type = "text" }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
        {React.cloneElement(icon, { sx: { color: '#9CA3AF', fontSize: 20 } })}
        <Box sx={{ flexGrow: 1 }}>
            <Typography variant="caption" sx={{ color: '#9CA3AF', display: 'block', lineHeight: 1 }}>{label}</Typography>
            {isEditing ? (
                <TextField
                    fullWidth
                    size="small"
                    type={type}
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    sx={{ mt: 0.5 }}
                    InputLabelProps={type === 'date' ? { shrink: true } : {}}
                />
            ) : (
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {type === 'date' || isDate ? (value ? new Date(value).toLocaleDateString('uk-UA') : '—') : (value || '—')}
                </Typography>
            )}
        </Box>
    </Box>
);

const StatusRow = ({ label, value, icon, isEditing, onChange }) => (
    <Grid size={{ xs: 12, sm: 4 }}>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', p: 1, border: 'none', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {icon}
                <Typography variant="body2" sx={{ color: '#6B7280' }}>{label}</Typography>
            </Box>
            {isEditing ? (
                <Switch checked={!!value} onChange={(e) => onChange(e.target.checked)} size="small" />
            ) : (
                <Typography variant="caption" sx={{ fontWeight: 700, lineHeight: 1, fontSize: '14px', color: value ? 'success.main' : 'text.disabled' }}>
                    {value ? "ТАК" : "НІ"}
                </Typography>
            )}
        </Box>
    </Grid>
);

const InfoField = ({ label, value, color = 'text.primary', isEditing, onChange, type = "text" }) => (
    <Grid size={{ xs: 12, sm: 4 }}>
        <Typography variant="caption" sx={{ color: '#9CA3AF', textTransform: 'uppercase', fontWeight: 600 }}>{label}</Typography>
        {isEditing ? (
            <TextField
                fullWidth
                size="small"
                type={type}
                value={value ?? ''}
                onChange={(e) => onChange(e.target.value)}
                sx={{ mt: 0.5, border: 'none'}}
            />
        ) : (
            <Typography variant="body1" sx={{ color, fontWeight: 600 }}>{value ?? '—'}</Typography>
        )}
    </Grid>
);

export default AdminUserInfo;