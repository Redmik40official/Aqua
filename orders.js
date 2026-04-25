const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

// Generate order number
const generateOrderNumber = () => {
  return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

// Create order (checkout)
router.post('/checkout', authMiddleware, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, cartItems } = req.body;
    
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    
    // Calculate total
    let totalAmount = 0;
    for (const item of cartItems) {
      const product = await db.get_async('SELECT price FROM products WHERE id = ?', [item.productId]);
      totalAmount += product.price * item.quantity;
    }
    
    // Create order
    const orderNumber = generateOrderNumber();
    const result = await db.run_async(
      `INSERT INTO orders (user_id, order_number, total_amount, status, shipping_address, payment_method)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [req.userId, orderNumber, totalAmount, 'pending', JSON.stringify(shippingAddress), paymentMethod]
    );
    
    const orderId = result.lastID;
    
    // Add order items
    for (const item of cartItems) {
      const product = await db.get_async('SELECT price FROM products WHERE id = ?', [item.productId]);
      await db.run_async(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES (?, ?, ?, ?)`,
        [orderId, item.productId, item.quantity, product.price]
      );
      
      // Update product stock
      await db.run_async(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.productId]
      );
    }
    
    // Clear cart
    await db.run_async('DELETE FROM cart WHERE user_id = ?', [req.userId]);
    
    res.status(201).json({ 
      message: 'Order created successfully',
      orderId,
      orderNumber,
      totalAmount: totalAmount.toFixed(2),
      status: 'pending'
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get order details
router.get('/:orderId', authMiddleware, async (req, res) => {
  try {
    const order = await db.get_async(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [req.params.orderId, req.userId]
    );
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const items = await db.all_async(
      `SELECT oi.*, p.name, p.image_url FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [req.params.orderId]
    );
    
    res.json({ 
      order,
      items,
      shippingAddress: JSON.parse(order.shipping_address)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user orders
router.get('/', authMiddleware, async (req, res) => {
  try {
    const orders = await db.all_async(
      `SELECT id, order_number, total_amount, status, created_at FROM orders 
       WHERE user_id = ? 
       ORDER BY created_at DESC`,
      [req.userId]
    );
    
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update order status (admin only)
router.put('/:orderId/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    await db.run_async(
      'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, req.params.orderId]
    );
    
    res.json({ message: 'Order status updated' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Payment integration (Stripe/PayPal placeholder)
router.post('/:orderId/payment', authMiddleware, async (req, res) => {
  try {
    const { paymentToken, amount } = req.body;
    const orderId = req.params.orderId;
    
    // In production, integrate with Stripe or PayPal here
    // This is a placeholder implementation
    
    const order = await db.get_async('SELECT * FROM orders WHERE id = ? AND user_id = ?', [orderId, req.userId]);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    if (parseFloat(order.total_amount) !== parseFloat(amount)) {
      return res.status(400).json({ error: 'Amount mismatch' });
    }
    
    // Simulate payment processing
    const transactionId = 'TXN-' + Date.now();
    
    await db.run_async(
      `UPDATE orders SET status = ?, transaction_id = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      ['processing', transactionId, orderId]
    );
    
    res.json({ 
      message: 'Payment successful',
      transactionId,
      status: 'processing'
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
