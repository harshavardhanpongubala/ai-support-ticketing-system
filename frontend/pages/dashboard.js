// Dashboard Page - Main page after login
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import api from '@/utils/api';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Colors for charts
  const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6'];

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));
    fetchStats();
  }, []);

  // Get analytics data from backend
  const fetchStats = async () => {
    try {
      const response = await api.get('/tickets/stats/analytics');
      setStats(response.data);
    } catch (error) {
      // If customer, no analytics access - that's OK
      console.log('No analytics access');
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">🎫 Support System</h1>
          
          <div className="flex items-center gap-4">
            <span className="text-gray-700">
              {user?.name} ({user?.role})
            </span>
            <button
              onClick={() => router.push('/tickets')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              View Tickets
            </button>
            {user?.role === 'customer' && (
              <button
                onClick={() => router.push('/create-ticket')}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                + New Ticket
              </button>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        
        {/* Welcome Message */}
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Welcome, {user?.name}! 👋
        </h2>

        {/* Show analytics for admin and agent */}
        {(user?.role === 'admin' || user?.role === 'agent') && stats && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-500 text-sm">Total Tickets</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalTickets}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-500 text-sm">Open</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.openTickets}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-500 text-sm">In Progress</p>
                <p className="text-3xl font-bold text-orange-600">{stats.inProgressTickets}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-500 text-sm">Resolved</p>
                <p className="text-3xl font-bold text-green-600">{stats.resolvedTickets}</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              
              {/* Category Pie Chart */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-bold mb-4">Tickets by Category</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.categoryStats}
                      dataKey="count"
                      nameKey="_id"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {stats.categoryStats.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Priority Bar Chart */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-bold mb-4">Tickets by Priority</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.priorityStats}>
                    <XAxis dataKey="_id" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Average Rating */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-2">Customer Satisfaction</h3>
              <p className="text-4xl font-bold text-yellow-500">
                ⭐ {stats.avgRating} / 5
              </p>
              <p className="text-gray-500 mt-2">Average rating from customers</p>
            </div>
          </>
        )}

        {/* Customer view */}
        {user?.role === 'customer' && (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <h3 className="text-2xl font-bold mb-4">Need Help?</h3>
            <p className="text-gray-600 mb-6">
              Create a new support ticket and our AI will route it to the right agent!
            </p>
            <button
              onClick={() => router.push('/create-ticket')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 text-lg"
            >
              + Create New Ticket
            </button>
          </div>
        )}

      </div>
    </div>
  );
}