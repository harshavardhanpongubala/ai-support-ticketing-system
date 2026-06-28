// Login Page
import { useState } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import api from '@/utils/api';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle login form submit
  const handleLogin = async (e) => {
    e.preventDefault();  // Stop page reload
    setLoading(true);

    try {
      // Send login request to backend
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      // Save token and user info in browser
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      toast.success('Login successful!');
      
      // Go to dashboard
      router.push('/dashboard');

    } catch (error) {
      // Show error message
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          🎫 Support System
        </h1>
        <p className="text-center text-gray-500 mb-6">Login to your account</p>

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          
          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="admin@demo.com"
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Register Link */}
        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-gray-100 rounded-lg text-sm">
          <p className="font-semibold text-gray-700 mb-2">Demo Accounts:</p>
          <p className="text-gray-600">Admin: admin@demo.com / admin123</p>
          <p className="text-gray-600">Agent: agent@demo.com / agent123</p>
          <p className="text-gray-600">Customer: customer@demo.com / customer123</p>
        </div>

      </div>
    </div>
  );
}