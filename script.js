document.addEventListener('DOMContentLoaded', function() {
    // Loading animation
    const loader = document.getElementById('loader-wrapper');
    window.addEventListener('load', () => {
        loader.classList.add('loader-hidden');
        setTimeout(() => {
            loader.remove();
        }, 300);
    });

    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
        offset: 100
    });

    // Mobile Navigation
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Smart navigation hide/show on scroll
    let lastScroll = 0;
    let scrollTimeout;
    
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        
        scrollTimeout = setTimeout(() => {
            const nav = document.querySelector('.main-nav');
            const currentScroll = window.pageYOffset;
            
            if (currentScroll <= 0) {
                nav.style.transform = 'translateY(0)';
                return;
            }
            
            if (currentScroll > lastScroll && !navLinks.classList.contains('active')) {
                nav.style.transform = 'translateY(-100%)';
            } else {
                nav.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll;
        }, 100);
    });

    // Enhanced smooth scrolling with offset
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            const navHeight = document.querySelector('.main-nav').offsetHeight;
            
            if (target) {
                const targetPosition = target.offsetTop - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form handling with improved validation and feedback
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Disable submit button and show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            
            try {
                const formData = {
                    name: document.getElementById('name').value.trim(),
                    email: document.getElementById('email').value.trim(),
                    message: document.getElementById('message').value.trim()
                };

                // Validate email format
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(formData.email)) {
                    throw new Error('Please enter a valid email address');
                }

                if (!formData.name || !formData.email || !formData.message) {
                    throw new Error('Please fill in all fields');
                }

                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to send message');
                }

                const data = await response.json();
                
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'alert alert-success';
                successMessage.textContent = 'Message sent successfully! I will get back to you soon.';
                contactForm.insertBefore(successMessage, contactForm.firstChild);
                
                // Reset form
                contactForm.reset();
                
                // Remove success message after 5 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
            } catch (error) {
                console.error('Error:', error);
                
                // Show error message
                const errorMessage = document.createElement('div');
                errorMessage.className = 'alert alert-error';
                errorMessage.textContent = error.message || 'Error sending message. Please try again.';
                contactForm.insertBefore(errorMessage, contactForm.firstChild);
                
                // Remove error message after 5 seconds
                setTimeout(() => {
                    errorMessage.remove();
                }, 5000);
            } finally {
                // Re-enable submit button
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        });
    }

    // Add active class to skills on scroll
    const skillCategories = document.querySelectorAll('.skill-category');
    const observerOptions = {
        threshold: 0.5
    };

    const skillObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transform = 'translateY(0)';
                entry.target.style.opacity = '1';
            }
        });
    }, observerOptions);

    skillCategories.forEach(category => {
        category.style.transform = 'translateY(20px)';
        category.style.opacity = '0';
        category.style.transition = 'all 0.6s ease-out';
        skillObserver.observe(category);
    });

    // Education timeline animations
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.5
    });

    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });

    // Dynamic copyright year
    const yearSpan = document.querySelector('footer p');
    if (yearSpan) {
        yearSpan.textContent = `© ${new Date().getFullYear()} Elija Asola. All rights reserved.`;
    }
});

// Parallax effect for hero section
let ticking = false;
window.addEventListener('scroll', function() {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const hero = document.querySelector('.hero');
            if (hero) {
                const scrolled = window.pageYOffset;
                hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
            }
            ticking = false;
        });
        ticking = true;
    }
});