import { WorkshopCard } from '../WorkshopCard/WorkshopCard';
import type { ApiTypesWorkshopResponse as WorkshopResponse } from '../../api/Api';
import './WorkshopList.css';

interface WorkshopListProps {
    workshops: WorkshopResponse[];
    onAddToCart: (workshopId: number) => void;
    isAuthenticated: boolean;
}

export default function WorkshopList({ workshops, onAddToCart, isAuthenticated }: WorkshopListProps) {
  return (
    <div className="card-grid">
      {workshops.map((ws) => (
        <WorkshopCard 
          key={ws.id} 
          workshop={ws} 
          onAddToCart={onAddToCart} 
          isAuthenticated={isAuthenticated}
        />  
      ))}
    </div>
  );
}