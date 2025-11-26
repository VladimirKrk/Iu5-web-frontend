// src/api/index.ts
import { Api } from './Api';
import type { RootState } from '../store/store';

export const api = new Api({

  baseURL: '/api', 
  securityWorker: (securityData) => {
    if (securityData) {
      return {
        headers: {
          Authorization: `Bearer ${securityData}`,
        },
      };
    }
  },
});

// ... остальной код initializeApi ...

// Новая функция для инициализации
export function initializeApi(store: { getState: () => RootState, subscribe: any }) {
  let currentToken: string | null = null;
  
  const updateToken = () => {
    const { token } = store.getState().user;
    if (token && token !== currentToken) {
      currentToken = token;
      api.setSecurityData(currentToken);
    }
  };
  
  // Вызываем сразу, чтобы установить начальный токен
  updateToken();
  // И подписываемся на будущие изменения
  store.subscribe(updateToken);
}