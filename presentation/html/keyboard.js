document.addEventListener('DOMContentLoaded', function() {
    // Get the navigation links
    const prevLink = document.querySelector('.navigation-buttons a:first-child');
    const nextLink = document.querySelector('.navigation-buttons a:last-child');
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(event) {
        // Left arrow key for previous slide
        if (event.key === 'ArrowLeft' && !prevLink.classList.contains('disabled')) {
            window.location.href = prevLink.getAttribute('href');
        }
        
        // Right arrow key or spacebar for next slide
        if ((event.key === 'ArrowRight' || event.key === ' ') && !nextLink.classList.contains('disabled')) {
            window.location.href = nextLink.getAttribute('href');
        }
    });
});