// Tickets List Page - Shows all tickets
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import api from '@/utils/api';

export default function Tickets() {
  const router = useRouter();
  const [tickets, setTickets] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check login
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));
    fetchTickets();
  }, []);

  // Get all tickets from backend
  const fetchTickets = async () => {
    try {
      const response = await api.get('/tickets');
      setTickets(response.data.tickets);
    } catch (error) {
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  // Update ticket status
  const updateStatus = async (ticketId, newStatus) => {
    try {
      await api.put(`/tickets/${ticketId}`, { status: newStatus });
      toast.success('Status updated!');
      fetchTickets();  // Refresh list
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  // Color for priority badges
  const getPriorityColor = (priority) => {
    const colors = {
      critical: 'bg-red-500',
      high: 'bg-orange-500',
      medium: 'bg-yellow-500',
      low: 'bg-green-500',
    };
    return colors[priority] || 'bg-gray-500';
  };

  // Color for status badges
  const getStatusColor = (status) => {
    const colors = {
      open: 'bg-blue-500',
      'in-progress': 'bg-yellow-500',
      resolved: 'bg-green-500',
      closed: 'bg-gray-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl">Loading tickets...</p>
      </div>
    );
  }

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
            {user?.role === 'customer' && (
              <button
                onClick={() => router.push('/create-ticket')}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                + New Ticket
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">All Tickets</h2>

        {tickets.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-600 text-lg">No tickets found.</p>
            {user?.role === 'customer' && (
              <button
                onClick={() => router.push('/create-ticket')}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Create Your First Ticket
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div key={ticket._id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg">
                
                {/* Title and Badges */}
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-800">{ticket.title}</h3>
                  <div className="flex gap-2">
                    <span className={`${getPriorityColor(ticket.priority)} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
                      {ticket.priority?.toUpperCase()}
                    </span>
                    <span className={`${getStatusColor(ticket.status)} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
                      {ticket.status?.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-3">{ticket.description}</p>

                {/* Details */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                  <span>📁 Category: <strong>{ticket.category}</strong></span>
                  <span>👤 Customer: <strong>{ticket.customer?.name}</strong></span>
                  {ticket.assignedAgent && (
                    <span>🧑‍💼 Agent: <strong>{ticket.assignedAgent?.name}</strong></span>
                  )}
                  <span>📅 {new Date(ticket.createdAt).toLocaleDateString()}</span>
                </div>

                {/* SLA Deadline */}
                {ticket.slaDeadline && (
                  <p className="text-sm text-orange-600 mb-3">
                    ⏰ SLA Deadline: {new Date(ticket.slaDeadline).toLocaleString()}
                  </p>
                )}

                {/* Action Buttons - Only for agent/admin */}
                {(user?.role === 'agent' || user?.role === 'admin') && ticket.status !== 'closed' && (
                  <div className="flex gap-2 mt-3">
                    {ticket.status !== 'in-progress' && (
                      <button
                        onClick={() => updateStatus(ticket._id, 'in-progress')}
                        className="bg-yellow-500 text-white px-4 py-1 rounded text-sm hover:bg-yellow-600"
                      >
                        Start Work
                      </button>
                    )}
                    {ticket.status !== 'resolved' && (
                      <button
                        onClick={() => updateStatus(ticket._id, 'resolved')}
                        className="bg-green-500 text-white px-4 py-1 rounded text-sm hover:bg-green-600"
                      >
                        Mark Resolved
                      </button>
                    )}
                    <button
                      onClick={() => updateStatus(ticket._id, 'closed')}
                      className="bg-gray-500 text-white px-4 py-1 rounded text-sm hover:bg-gray-600"
                    >
                      Close
                    </button>
                  </div>
                )}

                {/* Rating - Only show if resolved */}
                {ticket.status === 'resolved' && ticket.rating && (
                  <p className="text-yellow-600 mt-2">
                    ⭐ Rating: {ticket.rating} / 5
                  </p>
                )}

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}