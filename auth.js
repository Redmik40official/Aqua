// Authentication Module
class AuthManager {
  constructor() {
    this.isAuthenticated = !!storage.getToken();
    this.user = storage.getUser();
    this.initializeListeners();
  }
  
  initializeListeners() {
    document.addEventListener('DOMContentLoaded', () => {
      this.updateAuthUI();
    });
  }
  
  async register(username, email, password, firstName = '', lastName = '') {
    try {
      const response = await authAPI.register({
        username,
        email,
        password,
        firstName,
        lastName
      });
      
      this.setAuthState(response.token, response.user);
      this.showNotification('Registration successful!', 'success');
      return response;
    } catch (error) {
      this.showNotification(error.message, 'error');
      throw error;
    }
  }
  
  async login(email, password) {
    try {
      const response = await authAPI.login({ email, password });
      this.setAuthState(response.token, response.user);
      this.showNotification('Login successful!', 'success');
      return response;
    } catch (error) {
      this.showNotification(error.message, 'error');
      throw error;
    }
  }
  
  async logout() {
    try {
      await authAPI.logout();
      this.clearAuthState();
      this.showNotification('Logged out successfully', 'success');
      window.location.href = '/index.html';
    } catch (error) {
      console.error('Logout error:', error);
      this.clearAuthState();
    }
  }
  
  async verifyToken() {
    if (!this.isAuthenticated) return false;
    
    try {
      const response = await authAPI.verify();
      this.user = response.user;
      storage.setUser(this.user);
      return true;
    } catch (error) {
      this.clearAuthState();
      return false;
    }
  }
  
  setAuthState(token, user) {
    storage.setToken(token);
    storage.setUser(user);
    this.isAuthenticated = true;
    this.user = user;
    this.updateAuthUI();
  }
  
  clearAuthState() {
    storage.removeToken();
    storage.removeUser();
    this.isAuthenticated = false;
    this.user = null;
    this.updateAuthUI();
  }
  
  updateAuthUI() {
    const authContainer = document.getElementById('auth-container');
    if (!authContainer) return;
    
    if (this.isAuthenticated && this.user) {
      authContainer.innerHTML = `
        <div class="auth-user">
          <span class="username">${this.user.username}</span>
          <a href="/account.html" class="btn-account">Account</a>
          <button class="btn-logout" onclick="authManager.logout()">Logout</button>
        </div>
      `;
    } else {
      authContainer.innerHTML = `
        <div class="auth-buttons">
          <a href="/login.html" class="btn-login">Login</a>
          <a href="/register.html" class="btn-register">Register</a>
        </div>
      `;
    }
  }
  
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 5px;
      z-index: 9999;
      animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animationName = 'slideOut';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
  
  requireAuth(callback) {
    if (!this.isAuthenticated) {
      this.showNotification('Please log in first', 'warning');
      window.location.href = '/login.html';
      return;
    }
    if (callback) callback();
  }
}

const authManager = new AuthManager();

