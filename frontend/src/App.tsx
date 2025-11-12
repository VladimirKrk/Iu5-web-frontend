import { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ROUTES } from "./Routes";
import { HomePage } from './pages/HomePage/HomePage';
import { WorkshopListPage } from './pages/WorkshopListPage/WorkshopListPage';
import { WorkshopDetailPage } from './pages/WorkshopDetailPage/WorkshopDetailPage';
import { addToCart, fetchCartInfo } from './modules/WorkshopApi';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
//auth token of creator_id = 3
  const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NjIwMTA5MTUsImlzX21vZGVyYXRvciI6ZmFsc2UsInVzZXJfaWQiOjN9.plg2H7XuCUtq5s8GTGZ0zY45WYZajyVs0Drrbbri1Xg";

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
    <BrowserRouter basename="/lu5-web-frontend/">
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