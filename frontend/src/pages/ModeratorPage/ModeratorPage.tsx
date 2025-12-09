// src/pages/ModeratorPage/ModeratorPage.tsx
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { Spinner, Button, Table } from 'react-bootstrap';
import type { AppDispatch, RootState } from '../../store/store';
import { fetchOrdersHistoryAsync } from '../../store/slices/ordersHistorySlice';
import { OrderFilters } from '../../components/OrderFilters/OrderFilters';
import { completeApplicationAsync, rejectApplicationAsync } from '../../store/slices/applicationSlice'; // Мы создадим их позже
import './ModeratorPage.css';

export const ModeratorPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { list: historyList, loading: historyLoading } = useSelector((state: RootState) => state.ordersHistory);
    const { isModerator } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        // Защита страницы: если пользователь не модератор, перекидываем его
        if (!isModerator) {
            navigate('/');
        }
    }, [isModerator, navigate]);
    
    useEffect(() => {
        // Явно передаем 'false' для первичной загрузки
        dispatch(fetchOrdersHistoryAsync(false));

        const intervalId = setInterval(() => {
            // Явно передаем 'true' для фоновых обновлений
            dispatch(fetchOrdersHistoryAsync(true)); 
        }, 5000);

        return () => clearInterval(intervalId);
    }, [dispatch]);

    const handleComplete = (appId?: number) => {
        if (appId) {
            dispatch(completeApplicationAsync(appId));
        }
    };

    const handleReject = (appId?: number) => {
        if (appId) {
            dispatch(rejectApplicationAsync(appId));
        }
    };

    if (!isModerator) {
        return null; // Или можно показать спиннер, пока идет редирект
    }

    return (
        <div className="page-wrapper">
            <Header />
            <main className="main">
                <div className="container mt-4">
                    <h1 className="mb-4">Панель проффесора истории: Заявки</h1>
                    <OrderFilters />

                    {historyLoading === 'pending' ? (
                        <div className="text-center"><Spinner animation="border" /></div>
                    ) : (
                        <Table striped bordered hover responsive className="align-middle">
                            <thead>
                                <tr>
                                    <th>Статус</th>
                                    <th>Дата создания</th>
                                    <th>Количество ответов</th>
                                    <th>Создатель</th>
                                    <th className="text-center">Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historyList.map(order => (
                                    <tr key={order.id}>
                                        <td><span className={`badge bg-${order.status === 'completed' ? 'success' : order.status === 'rejected' ? 'danger' : 'secondary'}`}>{order.status}</span></td>
                                        <td>{new Date(order.created_at || '').toLocaleDateString('ru-RU')}</td>
                                        {order.status === 'completed' ? (
                                            <td className="fw-bold">
                                                {order.calculated_items_count} / {order.items_count}
                                            </td>
                                        ) : (
                                            <td className="fw-bold">
                                                -
                                            </td>
                                        )}
                                        <td>{order.creator?.login}</td>
                                        <td className="text-center">
                                            {order.status === 'formed' && (
                                                <>
                                                    <Button variant="success" size="sm" onClick={() => handleComplete(order.id)}>Завершить</Button>
                                                    <Button variant="danger" size="sm" className="ms-2" onClick={() => handleReject(order.id)}>Отклонить</Button>
                                                </>
                                            )}
                                            <Button variant="primary" size="sm" className="ms-2" onClick={() => navigate(`/orders/${order.id}`)}>Посмотреть</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </div>
            </main>
        </div>
    );
};