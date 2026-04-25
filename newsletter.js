const express = require('express');
const router = express.Router();
const db = require('../config/database');
const nodemailer = require('nodemailer');

// Email configuration (placeholder - use your own SMTP settings)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-password'
  }
});

// Subscribe to newsletter
router.post('/subscribe', async (req, res) => {
  try {
    const { email, name } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }
    
    await db.run_async(
      'INSERT OR IGNORE INTO newsletter_subscribers (email, name, status) VALUES (?, ?, ?)',
      [email, name || '', 'active']
    );
    
    // Send welcome email
    await transporter.sendMail({
      from: process.env.EMAIL_USER || 'noreply@fishpottery.com',
      to: email,
      subject: 'Welcome to Fish Pottery Newsletter',
      html: `
        <h2>Welcome to Fish Pottery!</h2>
        <p>Thank you for subscribing to our newsletter. You'll now receive updates about our latest pottery collections, special offers, and pottery care tips.</p>
        <p>Best regards,<br/>Fish Pottery Team</p>
      `
    }).catch(err => console.log('Email send failed:', err));
    
    res.json({ message: 'Subscribed successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Unsubscribe from newsletter
router.post('/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;
    
    await db.run_async(
      'UPDATE newsletter_subscribers SET status = ? WHERE email = ?',
      ['inactive', email]
    );
    
    res.json({ message: 'Unsubscribed successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Send newsletter (admin only)
router.post('/send', async (req, res) => {
  try {
    const { subject, htmlContent } = req.body;
    
    if (!subject || !htmlContent) {
      return res.status(400).json({ error: 'Subject and content required' });
    }
    
    // Get all active subscribers
    const subscribers = await db.all_async(
      'SELECT email FROM newsletter_subscribers WHERE status = ?',
      ['active']
    );
    
    let sent = 0;
    for (const subscriber of subscribers) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER || 'noreply@fishpottery.com',
          to: subscriber.email,
          subject,
          html: htmlContent
        });
        sent++;
      } catch (err) {
        console.log('Failed to send to:', subscriber.email);
      }
    }
    
    res.json({ 
      message: `Newsletter sent to ${sent} subscribers`,
      sent
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get subscriber count
router.get('/stats/count', async (req, res) => {
  try {
    const result = await db.get_async(
      'SELECT COUNT(*) as count FROM newsletter_subscribers WHERE status = ?',
      ['active']
    );
    
    res.json({ subscriberCount: result.count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
