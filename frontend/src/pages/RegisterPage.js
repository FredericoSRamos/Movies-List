import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/auth/register', { username, password });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Erro ao registrar.');
        }
    };

    return (
        <div className="auth-page">
            <form onSubmit={handleRegister}>
                <h2>Registrar</h2>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Usuário" required />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Senha" required />
                <button type="submit">Registrar</button>
                {error && <p className="error">{error}</p>}
                <p>Já tem uma conta? <a href="/login">Faça login</a></p>
            </form>
        </div>
    );
};

export default RegisterPage;