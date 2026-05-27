import { useState } from 'react';
import api from '../api';

interface LoginProps {
    onLogin: () => void;
}
export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Username is required');
      return;
    }
    try {
      const res = await api.post('/auth/login', { username });
      localStorage.setItem('token', res.data.access_token);
      onLogin();
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      setError(message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="p-8 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl mb-4 font-bold">Task Tracker Login</h2>
        {error && <p className="text-red-500 mb-4" id="error-msg">{error}</p>}
        <input 
          id="username"
          type="text" 
          placeholder="Username" 
          className="border p-2 w-full mb-4 rounded"
          onChange={(e) => setUsername(e.target.value)}
        />
        <button className="bg-blue-500 text-white p-2 w-full rounded hover:bg-blue-600">Login</button>
      </form>
    </div>
  );
}