export const ROUTES = {
  HOME: "/",
  WORKSHOPS: "/workshops",
  WORKSHOP_DETAIL: "/workshops/:id",
  LOGIN: "/login", 
  WORKSHOP_ORDERS: "/orders", 
  ORDER_VIEW: "/orders/:id",
  REGISTER: "/register",
  PROFILE: "/profile",
  MODERATOR_ORDERS: "/moderator/orders",
  ORDERS_HISTORY: "/history",
  
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
  ORDERS_HISTORY: "История",
  MODERATOR_ORDERS: "Модерация заказов",
  ORDER_VIEW: "История заказа",
};