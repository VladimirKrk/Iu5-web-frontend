import './Search.css';

interface SearchProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearchClick: () => void; //вызов по клику
}

export default function Search({ query, onQueryChange, onSearchClick }: SearchProps) {
  
  // Функция вызывается при нажатии Enter в поле ввода
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearchClick();
    }
  };

  return (
    <div className="search-form">
        <input 
            type="text" 
            className="search-input" 
            placeholder="Найти мастерскую..." 
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={handleKeyDown} 
        />
        {/* Кнопка поиска */  }
        <button
            type="button"
            className="search-button" 
            style={{ backgroundImage: "url('img/search.png')" }}
            onClick={onSearchClick} 
        />
    </div>
  );
}