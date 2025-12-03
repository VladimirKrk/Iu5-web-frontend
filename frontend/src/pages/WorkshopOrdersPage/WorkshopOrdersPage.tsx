// src/pages/WorkshopOrdersPage/WorkshopOrdersPage.tsx
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate} from 'react-router-dom'; 
import Header from '../../components/Header/Header';
import { Spinner, Button} from 'react-bootstrap';
import type { AppDispatch, RootState } from '../../store/store';
import { updateItemDefectsAsync } from '../../store/slices/applicationSlice';


import { 
  fetchApplicationDetailsAsync, 
  removeItemFromCartAsync, 
  updateItemDefects,
  updateProductionNameAsync,
  submitApplicationAsync,
  deleteApplicationAsync,
  setProductionName
} from '../../store/slices/applicationSlice';
import { getImageUrl } from '../../utils/getImageUrl';
import { ROUTES } from '../../Routes';
import './WorkshopOrdersPage.css';
export const WorkshopOrdersPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    
    const { draftApplicationId } = useSelector((state: RootState) => state.user);
    const { details, loading, error } = useSelector((state: RootState) => state.application);


    const handleSaveDefects = (workshopId?: number, defects?: number) => {
        if (details?.id && workshopId !== undefined && defects !== undefined) {
            dispatch(updateItemDefectsAsync({ appId: details.id, workshopId, defects }));
        }
    };

    useEffect(() => {
        if (typeof draftApplicationId === 'number') {
            dispatch(fetchApplicationDetailsAsync(draftApplicationId));
        }
    }, [draftApplicationId, dispatch]);


    // --- ОБРАБОТЧИКИ ДЕЙСТВИЙ ---

    const handleSaveName = () => {
        if (details?.id && details.production_name) {
            dispatch(updateProductionNameAsync({ appId: details.id, name: details.production_name }));
        }
    };

    const handleSubmitApp = () => {
        if (details?.id) {
            dispatch(submitApplicationAsync(details.id))
                .unwrap()
                .then(() => {
                    alert('Заявка успешно оформлена!');
                    // redirecting on workshop page
                    navigate(ROUTES.WORKSHOPS);
                })
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
                    <h1>Текущая заявка</h1>
                    
                    {loading === 'pending' && <div className="page-loader" style={{ display: 'flex', justifyContent: 'center', paddingTop: '2rem' }}><Spinner animation="border" /></div>}
                    {error && <p className="text-danger" style={{ textAlign: 'center' }}>{error}</p>}
                    
                    {details && details.status === 'draft' ? (
                        <>
                            <div className="filter-bar">
                                <label>Название производства</label>
                                <input 
                                    type="text" 
                                    className="filter-input" 
                                    placeholder="Название вашего производства..." 
                                    value={details?.production_name || ''}
                                    onChange={(e) => dispatch(setProductionName(e.target.value))}
                                    disabled={loading === 'pending'}
                                />
                                <button type="button" className="save-button" onClick={handleSaveName} disabled={loading === 'pending'}>
                                    Сохранить
                                </button>
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
                                                disabled={loading === 'pending'}
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

                                        
                                        <div className="item-actions">
                                            <Button 
                                                variant="outline-primary" 
                                                size="sm"
                                                onClick={() => handleSaveDefects(item.workshop?.id, item.found_defects)}
                                                disabled={loading === 'pending'}
                                            >
                                                Сохранить данные
                                            </Button>
                                            <Button 
                                                variant="outline-danger"
                                                size="sm" 
                                                onClick={() => handleRemoveItem(item.workshop?.id)} 
                                                disabled={loading === 'pending'}
                                            >
                                                Удалить
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="application-summary">{details.items?.length || 0} позиций в заявке</div>
                            
                            <div className="cart-actions">
                                <Button variant="primary" onClick={handleSubmitApp} disabled={loading === 'pending' || !details.items?.length}>Оформить заявку</Button>
                                <Button variant="outline-danger" onClick={handleDeleteApp} disabled={loading === 'pending'}>Удалить заявку</Button>
                            </div>
                        </>
                    ) : (
                        !loading && <p>Активного черновика не найдено.</p>
                    )}
                </div>
            </main>
        </div>
    );
};