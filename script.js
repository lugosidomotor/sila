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
    initEventTracking();
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
        // Enable analytics if accepted
        if (cookieChoice === 'accepted') {
            enableAnalytics();
        }
    }

    acceptBtn?.addEventListener('click', () => {
        localStorage.setItem('sila-cookies', 'accepted');
        cookieNotice.classList.remove('visible');
        setTimeout(() => cookieNotice.classList.add('hidden'), 500);
        enableAnalytics();
        trackEvent('cookie_consent', 'accept');
    });

    declineBtn?.addEventListener('click', () => {
        localStorage.setItem('sila-cookies', 'declined');
        cookieNotice.classList.remove('visible');
        setTimeout(() => cookieNotice.classList.add('hidden'), 500);
        disableAnalytics();
    });
}

// Enable Google Analytics tracking
function enableAnalytics() {
    if (typeof window['ga-disable-G-XXXXXXXXXX'] !== 'undefined') {
        window['ga-disable-G-XXXXXXXXXX'] = false;
    }
}

// Disable Google Analytics tracking
function disableAnalytics() {
    window['ga-disable-G-XXXXXXXXXX'] = true;
}

// Track custom events
function trackEvent(eventName, eventAction, eventLabel = null, eventValue = null) {
    if (typeof gtag === 'function' && localStorage.getItem('sila-cookies') === 'accepted') {
        gtag('event', eventAction, {
            'event_category': eventName,
            'event_label': eventLabel,
            'value': eventValue
        });
    }
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
    const heroImg = document.querySelector('.hero-img');
    const quoteImg = document.querySelector('.quote-bg img');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        // Hero parallax
        if (heroImg) {
            const heroSection = heroImg.closest('.hero');
            if (heroSection && scrolled < heroSection.offsetHeight) {
                const yPos = scrolled * 0.3;
                heroImg.style.transform = `translateY(${yPos}px) scale(1.1)`;
            }
        }

        // Quote parallax
        if (quoteImg) {
            const quoteSection = quoteImg.closest('.quote-section');
            if (quoteSection) {
                const sectionTop = quoteSection.offsetTop;
                const sectionHeight = quoteSection.offsetHeight;
                const viewportHeight = window.innerHeight;

                if (scrolled > sectionTop - viewportHeight &&
                    scrolled < sectionTop + sectionHeight) {
                    // Calculate progress through the section (0 to 1)
                    const progress = (scrolled - sectionTop + viewportHeight) / (sectionHeight + viewportHeight);
                    // Move image more (max 150px movement)
                    const yPos = (progress - 0.5) * 150;
                    quoteImg.style.transform = `translateY(${yPos}px)`;
                }
            }
        }
    });
}

// ========================================
// Gallery Lightbox
// ========================================

function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const images = Array.from(galleryItems).map(item => item.querySelector('img').src);
    let currentIndex = 0;

    const openLightbox = (index) => {
        currentIndex = index;
        const src = images[currentIndex];

        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <button class="lightbox-nav lightbox-prev">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="15 18 9 12 15 6"/>
                </svg>
            </button>
            <div class="lightbox-content">
                <img src="${src}" alt="Gallery image">
                <button class="lightbox-close">&times;</button>
            </div>
            <button class="lightbox-nav lightbox-next">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"/>
                </svg>
            </button>
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
            animation: fadeIn 0.3s ease;
        `;

        const content = lightbox.querySelector('.lightbox-content');
        content.style.cssText = `
            position: relative;
            max-width: 70%;
            max-height: 90%;
        `;

        const lightboxImg = lightbox.querySelector('img');
        lightboxImg.style.cssText = `
            max-width: 100%;
            max-height: 90vh;
            object-fit: contain;
            transition: opacity 0.3s ease;
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

        const navBtnStyle = `
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 50px;
            height: 50px;
            border: 1px solid #C9A962;
            background: rgba(13, 31, 24, 0.8);
            color: #C9A962;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 10001;
        `;

        const prevBtn = lightbox.querySelector('.lightbox-prev');
        prevBtn.style.cssText = navBtnStyle + 'left: 2rem;';

        const nextBtn = lightbox.querySelector('.lightbox-next');
        nextBtn.style.cssText = navBtnStyle + 'right: 2rem;';

        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';

        const updateImage = () => {
            lightboxImg.style.opacity = '0';
            setTimeout(() => {
                lightboxImg.src = images[currentIndex];
                lightboxImg.style.opacity = '1';
            }, 150);
        };

        const goToPrev = (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateImage();
        };

        const goToNext = (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % images.length;
            updateImage();
        };

        const closeLightbox = () => {
            lightbox.remove();
            document.body.style.overflow = 'auto';
        };

        prevBtn.addEventListener('click', goToPrev);
        nextBtn.addEventListener('click', goToNext);
        content.addEventListener('click', (e) => e.stopPropagation());
        lightbox.addEventListener('click', closeLightbox);
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeLightbox();
        });

        const keyHandler = (e) => {
            if (e.key === 'Escape') {
                closeLightbox();
                document.removeEventListener('keydown', keyHandler);
            } else if (e.key === 'ArrowLeft') {
                goToPrev(e);
            } else if (e.key === 'ArrowRight') {
                goToNext(e);
            }
        };
        document.addEventListener('keydown', keyHandler);
    };

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });
}

// ========================================
// Event Tracking (Google Analytics)
// ========================================

function initEventTracking() {
    // Track CTA button clicks
    document.querySelectorAll('.btn-primary, .nav-link-cta').forEach(btn => {
        btn.addEventListener('click', () => {
            const label = btn.textContent.trim() || btn.getAttribute('aria-label');
            trackEvent('cta_click', 'click', label);
        });
    });

    // Track phone calls
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', () => {
            trackEvent('phone_call', 'click', link.href);
        });
    });

    // Track email clicks
    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
        link.addEventListener('click', () => {
            trackEvent('email_click', 'click', link.href);
        });
    });

    // Track outbound links
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
        link.addEventListener('click', () => {
            trackEvent('outbound_link', 'click', link.href);
        });
    });

    // Track navigation clicks
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            const section = link.getAttribute('href');
            trackEvent('navigation', 'click', section);
        });
    });

    // Track language switch
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            trackEvent('language_switch', 'click', btn.dataset.lang);
        });
    });

    // Track scroll depth
    let scrollMarks = [25, 50, 75, 100];
    let scrollTracked = [];

    window.addEventListener('scroll', () => {
        const scrollPercent = Math.round(
            (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );

        scrollMarks.forEach(mark => {
            if (scrollPercent >= mark && !scrollTracked.includes(mark)) {
                scrollTracked.push(mark);
                trackEvent('scroll_depth', 'scroll', `${mark}%`);
            }
        });
    });
}
