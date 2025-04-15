import { useState } from 'react';
import AnnouncementsPage from "../pages/AnnouncementsPage.tsx";
import LoginPage from "../pages/LoginPage.tsx";
import RegisterPage from "../pages/RegisterPage.tsx";
import AnnouncementForm from '../pages/AnnouncementForm.tsx';

export default function OptionSwitcher() {
    const [selected, setSelected] = useState<'home' | 'login' | 'register' | 'add'>('home');

    return (
        <div>
            <h2>Wybierz sekcję</h2>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <button onClick={() => setSelected('home')}>Strona główna</button>
                <button onClick={() => setSelected('login')}>Logowanie</button>
                <button onClick={() => setSelected('register')}>Rejestracja</button>
                <button onClick={() => setSelected('add')}>Dodaj post</button>

            </div>

            <div>
                {selected === 'home' && <AnnouncementsPage />}
                {selected === 'login' && <LoginPage />}
                {selected === 'register' && <RegisterPage />}
                {selected === 'add' && <AnnouncementForm />}
            </div>
        </div>
    );
}
