// Product Catalog
window.products = [
    // LIVE FISH
    {
        id: 4,
        name: 'Fancy Guppy',
        price: 0,
        category: 'fish',
        description: 'Beautiful fancy guppies with vibrant colors and flowing fins.',
        features: ['Bright, vibrant colors', 'Flowing tail fins', 'Peaceful community fish', 'Hardy and easy to care for'],
        icon: '🐠',
        image: 'fancy-guppy.webp',
        type: 'Live Fish'
    },
    {
        id: 5,
        name: 'Betta Fish',
        price: 0,
        category: 'fish',
        description: 'Stunning male Betta fish with elaborate fins. Must be housed separately.',
        features: ['Vibrant coloring', 'Flowing fins', 'Single housing required', '2-3 year lifespan'],
        icon: '🐠',
        image: 'betta-fish.jpg',
        type: 'Live Fish'
    },
    {
        id: 6,
        name: 'Flowerhorn Fish',
        price: 0,
        category: 'fish',
        description: 'Colorful and intelligent cichlid with a distinctive head pearl.',
        features: ['Bright colors', 'Intelligent personality', 'Large breeding hump', 'Popular among collectors'],
        icon: '🐟',
        image: 'flowerhorn.webp',
        type: 'Live Fish'
    },
    {
        id: 7,
        name: 'Goldfish',
        price: 0,
        category: 'fish',
        description: 'Classic hardy goldfish. Perfect for beginners and outdoor ponds.',
        features: ['Hardy species', 'Long-lived (10+ years)', 'Cold water fish', 'Easy to care for'],
        icon: '🐠',
        image: 'goldfish.webp',
        type: 'Live Fish'
    },
    {
        id: 8,
        name: 'Paradise Fish',
        price: 0,
        category: 'fish',
        description: 'Colorful Asian fish with blue and orange banding patterns.',
        features: ['Beautiful banding pattern', 'Semi-aggressive', 'Good size', 'Great for planted tanks'],
        icon: '🐟',
        image: 'paradisefish.jpeg',
        type: 'Live Fish'
    },
    {
        id: 9,
        name: 'Zebra Fish',
        price: 0,
        category: 'fish',
        description: 'Active fish with distinctive black and white striped pattern.',
        features: ['Striking striped pattern', 'Active swimmers', 'Community friendly', 'Small size'],
        icon: '🐠',
        image: 'zebrafish.jpeg',
        type: 'Live Fish'
    },
    {
        id: 10,
        name: 'Tiger Fish',
        price: 0,
        category: 'fish',
        description: 'Predatory fish with bold tiger-like markings and powerful jaws.',
        features: ['Bold markings', 'Powerful predator', 'Medium-large size', 'Impressive coloration'],
        icon: '🐟',
        image: 'tigerfish.jpeg',
        type: 'Live Fish'
    },

    // SHRIMPS
    {
        id: 11,
        name: 'Fire Red Shrimp',
        price: 0,
        category: 'shrimp',
        description: 'Brilliant red freshwater shrimp. Great for planted tanks and cleanup.',
        features: ['Vibrant red color', 'Algae eater', 'Community safe', 'Small size'],
        icon: '🦐',
        image: 'fireredshrimp.jpeg',
        type: 'Shrimps'
    },
    {
        id: 12,
        name: 'Bloody Mary Shrimp',
        price: 0,
        category: 'shrimp',
        description: 'Deep red colored shrimp perfect for planted aquariums.',
        features: ['Deep red color', 'Scavenges algae', 'Peaceful', 'Breeding-friendly'],
        icon: '🦐',
        image: 'bloodymaryshrimp.jpeg',
        type: 'Shrimps'
    },
    {
        id: 13,
        name: 'Golden Shrimp',
        price: 0,
        category: 'shrimp',
        description: 'Bright golden-yellow freshwater shrimp.',
        features: ['Golden coloration', 'Algae cleaner', 'Hardy species', 'Community fish safe'],
        icon: '🦐',
        image: 'goldenshrimp.png',
        type: 'Shrimps'
    },
    {
        id: 14,
        name: 'Black Shrimp',
        price: 0,
        category: 'shrimp',
        description: 'Deep black colored shrimp for contrast in planted tanks.',
        features: ['Pure black color', 'Excellent cleanup crew', 'Very peaceful', 'Perfect algae eater'],
        icon: '🦐',
        image: 'blackshrimp.jpeg',
        type: 'Shrimps'
    },
    {
        id: 15,
        name: 'Blue Shrimp',
        price: 0,
        category: 'shrimp',
        description: 'Stunning bright blue freshwater shrimp.',
        features: ['Vibrant blue color', 'Active substrate grazer', 'Community compatible', 'Hardy'],
        icon: '🦐',
        image: 'blueshrimp.webp',
        type: 'Shrimps'
    },
    {
        id: 16,
        name: 'Red Rili Shrimp',
        price: 0,
        category: 'shrimp',
        description: 'Red and white patterned shrimp with distinctive markings.',
        features: ['Red and white stripe', 'Interesting pattern', 'Algae cleaner', 'Peaceful'],
        icon: '🦐',
        image: 'redrillishrimp.jpeg',
        type: 'Shrimps'
    },
    {
        id: 17,
        name: 'Black Rili Shrimp',
        price: 0,
        category: 'shrimp',
        description: 'Black with white striped pattern. Elegant and striking.',
        features: ['Black with white stripe', 'Beautiful contrast', 'Great for cleanup', 'Community safe'],
        icon: '🦐',
        image: 'blackrillishrimp.jpeg',
        type: 'Shrimps'
    },

    // LIVE PLANTS
    {
        id: 18,
        name: 'Java Fern',
        price: 0,
        category: 'plants',
        description: 'Hardy beginner-friendly plant. Does well in low light.',
        features: ['Low light tolerant', 'Easy to care for', 'Attaches to driftwood', 'Slow growing'],
        icon: '🌿',
        type: 'Live Plants'
    },
    {
        id: 19,
        name: 'Anubias',
        price: 0,
        category: 'plants',
        description: 'Beautiful broad-leaf plant that thrives in almost any condition.',
        features: ['Broad green leaves', 'Very hardy', 'Low maintenance', 'Great for beginners'],
        icon: '🌿',
        type: 'Live Plants'
    },

    // ACCESSORIES
    {
        id: 20,
        name: 'RS Aquarium Pump',
        price: 0,
        category: 'accessories',
        description: 'Reliable and quiet air pump for aquariums of all sizes.',
        features: ['Quiet operation', 'Energy efficient', 'Adjustable flow', 'Durable design'],
        icon: '⚙️',
        image: 'aquariumpump.webp',
        type: 'Accessories'
    },
    {
        id: 21,
        name: 'Silicone Tube',
        price: 0,
        category: 'accessories',
        description: 'High-quality, flexible silicone airline tubing for air pumps.',
        features: ['Kink resistant', 'Standard 3/16" size', 'Clear color', 'Food-safe silicone'],
        icon: '🚰',
        image: 'silicontube.jpeg',
        type: 'Accessories'
    },
    {
        id: 22,
        name: 'Air Stones',
        price: 0,
        category: 'accessories',
        description: 'Creates fine bubbles for optimal oxygenation in your tank.',
        features: ['Fine bubble mist', 'Increases oxygen levels', 'Durable mineral material', 'Easy to clean'],
        icon: '🫧',
        image: 'airstones.webp',
        type: 'Accessories'
    },
    {
        id: 23,
        name: 'Controller',
        price: 0,
        category: 'accessories',
        description: 'Smart aquarium controller for automating lights and pumps.',
        features: ['24/7 automation', 'Easy programming', 'LCD display', 'Multi-channel control'],
        icon: '🎛️',
        image: 'controller.webp',
        type: 'Accessories'
    },
    {
        id: 24,
        name: 'Air Pump',
        price: 0,
        category: 'accessories',
        description: 'Compact and efficient air pump for small to medium tanks.',
        features: ['Compact size', 'Low noise', 'Energy efficient', 'Standard connection'],
        icon: '⚙️',
        image: 'airpump.webp',
        type: 'Accessories'
    }
];

