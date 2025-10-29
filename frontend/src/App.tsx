import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Breadcrumbs from './components/Breadcrumbs';
import HomePage from './pages/HomePage';
import WorkshopListPage from './pages/WorkshopListPage';
import WorkshopDetailPage from './pages/WorkshopDetailPage';

function App() {
  return (
    <Router>
      {/* Navbar будет на всех страницах */}
      <Navbar />
      {/* Breadcrumbs тоже будут на всех страницах */}
      <Breadcrumbs />
      
      {/* Основной контент будет меняться в зависимости от роута */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/workshops" element={<WorkshopListPage />} />
        <Route path="/workshops/:id" element={<WorkshopDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
