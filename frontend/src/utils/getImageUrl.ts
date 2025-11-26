// frontend/src/utils/getImageUrl.ts

export const getImageUrl = (key: string | null | undefined): string => {
  const baseUrl = import.meta.env.BASE_URL;

  if (!key) {
    return `${baseUrl}img/placeholder.png`;
  }
  
  if (key.startsWith('img/')) {
    return `${baseUrl}${key}`;
  }

  return `/vlk-images/${key}`;
};