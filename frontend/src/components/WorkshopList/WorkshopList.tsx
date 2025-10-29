import type { IWorkshop } from "../../modules/WotkshopTypes";
import { WorkshopCard } from '../WorkshopCard/WorkshopCard';
import './WorkshopList.css';

interface WorkshopListProps {
    workshops: IWorkshop[];
    onAddToCart: (workshopId: number) => void;
}

export default function WorkshopList({ workshops, onAddToCart }: WorkshopListProps) {
  return (
    <div className="card-grid">
      {workshops.map((ws) => (
        <WorkshopCard key={ws.id} workshop={ws} onAddToCart={onAddToCart} />  
      ))}
    </div>
  );
}