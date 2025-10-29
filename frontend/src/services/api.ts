import type { IWorkshop } from '../types';

// Mock-данные, если бэкенд недоступен
const MOCK_WORKSHOPS: IWorkshop[] = [
  { 
    id: 1, 
    name: 'Mock Кузница', 
    description: 'Здесь куют мечи, когда бэкенд спит.', 
    century: 'XI', 
    image_key: '/img/test.jpeg',
    extra_image_key: '/img/extra_test.jpeg'
  },
  { 
    id: 2, 
    name: 'Mock Гончарная', 
    description: 'Лепим горшки в оффлайне.', 
    century: 'XII', 
    image_key: '/img/test.jpeg',
    extra_image_key: '/img/extra_test.jpeg'
  }
];

const API_BASE_URL = '/api'; // URL для прокси

/**
 * Получает список мастерских с бэкенда.
 * @param nameFilter - Строка для фильтрации по имени.
 * @returns Promise<IWorkshop[]> - Массив мастерских.
 */
export const fetchWorkshops = async (nameFilter: string): Promise<IWorkshop[]> => {
  try {
    // === ИСПРАВЛЕНИЕ ЗДЕСЬ ===
    // Мы передаем второй аргумент `window.location.origin`, чтобы конструктор
    // мог правильно создать полный URL из относительного пути.
    const url = new URL(`${API_BASE_URL}/workshops`, window.location.origin);
    
    if (nameFilter) {
      url.searchParams.append('name', nameFilter);
    }
    
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch workshops from backend, using mock data.", error);
    // Возвращаем отфильтрованные mock-данные, если поиск был
    if (nameFilter) {
        return MOCK_WORKSHOPS.filter(w => w.name.toLowerCase().includes(nameFilter.toLowerCase()));
    }
    return MOCK_WORKSHOPS;
  }
};

/**
 * Получает одну мастерскую по ID.
 * @param id - ID мастерской.
 * @returns Promise<IWorkshop> - Объект мастерской.
 */
export const fetchWorkshopById = async (id: string): Promise<IWorkshop> => {
  try {
    // В этой функции `new URL()` не используется, поэтому здесь ошибки не было.
    // `fetch` сам прекрасно справляется с относительными путями.
    const response = await fetch(`${API_BASE_URL}/workshops/${id}`);
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error(`Мастерская с id ${id} не найдена.`);
        }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch workshop ${id}, using mock data.`, error);
    const mock = MOCK_WORKSHOPS.find(w => w.id === parseInt(id));
    if (mock) {
      return mock;
    }
    throw new Error(`Мастерская с id ${id} не найдена (даже в mock-данных).`);
  }
};