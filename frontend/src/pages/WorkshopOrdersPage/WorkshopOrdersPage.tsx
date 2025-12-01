// src/pages/WorkshopOrdersPage/WorkshopOrdersPage.tsx
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'; 
import Header from '../../components/Header/Header';
import { Spinner, Button, Table } from 'react-bootstrap';
import type { AppDispatch, RootState } from '../../store/store';
import { fetchOrdersHistoryAsync } from '../../store/slices/ordersHistorySlice';

import { 
  fetchApplicationDetailsAsync, 
  removeItemFromCartAsync, 
  updateItemDefects,
  updateProductionNameAsync,
  submitApplicationAsync,
  deleteApplicationAsync
} from '../../store/slices/applicationSlice';
import { getImageUrl } from '../../utils/getImageUrl';
import { ROUTES } from '../../Routes';
import './WorkshopOrdersPage.css';
export const WorkshopOrdersPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    
    const { draftApplicationId } = useSelector((state: RootState) => state.user);
    const { details, loading, error } = useSelector((state: RootState) => state.application);
    const { list: historyList, loading: historyLoading } = useSelector((state: RootState) => state.ordersHistory);

    const [productionName, setProductionName] = useState('');

    useEffect(() => {
        // Если у нас есть ID черновика, загружаем его детали
        if (draftApplicationId) {
            dispatch(fetchApplicationDetailsAsync(draftApplicationId));
        }
        // И всегда загружаем историю заявок
        dispatch(fetchOrdersHistoryAsync());
    }, [draftApplicationId, dispatch]);
    
    useEffect(() => {
        setProductionName(details?.production_name || '');
    }, [details]);

    // --- ОБРАБОТЧИКИ ДЕЙСТВИЙ ---

    const handleSaveName = () => {
        if (details?.id) {
            dispatch(updateProductionNameAsync({ appId: details.id, name: productionName }));
        }
    };

    const handleSubmitApp = () => {
        if (details?.id) {
            dispatch(submitApplicationAsync(details.id))
                .unwrap()
                .then(() => alert('Заявка успешно оформлена!'))
                .catch(err => alert(`Ошибка: ${err}`));
        }
    };

    const handleDeleteApp = () => {
        if (details?.id && window.confirm('Вы уверены, что хотите удалить заявку?')) {
            dispatch(deleteApplicationAsync(details.id))
                .unwrap()
                .then(() => navigate(ROUTES.WORKSHOPS));
        }
    };

    const handleRemoveItem = (workshopId?: number) => {
        if (details?.id && workshopId) {
            dispatch(removeItemFromCartAsync({ appId: details.id, workshopId }));
        }
    };

    // --- УСЛОВНЫЙ РЕНДЕРИНГ ---

    // 1. Состояние начальной загрузки или отсутствия ID
    if (loading === 'pending' && !details) {
        return (
            <div className="page-wrapper-cart">
                <Header />
                <main className="main"><div className="page-loader" style={{ display: 'flex', justifyContent: 'center', paddingTop: '5rem' }}><Spinner animation="border" /></div></main>
            </div>
        );
    }
    
    // 2. Если нет активного черновика
    if (!draftApplicationId && !loading) {
        return (
             <div className="page-wrapper-cart">
                <Header />
                <main className="main"><div className="container"><p>Активной заявки (черновика) не найдено.</p></div></main>
            </div>
        )
    }

    // 3. Основная разметка страницы
    return (
        <div className="page-wrapper-cart">
            <Header />
            <main className="main">
                <div className="container">
                    {/* --- БЛОК ЧЕРНОВИКА --- */}
                    <h1>Текущая заявка (Черновик)</h1>
                    
                    {loading === 'pending' && <div className="page-loader" style={{ display: 'flex', justifyContent: 'center', paddingTop: '2rem' }}><Spinner animation="border" /></div>}
                    {error && <p className="text-danger">{error}</p>}
                    
                    {/* Показываем блок черновика, только если он есть */}
                    {details && details.status === 'draft' ? (
                        <>
                            <div className="filter-bar">
                                <label>Название производства</label>
                                <input type="text" className="filter-input" value={productionName} onChange={(e) => setProductionName(e.target.value)} disabled={loading === 'pending'}/>
                                <button type="button" className="save-button" onClick={handleSaveName} disabled={loading === 'pending'}>Сохранить</button>
                            </div>

                            <div className="application-header">
                                <div className="header-label">Количество найденного брака</div>
                                <div className="header-label">Прогнозируемый объем</div>
                            </div>

                            <div className="cart-items-wrapper">
                                {details.items && details.items.length > 0 ? (
                                    details.items.map(item => (
                                        <div className="application-item" key={item.workshop?.id}>
                                            {/* ... верстка application-item ... */}
                                            <img src={getImageUrl(item.workshop?.image_key)} alt={item.workshop?.name} className="item-image" />
                                            <div className="item-info">
                                                <span className="item-title">{item.workshop?.name}</span>
                                                <p className="item-description">{item.workshop?.description}</p>
                                            </div>
                                            <div className="item-field">
                                                <input type="number" value={item.found_defects ?? 0} onChange={(e) => { if(item.workshop?.id) dispatch(updateItemDefects({ workshopId: item.workshop.id, defects: Number(e.target.value)})) }}/>
                                            </div>
                                            <div className="item-field">
                                                <input type="text" value={item.predicted_output || '-'} readOnly />
                                            </div>
                                            <p className="item-century">{item.workshop?.century}</p>
                                            <Button variant="danger" size="sm" className="remove-item-btn" onClick={() => handleRemoveItem(item.workshop?.id)}>Удалить</Button>
                                        </div>
                                    ))
                                ) : (
                                    <p style={{ textAlign: 'center' }}>Черновик пуст. Добавьте мастерские со страницы "Мастерские".</p>
                                )}
                            </div>
                            
                            <div className="application-summary">{details.items?.length || 0} позиций в заявке</div>
                            
                            <div className="cart-actions">
                                <Button variant="primary" onClick={handleSubmitApp} disabled={loading === 'pending' || !details.items?.length}>Оформить заявку</Button>
                                <Button variant="outline-danger" onClick={handleDeleteApp} disabled={loading === 'pending'}>Удалить заявку</Button>
                            </div>
                        </>
                    ) : (
                        // Сообщение, если черновика нет
                        !loading && <p>Активного черновика не найдено.</p>
                    )}

                    {/* --- БЛОК ИСТОРИИ ЗАЯВОК --- */}
                    <hr className="my-5" />
                    <h2>История заявок</h2>
                    {historyLoading === 'pending' ? (
                        <div style={{ display: 'flex', justifyContent: 'center' }}><Spinner animation="border" /></div>
                    ) : (
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Статус</th>
                                    <th>Дата создания</th>
                                    <th>Кол-во позиций</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historyList.map(order => (
                                    <tr key={order.id}>
                                        <td>#{order.id}</td>
                                        <td>{order.status}</td>
                                        <td>{new Date(order.created_at || '').toLocaleDateString()}</td>
                                        <td>{order.items_count}</td>
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