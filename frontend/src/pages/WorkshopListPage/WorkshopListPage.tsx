import { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import WorkshopList from '../../components/WorkshopList/WorkshopList';
import Search from '../../components/Search/Search';
import { BreadCrumbs } from "../../components/BreadCrumbs/Breadcrumbs.tsx";
import { fetchWorkshops } from '../../modules/WorkshopApi';
import type { IWorkshop } from "../../modules/WotkshopTypes";
import { ROUTE_LABELS } from '../../Routes';
import './WorkshopListPage.css';

interface WorkshopListPageProps {
  itemCount: number;
  onAddToCart: (workshopId: number) => void;
}

export const WorkshopListPage: React.FC<WorkshopListPageProps> = ({ itemCount, onAddToCart }) => {
  const [workshops, setWorkshops] = useState<IWorkshop[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setLoading(true);
      fetchWorkshops(searchTerm)
        .then(setWorkshops)
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }, 300); // Небольшая задержка для "живого" поиска

    return () => clearTimeout(handler);
  }, [searchTerm]);

  return (
    <div className="page-wrapper">
      <Header />
      <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.WORKSHOPS }]} />
      
      <div className="search-section">
        <div className="search-container">
          <Search query={searchTerm} onQueryChange={setSearchTerm} />
          
          <a href="#" className={itemCount > 0 ? "cart-link" : "cart-link cart-link-disabled"}>
              <img src="/img/cart.png" alt="Корзина" />
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