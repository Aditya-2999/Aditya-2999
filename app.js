// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// DOM Elements
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const themeToggle = document.getElementById('theme-toggle');
const scrollProgress = document.querySelector('.scroll-progress__bar');

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeTheme();
    initializeTypewriter();
    initializeCounters();
    initializeScrollAnimations();
    initializeProgressBar();
    initializeMobileMenu();
    initializeSmoothScroll();
});

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav__link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed header
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                }
            }
        });
    });
}

// Theme toggle functionality
function initializeTheme() {
    // Check for saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
}

// Typewriter effect
function initializeTypewriter() {
    const nameElement = document.getElementById('typewriter-name');
    const titleElement = document.getElementById('typewriter-title');
    
    const nameText = "Aditya Kodali";
    const titleText = "Strategic Product Manager & Stakeholder Management Expert";
    
    function typeText(element, text, speed = 100, callback = null) {
        let i = 0;
        element.textContent = '';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else if (callback) {
                setTimeout(callback, 500);
            }
        }
        
        type();
    }
    
    // Start typewriter effect
    setTimeout(() => {
        typeText(nameElement, nameText, 80, () => {
            nameElement.classList.remove('typewriter');
            titleElement.classList.add('typewriter');
            typeText(titleElement, titleText, 60, () => {
                titleElement.classList.remove('typewriter');
            });
        });
    }, 1000);
}

// Counter animations
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-card__number');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.dataset.target);
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepValue = target / steps;
    const stepDuration = duration / steps;
    
    let current = 0;
    
    const timer = setInterval(() => {
        current += stepValue;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, stepDuration);
}

// GSAP Scroll Animations
function initializeScrollAnimations() {
    // Fade in sections
    gsap.utils.toArray('.about__card, .product-card, .timeline-card, .testimonial-card').forEach(element => {
        gsap.fromTo(element, {
            opacity: 0,
            y: 50
        }, {
            opacity: 1,
            y: 0,
            duration: 1,
            scrollTrigger: {
                trigger: element,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            }
        });
    });
    
    // Progress bars animation
    gsap.utils.toArray('.progress-bar__fill').forEach(bar => {
        const progress = bar.dataset.progress;
        gsap.fromTo(bar, {
            width: '0%'
        }, {
            width: `${progress}%`,
            duration: 1.5,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: bar,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });
    });
    
    // Timeline items animation
    gsap.utils.toArray('.timeline-item--left .timeline-card').forEach(card => {
        gsap.fromTo(card, {
            opacity: 0,
            x: -100
        }, {
            opacity: 1,
            x: 0,
            duration: 1,
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });
    });
    
    gsap.utils.toArray('.timeline-item--right .timeline-card').forEach(card => {
        gsap.fromTo(card, {
            opacity: 0,
            x: 100
        }, {
            opacity: 1,
            x: 0,
            duration: 1,
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });
    });
    
    // Product items hover effect enhancement
    gsap.utils.toArray('.product-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            gsap.to(item, {
                scale: 1.02,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        item.addEventListener('mouseleave', () => {
            gsap.to(item, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
    
    // Contact section fade in
    gsap.fromTo('.contact__content', {
        opacity: 0,
        y: 30
    }, {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
            trigger: '.contact__content',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });
}

// Progress bar for products overview
function initializeProgressBar() {
    const progressBar = document.querySelector('.scroll-progress__bar');
    const productsSection = document.querySelector('.products-overview');
    
    if (!progressBar || !productsSection) return;
    
    ScrollTrigger.create({
        trigger: productsSection,
        start: 'top center',
        end: 'bottom center',
        onUpdate: self => {
            const progress = self.progress * 100;
            progressBar.style.height = `${progress}%`;
        }
    });
}

// Mobile menu functionality
function initializeMobileMenu() {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Animate hamburger to X
        const isOpen = navMenu.classList.contains('active');
        navToggle.textContent = isOpen ? '✕' : '☰';
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.textContent = '☰';
        }
    });
    
    // Close menu on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            navToggle.textContent = '☰';
        }
    });
}

