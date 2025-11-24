import videoSource from '../../assets/hero-background.mp4';
import posterSource from '../../assets/hero-poster.jpg';
import Header from '../../components/Header/Header';
import './HomePage.css'; 
export const HomePage = () => {
  return (
    <div className="home-page-wrapper">
      {/* Элементы для фона */}
      <div className="video-overlay"></div>
      <video 
          className="background-video" 
          autoPlay 
          loop 
          muted 
          playsInline
          poster={posterSource}
      >
          <source src={videoSource} type="video/mp4" />
          Ваш браузер не поддерживает видео.
      </video>
      
      {/* Ваш контент, который будет поверх видео */}
      <Header />
      <main className="main home-page">
          <div className="container">
              <div className="hero-section">
                  <h1 className="hero-title">Исторические мастерские</h1>
                  <p className="hero-subtitle">
                      Исследуйте и рассчитайте производственные мощности мастерских прошлых веков. 
                      Сервис поможет вам спрогнозировать объем выпуска продукции на основе исторических данных.
                  </p>
              </div>
          </div>
      </main>
    </div>
  );
};