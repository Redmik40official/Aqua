// This file contains JavaScript code for interactivity on the fish pottery website.

// Function to handle navigation menu toggle
const toggleMenu = () => {
    const menu = document.getElementById('nav-menu');
    menu.classList.toggle('active');
};

// Function to handle smooth scrolling to sections
const smoothScroll = (target) => {
    const element = document.querySelector(target);
    element.scrollIntoView({ behavior: 'smooth' });
};

// Event listener for menu toggle
document.getElementById('menu-toggle').addEventListener('click', toggleMenu);

// Event listeners for smooth scrolling on navigation links
document.querySelectorAll('a.smooth-scroll').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = e.currentTarget.getAttribute('href');
        smoothScroll(target);
    });
});

// Function to initialize gallery lightbox
const initLightbox = () => {
    const lightbox = document.querySelector('.lightbox');
    const images = document.querySelectorAll('.gallery-image');

    images.forEach(image => {
        image.addEventListener('click', () => {
            lightbox.classList.add('active');
            lightbox.querySelector('img').src = image.src;
        });
    });

    lightbox.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });
};

// Initialize lightbox on page load
window.onload = initLightbox;