import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ROUTES } from "./Routes";
import { HomePage } from './pages/HomePage/HomePage';
import { WorkshopListPage } from './pages/WorkshopListPage/WorkshopListPage';
import { WorkshopDetailPage } from './pages/WorkshopDetailPage/WorkshopDetailPage';
import { LoginPage } from './pages/LoginPage/LoginPage';  // добавлен импорт LoginPage
import { WorkshopOrdersPage } from './pages/WorkshopOrdersPage/WorkshopOrdersPage';
import { RegisterPage } from './pages/RegisterPage/RegisterPage'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { ProfilePage } from './pages/ProfilePage/ProfilePage';


function App() {
  //const dispatch = useDispatch<AppDispatch>();
  //const { isAuthenticated } = useSelector((state: RootState) => state.user);
  
  //useEffect(() => {
    // Загружаем корзину, только если пользователь авторизован
  //  if (isAuthenticated) {
  //    dispatch(fetchCartInfoAsync());
  //  }
  //}, [isAuthenticated, dispatch]);
  

  return (
    <BrowserRouter basename="/Iu5-web-frontend/">
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        {/* WorkshopListPage больше не нужны пропсы */}
        <Route path={ROUTES.WORKSHOPS} element={<WorkshopListPage />} />
        <Route path={ROUTES.WORKSHOP_DETAIL} element={<WorkshopDetailPage />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.WORKSHOP_ORDERS} element={<WorkshopOrdersPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;