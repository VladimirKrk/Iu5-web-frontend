// src/pages/LoginPage/LoginPage.tsx
import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { ROUTES } from '../../Routes';
import type { AppDispatch, RootState } from '../../store/store';
import { loginUserAsync } from '../../store/slices/userSlice';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state: RootState) => state.user);

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(loginUserAsync({ login, password }))
            .unwrap()
            .then(() => {
                navigate(ROUTES.WORKSHOPS); // Переход на страницу мастерских после успеха
            })
            .catch((err) => {
                console.error("Ошибка входа:", err); // Ошибка уже будет в state.error, но можно и так отловить
            });
    };

    return (
        <div className="page-wrapper">
            <Header/>
            <main className="main login-page-main">
                <div className="login-form-container">
                    <h2>Вход в систему</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="login-username">
                            <Form.Label>Логин</Form.Label>
                            <Form.Control
                                type="text"
                                value={login}
                                onChange={(e) => setLogin(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="login-password">
                            <Form.Label>Пароль</Form.Label>
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={loading === 'pending'}>
                            {loading === 'pending' ? <Spinner as="span" animation="border" size="sm" /> : 'Войти'}
                        </Button>
                    </Form>
                </div>
            </main>
        </div>
    );
};