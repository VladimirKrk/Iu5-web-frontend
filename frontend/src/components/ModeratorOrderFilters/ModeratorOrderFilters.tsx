// src/components/ModeratorOrderFilters/ModeratorOrderFilters.tsx
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Row, Col, Button } from 'react-bootstrap';
import type { AppDispatch, RootState } from '../../store/store';
import { 
  setStatusFilter, 
  setDateFromFilter, 
  setDateToFilter,
  fetchOrdersHistoryAsync 
} from '../../store/slices/ordersHistorySlice';
import { setSearchTerm } from '../../store/slices/filterSlice';

export const ModeratorOrderFilters: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { filters, loading } = useSelector((state: RootState) => state.ordersHistory);
    // Берем сохраненный фильтр из Redux, чтобы поле не сбрасывалось
    const savedCreatorFilter = useSelector((state: RootState) => state.filter.searchTerm);

    // Локальное состояние ТОЛЬКО для поля ввода. Redux не трогаем до клика.
    const [creatorInput, setCreatorInput] = useState(savedCreatorFilter);

    // Синхронизируем поле ввода, если фильтр изменился где-то еще
    useEffect(() => {
        setCreatorInput(savedCreatorFilter);
    }, [savedCreatorFilter]);


    const handleApplyFilters = () => {
        // 1. По клику - обновляем фильтр по создателю в Redux
        dispatch(setSearchTerm(creatorInput));
        // 2. Сразу после этого - запускаем загрузку данных с бэкенда
        dispatch(fetchOrdersHistoryAsync(false));
    };

    return (
        <div className="p-3 mb-4 border rounded bg-light">
            {/* --- V-- ИЗМЕНЯЕМ ВЕРСТКУ --V --- */}
            <Row className="g-3">
                {/* Группа полей для фильтрации */}
                <Col md>
                    <Row className="g-3 align-items-end">
                        <Col md><Form.Group>
                            <Form.Label>Дата от</Form.Label>
                            <Form.Control type="date" value={filters.dateFrom} onChange={(e) => dispatch(setDateFromFilter(e.target.value))}/>
                        </Form.Group></Col>
                        <Col md><Form.Group>
                            <Form.Label>Дата до</Form.Label>
                            <Form.Control type="date" value={filters.dateTo} onChange={(e) => dispatch(setDateToFilter(e.target.value))}/></Form.Group>
                        </Col>
                        <Col md><Form.Group>
                            <Form.Label>Создатель</Form.Label>
                            <Form.Control type="text" placeholder="Логин..." value={creatorInput} onChange={(e) => setCreatorInput(e.target.value)} />
                        </Form.Group></Col>
                        <Col md><Form.Group>
                            <Form.Label>Статус</Form.Label>
                            <Form.Select value={filters.status} onChange={(e) => dispatch(setStatusFilter(e.target.value))}>
                                <option value="">Все</option>
                                <option value="formed">Сформирована</option>
                                <option value="completed">Завершена</option>
                                <option value="rejected">Отклонена</option>
                            </Form.Select>
                        </Form.Group></Col>
                    </Row>
                </Col>
                {/* Отдельная колонка для кнопки */}
                <Col md="auto" className="d-flex align-items-end">
                    <Button variant="primary" onClick={handleApplyFilters} disabled={loading === 'pending'}>
                        Применить
                    </Button>
                </Col>
            </Row>
        </div>
    );
};