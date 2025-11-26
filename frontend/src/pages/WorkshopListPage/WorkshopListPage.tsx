import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Header from '../../components/Header/Header';
import WorkshopList from '../../components/WorkshopList/WorkshopList';
import Search from '../../components/Search/Search';
import { BreadCrumbs } from "../../components/BreadCrumbs/Breadcrumbs";
import { ROUTE_LABELS, ROUTES } from '../../Routes';
import './WorkshopListPage.css';
import { Link } from 'react-router-dom';
// --- ИМПОРТЫ ДЛЯ РАБОТЫ С REDUX ---
import type { RootState, AppDispatch } from '../../store/store'; 
import { setSearchTerm } from '../../store/slices/filterSlice';
import { fetchWorkshopsAsync } from '../../store/slices/workshopSlice';
import { addToCartAsync } from '../../store/slices/applicationSlice';
import Spinner from 'react-bootstrap/esm/Spinner';


// Пропсы для этой страницы больше не нужны, так как все данные берутся из Redux
export const WorkshopListPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // --- ПОЛУЧАЕМ ВСЕ ДАННЫЕ ИЗ REDUX STORE ---
  const searchTerm = useSelector((state: RootState) => state.filter.searchTerm);
  const { list: workshops, loading } = useSelector((state: RootState) => state.workshops);
  const { itemCount, isAuthenticated } = useSelector((state: RootState) => state.user);

{isAuthenticated && (
  <Link to={ROUTES.WORKSHOP_ORDERS} className={itemCount > 0 ? "cart-link" : "cart-link cart-link-disabled"}>
    <img src={`${import.meta.env.BASE_URL}img/cart.png`} alt="Корзина" />
    <span className="cart-count">{itemCount}</span>
  </Link>
)}
  // useEffect для первоначальной загрузки данных.
  // Теперь он зависит только от dispatch и выполняется один раз.
  useEffect(() => {
    dispatch(fetchWorkshopsAsync());
  }, [dispatch]);

  // Эта функция будет вызвана при клике на кнопку поиска
  const handleSearch = () => {
    // Диспатчим thunk, который сам возьмет актуальный searchTerm из стора.
    dispatch(fetchWorkshopsAsync());
  };

  // Новая функция для добавления в корзину через Redux
  const handleAddToCart = async (workshopId: number) => {
    try {
      // Диспатчим асинхронный thunk и ждем его выполнения
      await dispatch(addToCartAsync(workshopId)).unwrap();
      alert('Мастерская успешно добавлена в корзину!');
    } catch (error: any) {
      // unwrap() пробросит ошибку из rejectWithValue, если она будет
      alert(`Ошибка: ${error}`);
    }
  };

  return (
    <div className="page-wrapper">
      <Header />
      <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.WORKSHOPS }]} />
      
      <div className="search-section">
        <div className="search-container">
          <Search 
            query={searchTerm}
            onQueryChange={(query) => dispatch(setSearchTerm(query))}
            onSearchClick={handleSearch}
          />
          
          <Link 
              to={ROUTES.WORKSHOP_ORDERS} 
              className={itemCount > 0 ? "cart-link" : "cart-link cart-link-disabled"}
            >
              <img src={`${import.meta.env.BASE_URL}img/cart.png`} alt="Корзина" />
              <span className="cart-count">{itemCount}</span>
            </Link>
        </div>
      </div>

      <main className="main">
        <div className="container">
          {loading ? (
            <div className="page-loader">
              <Spinner animation="border" />
            </div>
          ) : workshops.length > 0 ? (
            <WorkshopList 
              workshops={workshops} 
              onAddToCart={handleAddToCart} 
              isAuthenticated={isAuthenticated}
            />
          ) : (
            <p>Мастерские по вашему запросу не найдены.</p>
          )}
          
        </div>
      </main>
    </div>
  );
};