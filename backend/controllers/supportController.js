const db = require('../config/db');

// @desc    Submit a support ticket
// @route   POST /api/support
// @access  Public (or Private if required)
const submitTicket = async (req, res) => {
  const { user, subject, message } = req.body;
  if (!user || !subject || !message) {
    return res.status(400).json({ message: 'Please provide user, subject, and message' });
  }

  const ticketId = `T-${Date.now()}`;

  try {
    await db.initDb();
    await db.pool.query(
      'INSERT INTO support_tickets (id, user_name, subject, message) VALUES ($1, $2, $3, $4)',
      [ticketId, user, subject, message]
    );

    res.status(201).json({ message: 'Ticket submitted successfully', ticket: { id: ticketId } });
  } catch (err) {
    console.error('Error submitting ticket:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all support tickets
// @route   GET /api/crm/support
// @access  Private/Admin
const getAllTickets = async (req, res) => {
  try {
    await db.initDb();
    const { rows } = await db.pool.query('SELECT id, user_name as user, subject, status, priority, message, created_at as date FROM support_tickets ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching tickets:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a ticket status
// @route   PUT /api/crm/support/:id
// @access  Private/Admin
const updateTicketStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await db.initDb();
    await db.pool.query('UPDATE support_tickets SET status = $1 WHERE id = $2', [status, id]);
    res.json({ message: 'Ticket status updated' });
  } catch (err) {
    console.error('Error updating ticket:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  submitTicket,
  getAllTickets,
  updateTicketStatus
};
