// src/pages/ProfilePage/ProfilePage.tsx
import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../components/Header/Header';
import type { AppDispatch, RootState } from '../../store/store';
import { updatePasswordAsync } from '../../store/slices/userSlice';
import './ProfilePage.css';

export const ProfilePage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error, username } = useSelector((state: RootState) => state.user);
    const [password, setPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage(''); // Сбрасываем сообщение об успехе
        dispatch(updatePasswordAsync(password))
            .unwrap()
            .then(() => {
                setSuccessMessage('Пароль успешно изменен!');
                setPassword(''); // Очищаем поле
            })
            .catch((err) => {
                console.error("Ошибка смены пароля:", err);
            });
    };

    return (
        <div className="page-wrapper">
            <Header/>
            <main className="main profile-page-main">
                <div className="profile-form-container">
                    <h2>Личный кабинет: {username}</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {successMessage && <Alert variant="success">{successMessage}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="profile-password">
                            <Form.Label>Новый пароль</Form.Label>
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Введите новый пароль"
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={loading === 'pending'}>
                            {loading === 'pending' ? <Spinner as="span" animation="border" size="sm" /> : 'Сменить пароль'}
                        </Button>
                    </Form>
                </div>
            </main>
        </div>
    );
};