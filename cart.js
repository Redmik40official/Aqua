// Shopping Cart Manager
window.cartManager = {
  loadCart: function() {
    return JSON.parse(localStorage.getItem('cart')) || [];
  },
  
  saveCart: function(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
  },
  
  addItem: function(productId) {
    console.log('cartManager.addItem called with id:', productId);
    const product = products.find(p => p.id === productId);
    if (!product) {
      console.error('Product not found in products array for id:', productId);
      return;
    }
    console.log('Found product:', product.name);
    
    let cart = this.loadCart();
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1
      });
    }
    
    this.saveCart(cart);
    alert(`${product.name} added to cart!`);
  },
  
  removeItem: function(productId) {
    let cart = this.loadCart();
    cart = cart.filter(item => item.id !== productId);
    this.saveCart(cart);
  },
  
  updateQuantity: function(productId, quantity) {
    let cart = this.loadCart();
    const item = cart.find(item => item.id === productId);
    if (item) {
      item.quantity = Math.max(1, parseInt(quantity));
      this.saveCart(cart);
    }
  },
  
  clearCart: function() {
    if (confirm('Clear your cart?')) {
      localStorage.removeItem('cart');
      updateCartCount();
      location.reload();
    }
  },
  
  getTotal: function() {
    const cart = this.loadCart();
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }
};

// Update cart count in header
function updateCartCount() {
  try {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCounts = document.querySelectorAll('.cart-count');
    
    // Calculate total quantity of all items
    const totalQuantity = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    
    cartCounts.forEach(countEl => {
      countEl.textContent = totalQuantity;
    });
    
    console.log('Cart count updated to:', totalQuantity, 'across', cartCounts.length, 'elements');
  } catch (e) {
    console.error('Error updating cart count:', e);
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  console.log('Cart Manager Initialized');
  updateCartCount();
});

