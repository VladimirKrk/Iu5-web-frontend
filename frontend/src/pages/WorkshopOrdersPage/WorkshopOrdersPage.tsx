// src/pages/WorkshopOrdersPage/WorkshopOrdersPage.tsx
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Header from '../../components/Header/Header';
import { Spinner, Button } from 'react-bootstrap';
import type { AppDispatch, RootState } from '../../store/store';
import { fetchApplicationDetailsAsync, removeItemFromCartAsync, updateItemDefects } from '../../store/slices/applicationSlice';
import { getImageUrl } from '../../utils/getImageUrl';
import './WorkshopOrdersPage.css';

export const WorkshopOrdersPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    
    // --- ИЗМЕНЕНИЯ ЗДЕСЬ ---
    // Получаем ID заявки не из URL, а напрямую из userSlice
    const { draftApplicationId } = useSelector((state: RootState) => state.user);
    // Детали заявки по-прежнему берем из applicationSlice
    const { details, loading, error } = useSelector((state: RootState) => state.application);

    const [productionName, setProductionName] = useState('');

    useEffect(() => {
        // Запускаем загрузку, только если ID черновика известен
        if (draftApplicationId) {
            dispatch(fetchApplicationDetailsAsync(draftApplicationId));
        }
    }, [draftApplicationId, dispatch]);
    
    useEffect(() => {
        if (details?.production_name) {
            setProductionName(details.production_name);
        }
    }, [details]);

    const handleRemoveItem = (workshopId?: number) => {
        if (details?.id && workshopId) {
            dispatch(removeItemFromCartAsync({ appId: details.id, workshopId }));
        }
    };
    
    if (loading === 'pending' && !details) {
        return (
            <div className="page-wrapper-cart">
                <Header />
                <main className="main"><div className="page-loader" style={{ display: 'flex', justifyContent: 'center', paddingTop: '5rem' }}><Spinner animation="border" /></div></main>
            </div>
        );
    }

    // Если нет ID черновика, показываем сообщение
    if (!draftApplicationId) {
        return (
             <div className="page-wrapper-cart">
                <Header />
                <main className="main"><div className="container"><p>Активной заявки (черновика) не найдено.</p></div></main>
            </div>
        )
    }

    return (
        // ... остальная JSX-разметка остается без изменений ...
        <div className="page-wrapper-cart">
            <Header />
            <main className="main">
                <div className="container">
                    <div className="filter-bar">
                        <label>Введите название производства</label>
                        <input 
                            type="text" 
                            className="filter-input" 
                            placeholder="Название вашего производства..." 
                            value={productionName}
                            onChange={(e) => setProductionName(e.target.value)}
                        />
                        <button type="button" className="save-button">Сохранить</button>
                    </div>

                    <div className="application-header">
                        <div className="header-label">Количество найденного брака</div>
                        <div className="header-label">Прогнозируемый объем</div>
                    </div>

                    <div className="cart-items-wrapper">
                        {details?.items?.map(item => (
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
                                <Button variant="danger" size="sm" className="remove-item-btn" onClick={() => handleRemoveItem(item.workshop?.id)}>
                                    Удалить
                                </Button>
                            </div>
                        ))}
                    </div>
                    
                    <div className="application-summary">
                        {details?.items?.length || 0} позиций в заявке
                    </div>
                    
                    <div className="cart-actions">
                        <Button variant="primary">Оформить заявку</Button>
                        <Button variant="outline-danger">Удалить заявку</Button>
                    </div>
                </div>
            </main>
        </div>
    );
};