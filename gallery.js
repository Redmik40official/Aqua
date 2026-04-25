// Gallery & Image Zoom Manager
class GalleryManager {
  constructor() {
    this.currentIndex = 0;
    this.images = [];
  }
  
  initializeZoom() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
      const img = item.querySelector('img');
      if (img) {
        img.addEventListener('click', (e) => {
          this.openZoomView(e.target.src);
        });
      }
    });
  }
  
  openZoomView(imageSrc) {
    const modal = document.createElement('div');
    modal.className = 'image-zoom-modal';
    modal.innerHTML = `
      <div class="zoom-container">
        <button class="zoom-close" onclick="this.closest('.image-zoom-modal').remove()">✕</button>
        <img src="${imageSrc}" alt="Zoomed view" class="zoomed-image">
        <div class="zoom-controls">
          <button onclick="galleryManager.zoomIn()" class="zoom-btn">🔍+</button>
          <button onclick="galleryManager.zoomOut()" class="zoom-btn">🔍-</button>
          <button onclick="galleryManager.resetZoom()" class="zoom-btn">Reset</button>
          <button onclick="this.closest('.image-zoom-modal').remove()" class="zoom-btn">Close</button>
        </div>
      </div>
    `;
    
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
    `;
    
    document.body.appendChild(modal);
    this.setupZoomInteraction(modal.querySelector('.zoomed-image'));
  }
  
  setupZoomInteraction(img) {
    let scale = 1;
    let panning = false;
    let pointX = 0;
    let pointY = 0;
    let start = { x: 0, y: 0 };
    
    img.addEventListener('wheel', (e) => {
      e.preventDefault();
      const xs = (e.clientX - img.offsetLeft) / img.offsetWidth;
      const ys = (e.clientY - img.offsetTop) / img.offsetHeight;
      const delta = (e.wheelDelta ? e.wheelDelta : -e.deltaY);
      delta > 0 ? (scale *= 1.2) : (scale /= 1.2);
      img.style.transformOrigin = `${xs * 100}% ${ys * 100}%`;
      img.style.transform = `scale(${scale}) translate(${pointX}px, ${pointY}px)`;
    });
    
    img.addEventListener('mousedown', (e) => {
      panning = true;
      start = { x: e.clientX - pointX, y: e.clientY - pointY };
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!panning) return;
      pointX = e.clientX - start.x;
      pointY = e.clientY - start.y;
      img.style.cursor = 'grabbing';
      img.style.transform = `scale(${scale}) translate(${pointX}px, ${pointY}px)`;
    });
    
    document.addEventListener('mouseup', () => {
      panning = false;
      img.style.cursor = 'grab';
    });
  }
  
  zoomIn() {
    const img = document.querySelector('.zoomed-image');
    if (img) {
      const currentScale = new DOMMatrix(window.getComputedStyle(img).transform).m11;
      img.style.transform = `scale(${currentScale * 1.2})`;
    }
  }
  
  zoomOut() {
    const img = document.querySelector('.zoomed-image');
    if (img) {
      const currentScale = new DOMMatrix(window.getComputedStyle(img).transform).m11;
      img.style.transform = `scale(${Math.max(1, currentScale / 1.2)})`;
    }
  }
  
  resetZoom() {
    const img = document.querySelector('.zoomed-image');
    if (img) {
      img.style.transform = 'scale(1) translate(0, 0)';
    }
  }
  
  initializeGalleryCarousel(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const images = container.querySelectorAll('img');
    if (images.length === 0) return;
    
    this.images = Array.from(images).map(img => img.src);
    this.currentIndex = 0;
    
    const carousel = document.createElement('div');
    carousel.className = 'gallery-carousel';
    carousel.innerHTML = `
      <div class="carousel-main">
        <img src="${this.images[0]}" alt="Main image" id="carousel-main">
      </div>
      <div class="carousel-thumbnails">
        ${this.images.map((img, idx) => `
          <img src="${img}" alt="Thumbnail ${idx}" onclick="galleryManager.selectImage(${idx})" 
               class="carousel-thumb ${idx === 0 ? 'active' : ''}">
        `).join('')}
      </div>
      <div class="carousel-controls">
        <button onclick="galleryManager.prevImage()">← Previous</button>
        <button onclick="galleryManager.nextImage()">Next →</button>
      </div>
    `;
    
    container.innerHTML = '';
    container.appendChild(carousel);
  }
  
  selectImage(index) {
    this.currentIndex = Math.max(0, Math.min(index, this.images.length - 1));
    document.getElementById('carousel-main').src = this.images[this.currentIndex];
    
    document.querySelectorAll('.carousel-thumb').forEach((thumb, idx) => {
      thumb.classList.toggle('active', idx === this.currentIndex);
    });
  }
  
  nextImage() {
    this.selectImage(this.currentIndex + 1);
  }
  
  prevImage() {
    this.selectImage(this.currentIndex - 1);
  }
}

// Add CSS for gallery zoom
const galleryCSS = `
  .image-zoom-modal {
    animation: fadeIn 0.3s ease-out;
  }
  
  .zoom-container {
    position: relative;
    max-width: 90vw;
    max-height: 90vh;
  }
  
  .zoomed-image {
    max-width: 100%;
    max-height: 100%;
    cursor: grab;
    transition: transform 0.2s ease-out;
  }
  
  .zoom-close {
    position: absolute;
    top: 10px;
    right: 10px;
    background: white;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-size: 20px;
    cursor: pointer;
    z-index: 10001;
  }
  
  .zoom-controls {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 10px;
  }
  
  .zoom-btn {
    background: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.2s;
  }
  
  .zoom-btn:hover {
    background: #f0f0f0;
    transform: scale(1.05);
  }
  
  .gallery-carousel {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .carousel-main {
    width: 100%;
    max-height: 500px;
    overflow: hidden;
    border-radius: 8px;
  }
  
  .carousel-main img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .carousel-thumbnails {
    display: flex;
    gap: 10px;
    overflow-x: auto;
  }
  
  .carousel-thumb {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border: 2px solid #ddd;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .carousel-thumb:hover,
  .carousel-thumb.active {
    border-color: #2a7fa3;
    transform: scale(1.05);
  }
  
  .carousel-controls {
    display: flex;
    gap: 10px;
    justify-content: center;
  }
  
  .carousel-controls button {
    padding: 10px 20px;
    background: #2a7fa3;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .carousel-controls button:hover {
    background: #1a4d6d;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

// Inject gallery CSS
const style = document.createElement('style');
style.textContent = galleryCSS;
document.head.appendChild(style);

const galleryManager = new GalleryManager();

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  galleryManager.initializeZoom();
});
