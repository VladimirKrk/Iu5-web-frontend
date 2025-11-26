import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ROUTES } from "./Routes";
import { HomePage } from './pages/HomePage/HomePage';
import { WorkshopListPage } from './pages/WorkshopListPage/WorkshopListPage';
import { WorkshopDetailPage } from './pages/WorkshopDetailPage/WorkshopDetailPage';
import { LoginPage } from './pages/LoginPage/LoginPage';  // добавлен импорт LoginPage

import 'bootstrap/dist/css/bootstrap.min.css';

import { useSelector, useDispatch } from 'react-redux';
import { fetchCartInfoAsync } from './store/slices/applicationSlice';
import type { AppDispatch, RootState } from './store/store';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  
  useEffect(() => {
    // Загружаем корзину, только если пользователь авторизован
    if (isAuthenticated) {
      dispatch(fetchCartInfoAsync());
    }
  }, [isAuthenticated, dispatch]);
  
  // ... (убираем старый useEffect и handleAddToCart, они теперь в Redux)

  return (
    <BrowserRouter basename="/Iu5-web-frontend/">
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        {/* WorkshopListPage больше не нужны пропсы */}
        <Route path={ROUTES.WORKSHOPS} element={<WorkshopListPage />} />
        <Route path={ROUTES.WORKSHOP_DETAIL} element={<WorkshopDetailPage />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;