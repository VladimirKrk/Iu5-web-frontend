import './Search.css';

/**
 * Интерфейс для пропсов компонента Search.
 * @param query - Текущее значение поискового запроса.
 * @param onQueryChange - Функция обратного вызова, которая вызывается при каждом изменении текста в поле ввода.
 */
interface SearchProps {
  query: string;
  onQueryChange: (query: string) => void;
}

/**
 * "Глупый" компонент, отвечающий только за отображение поля поиска.
 * Всю логику поиска (отправку запросов, таймеры) обрабатывает родительский компонент.
 */
export default function Search({ query, onQueryChange }: SearchProps) {
  return (
    <div className="search-form">
        <input 
            type="text" 
            className="search-input" 
            placeholder="Найти мастерскую..." 
            value={query}
            // При каждом изменении вызываем функцию, переданную из родителя
            onChange={(e) => onQueryChange(e.target.value)}
        />
        {/* Убедитесь, что файл search.png находится в папке /public/img/ */}
        <div 
            className="search-button" 
            style={{ backgroundImage: "url('/img/search.png')" }}
        ></div>
    </div>
  );
}