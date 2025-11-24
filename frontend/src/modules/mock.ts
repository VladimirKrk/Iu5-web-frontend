import { type IWorkshop } from "./WotkshopTypes";

export const WORKSHOPS_MOCK: IWorkshop[] = [
  { 
    id: 1, 
    name: 'Кузница', 
    description: 'Бэкенд спит.', 
    century: 'XI', 
    image_key: 'img/test.jpeg', 
    extra_image_key: 'img/extra_test.jpeg'
  },
  { 
    id: 2, 
    name: 'Гончарная', 
    description: 'Бэкенд спит.', 
    century: 'XII', 
    image_key: 'img/test.jpeg',
    extra_image_key: 'img/extra_test.jpeg'
  }
];