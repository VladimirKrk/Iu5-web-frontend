// src/pages/OrderViewPage/OrderViewPage.tsx
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { Spinner } from 'react-bootstrap';
import type { AppDispatch, RootState } from '../../store/store';
import { fetchApplicationDetailsAsync } from '../../store/slices/applicationSlice';
import { getImageUrl } from '../../utils/getImageUrl';
import './OrderViewPage.css';

// Этот компонент будет использоваться повторно
const ApplicationItemView = ({ item }: { item: any }) => (
    <div className="application-item">
        <img src={getImageUrl(item.workshop?.image_key)} alt={item.workshop?.name} className="item-image" />
        <div className="item-info">
            <span className="item-title">{item.workshop?.name}</span>
            <p className="item-description">{item.workshop?.description}</p>
        </div>
        <div className="item-field">
            <input type="number" value={item.found_defects ?? 0} readOnly />
        </div>
        <div className="item-field">
            <input type="text" value={item.predicted_output || '-'} readOnly />
        </div>
        <p className="item-century">{item.workshop?.century}</p>
    </div>
);

export const OrderViewPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch<AppDispatch>();
    
    const { details, loading, error } = useSelector((state: RootState) => state.application);

    useEffect(() => {
        if (id) {
            dispatch(fetchApplicationDetailsAsync(Number(id)));
        }
    }, [id, dispatch]);

    return (
        <div className="page-wrapper-cart">
            <Header />
            <main className="main">
                <div className="container">
                    <h1>Просмотр заявки #{id}</h1>

                    {loading === 'pending' && <div className="text-center mt-4"><Spinner animation="border" /></div>}
                    {error && <p className="text-danger">{error}</p>}
                    
                    {details && loading === 'idle' && (
                        <>
                            <div className="filter-bar">
                                <label>Название производства</label>
                                <input type="text" className="filter-input" value={details.production_name || ''} readOnly />
                            </div>

                            <div className="application-header">
                                <div className="header-label">Количество найденного брака</div>
                                <div className="header-label">Прогнозируемый объем</div>
                            </div>

                            <div className="cart-items-wrapper">
                                {details.items?.map(item => <ApplicationItemView key={item.workshop?.id} item={item} />)}
                            </div>
                            
                            <div className="application-summary">
                                {details.items?.length || 0} позиций в заявке
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};