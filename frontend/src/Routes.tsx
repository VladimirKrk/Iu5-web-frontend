export const ROUTES = {
  HOME: "/",
  WORKSHOPS: "/workshops",
  WORKSHOP_DETAIL: "/workshops/:id",
  LOGIN: "/login", 
  WORKSHOP_ORDERS: "/orders", 
  REGISTER: "/register",
  PROFILE: "/profile",
  
};

export type RouteKeyType = keyof typeof ROUTES;

export const ROUTE_LABELS: {[key in RouteKeyType]: string} = {
  HOME: "Главная",
  WORKSHOPS: "Мастерские",
  WORKSHOP_DETAIL: "Мастерская", // Для "хлебных крошек"
  LOGIN: "Вход",
  WORKSHOP_ORDERS: "/Заказы",
  REGISTER: "Регистрация",
  PROFILE: "Профиль",
};