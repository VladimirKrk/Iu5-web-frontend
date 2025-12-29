// src/pages/ModeratorPage/ModeratorPage.tsx
import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { Spinner, Button, Table} from 'react-bootstrap';
import type { AppDispatch, RootState } from '../../store/store';
import { fetchOrdersHistoryAsync } from '../../store/slices/ordersHistorySlice';
import { ModeratorOrderFilters } from '../../components/ModeratorOrderFilters/ModeratorOrderFilters';
import { completeWorkshopApplicationAsync, rejectWorkshopApplicationAsync } from '../../store/slices/workshopApplicationSlice';
import './ModeratorPage.css';

export const ModeratorPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { list: historyList, loading: historyLoading } = useSelector((state: RootState) => state.ordersHistory);
    const { isModerator } = useSelector((state: RootState) => state.user);
    const creatorFilter = useSelector((state: RootState) => state.filter.searchTerm);

    useEffect(() => {
        if (!isModerator) {
            navigate('/');
        }
    }, [isModerator, navigate]);
    
    useEffect(() => {
        dispatch(fetchOrdersHistoryAsync(false));
        const intervalId = setInterval(() => {
            dispatch(fetchOrdersHistoryAsync(true)); 
        }, 5000);
        return () => clearInterval(intervalId);
    }, [dispatch]);

    const handleComplete = (appId?: number) => {
        if (appId) {
            dispatch(completeWorkshopApplicationAsync(appId));
        }
    };

    const handleReject = (appId?: number) => {
        if (appId) {
            dispatch(rejectWorkshopApplicationAsync(appId));
        }
    };

    const filteredHistoryList = useMemo(() => {
        if (!creatorFilter) {
            return historyList;
        }
        return historyList.filter(order => 
            order.creator?.login?.toLowerCase().includes(creatorFilter.toLowerCase())
        );
    }, [historyList, creatorFilter]);

    if (!isModerator) {
        return null;
    }

    return (
        <div className="page-wrapper">
            <Header />
            <main className="main">
                <div className="container mt-4">
                    <h1 className="mb-4">Панель проффесора истории</h1>
                    <ModeratorOrderFilters />

                    {(historyLoading === 'pending' && !filteredHistoryList.length) ? (
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
                                {filteredHistoryList.map(order => (
                                    <tr key={order.id}>
                                        <td><span className={`badge bg-${order.status === 'completed' ? 'success' : order.status === 'rejected' ? 'danger' : 'secondary'}`}>{order.status}</span></td>
                                        <td>{new Date(order.created_at || '').toLocaleDateString('ru-RU')}</td>
                                        <td className="text-center fw-bold">{order.calculated_items_count} / {order.items_count}</td>
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
                                 {filteredHistoryList.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="text-center">Заявки не найдены.</td>
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