import { useState } from 'react';
import { registerUser } from '../services/api';
import Nav from "../components/Nav.tsx";

export const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.includes('@')) {
      setError('Nieprawidłowy email');
      return;
    }

    if (password.length < 6) {
      setError('Hasło za krótkie');
      return;
    }

    try {
      await registerUser({ email, password, username });
      alert('Rejestracja udana');
    } catch {
      setError('Błąd rejestracji');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blueGradientStart to-blueGradientEnd flex flex-col items-center justify-center p-8">
      <Nav />
      <form onSubmit={handleSubmit}>
        <input
            className="p-4 bg-gradient-to-br from-whiteGradientStart to-whiteGradientEnd text-blue placeholder-gray rounded-2xl"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder='Email'
        />
        <input
            className="p-4 m-2 bg-gradient-to-br from-whiteGradientStart to-whiteGradientEnd text-blue placeholder-gray rounded-2xl"
          type='password'
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder='Hasło'
        />
        <input
            className="p-4 bg-gradient-to-br from-whiteGradientStart to-whiteGradientEnd text-blue placeholder-gray rounded-2xl"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder='Nazwa użytkownika'
        />
        <button className="font-bold m-2 px-4 py-2 rounded-2xl bg-gradient-to-br from-pinkGradientStart to-pinkGradientEnd text-blue" type='submit'>Zarejestruj</button>
        {error && <p className="text-red-500 font-semibold">{error}</p>}
      </form>
    </div>
  );
};

export default RegisterPage;
