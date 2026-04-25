const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all blog posts
router.get('/', async (req, res) => {
  try {
    const { category, page = 1 } = req.query;
    const limit = 10;
    const offset = (page - 1) * limit;
    
    let sql = 'SELECT * FROM blog_posts WHERE 1=1';
    const params = [];
    
    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }
    
    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const posts = await db.all_async(sql, params);
    
    // Get count
    let countSql = 'SELECT COUNT(*) as count FROM blog_posts WHERE 1=1';
    const countParams = [];
    if (category) {
      countSql += ' AND category = ?';
      countParams.push(category);
    }
    
    const countResult = await db.get_async(countSql, countParams);
    
    res.json({
      posts,
      total: countResult.count,
      page: parseInt(page),
      pages: Math.ceil(countResult.count / limit)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single blog post
router.get('/:slug', async (req, res) => {
  try {
    const post = await db.get_async('SELECT * FROM blog_posts WHERE slug = ?', [req.params.slug]);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Increment views
    await db.run_async('UPDATE blog_posts SET views = views + 1 WHERE id = ?', [post.id]);
    
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create blog post (admin only - placeholder)
router.post('/', async (req, res) => {
  try {
    const { title, slug, content, excerpt, author, featuredImage, category } = req.body;
    
    if (!title || !slug || !content) {
      return res.status(400).json({ error: 'Title, slug, and content required' });
    }
    
    const result = await db.run_async(
      `INSERT INTO blog_posts (title, slug, content, excerpt, author, featured_image, category)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, slug, content, excerpt, author, featuredImage, category]
    );
    
    res.status(201).json({ 
      message: 'Blog post created',
      id: result.lastID
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update blog post
router.put('/:id', async (req, res) => {
  try {
    const { title, content, excerpt, author, featured_image, category } = req.body;
    
    await db.run_async(
      `UPDATE blog_posts SET 
        title = ?, content = ?, excerpt = ?, author = ?, featured_image = ?, category = ?,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [title, content, excerpt, author, featured_image, category, req.params.id]
    );
    
    res.json({ message: 'Post updated' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete blog post
router.delete('/:id', async (req, res) => {
  try {
    await db.run_async('DELETE FROM blog_posts WHERE id = ?', [req.params.id]);
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get blog categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await db.all_async(
      'SELECT DISTINCT category FROM blog_posts WHERE category IS NOT NULL'
    );
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
