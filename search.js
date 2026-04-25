const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Full text search across products and blog
router.get('/', async (req, res) => {
  try {
    const { q, type = 'all' } = req.query;
    
    if (!q || q.length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }
    
    const searchTerm = `%${q}%`;
    let products = [];
    let posts = [];
    
    if (type === 'all' || type === 'products') {
      products = await db.all_async(
        `SELECT id, name, description, price, image_url, rating FROM products 
         WHERE name LIKE ? OR description LIKE ? 
         ORDER BY rating DESC
         LIMIT 20`,
        [searchTerm, searchTerm]
      );
    }
    
    if (type === 'all' || type === 'blog') {
      posts = await db.all_async(
        `SELECT id, title, slug, excerpt, featured_image, created_at FROM blog_posts 
         WHERE title LIKE ? OR excerpt LIKE ? OR content LIKE ? 
         ORDER BY created_at DESC
         LIMIT 20`,
        [searchTerm, searchTerm, searchTerm]
      );
    }
    
    res.json({
      query: q,
      products,
      posts,
      totalResults: products.length + posts.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get search suggestions/autocomplete
router.get('/suggestions', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.json({ suggestions: [] });
    }
    
    const searchTerm = `${q}%`;
    
    const products = await db.all_async(
      'SELECT DISTINCT name FROM products WHERE name LIKE ? LIMIT 5',
      [searchTerm]
    );
    
    const posts = await db.all_async(
      'SELECT DISTINCT title FROM blog_posts WHERE title LIKE ? LIMIT 5',
      [searchTerm]
    );
    
    const suggestions = [
      ...products.map(p => ({ text: p.name, type: 'product' })),
      ...posts.map(p => ({ text: p.title, type: 'blog' }))
    ];
    
    res.json({ suggestions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get trending searches
router.get('/trending', async (req, res) => {
  try {
    // Get most viewed blog posts
    const trendingPosts = await db.all_async(
      'SELECT title, slug FROM blog_posts ORDER BY views DESC LIMIT 5'
    );
    
    // Get top rated products
    const trendingProducts = await db.all_async(
      'SELECT name, id FROM products ORDER BY rating DESC LIMIT 5'
    );
    
    res.json({
      trendingPosts,
      trendingProducts
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
