import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
    <header className="header">
        <div className="container header-container">
        <Link to="/" className="logo">
            {/* Пути к картинкам в public доступны напрямую от корня */}
            <img src="img/logo.png" alt="VLK Logo" />
        </Link>
        {/* Здесь можно будет добавить ссылки на другие страницы */}
        </div>
    </header>
    );
};

export default Navbar;