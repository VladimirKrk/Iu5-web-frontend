import { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import WorkshopList from '../../components/WorkshopList/WorkshopList';
import Search from '../../components/Search/Search';
import { BreadCrumbs } from "../../components/BreadCrumbs/Breadcrumbs.tsx";
import { fetchWorkshops } from '../../modules/WorkshopApi';
import type { IWorkshop } from "../../modules/WotkshopTypes";
import { ROUTE_LABELS } from '../../Routes';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../store/store'; 
import { setSearchTerm } from '../../store/slices/filterSlice'; 
import './WorkshopListPage.css';

interface WorkshopListPageProps {
  itemCount: number;
  onAddToCart: (workshopId: number) => void;
}

export const WorkshopListPage: React.FC<WorkshopListPageProps> = ({ itemCount, onAddToCart }) => {
  const [workshops, setWorkshops] = useState<IWorkshop[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // searchTerm из Redux - это то, по чему мы УЖЕ выполнили поиск.
  const searchTerm = useSelector((state: RootState) => state.filter.searchTerm);
  const dispatch = useDispatch<AppDispatch>();

  // inputValue - это то, что пользователь вводит в поле ПРЯМО СЕЙЧАС.
  const [inputValue, setInputValue] = useState(searchTerm);

  // useEffect теперь зависит только от searchTerm из Redux.
  // Он сработает только тогда, когда мы нажмем кнопку "Найти".
  useEffect(() => {
    setLoading(true);
    fetchWorkshops(searchTerm)
      .then(setWorkshops)
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [searchTerm]);

  // Эта функция будет вызвана при клике на кнопку поиска
  const handleSearch = () => {
    // Мы диспатчим action, чтобы обновить searchTerm в Redux.
    // Это, в свою очередь, вызовет useEffect для нового поиска.
    dispatch(setSearchTerm(inputValue));
  };

  return (
    <div className="page-wrapper">
      <Header />
      <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.WORKSHOPS }]} />
      
      <div className="search-section">
        <div className="search-container">
          <Search 
            query={inputValue} // Поле ввода управляется inputValue
            onQueryChange={setInputValue} // При вводе меняем только inputValue
            onSearchClick={handleSearch} // При клике вызываем нашу функцию поиска
          />
          
          <a href="#" className={itemCount > 0 ? "cart-link" : "cart-link cart-link-disabled"}>
              <img src="img/cart.png" alt="Корзина" />
              <span className="cart-count">{itemCount}</span>
          </a>
        </div>
      </div>

      <main className="main">
        <div className="container">
          {loading ? (
            <p>Загрузка мастерских...</p>
          ) : (
            workshops.length > 0 
              ? <WorkshopList workshops={workshops} onAddToCart={onAddToCart} />
              : <p>Мастерские по вашему запросу не найдены.</p>
          )}
        </div>
      </main>
    </div>
  );
};