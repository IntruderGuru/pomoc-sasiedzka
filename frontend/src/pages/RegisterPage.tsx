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
    <>
      <Nav />
      <form onSubmit={handleSubmit}>
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder='Email'
        />
        <input
          type='password'
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder='Hasło'
        />
        <input
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder='Nazwa użytkownika'
        />
        <button type='submit'>Zarejestruj</button>
        {error && <p>{error}</p>}
      </form>
    </>
  );
};

export default RegisterPage;
