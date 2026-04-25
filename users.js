const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');
const bcrypt = require('bcryptjs');

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await db.get_async('SELECT * FROM users WHERE id = ?', [req.userId]);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, phone, address, city, state, zipCode, country } = req.body;
    
    await db.run_async(
      `UPDATE users SET 
        first_name = ?, last_name = ?, phone = ?, address = ?, 
        city = ?, state = ?, zip_code = ?, country = ?,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [firstName, lastName, phone, address, city, state, zipCode, country, req.userId]
    );
    
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Change password
router.post('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }
    
    const user = await db.get_async('SELECT * FROM users WHERE id = ?', [req.userId]);
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.run_async('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.userId]);
    
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add to wishlist
router.post('/wishlist/add', authMiddleware, async (req, res) => {
  try {
    const { productId } = req.body;
    
    if (!productId) {
      return res.status(400).json({ error: 'Product ID required' });
    }
    
    await db.run_async(
      'INSERT OR IGNORE INTO wishlist (user_id, product_id) VALUES (?, ?)',
      [req.userId, productId]
    );
    
    res.json({ message: 'Added to wishlist' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get wishlist
router.get('/wishlist', authMiddleware, async (req, res) => {
  try {
    const wishlist = await db.all_async(
      `SELECT p.* FROM wishlist w
       JOIN products p ON w.product_id = p.id
       WHERE w.user_id = ?
       ORDER BY w.created_at DESC`,
      [req.userId]
    );
    
    res.json({ items: wishlist });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove from wishlist
router.delete('/wishlist/remove/:productId', authMiddleware, async (req, res) => {
  try {
    await db.run_async(
      'DELETE FROM wishlist WHERE user_id = ? AND product_id = ?',
      [req.userId, req.params.productId]
    );
    
    res.json({ message: 'Removed from wishlist' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
