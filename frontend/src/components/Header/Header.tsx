// src/components/Header/Header.tsx
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ROUTES } from '../../Routes';
import type { RootState, AppDispatch } from '../../store/store';
import { logoutUserAsync } from '../../store/slices/userSlice';
import { setSearchTerm } from '../../store/slices/filterSlice';
import './Header.css';

export default function Header() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isAuthenticated, username, isModerator} = useSelector((state: RootState) => state.user);

  const handleLogout = () => {
    dispatch(logoutUserAsync());
    dispatch(setSearchTerm('')); // Сбрасываем поиск при выходе
    navigate(ROUTES.HOME); // Перенаправляем на главную
  };

  return (
    <header className="header">
        <div className="header-container">
            <Link to={ROUTES.HOME} className="logo">
                <img src={`${import.meta.env.BASE_URL}img/logo.png`} alt="VLK Logo" />
            </Link>
            <nav className="header-nav">
              <Link to={ROUTES.WORKSHOPS} className="nav-link">
                Мастерские
              </Link>
              {isAuthenticated ? (
                <>
                  {isModerator ? (
                    <Link to={ROUTES.MODERATOR_ORDERS} className="nav-link">Панель модератора</Link>
                  ) : (
                    <Link to={ROUTES.ORDERS_HISTORY} className="nav-link">История</Link>
                  )}
                  <Link to={ROUTES.PROFILE} className="nav-link username">{username}</Link>
                  <button onClick={handleLogout} className="nav-link logout-btn">Выйти</button>
                </>
                
              ) : (
                <>
                  <Link to={ROUTES.LOGIN} className="nav-link">Войти</Link>
                  <Link to={ROUTES.REGISTER} className="nav-link">Регистрация</Link>
                </>
              )}
            </nav>
        </div>
    </header>
  );
}