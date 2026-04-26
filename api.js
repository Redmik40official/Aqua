// Static API Configuration and Mock Functions
// This file replaces backend API calls with client-side logic using localStorage

// Storage helpers
const storage = {
  getToken: () => localStorage.getItem('authToken'),
  setToken: (token) => localStorage.setItem('authToken', token),
  removeToken: () => localStorage.removeItem('authToken'),
  getUser: () => JSON.parse(localStorage.getItem('user') || 'null'),
  setUser: (user) => localStorage.setItem('user', JSON.stringify(user)),
  removeUser: () => localStorage.removeItem('user')
};

// Mock API request helper (simulates network delay)
async function apiCall(endpoint, options = {}) {
  console.log(`Mock API Call: ${endpoint}`, options);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ status: 'success' });
    }, 300);
  });
}

// Auth API Mock
const authAPI = {
  register: async (data) => {
    const user = { username: data.username, email: data.email, id: Date.now() };
    return { token: 'mock-token-' + Date.now(), user };
  },
  login: async (data) => {
    const user = { username: data.email.split('@')[0], email: data.email, id: 123 };
    return { token: 'mock-token-' + Date.now(), user };
  },
  verify: async () => ({ user: storage.getUser() }),
  logout: async () => ({ success: true }),
  socialLogin: async (data) => ({ token: 'social-token', user: { username: 'SocialUser', id: 456 } })
};

// Products API Mock (Uses products.js data)
const productsAPI = {
  getAll: async () => (window.products || []),
  getById: async (id) => (window.products || []).find(p => p.id === id),
  create: async (data) => ({ ...data, id: Date.now() }),
  update: async (id, data) => ({ ...data, id }),
  delete: async (id) => ({ success: true }),
  getCategories: async () => ['fish', 'shrimp', 'plants', 'accessories']
};

// Cart API Mock (Now redundant as cart.js handles localStorage directly)
const cartAPI = {
  get: async () => JSON.parse(localStorage.getItem('cart') || '[]'),
  add: async (data) => { console.log('Mock add to cart'); return { success: true }; },
  update: async (id, data) => ({ success: true }),
  remove: async (id) => ({ success: true }),
  clear: async () => ({ success: true })
};

// Orders API Mock
const ordersAPI = {
  getAll: async () => [],
  getById: async (id) => ({ id, status: 'delivered' }),
  checkout: async (data) => ({ orderId: 'ORD-' + Date.now(), status: 'success' }),
  processPayment: async (orderId, data) => ({ status: 'paid' })
};

// Reviews API Mock
const reviewsAPI = {
  getByProduct: async (productId) => [],
  create: async (data) => ({ ...data, id: Date.now() }),
  markHelpful: async (reviewId) => ({ success: true }),
  delete: async (reviewId) => ({ success: true }),
  getSummary: async (productId) => ({ average: 5, count: 1 })
};

// Users API Mock
const usersAPI = {
  getProfile: async () => storage.getUser(),
  updateProfile: async (data) => {
    const user = { ...storage.getUser(), ...data };
    storage.setUser(user);
    return user;
  },
  changePassword: async (data) => ({ success: true }),
  addToWishlist: async (productId) => ({ success: true }),
  getWishlist: async () => [],
  removeFromWishlist: async (productId) => ({ success: true })
};

// Analytics API Mock
const analyticsAPI = {
  track: async (data) => { console.log('Analytics tracked:', data); return { success: true }; },
  pageStats: async () => ({}),
  referrerStats: async () => ({}),
  overview: async () => ({}),
  conversion: async () => ({}),
  sitemap: async () => '<?xml version="1.0" encoding="UTF-8"?><urlset></urlset>'
};

// Track page view
window.addEventListener('load', () => {
  analyticsAPI.track({
    pagePath: window.location.pathname,
    referrer: document.referrer
  }).catch(err => console.log('Analytics tracking failed:', err));
});

