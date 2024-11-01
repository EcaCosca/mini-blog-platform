import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const {login} = useAuth();
  const notify = (msg: string) => toast(msg);

  const handleAuth = async () => {
    const endpoint = isLogin ? '/auth/login' : '/auth/signup';
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      login(data.data.session.access_token, data.data.user);

      notify(isLogin ? 'Logged in successfully!' : 'Signed up successfully! Please check your email to confirm.');

      navigate('/');

    } catch (error) {
      notify((error as Error).message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-dark-background">
      <div className="bg-white dark:bg-dark-accent shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-semibold mb-6 text-primary dark:text-dark-primary text-center">
          {isLogin ? 'Login' : 'Sign Up'}
        </h1>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="mb-4 p-3 border border-gray-300 dark:border-dark-border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary transition"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="mb-6 p-3 border border-gray-300 dark:border-dark-border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary transition"
        />
        <button
          onClick={handleAuth}
          className="w-full bg-primary dark:bg-dark-primary text-white font-bold py-3 rounded-lg hover:bg-hover dark:hover:bg-dark-hover transition-all duration-300 mb-4 shadow-lg hover:shadow-xl"
        >
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="w-full text-primary dark:text-dark-primary font-semibold hover:underline mt-2 transition"
        >
          {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
};

export default Auth;