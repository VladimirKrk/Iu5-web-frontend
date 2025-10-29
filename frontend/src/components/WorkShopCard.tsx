// src/components/WorkshopCard.tsx
import { Link } from 'react-router-dom';
import type { IWorkshop } from '../types';

// Вспомогательная функция для получения URL изображения
const getImageUrl = (key: string | null) => {
    if (!key) {
        return '/img/placeholder.png'; // Заглушка, если ключ null
    }
    // Если ключ - это путь к локальному mock-файлу
    if (key.startsWith('/img/')) {
        return key;
    }
    // Иначе это ключ для Minio
    return `/vlk-images/${key}`;
};

interface WorkshopCardProps {
  workshop: IWorkshop;
}

const WorkshopCard: React.FC<WorkshopCardProps> = ({ workshop }) => {
  const imageUrl = getImageUrl(workshop.image_key);

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