function buyNow(productId) {
    addToCart(productId);
    const isPage = window.location.pathname.includes('/pages/');
    window.location.href = isPage ? 'cart.html' : 'pages/cart.html';
}

// Render products on page load
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
});

function renderProducts(itemsToRender = products) {
    const productList = document.getElementById('product-list');
    if (!productList) return;
    
    if (itemsToRender.length === 0) {
        productList.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: var(--neutral-medium); font-size: 1.1rem; padding: var(--spacing-xl) 0;">No products found matching your search.</p>';
        return;
    }
    
    productList.innerHTML = itemsToRender.map(product => {
        // Handle image path relative to the page
        const isPage = window.location.pathname.includes('/pages/');
        const imagePath = product.image ? (isPage ? '../' + product.image : product.image) : null;
        
        return `
        <div class="product-card-premium glass-panel" data-category="${product.category}">
            <div class="product-image-container">
                ${imagePath ? 
                    `<img src="${imagePath}?t=${Date.now()}" alt="${product.name}" class="product-img">` : 
                    `<span class="product-icon-large">${product.icon}</span>`
                }
                <div class="product-category-tag">${product.type}</div>
            </div>
            
            <div class="product-info">
                <h4 class="product-name">${product.name}</h4>
                <p class="product-desc">${product.description}</p>
                
                <div class="product-meta">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    <button class="btn-add-mini" onclick="addToCart(${product.id})">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                
                <div class="product-details">
                    <ul class="feature-list">
                        ${product.features.slice(0, 3).map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('')}
                    </ul>
                </div>
                
                <button class="btn btn-premium btn-full" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
                <button class="btn btn-outline btn-full btn-buy-now" onclick="buyNow(${product.id})" style="margin-top: 10px;">
                    Buy Now
                </button>
            </div>
        </div>
        `;
    }).join('');
}

function searchProducts() {
    const searchInput = document.getElementById('product-search');
    if (!searchInput) return;
    
    const query = searchInput.value.toLowerCase().trim();
    
    if (query === '') {
        renderProducts(); // Render all if empty
        return;
    }
    
    const filteredProducts = products.filter(product => {
        return product.name.toLowerCase().includes(query) || 
               product.description.toLowerCase().includes(query) || 
               product.type.toLowerCase().includes(query);
    });
    
    renderProducts(filteredProducts);
}

function addToCart(productId) {
    if (typeof cartManager !== 'undefined') {
        cartManager.addItem(productId);
    } else {
        console.log('Added product to cart:', productId);
    }
}
