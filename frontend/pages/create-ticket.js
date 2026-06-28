// Create Ticket Page - For customers to create new tickets
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import api from '@/utils/api';

export default function CreateTicket() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  useEffect(() => {
    // Check login
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, []);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAiResult(null);

    try {
      // Send to backend - it will call AI service
      const response = await api.post('/tickets', {
        title,
        description,
      });

      toast.success('Ticket created successfully!');
      
      // Show AI classification result
      setAiResult(response.data.aiInfo);

      // Wait 3 seconds, then go to tickets page
      setTimeout(() => {
        router.push('/tickets');
      }, 3000);

    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">🎫 Support System</h1>
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Dashboard
            </button>
            <button
              onClick={() => router.push('/tickets')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              My Tickets
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Create New Ticket 🎫
        </h2>
        <p className="text-gray-600 mb-6">
          Our AI will automatically categorize your ticket and assign it to the right agent!
        </p>

        {/* AI Result (shows after submit) */}
        {aiResult && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
            <h3 className="font-bold text-blue-800 mb-2">🤖 AI Analysis:</h3>
            <p className="text-blue-700">
              <strong>Category:</strong> {aiResult.category}
            </p>
            <p className="text-blue-700">
              <strong>Priority:</strong> {aiResult.priority}
            </p>
            <p className="text-sm text-blue-600 mt-2">
              Redirecting to tickets page in 3 seconds...
            </p>
          </div>
        )}

        {/* Form */}
        <div className="bg-white p-6 rounded-lg shadow">
          <form onSubmit={handleSubmit}>
            
            {/* Title */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Ticket Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="e.g. Cannot login to my account"
              />
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Describe Your Issue *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows="6"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Please describe your issue in detail..."
              ></textarea>
              <p className="text-sm text-gray-500 mt-1">
                💡 Tip: Include keywords like "urgent", "payment", "login" - our AI uses these to classify your ticket
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 text-lg font-semibold"
            >
              {loading ? '🤖 AI is analyzing...' : 'Submit Ticket'}
            </button>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <h3 className="font-bold text-yellow-800 mb-2">⏰ Response Times (SLA):</h3>
          <ul className="text-yellow-700 text-sm space-y-1">
            <li>🔴 Critical: 2 hours</li>
            <li>🟠 High: 8 hours</li>
            <li>🟡 Medium: 24 hours</li>
            <li>🟢 Low: 72 hours</li>
          </ul>
        </div>

      </div>
    </div>
  );
}