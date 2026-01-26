// ========================================
// SILA - Premium Hair Salon
// JavaScript
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initCookieNotice();
    initLanguageSwitcher();
    initNavigation();
    initScrollReveal();
    initSmoothScroll();
    initServiceFilter();
    initFAQ();
    initParallax();
    initGalleryLightbox();
    initHeroVideo();
    initStylistModal();
});

// ========================================
// Hero Video Fallback
// ========================================

function initHeroVideo() {
    const video = document.getElementById('hero-video');
    if (!video) return;

    // Hide video and show fallback image if video fails to load
    video.addEventListener('error', () => {
        video.classList.add('hidden');
    });

    // Also check if video can play
    video.addEventListener('loadeddata', () => {
        video.play().catch(() => {
            video.classList.add('hidden');
        });
    });

    // Timeout fallback - if video doesn't load in 5 seconds, hide it
    setTimeout(() => {
        if (video.readyState < 2) {
            video.classList.add('hidden');
        }
    }, 5000);
}

// ========================================
// Cookie Notice
// ========================================

function initCookieNotice() {
    const cookieNotice = document.getElementById('cookie-notice');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (!cookieNotice) return;

    // Check if user already made a choice
    const cookieChoice = localStorage.getItem('sila-cookies');

    if (!cookieChoice) {
        setTimeout(() => {
            cookieNotice.classList.add('visible');
        }, 2000);
    } else {
        cookieNotice.classList.add('hidden');
    }

    acceptBtn?.addEventListener('click', () => {
        localStorage.setItem('sila-cookies', 'accepted');
        cookieNotice.classList.remove('visible');
        setTimeout(() => cookieNotice.classList.add('hidden'), 500);
    });

    declineBtn?.addEventListener('click', () => {
        localStorage.setItem('sila-cookies', 'declined');
        cookieNotice.classList.remove('visible');
        setTimeout(() => cookieNotice.classList.add('hidden'), 500);
    });
}

// ========================================
// Language Switcher
// ========================================

function initLanguageSwitcher() {
    const langBtns = document.querySelectorAll('.lang-btn');
    const savedLang = localStorage.getItem('sila-lang') || 'hu';

    // Set initial language
    setLanguage(savedLang);

    langBtns.forEach(btn => {
        if (btn.dataset.lang === savedLang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }

        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            langBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            setLanguage(lang);
            localStorage.setItem('sila-lang', lang);
        });
    });
}

function setLanguage(lang) {
    document.documentElement.lang = lang;

    // Update all elements with data-hu and data-en attributes
    const elements = document.querySelectorAll('[data-hu][data-en]');
    elements.forEach(el => {
        const text = el.dataset[lang];
        if (text) {
            if (el.tagName === 'INPUT' && el.placeholder) {
                el.placeholder = el.dataset[`placeholder${lang === 'hu' ? 'Hu' : 'En'}`] || text;
            } else {
                el.textContent = text;
            }
        }
    });

    // Update placeholders
    const inputs = document.querySelectorAll('[data-placeholder-hu][data-placeholder-en]');
    inputs.forEach(input => {
        input.placeholder = input.dataset[`placeholder${lang.charAt(0).toUpperCase() + lang.slice(1)}`];
    });
}

// ========================================
// Navigation
// ========================================

function initNavigation() {
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll behavior
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    navToggle?.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle?.classList.remove('active');
            navMenu?.classList.remove('active');
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
        '.first-visit-step, .product-card, .blog-card, ' +
        '.gallery-item, .location-content, .location-map, .cta-content, ' +
        '.quote, .stylist-levels, .price-table-wrapper, .price-note, ' +
        '.review-card, .faq-list, .gift-card-content, ' +
        '.instagram-feed'
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
    revealOnScroll();
}

// ========================================
// Smooth Scroll
// ========================================

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;

            e.preventDefault();
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
// Service Filter
// ========================================

function initServiceFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const tableRows = document.querySelectorAll('.price-table tbody tr');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;

            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter rows
            tableRows.forEach(row => {
                const category = row.dataset.category;

                if (filter === 'all' || category === filter) {
                    row.classList.remove('hidden');
                } else {
                    row.classList.add('hidden');
                }
            });
        });
    });
}

// ========================================
// FAQ Accordion
// ========================================

function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question?.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all items
            faqItems.forEach(i => i.classList.remove('active'));

            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// ========================================
// Before/After Slider
// ========================================

// ========================================
// Stylist Modal
// ========================================

function initStylistModal() {
    const teamMembers = document.querySelectorAll('.team-member[data-stylist]');
    const modal = document.getElementById('stylist-modal');
    const modalBody = document.getElementById('stylist-modal-body');
    const modalClose = document.getElementById('stylist-modal-close');
    const stylistDataEl = document.getElementById('stylist-data');

    if (!modal || !stylistDataEl) return;

    let stylistData;
    try {
        stylistData = JSON.parse(stylistDataEl.textContent);
    } catch (e) {
        console.error('Failed to parse stylist data');
        return;
    }

    const currentLang = localStorage.getItem('sila-lang') || 'hu';

    const openModal = (stylistId) => {
        const stylist = stylistData[stylistId];
        if (!stylist) return;

        const lang = localStorage.getItem('sila-lang') || 'hu';

        modalBody.innerHTML = `
            <div class="stylist-modal-image">
                <img src="${stylist.image}" alt="${stylist.name}">
            </div>
            <div class="stylist-modal-info">
                <span class="stylist-modal-level">${stylist.level}</span>
                <h2 class="stylist-modal-name">${stylist.name}</h2>
                <p class="stylist-modal-exp">${stylist.experience[lang]}</p>
                <p class="stylist-modal-bio">${stylist.bio[lang]}</p>
                <p class="stylist-modal-quote">${stylist.philosophy[lang]}</p>
                <div class="stylist-modal-section">
                    <h3 class="stylist-modal-section-title">${lang === 'hu' ? 'Specialitások' : 'Specialties'}</h3>
                    <div class="stylist-modal-tags">
                        ${stylist.specialties[lang].map(s => `<span class="stylist-modal-tag">${s}</span>`).join('')}
                    </div>
                </div>
                <div class="stylist-modal-section">
                    <h3 class="stylist-modal-section-title">${lang === 'hu' ? 'Képzések & Tanúsítványok' : 'Training & Certifications'}</h3>
                    <div class="stylist-modal-tags">
                        ${stylist.certifications[lang].map(c => `<span class="stylist-modal-tag">${c}</span>`).join('')}
                    </div>
                </div>
                <a href="https://sila.salonic.hu" target="_blank" rel="noopener" class="btn btn-primary stylist-modal-book">
                    ${lang === 'hu' ? 'Foglalj hozzá' : 'Book with her'}
                </a>
            </div>
        `;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    teamMembers.forEach(member => {
        member.style.cursor = 'pointer';
        member.addEventListener('click', () => {
            const stylistId = member.dataset.stylist;
            openModal(stylistId);
        });
    });

    modalClose?.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// ========================================
// Parallax Effect
// ========================================

function initParallax() {
    const parallaxElements = document.querySelectorAll('.hero-video, .hero-img, .quote-bg img');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        parallaxElements.forEach(el => {
            const parent = el.closest('section') || el.closest('.hero');
            if (!parent) return;

            const parentTop = parent.offsetTop;
            const parentHeight = parent.offsetHeight;

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
// Gallery Lightbox
// ========================================

function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const src = img.src.replace('w=600', 'w=1200').replace('w=800', 'w=1200');

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

            const closeLightbox = () => {
                lightbox.remove();
                document.body.style.overflow = 'auto';
            };

            lightbox.addEventListener('click', closeLightbox);
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                closeLightbox();
            });

            document.addEventListener('keydown', function escHandler(e) {
                if (e.key === 'Escape') {
                    closeLightbox();
                    document.removeEventListener('keydown', escHandler);
                }
            });
        });
    });
}
