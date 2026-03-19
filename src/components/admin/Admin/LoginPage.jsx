import React, { useState } from 'react';
import {Container, Paper, TextField,
    Button, Typography, Box, Alert
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../../services/authService';

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/admin-ui/products';

    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authService.login(credentials.email, credentials.password);
            navigate(from, { replace: true });
        } catch (err) {
            setError('Невірний email або пароль');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (

        <Container component="main" maxWidth='100%'  sx={{ height: '100vh', width: '100%' ,display: 'flex',  justifyContent: 'center', alignItems: 'center' }}>
            <Paper
                elevation={3}
                sx={{
                    padding: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '400px'
                }}
            >
                <Typography component="h1" variant="h5" fontWeight="bold" gutterBottom>
                    Вхід в систему
                </Typography>

                {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email адреса"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={credentials.email}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Пароль"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={credentials.password}
                        onChange={handleChange}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2, py: 1.5, fontSize: '1rem' }}
                        disabled={loading}
                    >
                        {loading ? 'Вхід...' : 'Увійти'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default LoginPage;