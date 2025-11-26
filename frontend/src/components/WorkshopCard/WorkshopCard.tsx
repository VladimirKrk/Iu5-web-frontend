import { Link } from 'react-router-dom';
import { getImageUrl } from '../../utils/getImageUrl';
import type { ApiTypesWorkshopResponse as WorkshopResponse } from "../../api/Api";
import './WorkshopCard.css';


interface WorkshopCardProps {
  workshop: WorkshopResponse;
  onAddToCart: (workshopId: number) => void;
  isAuthenticated: boolean; 
}

export const WorkshopCard: React.FC<WorkshopCardProps> = ({ workshop, onAddToCart, isAuthenticated }) => {
  const imageUrl = getImageUrl(workshop.image_key);

  const handleAddToCartClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    // Убедимся, что ID существует, прежде чем вызывать функцию
    if (workshop.id) {
        onAddToCart(workshop.id);
    }
  };

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
          
          {/* --- 3. УСЛОВНЫЙ РЕНДЕРИНГ КНОПКИ --- */}
          {isAuthenticated && (
            <button 
              type="button" 
              className="card-button card-button-primary" 
              onClick={handleAddToCartClick}
              // Кнопка неактивна, если у мастерской нет ID
              disabled={!workshop.id} 
            >
              В корзину
            </button>
          )}
        </div>
      </div>
    </div>
  );
};