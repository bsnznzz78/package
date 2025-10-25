// Main JavaScript for RBC Counselling Website

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    initMobileMenu();
    
    // Countdown Timer
    initCountdownTimer();
    
    // Testimonials Carousel
    initTestimonialsCarousel();
    
    // FAQ Accordion
    initFAQAccordion();
    
    // Smooth Scrolling
    initSmoothScrolling();
    
    // Animated Counters
    initAnimatedCounters();
    
    // Form Handling
    initFormHandling();
});

// ===========================
// Mobile Menu
// ===========================
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Animate hamburger icon
            const spans = this.querySelectorAll('span');
            spans.forEach(span => span.classList.toggle('active'));
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
            }
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
            });
        });
    }
}

// ===========================
// Countdown Timer
// ===========================
function initCountdownTimer() {
    const timerElement = document.getElementById('countdown-timer');
    
    if (timerElement) {
        // Set countdown end date (7 days from now)
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 7);
        
        function updateCountdown() {
            const now = new Date().getTime();
            const distance = endDate - now;
            
            if (distance < 0) {
                timerElement.textContent = "Offer Ended";
                return;
            }
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            timerElement.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }
        
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
}

// ===========================
// Testimonials Carousel
// ===========================
function initTestimonialsCarousel() {
    const track = document.querySelector('.testimonials-track');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    if (!track) return;
    
    const testimonials = track.querySelectorAll('.testimonial-card');
    let currentIndex = 0;
    
    // Create dots
    if (dotsContainer) {
        testimonials.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToTestimonial(index));
            dotsContainer.appendChild(dot);
        });
    }
    
    function goToTestimonial(index) {
        testimonials[currentIndex].classList.remove('active');
        currentIndex = index;
        testimonials[currentIndex].classList.add('active');
        
        // Update dots
        if (dotsContainer) {
            const dots = dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach(dot => dot.classList.remove('active'));
            dots[currentIndex].classList.add('active');
        }
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            const prevIndex = currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1;
            goToTestimonial(prevIndex);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            const nextIndex = currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1;
            goToTestimonial(nextIndex);
        });
    }
    
    // Auto-advance every 5 seconds
    setInterval(function() {
        const nextIndex = currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1;
        goToTestimonial(nextIndex);
    }, 5000);
}

// ===========================
// FAQ Accordion
// ===========================
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });
                
                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });
    
    // FAQ Category Switching
    const faqCategories = document.querySelectorAll('.faq-category');
    const faqSections = document.querySelectorAll('.faq-category-section');
    
    faqCategories.forEach(category => {
        category.addEventListener('click', function() {
            const targetCategory = this.getAttribute('data-category');
            
            // Update active category button
            faqCategories.forEach(cat => cat.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding section
            faqSections.forEach(section => {
                section.classList.remove('active');
                if (section.getAttribute('data-category') === targetCategory) {
                    section.classList.add('active');
                }
            });
        });
    });
}

// ===========================
// Smooth Scrolling
// ===========================
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip empty anchors
            if (href === '#' || href === '#!') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const offsetTop = target.offsetTop - 80; // Account for sticky navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===========================
// Animated Counters
// ===========================
function initAnimatedCounters() {
    const counters = document.querySelectorAll('.metric-number');
    
    if (counters.length === 0) return;
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseFloat(counter.getAttribute('data-target'));
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60fps
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    
                    if (current < target) {
                        // Format number based on target
                        if (target > 100) {
                            counter.textContent = Math.floor(current);
                        } else {
                            counter.textContent = current.toFixed(1);
                        }
                        requestAnimationFrame(updateCounter);
                    } else {
                        // Final value
                        if (target % 1 === 0) {
                            counter.textContent = Math.floor(target);
                        } else {
                            counter.textContent = target.toFixed(1);
                        }
                    }
                };
                
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

// ===========================
// Form Handling
// ===========================
function initFormHandling() {
    // Appointment Form
    const appointmentForm = document.getElementById('appointment-form');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            console.log('Appointment Form Data:', data);
            
            // Show success message
            alert('Thank you for booking an appointment! We will confirm your appointment via phone within 2 hours.');
            
            // Reset form
            this.reset();
        });
        
        // Set minimum date to today
        const dateInput = document.getElementById('appt-date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }
    }
    
    // General Contact Form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            console.log('Contact Form Data:', data);
            
            // Show success message
            alert('Thank you for contacting us! We will respond to your inquiry within 24 hours.');
            
            // Reset form
            this.reset();
        });
    }
    
    // Form validation
    const forms = document.querySelectorAll('.contact-form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        
        inputs.forEach(input => {
            input.addEventListener('invalid', function() {
                this.classList.add('error');
            });
            
            input.addEventListener('input', function() {
                if (this.validity.valid) {
                    this.classList.remove('error');
                }
            });
        });
    });
}

// ===========================
// Package URL Parameter Handler
// ===========================
(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const packageParam = urlParams.get('package');
    
    if (packageParam) {
        // Scroll to appointment section if on contact page
        const appointmentSection = document.getElementById('appointment');
        if (appointmentSection) {
            setTimeout(() => {
                appointmentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }
})();

// ===========================
// Utility Functions
// ===========================

// Debounce function for performance
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

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}
