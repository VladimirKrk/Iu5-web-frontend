import { Link } from 'react-router-dom';
import type { IWorkshop } from '../types';

interface WorkshopCardProps {
  workshop: IWorkshop;
}

const WorkshopCard: React.FC<WorkshopCardProps> = ({ workshop }) => {
  const imageUrl = workshop.image_key
    ? `/vlk-images/${workshop.image_key}` 
    : '/img/placeholder.png'; 

  return (
    <div className="card">
      <img src={imageUrl} alt={workshop.name} className="card-image" />
      <div className="card-body">
        <div className="card-content">
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

export default WorkshopCard;