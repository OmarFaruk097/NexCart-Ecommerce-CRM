import React, { useState, useEffect } from 'react';

const SupportSystem = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://https://nexcart-ecommerce-crm.onrender.com:5000/api/crm/support')
      .then(res => res.json())
      .then(data => {
        setTickets(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleRespond = async (ticketId, currentStatus) => {
    if (currentStatus === 'Resolved') {
      alert('Ticket is already resolved.');
      return;
    }

    const responseMsg = prompt('Enter your response to the user:');
    if (!responseMsg) return; // cancelled

    try {
      const response = await fetch(`http://https://nexcart-ecommerce-crm.onrender.com:5000/api/crm/support/${ticketId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Resolved' })
      });

      if (response.ok) {
        setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: 'Resolved' } : t));
        alert('Response sent! Ticket marked as Resolved.');
      } else {
        alert('Failed to update ticket status.');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating ticket status.');
    }
  };

  if (loading) return <p>Loading tickets...</p>;

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>Support Tickets</h2>
      <div style={{ background: 'var(--surface-color)', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow-sm)' }}>
        {tickets.map((ticket, idx) => (
          <div key={ticket.id} style={{ padding: '1.5rem', borderBottom: idx !== tickets.length - 1 ? '1px solid var(--border-color)' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <strong>{ticket.id}</strong>
                <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', background: ticket.status === 'Open' ? '#ef4444' : ticket.status === 'In Progress' ? '#f59e0b' : '#10b981', color: 'white', borderRadius: '4px' }}>
                  {ticket.status}
                </span>
              </div>
              <p style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{ticket.subject}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>From: {ticket.user}</p>
            </div>
            <div>
              <button
                className="btn btn-primary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                onClick={() => handleRespond(ticket.id, ticket.status)}
              >
                Respond
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupportSystem;
