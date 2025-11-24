import { Link } from 'react-router-dom';
import { ROUTES } from '../../Routes';
import './Header.css';

// 1. Создаем правильный URL для логотипа
// import.meta.env.BASE_URL всегда будет содержать правильный префикс ('/Iu5-web-frontend/')
const logoUrl = `${import.meta.env.BASE_URL}img/logo.png`;

export default function Header() {
  return (
    <header className="header">
        <div className="header-container">
            <Link to={ROUTES.HOME} className="logo">
                {/* 2. Используем созданную переменную */}
                <img src={logoUrl} alt="VLK Logo" />
            </Link>
            <nav className="header-nav">
              <Link to={ROUTES.WORKSHOPS} className="nav-link">
                Мастерские
              </Link>
            </nav>
        </div>
    </header>
  );
}