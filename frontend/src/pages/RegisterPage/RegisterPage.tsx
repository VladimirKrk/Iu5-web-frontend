// src/pages/RegisterPage/RegisterPage.tsx
import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { ROUTES } from '../../Routes';
import type { AppDispatch, RootState } from '../../store/store';
import { registerUserAsync } from '../../store/slices/userSlice';
import './RegisterPage.css'; // Используем похожие стили

export const RegisterPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state: RootState) => state.user);

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(registerUserAsync({ login, password }))
            .unwrap()
            .then(() => {
                navigate(ROUTES.WORKSHOPS); // Переход на страницу мастерских после успеха
            })
            .catch((err) => {
                console.error("Ошибка регистрации:", err);
            });
    };

    return (
        <div className="page-wrapper">
            <Header/>
            <main className="main register-page-main">
                <div className="register-form-container">
                    <h2>Регистрация</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="register-username">
                            <Form.Label>Логин</Form.Label>
                            <Form.Control
                                type="text"
                                value={login}
                                onChange={(e) => setLogin(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="register-password">
                            <Form.Label>Пароль</Form.Label>
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={loading === 'pending'}>
                            {loading === 'pending' ? <Spinner as="span" animation="border" size="sm" /> : 'Зарегистрироваться'}
                        </Button>
                    </Form>
                    <div className="text-center mt-3">
                        <Link to={ROUTES.LOGIN}>Уже есть аккаунт? Войти</Link>
                    </div>
                </div>
            </main>
        </div>
    );
};