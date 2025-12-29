// src/components/UserOrderFilters/UserOrderFilters.tsx
import { useSelector, useDispatch } from 'react-redux';
import { Form, Row, Col, Button } from 'react-bootstrap';
import type { AppDispatch, RootState } from '../../store/store';
import {
  setStatusFilter,
  setDateFromFilter,
  setDateToFilter,
  fetchOrdersHistoryAsync
} from '../../store/slices/ordersHistorySlice';

export const UserOrderFilters: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { filters, loading } = useSelector((state: RootState) => state.ordersHistory);

    const handleApplyFilters = () => {
        // Просто запускаем thunk, который возьмет данные из Redux
        dispatch(fetchOrdersHistoryAsync(false));
    };

    return (
        <div className="p-3 mb-4 border rounded bg-light">
            <Row className="g-3 align-items-end">
                <Col md={4} sm={6}>
                    <Form.Group>
                        <Form.Label>Дата от</Form.Label>
                        <Form.Control type="date" value={filters.dateFrom} onChange={(e) => dispatch(setDateFromFilter(e.target.value))}/>
                    </Form.Group>
                </Col>
                
                <Col md={4} sm={6}>
                    <Form.Group>
                        <Form.Label>Дата до</Form.Label>
                        <Form.Control type="date" value={filters.dateTo} onChange={(e) => dispatch(setDateToFilter(e.target.value))}/>
                    </Form.Group>
                </Col>
                
                <Col md={2} sm={6}>
                    <Form.Group>
                        <Form.Label>Статус</Form.Label>
                        <Form.Select value={filters.status} onChange={(e) => dispatch(setStatusFilter(e.target.value))}>
                            <option value="">Все</option>
                            <option value="formed">Сформирована</option>
                            <option value="completed">Завершена</option>
                            <option value="rejected">Отклонена</option>
                        </Form.Select>
                    </Form.Group>
                </Col>

                <Col md={2} sm={6}>
                    <Button variant="primary" className="w-100" onClick={handleApplyFilters} disabled={loading === 'pending'}>
                        Применить
                    </Button>
                </Col>
            </Row>
        </div>
    );
};