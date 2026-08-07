import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ContactUs = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setStatus('error');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: user.name,
          subject: formData.subject,
          message: formData.message
        })
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="form-container">
      <h1 className="page-title" style={{ textAlign: 'center' }}>Contact Support</h1>
      
      {!user ? (
        <div style={{ textAlign: 'center', color: '#ef4444' }}>
          Please log in to submit a support ticket.
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {status === 'success' && <div style={{ color: '#10b981', marginBottom: '1rem' }}>Ticket submitted successfully! We will get back to you soon.</div>}
          {status === 'error' && <div style={{ color: '#ef4444', marginBottom: '1rem' }}>Failed to submit ticket. Please try again.</div>}
          
          <div className="form-group">
            <label htmlFor="subject" className="form-label">Subject</label>
            <input 
              type="text" 
              id="subject" 
              className="form-input" 
              value={formData.subject} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="message" className="form-label">Message</label>
            <textarea 
              id="message" 
              className="form-input" 
              rows="5"
              value={formData.message} 
              onChange={handleChange} 
              required 
            ></textarea>
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Submit Ticket
          </button>
        </form>
      )}
    </div>
  );
};

export default ContactUs;
