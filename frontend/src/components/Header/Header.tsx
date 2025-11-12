import { Link } from 'react-router-dom';
import { ROUTES } from '../../Routes';
import './Header.css';

export default function Header() {
  return (
    <header className="header">
        <div className="header-container">
            <Link to={ROUTES.HOME} className="logo">
                <img src="img/logo.png" alt="VLK Logo" />
            </Link>
        </div>
    </header>
  );
}