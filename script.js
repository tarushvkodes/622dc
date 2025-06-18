// Intersection Observer for timeline animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

// Create observer for timeline items
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Create observer for lazy loading images
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.classList.add('loaded');
            imageObserver.unobserve(img);
        }
    });
}, observerOptions);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Observe timeline items for animation
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });

    // Observe images for lazy loading
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });

    // Smooth scroll for anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add subtle parallax effect to hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }

    // Enhanced scroll animations for better performance
    let ticking = false;

    function updateScrollAnimations() {
        const scrollTop = window.pageYOffset;
        
        // Update timeline line height based on scroll
        const timeline = document.querySelector('.timeline');
        const timelineLine = document.querySelector('.timeline-line');
        
        if (timeline && timelineLine) {
            const timelineRect = timeline.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            if (timelineRect.top < windowHeight && timelineRect.bottom > 0) {
                const progress = Math.min(1, Math.max(0, 
                    (windowHeight - timelineRect.top) / (timelineRect.height + windowHeight)
                ));
                timelineLine.style.transform = `translateX(-50%) scaleY(${progress})`;
                timelineLine.style.transformOrigin = 'top';
            }
        }
        
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollAnimations);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick);

    // Add loading states for external links
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    externalLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Add a subtle loading indicator
            const originalText = this.textContent;
            this.textContent = 'Opening...';
            
            setTimeout(() => {
                this.textContent = originalText;
            }, 1500);
        });
    });

    // Add hover effects for timeline items
    const timelineTexts = document.querySelectorAll('.timeline-text');
    timelineTexts.forEach(text => {
        text.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.15)';
        });

        text.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.1)';
        });
    });

    // Keyboard navigation improvements
    document.addEventListener('keydown', function(e) {
        // Allow keyboard navigation for timeline items
        if (e.key === 'Tab') {
            const focusedElement = document.activeElement;
            if (focusedElement.classList.contains('timeline-link')) {
                focusedElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }
    });

    // Progressive enhancement for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        // Disable animations for users who prefer reduced motion
        const style = document.createElement('style');
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Add error handling for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            console.warn(`Failed to load image: ${this.src}`);
            this.style.display = 'none';
        });

        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });
    });

    // Add loading animation for the map
    const mapContainer = document.querySelector('.map-container iframe');
    if (mapContainer) {
        mapContainer.addEventListener('load', function() {
            this.style.opacity = '1';
        });
    }

    console.log('A Sunday in Washington D.C. - Site initialized successfully!');
});

// Additional utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(() => {
    // Additional scroll-based animations can be added here
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);
