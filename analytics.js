const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Track page visit
router.post('/track', async (req, res) => {
  try {
    const { pagePath, referrer } = req.body;
    
    await db.run_async(
      `INSERT INTO analytics (page_path, referrer, user_agent, ip_address)
       VALUES (?, ?, ?, ?)`,
      [
        pagePath,
        referrer,
        req.headers['user-agent'],
        req.ip || req.connection.remoteAddress
      ]
    );
    
    res.json({ message: 'Tracked' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get page statistics
router.get('/stats/pages', async (req, res) => {
  try {
    const stats = await db.all_async(
      `SELECT page_path, COUNT(*) as visits FROM analytics 
       GROUP BY page_path 
       ORDER BY visits DESC 
       LIMIT 20`
    );
    
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get referrer statistics
router.get('/stats/referrers', async (req, res) => {
  try {
    const stats = await db.all_async(
      `SELECT referrer, COUNT(*) as count FROM analytics 
       WHERE referrer IS NOT NULL 
       GROUP BY referrer 
       ORDER BY count DESC 
       LIMIT 10`
    );
    
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get traffic overview
router.get('/stats/overview', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const totalVisits = await db.get_async(
      'SELECT COUNT(*) as count FROM analytics'
    );
    
    const todayVisits = await db.get_async(
      'SELECT COUNT(*) as count FROM analytics WHERE DATE(timestamp) = ?',
      [today]
    );
    
    const totalOrders = await db.get_async(
      'SELECT COUNT(*) as count FROM orders'
    );
    
    const totalRevenue = await db.get_async(
      'SELECT SUM(total_amount) as total FROM orders'
    );
    
    const totalUsers = await db.get_async(
      'SELECT COUNT(*) as count FROM users'
    );
    
    res.json({
      totalVisits: totalVisits.count,
      todayVisits: todayVisits.count,
      totalOrders: totalOrders.count,
      totalRevenue: totalRevenue.total || 0,
      totalUsers: totalUsers.count
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get conversion rate
router.get('/stats/conversion', async (req, res) => {
  try {
    const visitors = await db.get_async('SELECT COUNT(*) as count FROM analytics');
    const customers = await db.get_async('SELECT COUNT(DISTINCT user_id) as count FROM orders');
    
    const conversionRate = visitors.count > 0 
      ? ((customers.count / visitors.count) * 100).toFixed(2)
      : 0;
    
    res.json({
      visitors: visitors.count,
      customers: customers.count,
      conversionRate: conversionRate + '%'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Generate sitemap
router.get('/sitemap.xml', async (req, res) => {
  try {
    const products = await db.all_async('SELECT id, updated_at FROM products');
    const posts = await db.all_async('SELECT slug, updated_at FROM blog_posts');
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Add pages
    const pages = ['/', '/pages/about.html', '/pages/gallery.html', '/pages/shop.html', '/pages/contact.html'];
    pages.forEach(page => {
      xml += '  <url>\n';
      xml += `    <loc>https://fishpottery.com${page}</loc>\n`;
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += '    <priority>0.8</priority>\n';
      xml += '  </url>\n';
    });
    
    // Add products
    products.forEach(product => {
      xml += '  <url>\n';
      xml += `    <loc>https://fishpottery.com/product/${product.id}</loc>\n`;
      xml += `    <lastmod>${new Date(product.updated_at).toISOString()}</lastmod>\n`;
      xml += '    <changefreq>monthly</changefreq>\n';
      xml += '    <priority>0.7</priority>\n';
      xml += '  </url>\n';
    });
    
    // Add blog posts
    posts.forEach(post => {
      xml += '  <url>\n';
      xml += `    <loc>https://fishpottery.com/blog/${post.slug}</loc>\n`;
      xml += `    <lastmod>${new Date(post.updated_at).toISOString()}</lastmod>\n`;
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += '    <priority>0.6</priority>\n';
      xml += '  </url>\n';
    });
    
    xml += '</urlset>';
    
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
