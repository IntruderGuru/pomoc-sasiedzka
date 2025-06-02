import { useNavigate } from "react-router";

export default function Nav() {
    const navigate = useNavigate();

    return (
        <div className="align-top">
            <div className="align-top" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <button className="font-bold px-4 py-2 rounded-2xl bg-gradient-to-br from-pinkGradientStart to-pinkGradientEnd text-blue" onClick={() => navigate("/announcements")}>Strona główna</button>
                <button className="font-bold px-4 py-2 rounded-2xl bg-gradient-to-br from-pinkGradientStart to-pinkGradientEnd text-blue" onClick={() => navigate("/login")}>Logowanie</button>
                <button className="font-bold px-4 py-2 rounded-2xl bg-gradient-to-br from-pinkGradientStart to-pinkGradientEnd text-blue" onClick={() => navigate("/register")}>Rejestracja</button>
                <button className="font-bold px-4 py-2 rounded-2xl bg-gradient-to-br from-pinkGradientStart to-pinkGradientEnd text-blue" onClick={() => navigate("/announcements/create")}>Dodaj post</button>
                <button className="font-bold px-4 py-2 rounded-2xl bg-gradient-to-br from-pinkGradientStart to-pinkGradientEnd text-blue" onClick={() => navigate("/announcements/my")}>Moje ogłoszenia</button>


            </div>
        </div>
    );
}
