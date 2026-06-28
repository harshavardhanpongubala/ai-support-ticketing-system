// Register Page - For new users
import { useState } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import api from '@/utils/api';

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle register form submit
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send register request to backend
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
      });

      // Save token and user info
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      toast.success('Registration successful!');
      router.push('/dashboard');

    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 to-blue-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          🎫 Create Account
        </h1>
        <p className="text-center text-gray-500 mb-6">Join our support system</p>

        {/* Register Form */}
        <form onSubmit={handleRegister}>
          
          {/* Name Input */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
              placeholder="John Doe"
            />
          </div>

          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
              placeholder="you@example.com"
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
              minLength="6"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
              placeholder="At least 6 characters"
            />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-gray-600 mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>

      </div>
    </div>
  );
}