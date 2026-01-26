// ========================================
// SILA - Premium Hair Salon
// JavaScript
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initNavigation();
    initScrollReveal();
    initSmoothScroll();
    initParallax();
});

// ========================================
// Navigation
// ========================================

function initNavigation() {
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll behavior
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add scrolled class
        if (currentScroll > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 200;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    });
}

// ========================================
// Scroll Reveal Animation
// ========================================

function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        '.section-header, .about-content, .about-image, .team-member, ' +
        '.gallery-item, .location-content, .location-map, .cta-content, ' +
        '.quote, .stylist-levels, .price-table-wrapper, .price-note'
    );

    revealElements.forEach(el => {
        el.classList.add('reveal');
    });

    const revealOnScroll = () => {
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < window.innerHeight - elementVisible) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check
}

// ========================================
// Smooth Scroll
// ========================================

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}


// ========================================
// Parallax Effect
// ========================================

function initParallax() {
    const parallaxElements = document.querySelectorAll('.hero-img, .quote-bg img');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        parallaxElements.forEach(el => {
            const parent = el.closest('section') || el.closest('.hero');
            if (!parent) return;

            const parentTop = parent.offsetTop;
            const parentHeight = parent.offsetHeight;

            // Only apply parallax when element is in view
            if (scrolled > parentTop - window.innerHeight &&
                scrolled < parentTop + parentHeight) {
                const speed = 0.3;
                const yPos = (scrolled - parentTop) * speed;
                el.style.transform = `translateY(${yPos}px) scale(1.1)`;
            }
        });
    });
}

// ========================================
// Gallery Lightbox (Optional Enhancement)
// ========================================

function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const src = img.src.replace('w=600', 'w=1200').replace('w=800', 'w=1200');

            // Create lightbox
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <img src="${src}" alt="Gallery image">
                    <button class="lightbox-close">&times;</button>
                </div>
            `;

            lightbox.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(10, 10, 10, 0.95);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                cursor: pointer;
                animation: fadeIn 0.3s ease;
            `;

            const content = lightbox.querySelector('.lightbox-content');
            content.style.cssText = `
                position: relative;
                max-width: 90%;
                max-height: 90%;
            `;

            const lightboxImg = lightbox.querySelector('img');
            lightboxImg.style.cssText = `
                max-width: 100%;
                max-height: 90vh;
                object-fit: contain;
            `;

            const closeBtn = lightbox.querySelector('.lightbox-close');
            closeBtn.style.cssText = `
                position: absolute;
                top: -2rem;
                right: 0;
                background: none;
                border: none;
                color: #C9A962;
                font-size: 2rem;
                cursor: pointer;
            `;

            document.body.appendChild(lightbox);
            document.body.style.overflow = 'hidden';

            // Close lightbox
            const closeLightbox = () => {
                lightbox.remove();
                document.body.style.overflow = 'auto';
            };

            lightbox.addEventListener('click', closeLightbox);
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                closeLightbox();
            });

            // Close on escape key
            document.addEventListener('keydown', function escHandler(e) {
                if (e.key === 'Escape') {
                    closeLightbox();
                    document.removeEventListener('keydown', escHandler);
                }
            });
        });
    });
}

// Initialize lightbox after DOM is ready
document.addEventListener('DOMContentLoaded', initGalleryLightbox);

// ========================================
// Cursor Effect (Optional Enhancement)
// ========================================

function initCustomCursor() {
    // Only for desktop
    if (window.innerWidth < 1024) return;

    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.innerHTML = '<div class="cursor-dot"></div><div class="cursor-ring"></div>';

    const style = document.createElement('style');
    style.textContent = `
        .custom-cursor {
            pointer-events: none;
            position: fixed;
            z-index: 99999;
        }
        .cursor-dot {
            position: absolute;
            width: 8px;
            height: 8px;
            background-color: #C9A962;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            transition: transform 0.1s ease;
        }
        .cursor-ring {
            position: absolute;
            width: 40px;
            height: 40px;
            border: 1px solid rgba(201, 169, 98, 0.5);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            transition: transform 0.2s ease, border-color 0.2s ease;
        }
        .custom-cursor.hover .cursor-ring {
            transform: translate(-50%, -50%) scale(1.5);
            border-color: #C9A962;
        }
        a, button {
            cursor: none;
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Hover effect on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .gallery-item, .service-card');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
}

// Uncomment to enable custom cursor
// document.addEventListener('DOMContentLoaded', initCustomCursor);
