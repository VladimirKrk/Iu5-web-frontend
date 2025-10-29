import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchWorkshopById } from '../services/api';
import type { IWorkshop } from '../types';

const WorkshopDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [workshop, setWorkshop] = useState<IWorkshop | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadWorkshop = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchWorkshopById(id);
        setWorkshop(data);
      } catch (err: any) {
        setError(err.message || 'Не удалось загрузить данные о мастерской.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadWorkshop();
  }, [id]);


  const imageUrl = workshop?.image_key ? `/vlk-images/${workshop.image_key}` : '/img/placeholder.png';
  const extraImageUrl = workshop?.extra_image_key ? `/vlk-images/${workshop.extra_image_key}` : '/img/placeholder.png';

  if (loading) {
    return <main className="main"><p>Загрузка информации о мастерской...</p></main>;
  }

  if (error) {
    return <main className="main"><p style={{ color: 'red' }}>{error}</p></main>;
  }
  
  if (!workshop) {
      return <main className="main"><p>Мастерская не найдена.</p></main>;
  }

  return (
    <main className="main">
        <div className="title-section">
            <div className="title-wrapper">
                <h1 className="detail-title">{workshop.name}</h1>
            </div>
            <p className="detail-century">{workshop.century}</p>
        </div>

        <div className="content-row">
            <div className="photo-gallery">
                <div className="photo-card">
                    <img src={imageUrl} alt={workshop.name} />
                </div>
                <div className="photo-card">
                    <img src={extraImageUrl} alt={`${workshop.name} (дополнительное фото)`} />
                </div>
            </div>
            <div className="description-wrapper">
                <p>{workshop.description}</p>
            </div>
        </div>
    </main>
  );
};

export default WorkshopDetailPage;