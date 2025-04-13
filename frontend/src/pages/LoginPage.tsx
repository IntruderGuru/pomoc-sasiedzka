import { useState } from 'react';
import { loginUser, setToken } from '../services/api';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await loginUser({ email, password });
      setToken(res.data.token);
      alert('Zalogowano!');
    } catch {
      setError('Błędne dane logowania');
    }
  };

  return (
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
      <button type='submit'>Zaloguj</button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default LoginPage;
