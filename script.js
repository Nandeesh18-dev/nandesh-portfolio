/**
 * ==========================================================================
 * Software Engineer Portfolio - Interactive Logic & UI Controller
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileNav();
    initScrollSpy();
    initProjectFilters();
    initContactForm();
    initCopyEmail();
    initScrollAnimations();
});

/* --------------------------------------------------------------------------
   THEME TOGGLE (DARK / LIGHT MODE WITH LOCAL STORAGE PERSISTENCE)
   -------------------------------------------------------------------------- */
function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const rootElement = document.documentElement;

    // Determine starting theme: LocalStorage -> System Preference -> Default Dark
    const savedTheme = localStorage.getItem('portfolio-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        rootElement.setAttribute('data-theme', savedTheme);
    } else if (prefersDark) {
        rootElement.setAttribute('data-theme', 'dark');
    } else {
        rootElement.setAttribute('data-theme', 'dark');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = rootElement.getAttribute('data-theme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            rootElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('portfolio-theme', newTheme);
            
            showToast(newTheme === 'dark' ? 'Switched to Night Mode 🌙' : 'Switched to Light Mode ☀️');
        });
    }

    // Listen for OS theme preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('portfolio-theme')) {
            const systemTheme = e.matches ? 'dark' : 'light';
            rootElement.setAttribute('data-theme', systemTheme);
        }
    });
}

/* --------------------------------------------------------------------------
   MOBILE NAVIGATION MENU TOGGLE
   -------------------------------------------------------------------------- */
function initMobileNav() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!mobileToggle || !navMenu) return;

    mobileToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.contains('active');
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    function openMenu() {
        navMenu.classList.add('active');
        mobileToggle.classList.add('open');
        mobileToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        navMenu.classList.remove('active');
        mobileToggle.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    // Close menu when clicking any nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                closeMenu();
            }
        });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
}

/* --------------------------------------------------------------------------
   SCROLL SPY & ACTIVE NAVIGATION LINK HIGHLIGHTING
   -------------------------------------------------------------------------- */
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.getElementById('site-header');

    function updateActiveLink() {
        const scrollPosition = window.scrollY + 120; // Offset for header

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();
}

/* --------------------------------------------------------------------------
   PROJECT CATEGORY FILTERING
   -------------------------------------------------------------------------- */
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (!filterButtons.length || !projectCards.length) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active state on button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 20);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 200);
                }
            });
        });
    });
}

/* --------------------------------------------------------------------------
   CONTACT FORM VALIDATION & HANDLING
   -------------------------------------------------------------------------- */
function initContactForm() {
    const form = document.getElementById('portfolio-contact-form');
    if (!form) return;

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const submitBtn = document.getElementById('submit-btn');
    const feedbackEl = document.getElementById('form-feedback');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Clear previous states
        clearErrors();
        let isValid = true;

        // Name validation
        if (!nameInput.value.trim()) {
            showInputError(nameInput, 'Please provide your name.');
            isValid = false;
        }

        // Email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim() || !emailPattern.test(emailInput.value.trim())) {
            showInputError(emailInput, 'Please provide a valid email address.');
            isValid = false;
        }

        // Message validation
        if (!messageInput.value.trim() || messageInput.value.trim().length < 8) {
            showInputError(messageInput, 'Message should be at least 8 characters long.');
            isValid = false;
        }

        if (!isValid) return;

        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        // Simulate network API request
        await new Promise(resolve => setTimeout(resolve, 1100));

        // Restore button state
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;

        // Show success state
        feedbackEl.className = 'form-feedback success';
        feedbackEl.textContent = '🎉 Thank you! Your message has been sent successfully. I will get back to you shortly.';
        
        showToast('Message sent successfully! 🚀');

        // Reset form inputs
        form.reset();

        // Fade feedback out after 6 seconds
        setTimeout(() => {
            feedbackEl.className = 'form-feedback';
            feedbackEl.textContent = '';
        }, 6000);
    });

    function showInputError(input, message) {
        const group = input.closest('.form-group');
        if (group) {
            group.classList.add('has-error');
            const errorSpan = group.querySelector('.input-error');
            if (errorSpan) errorSpan.textContent = message;
        }
    }

    function clearErrors() {
        document.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('has-error');
        });
        feedbackEl.className = 'form-feedback';
        feedbackEl.textContent = '';
    }

    // Clear individual errors on input
    [nameInput, emailInput, messageInput].forEach(input => {
        if (input) {
            input.addEventListener('input', () => {
                const group = input.closest('.form-group');
                if (group) group.classList.remove('has-error');
            });
        }
    });
}

/* --------------------------------------------------------------------------
   COPY EMAIL TO CLIPBOARD
   -------------------------------------------------------------------------- */
function initCopyEmail() {
    const copyBtn = document.getElementById('copy-email-btn');
    const emailText = document.getElementById('email-text');

    if (!copyBtn || !emailText) return;

    copyBtn.addEventListener('click', async () => {
        const email = emailText.textContent.trim();
        try {
            await navigator.clipboard.writeText(email);
            showToast('Email copied to clipboard! 📋');
        } catch (err) {
            // Fallback for older browsers
            const tempInput = document.createElement('input');
            tempInput.value = email;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            showToast('Email copied to clipboard! 📋');
        }
    });
}

/* --------------------------------------------------------------------------
   TOAST NOTIFICATION COMPONENT
   -------------------------------------------------------------------------- */
function showToast(message) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <span class="toast-icon">✨</span>
        <span class="toast-message">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('toast-fadeout');
        setTimeout(() => toast.remove(), 350);
    }, 3200);
}

/* --------------------------------------------------------------------------
   SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
    const revealElements = document.querySelectorAll(
        '.feature-card, .skill-category-card, .timeline-card, .project-card, .service-card, .info-detail-item'
    );

    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        observer.observe(el);
    });
}
