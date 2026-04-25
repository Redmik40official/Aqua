// API Configuration and Helper Functions
const API_BASE_URL = 'http://localhost:5000/api';

// Storage helpers
const storage = {
  getToken: () => localStorage.getItem('authToken'),
  setToken: (token) => localStorage.setItem('authToken', token),
  removeToken: () => localStorage.removeItem('authToken'),
  getUser: () => JSON.parse(localStorage.getItem('user') || 'null'),
  setUser: (user) => localStorage.setItem('user', JSON.stringify(user)),
  removeUser: () => localStorage.removeItem('user')
};

// API request helper
async function apiCall(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  const token = storage.getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API request failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Auth API
const authAPI = {
  register: (data) => apiCall('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => apiCall('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  verify: () => apiCall('/auth/verify', { method: 'GET' }),
  logout: () => apiCall('/auth/logout', { method: 'POST' }),
  socialLogin: (data) => apiCall('/auth/social-login', { method: 'POST', body: JSON.stringify(data) })
};

// Products API
const productsAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return apiCall(`/products?${params}`);
  },
  getById: (id) => apiCall(`/products/${id}`),
  create: (data) => apiCall('/products', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiCall(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiCall(`/products/${id}`, { method: 'DELETE' }),
  getCategories: () => apiCall('/products/categories')
};

// Cart API
const cartAPI = {
  get: () => apiCall('/cart'),
  add: (data) => apiCall('/cart/add', { method: 'POST', body: JSON.stringify(data) }),
  update: (cartId, data) => apiCall(`/cart/update/${cartId}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (cartId) => apiCall(`/cart/remove/${cartId}`, { method: 'DELETE' }),
  clear: () => apiCall('/cart/clear', { method: 'DELETE' })
};

// Orders API
const ordersAPI = {
  getAll: () => apiCall('/orders'),
  getById: (id) => apiCall(`/orders/${id}`),
  checkout: (data) => apiCall('/orders/checkout', { method: 'POST', body: JSON.stringify(data) }),
  processPayment: (orderId, data) => apiCall(`/orders/${orderId}/payment`, { method: 'POST', body: JSON.stringify(data) })
};

// Reviews API
const reviewsAPI = {
  getByProduct: (productId, page = 1) => apiCall(`/reviews/product/${productId}?page=${page}`),
  create: (data) => apiCall('/reviews', { method: 'POST', body: JSON.stringify(data) }),
  markHelpful: (reviewId) => apiCall(`/reviews/${reviewId}/helpful`, { method: 'POST' }),
  delete: (reviewId) => apiCall(`/reviews/${reviewId}`, { method: 'DELETE' }),
  getSummary: (productId) => apiCall(`/reviews/summary/${productId}`)
};

// Users API
const usersAPI = {
  getProfile: () => apiCall('/users/profile'),
  updateProfile: (data) => apiCall('/users/profile', { method: 'PUT', body: JSON.stringify(data) }),
  changePassword: (data) => apiCall('/users/change-password', { method: 'POST', body: JSON.stringify(data) }),
  addToWishlist: (productId) => apiCall('/users/wishlist/add', { method: 'POST', body: JSON.stringify({ productId }) }),
  getWishlist: () => apiCall('/users/wishlist'),
  removeFromWishlist: (productId) => apiCall(`/users/wishlist/remove/${productId}`, { method: 'DELETE' })
};

// Blog API
const blogAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return apiCall(`/blog?${params}`);
  },
  getBySlug: (slug) => apiCall(`/blog/${slug}`),
  create: (data) => apiCall('/blog', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiCall(`/blog/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiCall(`/blog/${id}`, { method: 'DELETE' })
};

// Newsletter API
const newsletterAPI = {
  subscribe: (data) => apiCall('/newsletter/subscribe', { method: 'POST', body: JSON.stringify(data) }),
  unsubscribe: (email) => apiCall('/newsletter/unsubscribe', { method: 'POST', body: JSON.stringify({ email }) })
};

// Search API
const searchAPI = {
  search: (query, type = 'all') => apiCall(`/search?q=${query}&type=${type}`),
  suggestions: (query) => apiCall(`/search/suggestions?q=${query}`),
  trending: () => apiCall('/search/trending')
};

// Analytics API
const analyticsAPI = {
  track: (data) => apiCall('/analytics/track', { method: 'POST', body: JSON.stringify(data) }),
  pageStats: () => apiCall('/analytics/stats/pages'),
  referrerStats: () => apiCall('/analytics/stats/referrers'),
  overview: () => apiCall('/analytics/stats/overview'),
  conversion: () => apiCall('/analytics/stats/conversion'),
  sitemap: () => fetch(`${API_BASE_URL}/analytics/sitemap.xml`)
};

// Track page view
window.addEventListener('load', () => {
  analyticsAPI.track({
    pagePath: window.location.pathname,
    referrer: document.referrer
  }).catch(err => console.log('Analytics tracking failed:', err));
});
