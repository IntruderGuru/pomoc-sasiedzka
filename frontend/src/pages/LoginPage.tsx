import { use, useState } from 'react';
import { loginUser, setToken, setuserId, setUsername } from '../services/api';
import Nav from "../components/Nav.tsx";
import '../index.css';


export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await loginUser({ email, password });
      setToken(res.data.token);
      setuserId(res.data.user.id);
      setUsername(res.data.user.username ?? res.data.user.email.split('@')[0]);
      alert('Zalogowano jako ' + res.data.user.username);

    } catch {
      setError('Błędne dane logowania');
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-blueGradientStart to-blueGradientEnd flex flex-col items-center justify-center p-8">
        <Nav />
        <form onSubmit={handleSubmit} >
          <input
              type="text"
              className="p-4 bg-gradient-to-br from-whiteGradientStart to-whiteGradientEnd text-blue placeholder-gray rounded-2xl"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
          />
          <input
              type="password"
              className="p-4 m-2 bg-gradient-to-br from-whiteGradientStart to-whiteGradientEnd text-blue placeholder-gray rounded-2xl"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Hasło"
          />
          <button
              type="submit"
              className="font-bold px-4 py-2 rounded-2xl bg-gradient-to-br from-pinkGradientStart to-pinkGradientEnd text-blue"
          >
            Zaloguj
          </button>
          {error && <p className="text-red-500 font-semibold">{error}</p>}
        </form>
      </div>
  );

};

export default LoginPage;
