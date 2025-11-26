import { Api } from './Api';

export const api = new Api({
    // Указываем на прокси, который настроен в vite.config.ts
    baseURL: import.meta.env.BASE_URL, 
});