import {useNavigate} from "react-router";

export default function Nav() {
    const navigate = useNavigate();

    return (
        <div>
            <h2>Wybierz sekcję</h2>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <button onClick={() => navigate("/announcements")}>Strona główna</button>
                <button onClick={() => navigate("/login")}>Logowanie</button>
                <button onClick={() => navigate("/register")}>Rejestracja</button>
                <button onClick={() => navigate("/announcements/create")}>Dodaj post</button>
                <button onClick={() => navigate("/announcements/my")}>Moje ogłoszenia</button>
                <button onClick={() => navigate("/messages")}>Wiadomości</button>
            </div>
        </div>
    );
}
