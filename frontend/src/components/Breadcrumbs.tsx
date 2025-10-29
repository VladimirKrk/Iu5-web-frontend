import { useLocation, Link } from 'react-router-dom';

const breadcrumbNameMap: { [key: string]: string } = {
  '/workshops': 'Мастерские',
  // Можно будет добавить другие пути
};

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) {
    return null; // Не показываем на главной
  }

  return (
    <div style={{ padding: '10px 20px', backgroundColor: '#f5f5f5' }}>
      <Link to="/">Главная</Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        
        // Пытаемся получить имя из карты или используем сам путь
        const displayName = breadcrumbNameMap[to] || value;

        return isLast ? (
          <span key={to}> / {displayName}</span>
        ) : (
          <span key={to}>
            {' / '}
            <Link to={to}>{displayName}</Link>
          </span>
        );
      })}
    </div>
  );
};

export default Breadcrumbs;