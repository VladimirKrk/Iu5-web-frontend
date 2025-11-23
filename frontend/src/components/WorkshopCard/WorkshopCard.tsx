import { Link } from 'react-router-dom';
import type { IWorkshop } from "../../modules/WotkshopTypes";
import './WorkshopCard.css';

const getImageUrl = (key: string | null) => {
    if (!key) return '/img/placeholder.png'; // Создайте этот файл-заглушку в public/img
    if (key.startsWith('/img/')) return key; 
    return `/vlk-images/${key}`;
};
//<button type="button" className="card-button card-button-primary" onClick={handleAddToCartClick}>В корзину</button>

interface WorkshopCardProps {
  workshop: IWorkshop;
  onAddToCart: (workshopId: number) => void;
}

export const WorkshopCard: React.FC<WorkshopCardProps> = ({ workshop, onAddToCart }) => {
  const imageUrl = getImageUrl(workshop.image_key);

  //const handleAddToCartClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  //  event.preventDefault();
  //  onAddToCart(workshop.id);
  //};

  return (
    <div className="card">
      <div className="card-image-wrapper">
        <img src={imageUrl} alt={workshop.name} className="card-image" />
      </div>
      <div className="card-body">
        <div>
            <h3 className="card-title">{workshop.name}</h3>
        </div>
        <div className="card-footer">
          <p className="card-century">{workshop.century}</p> 
          <Link to={`/workshops/${workshop.id}`} className="card-button">Подробнее</Link>
        </div>
      </div>
    </div>
  );
};