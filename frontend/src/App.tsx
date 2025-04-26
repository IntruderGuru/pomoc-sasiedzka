import { Routes, Route, Navigate } from 'react-router-dom';
import AnnouncementsPage from './pages/AnnouncementsPage';
import AnnouncementForm from './pages/AnnouncementForm';
import AnnouncementUpdateForm from "./pages/AnnouncementUpdateForm.tsx";
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyAnnouncementsPage from "./pages/MyAnnouncementsPage.tsx";

function App() {
  return (
      <Routes>
          <Route path="/" element={<Navigate to="/announcements" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/announcements" element={<AnnouncementsPage />} />
          <Route path="/announcements/create" element={<AnnouncementForm />} />
          <Route path="/announcements/:id" element={<AnnouncementUpdateForm />} />
          <Route path="/announcements/my" element={<MyAnnouncementsPage />} />
          {/* Możesz dodać stronę 404 */}
          <Route path="*" element={<div>404 - Strona nie znaleziona</div>} />
      </Routes>
  );
}

export default App;
