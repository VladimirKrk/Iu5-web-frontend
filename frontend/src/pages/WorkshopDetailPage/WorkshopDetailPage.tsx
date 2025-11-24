import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import Header from '../../components/Header/Header';
import { BreadCrumbs } from "../../components/BreadCrumbs/Breadcrumbs.tsx";
import { fetchWorkshopById } from '../../modules/WorkshopApi';
import type { IWorkshop } from "../../modules/WotkshopTypes";
import { ROUTE_LABELS, ROUTES } from '../../Routes';
import './WorkshopDetailPage.css';

// Эта функция должна быть здесь, так как она специфична для этой страницы
const getImageUrl = (key: string | null): string => {
  // Получаем базовый URL из переменных окружения Vite
  // В вашем случае это будет '/Iu5-web-frontend/'
  const baseUrl = import.meta.env.BASE_URL;

  if (!key) {
    // Для заглушки тоже строим полный путь
    return `${baseUrl}img/placeholder.png`;
  }

  // Если ключ - это путь к локальной картинке в /public
  if (key.startsWith('img/')) {
    // Собираем полный, правильный путь: /Iu5-web-frontend/ + img/test.jpeg
    return `${baseUrl}${key}`;
  }

  // Если это ключ для MinIO, он идет через прокси, и ему не нужен baseUrl
  return `/vlk-images/${key}`;
};

export const WorkshopDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [workshop, setWorkshop] = useState<IWorkshop | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchWorkshopById(Number(id))
      .then(setWorkshop)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="page-loader">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!workshop) {
    return (
      <div className="page-wrapper">
        <Header />
        <main className="main container"><p>Мастерская не найдена.</p></main>
      </div>
    );
  }

  const imageUrl = getImageUrl(workshop.image_key);
  const extraImageUrl = getImageUrl(workshop.extra_image_key);

  return (
    <div className="page-wrapper">
      <Header />
      <BreadCrumbs crumbs={[
        { label: ROUTE_LABELS.WORKSHOPS, path: ROUTES.WORKSHOPS },
        { label: workshop.name }
      ]} />
      
      <main className="main detail-page-main">
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
    </div>
  );
};