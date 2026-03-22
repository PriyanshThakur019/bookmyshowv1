// Hamburger Menu Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when a link is clicked
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', function() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Close menu when clicking outside
document.addEventListener('click', function(event) {
    const isClickInsideNav = navMenu.contains(event.target);
    const isClickOnHamburger = hamburger.contains(event.target);

    if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Smooth Scrolling
function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// FAQ Accordion
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
        const faqItem = this.parentElement;
        
        // Close other open FAQs
        document.querySelectorAll('.faq-item.active').forEach(item => {
            if (item !== faqItem) {
                item.classList.remove('active');
            }
        });

        // Toggle current FAQ
        faqItem.classList.toggle('active');
    });
});

// Contact Form Handling
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        // Don't prevent default - let Formspree handle the submission
        // e.preventDefault();

        // Get form values for validation only
        const name = contactForm.querySelector('input[name="name"]').value;
        const email = contactForm.querySelector('input[name="email"]').value;
        const phone = contactForm.querySelector('input[name="phone"]').value;
        const service = contactForm.querySelector('select[name="service"]').value;
        const message = contactForm.querySelector('textarea[name="message"]').value;

        // Validate form
        if (!name || !email || !phone || !service || !message) {
            e.preventDefault();
            alert('Please fill all fields');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            e.preventDefault();
            alert('Please enter a valid email');
            return;
        }

        // Phone validation (basic)
        const phoneRegex = /^[0-9\+\-\s\(\)]+$/;
        if (!phoneRegex.test(phone)) {
            e.preventDefault();
            alert('Please enter a valid phone number');
            return;
        }

        // Show submitting message
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Handle successful submission (Formspree will redirect or show success)
        // This will run after Formspree processes the form
        setTimeout(() => {
            if (!submitBtn.disabled) return; // Already handled
            submitBtn.textContent = 'Message Sent Successfully!';
            submitBtn.style.backgroundColor = '#10b981';
            contactForm.reset();

            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.backgroundColor = '';
                submitBtn.disabled = false;
            }, 3000);
        }, 2000);
    });
}

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
const sections = document.querySelectorAll('section');
sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Navbar scroll effect
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 100) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// Add scroll to top button
document.addEventListener('DOMContentLoaded', function() {
    // Create scroll to top button
    const scrollBtn = document.createElement('button');
    scrollBtn.id = 'scrollToTop';
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border: none;
        border-radius: 50%;
        background: linear-gradient(135deg, #1e3a8a 0%, #06b6d4 100%);
        color: white;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 999;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
        font-size: 1.2rem;
    `;

    document.body.appendChild(scrollBtn);

    // Show/hide scroll to top button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollBtn.style.display = 'flex';
        } else {
            scrollBtn.style.display = 'none';
        }
    });

    // Scroll to top function
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Hover effect for scroll button
    scrollBtn.addEventListener('mouseover', function() {
        scrollBtn.style.transform = 'translateY(-5px)';
        scrollBtn.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.3)';
    });

    scrollBtn.addEventListener('mouseout', function() {
        scrollBtn.style.transform = 'translateY(0)';
        scrollBtn.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
    });
});

// Initialize on page load
window.addEventListener('load', function() {
    document.body.style.opacity = '1';
});

// Add page load animation
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.3s ease';
window.addEventListener('DOMContentLoaded', function() {
    document.body.style.opacity = '1';
});
