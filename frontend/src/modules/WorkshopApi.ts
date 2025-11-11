import type { IWorkshop } from "./WotkshopTypes";
import { WORKSHOPS_MOCK } from './mock';

const API_BASE_URL = '/api';

// --- Функции для работы с API ---

export async function fetchWorkshops(nameFilter?: string): Promise<IWorkshop[]> {
  try {
    const url = new URL(`${API_BASE_URL}/workshops`, window.location.origin);
    if (nameFilter) {
      url.searchParams.append('name', nameFilter);
    }
    
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error('API request failed'); // Вызовет блок catch
    }
    return await response.json();
  } catch (error) {
    console.warn("API not available, using mock data for workshops list.", error);
    if (nameFilter) {
        return WORKSHOPS_MOCK.filter(w => w.name.toLowerCase().includes(nameFilter.toLowerCase()));
    }
    return WORKSHOPS_MOCK;
  }
}

export async function fetchWorkshopById(id: number): Promise<IWorkshop | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/workshops/${id}`);
    if (!response.ok) {
      throw new Error(`API request for ID ${id} failed`);
    }
    return await response.json();
  } catch (error) {
    console.warn(`API not available, using mock data for workshop ID: ${id}.`, error);
    return WORKSHOPS_MOCK.find(w => w.id === id) || null;
  }
}

export async function addToCart(workshopId: number, token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/workshop_production/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ workshop_id: workshopId })
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add to cart');
    }
}

export async function fetchCartInfo(token: string): Promise<{ item_count: number }> {
    if (!token) return { item_count: 0 };
    const response = await fetch(`${API_BASE_URL}/workshop_applications/info`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) {
        // Не бросаем ошибку, а возвращаем 0, чтобы приложение не падало, если токен протух
        console.error('Failed to fetch cart info');
        return { item_count: 0 };
    }
    return response.json();
}