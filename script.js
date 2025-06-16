document.addEventListener('DOMContentLoaded', () => {

    // --- Smooth scrolling for navigation links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Fade-in effect for sections on scroll ---
    const fadeInObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Optional: stop observing once visible
            }
        });
    }, {
        threshold: 0.1
    });

    // Add a class to elements you want to fade in
    document.querySelectorAll('section > .container').forEach(el => {
        el.classList.add('fade-in-section');
        fadeInObserver.observe(el);
    });

    // Add the required CSS for the fade-in effect to your style.css or a <style> tag
    // I've added it here for simplicity, but it's better in the CSS file.
    const style = document.createElement('style');
    style.innerHTML = `
        .fade-in-section {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .fade-in-section.is-visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
});
class ImageCarousel {
    constructor(element) {
        this.carousel = element;
        this.container = element.querySelector('.carousel-container');
        this.indicators = element.querySelectorAll('.indicator');
        this.images = JSON.parse(element.dataset.images);
        this.currentIndex = 0;
        this.autoSlideInterval = null;
        
        this.init();
    }
    
    init() {
        // Only start auto-slide if there are multiple images
        if (this.images.length > 1) {
            this.startAutoSlide();
            this.addEventListeners();
        }
    }
    
    startAutoSlide() {
        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
        }, 3000); // Change image every 3 seconds
    }
    
    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }
    
    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateCarousel();
    }
    
    goToSlide(index) {
        this.currentIndex = index;
        this.updateCarousel();
    }
    
    updateCarousel() {
        const translateX = -this.currentIndex * 100;
        this.container.style.transform = `translateX(${translateX}%)`;
        
        // Update indicators
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });
    }
    
    addEventListeners() {
        // Pause auto-slide on hover
        this.carousel.addEventListener('mouseenter', () => {
            this.stopAutoSlide();
        });
        
        // Resume auto-slide when mouse leaves
        this.carousel.addEventListener('mouseleave', () => {
            this.startAutoSlide();
        });
        
        // Add click listeners to indicators
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.goToSlide(index);
                this.stopAutoSlide();
                this.startAutoSlide(); // Restart auto-slide
            });
        });
    }
}

// Initialize all carousels when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const carousels = document.querySelectorAll('.image-carousel');
    carousels.forEach(carousel => {
        new ImageCarousel(carousel);
    });
});