// Smooth scroll for all internal links
function initializeSmoothScroll() {
    const contactButtons = document.querySelectorAll('.nav__contact-btn, .contact__btn');
    
    contactButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            if (button.classList.contains('contact__btn')) return; // Let email button work normally
            
            e.preventDefault();
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                const offsetTop = contactSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Matrix cells pulse animation
document.addEventListener('DOMContentLoaded', function() {
    const matrixCells = document.querySelectorAll('.matrix-cell');
    
    matrixCells.forEach(cell => {
        cell.addEventListener('mouseenter', () => {
            cell.classList.add('pulse');
        });
        
        cell.addEventListener('mouseleave', () => {
            cell.classList.remove('pulse');
        });
    });
});

// Header background opacity on scroll
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    if (scrolled > 100) {
        header.style.backgroundColor = 'rgba(44, 62, 80, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.backgroundColor = 'rgba(44, 62, 80, 1)';
        header.style.backdropFilter = 'none';
    }
});

// Parallax effect for hero background
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const rate = scrolled * -0.5;
    
    if (hero) {
        hero.style.backgroundPosition = `center ${rate}px`;
    }
});

// Add loading animation
window.addEventListener('load', () => {
    // Add stagger animation to hero stats
    gsap.fromTo('.stat-card', {
        opacity: 0,
        y: 30,
        scale: 0.8
    }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: 'back.out(1.7)',
        delay: 3 // After typewriter completes
    });
});

// Intersection Observer for section highlighting in navigation
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav__link');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('id');
            
            // Remove active class from all nav links
            navLinks.forEach(link => link.classList.remove('active'));
            
            // Add active class to current section nav link
            const activeLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}, {
    threshold: 0.5,
    rootMargin: '-80px 0px -80px 0px'
});

sections.forEach(section => {
    sectionObserver.observe(section);
});

// Add CSS for active nav link if not already present
if (!document.querySelector('style[data-nav-active]')) {
    const style = document.createElement('style');
    style.setAttribute('data-nav-active', 'true');
    style.textContent = `
        .nav__link.active {
            background-color: rgba(255, 255, 255, 0.2);
            transform: scale(1.1);
        }
    `;
    document.head.appendChild(style);
}

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
const throttledScrollHandler = throttle(() => {
    // Header background opacity
    const header = document.getElementById('header');
    const scrolled = window.pageYOffset;
    
    if (scrolled > 100) {
        header.style.backgroundColor = 'rgba(44, 62, 80, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.backgroundColor = 'rgba(44, 62, 80, 1)';
        header.style.backdropFilter = 'none';
    }
    
    // Parallax effect
    const hero = document.querySelector('.hero');
    const rate = scrolled * -0.3;
    
    if (hero && scrolled < hero.offsetHeight) {
        hero.style.backgroundPosition = `center ${rate}px`;
    }
}, 16); // ~60fps

window.addEventListener('scroll', throttledScrollHandler);

// Error handling for GSAP
if (typeof gsap === 'undefined') {
    console.warn('GSAP not loaded, falling back to CSS animations');
    // Add fallback animations using CSS classes
    const fallbackStyle = document.createElement('style');
    fallbackStyle.textContent = `
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .fade-in-up {
            animation: fadeInUp 1s ease forwards;
        }
    `;
    document.head.appendChild(fallbackStyle);
    
    // Apply fallback classes
    const animatedElements = document.querySelectorAll('.about__card, .product-card, .timeline-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(el => observer.observe(el));
}

// Accessibility enhancements
document.addEventListener('keydown', (e) => {
    // Close mobile menu with Escape key
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.textContent = '☰';
        navToggle.focus();
    }
});

// Focus management for mobile menu
navToggle.addEventListener('click', () => {
    const isMenuOpen = navMenu.classList.contains('active');
    if (isMenuOpen) {
        // Focus first menu item when menu opens
        const firstLink = navMenu.querySelector('.nav__link');
        if (firstLink) {
            setTimeout(() => firstLink.focus(), 100);
        }
    }
});

// Add keyboard navigation for testimonial cards
document.querySelectorAll('.testimonial-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', 'Click or press Enter to flip card');
    
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            card.classList.toggle('flipped');
        }
    });
});

console.log('Portfolio application initialized successfully!');