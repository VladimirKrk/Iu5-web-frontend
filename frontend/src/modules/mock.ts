import { type IWorkshop } from "./WotkshopTypes";

export const WORKSHOPS_MOCK: IWorkshop[] = [
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