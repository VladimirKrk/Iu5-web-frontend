// src/components/OrderFilters/OrderFilters.tsx
import { useSelector, useDispatch } from 'react-redux';
import { Form, Row, Col, Button } from 'react-bootstrap';
import type { AppDispatch, RootState } from '../../store/store';
import { 
  setStatusFilter, 
  setDateFromFilter, 
  setDateToFilter 
} from '../../store/slices/ordersHistorySlice';
import { fetchOrdersHistoryAsync } from '../../store/slices/ordersHistorySlice';

export const OrderFilters: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const filters = useSelector((state: RootState) => state.ordersHistory.filters);
    const loading = useSelector((state: RootState) => state.ordersHistory.loading);

    const handleApplyFilters = () => {
        dispatch(fetchOrdersHistoryAsync(true));
    };

    return (
        <div className="filters-container mb-4 p-3 border rounded">
            <Row className="g-3 align-items-end">
                <Col md={4}>
                    <Form.Group controlId="dateFrom">
                        <Form.Label>Дата от</Form.Label>
                        <Form.Control 
                            type="date" 
                            value={filters.dateFrom}
                            onChange={(e) => dispatch(setDateFromFilter(e.target.value))}
                        />
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group controlId="dateTo">
                        <Form.Label>Дата до</Form.Label>
                        <Form.Control 
                            type="date" 
                            value={filters.dateTo}
                            onChange={(e) => dispatch(setDateToFilter(e.target.value))}
                        />
                    </Form.Group>
                </Col>
                <Col md={2}>
                    <Form.Group controlId="status">
                        <Form.Label>Статус</Form.Label>
                        <Form.Select
                            value={filters.status}
                            onChange={(e) => dispatch(setStatusFilter(e.target.value))}
                        >
                            <option value="">Все</option>
                            <option value="formed">Сформирована</option>
                            <option value="completed">Завершена</option>
                            <option value="rejected">Отклонена</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col md={2}>
                    <Button 
                        variant="primary" 
                        className="w-100" 
                        onClick={handleApplyFilters}
                        disabled={loading === 'pending'}
                    >
                        Применить
                    </Button>
                </Col>
            </Row>
        </div>
    );
};