import { Routes, Route, Navigate } from 'react-router-dom';
import AnnouncementsPage from './pages/AnnouncementsPage';
import AnnouncementForm from './pages/AnnouncementForm';
import AnnouncementUpdateForm from "./pages/AnnouncementUpdateForm.tsx";
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyAnnouncementsPage from "./pages/MyAnnouncementsPage.tsx";
import ConversationsPage from "./pages/ConversationsPage.tsx";
import MessageThreadPage from "./pages/MessageThreadPage.tsx";
import AnnouncementDetailsPage from "./pages/AnnouncementDetailsPage.tsx";
import "tailwindcss";
import {PrivateRoute} from "./components/PrivateRoute.tsx";
import {AdminLayout} from "./layouts/AdminLayout.tsx";
import {Toaster} from "react-hot-toast";
import {UsersPage} from "./pages/UsersPage.tsx";
import {DashboardPage} from "./pages/DashboardPage.tsx";
import {CategoriesPage} from "./pages/CategoriesPage.tsx";
import {AnnouncementsModerationPage} from "./pages/AnnouncementsModerationPage.tsx";
import {CommentsModerationPage} from "./pages/CommentsModerationPage.tsx";

function App() {
  return (
      <>
      <Routes>
          <Route path="/" element={<Navigate to="/announcements" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/announcements" element={<AnnouncementsPage />} />
          <Route path="/announcements/create" element={<AnnouncementForm />} />
          <Route path="/announcements/:id" element={<AnnouncementUpdateForm />} />
          <Route path="/announcements/my" element={<MyAnnouncementsPage />} />
          <Route path="/messages" element={<ConversationsPage />} />
          <Route path="/messages/:id" element={<MessageThreadPage />} />
          <Route path="/announcements/:id/details" element={<AnnouncementDetailsPage />} />
          <Route element={<PrivateRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<DashboardPage />} />
                  <Route path="users" element={<UsersPage />} />
                  <Route path="categories" element={<CategoriesPage />} />
                  <Route path="announcements" element={<AnnouncementsModerationPage />} />
                  <Route path="comments" element={<CommentsModerationPage />} />
              </Route>
          </Route>
          {/* Możesz dodać stronę 404 */}
          <Route path="*" element={<div>404 - Strona nie znaleziona</div>} />
      </Routes>
          <Toaster position="top-right" />
      </>
  );
}

export default App;
