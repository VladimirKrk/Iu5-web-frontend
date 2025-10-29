import { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ROUTES } from "./Routes";
import { HomePage } from './pages/HomePage/HomePage';
import { WorkshopListPage } from './pages/WorkshopListPage/WorkshopListPage';
import { WorkshopDetailPage } from './pages/WorkshopDetailPage/WorkshopDetailPage';
import { addToCart, fetchCartInfo } from './modules/WorkshopApi';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  // --- ВАЖНО: Вставьте сюда ваш JWT токен! ---
  const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzA0NTExNzcsImlzX21vZGVyYXRvciI6ZmFsc2UsInVzZXJfaWQiOjF9.e89R1Lp-jR1CgGgF8e7Y_tG1f0wZ0c0p0zX1gY4Z9Y4";

  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    if (AUTH_TOKEN) {
      fetchCartInfo(AUTH_TOKEN)
        .then(data => setItemCount(data.item_count))
        .catch(err => console.error("Не удалось загрузить корзину:", err));
    }
  }, []);

  const handleAddToCart = async (workshopId: number) => {
    try {
      await addToCart(workshopId, AUTH_TOKEN);
      setItemCount(prevCount => prevCount + 1);
      alert('Мастерская успешно добавлена в корзину!');
    } catch (error: any) {
      alert(`Ошибка: ${error.message}`);
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.WORKSHOPS} element={
          <WorkshopListPage itemCount={itemCount} onAddToCart={handleAddToCart} />
        } />
        <Route path={ROUTES.WORKSHOP_DETAIL} element={<WorkshopDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;