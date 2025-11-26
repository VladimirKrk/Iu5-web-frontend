// src/pages/WorkshopOrdersPage/WorkshopOrdersPage.tsx
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'; 
import Header from '../../components/Header/Header';
import { Spinner, Button } from 'react-bootstrap';
import type { AppDispatch, RootState } from '../../store/store';

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
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    
    const { draftApplicationId } = useSelector((state: RootState) => state.user);
    const { details, loading, error } = useSelector((state: RootState) => state.application);

    const [productionName, setProductionName] = useState('');

    useEffect(() => {
        if (draftApplicationId) {
            dispatch(fetchApplicationDetailsAsync(draftApplicationId));
        }
    }, [draftApplicationId, dispatch]);
    
    useEffect(() => {
        // Загружаем детали заявки по ID из URL
        if (id) {
            dispatch(fetchApplicationDetailsAsync(Number(id)));
        }
    }, [id, dispatch]);

    useEffect(() => {
        // Устанавливаем имя, когда детали заявки загружаются или обновляются
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
                    <div className="filter-bar">
                        <label>Название производства</label>
                        <input 
                            type="text" 
                            className="filter-input" 
                            placeholder="Название вашего производства..." 
                            value={productionName}
                            onChange={(e) => setProductionName(e.target.value)}
                            disabled={details?.status !== 'draft' || loading === 'pending'}
                        />
                        {details?.status === 'draft' && (
                            <button type="button" className="save-button" onClick={handleSaveName} disabled={loading === 'pending'}>
                                Сохранить
                            </button>
                        )}
                    </div>

                    {error && <p className="text-danger" style={{ textAlign: 'center' }}>{error}</p>}

                    <div className="application-header">
                        <div className="header-label">Количество найденного брака</div>
                        <div className="header-label">Прогнозируемый объем</div>
                    </div>

                    <div className="cart-items-wrapper">
                        {details?.items && details.items.length > 0 ? (
                            details.items.map(item => (
                                <div className="application-item" key={item.workshop?.id}>
                                    <img src={getImageUrl(item.workshop?.image_key)} alt={item.workshop?.name} className="item-image" />
                                    <div className="item-info">
                                        <span className="item-title">{item.workshop?.name}</span>
                                        <p className="item-description">{item.workshop?.description}</p>
                                    </div>
                                    <div className="item-field">
                                        <input 
                                            type="number" 
                                            value={item.found_defects ?? 0}
                                            disabled={details?.status !== 'draft' || loading === 'pending'}
                                            onChange={(e) => {
                                                if(item.workshop?.id) {
                                                    dispatch(updateItemDefects({ workshopId: item.workshop.id, defects: Number(e.target.value)}))
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="item-field">
                                        <input type="text" value={item.predicted_output || '-'} readOnly />
                                    </div>
                                    <p className="item-century">{item.workshop?.century}</p>
                                    {details?.status === 'draft' && (
                                        <Button variant="danger" size="sm" className="remove-item-btn" onClick={() => handleRemoveItem(item.workshop?.id)} disabled={loading === 'pending'}>
                                            Удалить
                                        </Button>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p style={{ textAlign: 'center' }}>Ваша заявка пуста.</p>
                        )}
                    </div>
                    
                    <div className="application-summary">
                        {details?.items?.length || 0} позиций в заявке
                    </div>
                    
                    <div className="cart-actions">
                        {details?.status === 'draft' && (
                            <>
                                <Button variant="primary" onClick={handleSubmitApp} disabled={loading === 'pending' || !details?.items?.length}>
                                    Оформить заявку
                                </Button>
                                <Button variant="outline-danger" onClick={handleDeleteApp} disabled={loading === 'pending'}>
                                    Удалить заявку
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};