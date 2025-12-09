// src/pages/OrdersHistoryPage/OrdersHistoryPage.tsx
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { Spinner, Button, Table } from 'react-bootstrap';
import type { AppDispatch, RootState } from '../../store/store';
import { fetchOrdersHistoryAsync } from '../../store/slices/ordersHistorySlice';
import { OrderFilters } from '../../components/OrderFilters/OrderFilters';
import './OrdersHistoryPage.css'; // Можно создать пустой файл или скопировать стили, если нужны

export const OrdersHistoryPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { list: historyList, loading: historyLoading } = useSelector((state: RootState) => state.ordersHistory);

    useEffect(() => {
        // При заходе на страницу всегда загружаем историю
        dispatch(fetchOrdersHistoryAsync(true));
    }, [dispatch]);

    return (
        <div className="page-wrapper">
            <Header />
            <main className="main">
                <div className="container">
                    <h1 className="mb-4">История заявок</h1>
                    
                    <OrderFilters />
                    {historyLoading === 'pending' ? (
                        <div style={{ display: 'flex', justifyContent: 'center' }}><Spinner animation="border" /></div>
                    ) : (
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    {/* Убираем колонку ID */}
                                    <th>Статус</th>
                                    <th>Дата создания</th>
                                    <th>Количество ответов</th>
                                    <th>Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historyList.map(order => (
                                    <tr key={order.id}>
                                        <td>{order.status}</td>
                                        <td>{new Date(order.created_at || '').toLocaleDateString('ru-RU')}</td>
                                        <td>
                                            <span className="fw-bold">
                                                {order.calculated_items_count} / {order.items_count}
                                            </span>
                                        </td>

                                        <td>
                                            <Button variant="primary" size="sm" onClick={() => navigate(`/orders/${order.id}`)} >
                                                Посмотреть
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {historyList.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="text-center">История заявок пуста.</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    )}
                </div>
            </main>
        </div>
    );
};