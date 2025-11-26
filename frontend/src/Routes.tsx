export const ROUTES = {
  HOME: "/",
  WORKSHOPS: "/workshops",
  WORKSHOP_DETAIL: "/workshops/:id",
  LOGIN: "/login", 
  WORKSHOP_ORDERS: "/orders/:id", 
  REGISTER: "/register",
};

export type RouteKeyType = keyof typeof ROUTES;

export const ROUTE_LABELS: {[key in RouteKeyType]: string} = {
  HOME: "Главная",
  WORKSHOPS: "Мастерские",
  WORKSHOP_DETAIL: "Мастерская", // Для "хлебных крошек"
  LOGIN: "Вход",
  WORKSHOP_ORDERS: "/Заказы",
  REGISTER: "Регистрация",
};