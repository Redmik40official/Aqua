/**
 * Navigation Active Link Highlighting
 * Automatically highlights the current page in the navigation
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get all navigation links
    const navLinks = document.querySelectorAll('nav a');
    
    // Get current page filename
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Remove active class from all links
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        // Check if link href matches current page
        const href = link.getAttribute('href');
        
        // Handle different cases
        if (
            (currentPage === 'index.html' && (href === 'index.html' || href === 'index.html')) ||
            (currentPage === href) ||
            (currentPage === '' && href === 'index.html') ||
            (currentPage === '' && href === 'index.html')
        ) {
            link.classList.add('active');
        }
    });
    
    // Handle scroll-to sections
    navLinks.forEach(link => {
        if (link.getAttribute('href').startsWith('#')) {
            link.addEventListener('click', function(e) {
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            });
        }
    });
});

