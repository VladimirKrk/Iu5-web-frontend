// src/pages/WorkshopListPage.tsx
import WorkshopCard from '../components/WorkShopCard.tsx';
import { useState, useEffect } from 'react';
import { fetchWorkshops } from '../services/api';
import type { IWorkshop } from '../types';

const WorkshopListPage = () => {
  const [workshops, setWorkshops] = useState<IWorkshop[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // useEffect для загрузки данных при монтировании компонента и при изменении поиска
  // Мы используем debounce, чтобы не отправлять запрос на каждое нажатие клавиши
  useEffect(() => {
    // Устанавливаем таймер. Запрос отправится через 500мс после того, как пользователь перестанет печатать.
    const handler = setTimeout(() => {
      setLoading(true);
      setError(null);
      fetchWorkshops(searchTerm)
        .then(data => {
          setWorkshops(data);
        })
        .catch(err => {
          setError('Не удалось загрузить данные о мастерских.');
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }, 500);

    // Эта функция очистки. Она сбросит таймер, если пользователь продолжит печатать.
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]); // Эффект будет перезапускаться каждый раз, когда меняется searchTerm

  return (
    <>
      <div className="search-section">
        <div className="container">
          {/* Убираем тег <form>, чтобы избежать перезагрузки при нажатии Enter */}
          <div className="search-form">
            <input 
              type="text" 
              name="мастерская" 
              className="search-input" 
              placeholder="Найти мастерскую..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* Кнопка теперь не нужна, поиск работает автоматически */}
            <div className="search-button" style={{ backgroundImage: "url('/img/search.png')" }}></div>
          </div>
        </div>
      </div>

      <main className="main">
        <div className="container">
          {/* === ИСПРАВЛЕННЫЙ ТЕКСТ ЗАГРУЗКИ === */}
          {loading && <p>Загрузка мастерских...</p>}
          
          {error && <p style={{ color: 'red' }}>{error}</p>}
          
          {!loading && !error && (
            <div className="card-grid">
              {workshops.length > 0 ? (
                workshops.map(workshop => (
                  <WorkshopCard key={workshop.id} workshop={workshop} />
                ))
              ) : (
                <p>Мастерские по вашему запросу не найдены.</p>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default WorkshopListPage;