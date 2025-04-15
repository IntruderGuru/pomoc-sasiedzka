import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AnnouncementsPage from '../pages/AnnouncementsPage';
import AnnouncementForm from '../pages/AnnouncementForm';

export default function AppRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/announcements" element={<AnnouncementsPage />} />
                <Route path="/announcements/create" element={<AnnouncementForm />} />
                <Route path="/announcements/:id" element={<AnnouncementForm />} />
            </Routes>
        </Router>
    );
}
