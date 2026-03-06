document.addEventListener('DOMContentLoaded', () => {

    // ========== STICKY NAV ==========
    const nav = document.getElementById('nav');
    const hero = document.getElementById('hero');

    const navObserver = new IntersectionObserver(
        ([entry]) => {
            nav.classList.toggle('scrolled', !entry.isIntersecting);
        },
        { threshold: 0.1 }
    );
    navObserver.observe(hero);

    // ========== HAMBURGER MENU ==========
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });

    // ========== SCROLL ANIMATIONS ==========
    const fadeElements = document.querySelectorAll('.fade-in');

    const fadeObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    // Stagger animation for siblings
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, i * 100);
                    fadeObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    fadeElements.forEach(el => fadeObserver.observe(el));

    // ========== TESTIMONIAL CAROUSEL ==========
    const track = document.getElementById('testimonialTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('testimonialDots');
    const cards = track.querySelectorAll('.testimonial-card');
    let currentSlide = 0;
    let visibleCards = getVisibleCards();
    let maxSlide = Math.max(0, cards.length - visibleCards);

    function getVisibleCards() {
        const width = window.innerWidth;
        if (width <= 600) return 1;
        if (width <= 900) return 2;
        return 3;
    }

    function createDots() {
        dotsContainer.innerHTML = '';
        const totalDots = maxSlide + 1;
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('span');
            dot.className = 'dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    function updateDots() {
        dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    function goToSlide(n) {
        currentSlide = Math.max(0, Math.min(n, maxSlide));
        const cardWidth = cards[0].offsetWidth + 28; // card + gap
        track.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
        updateDots();
    }

    prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

    // Auto-scroll testimonials
    let autoScroll = setInterval(() => {
        if (currentSlide >= maxSlide) {
            goToSlide(0);
        } else {
            goToSlide(currentSlide + 1);
        }
    }, 5000);

    // Pause auto-scroll on hover
    track.addEventListener('mouseenter', () => clearInterval(autoScroll));
    track.addEventListener('mouseleave', () => {
        autoScroll = setInterval(() => {
            if (currentSlide >= maxSlide) goToSlide(0);
            else goToSlide(currentSlide + 1);
        }, 5000);
    });

    // Recalculate on resize
    window.addEventListener('resize', () => {
        visibleCards = getVisibleCards();
        maxSlide = Math.max(0, cards.length - visibleCards);
        createDots();
        goToSlide(Math.min(currentSlide, maxSlide));
    });

    createDots();

    // ========== FORM HANDLING ==========
    const form = document.getElementById('registrationForm');
    const formWrapper = document.getElementById('formWrapper');
    const successWrapper = document.getElementById('successWrapper');
    const formError = document.getElementById('formError');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Reset error
        formError.hidden = true;

        // Validate required fields
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const mobile = document.getElementById('mobile').value.trim();
        const termsChecked = document.getElementById('consent_terms').checked;

        if (!fullName || !email || !mobile || !termsChecked) {
            formError.hidden = false;
            formError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            formError.textContent = 'Please enter a valid email address.';
            formError.hidden = false;
            formError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        // Show loading state
        btnText.hidden = true;
        btnLoader.hidden = false;
        submitBtn.disabled = true;

        // Collect form data
        const formData = {
            fullName,
            email,
            mobile,
            consent_terms: termsChecked,
            consent_stl: document.getElementById('consent_stl').checked,
            consent_ab: document.getElementById('consent_ab').checked,
            timestamp: new Date().toISOString()
        };

        console.log('Registration submitted:', formData);

        // Simulate API call (replace with actual endpoint)
        setTimeout(() => {
            // Hide form, show success
            formWrapper.hidden = true;
            successWrapper.hidden = false;

            // Scroll to success view
            successWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // Animate success elements
            const successCard = successWrapper.querySelector('.success-card');
            successCard.classList.add('fade-in');
            requestAnimationFrame(() => {
                successCard.classList.add('visible');
            });
        }, 1200);
    });

    // ========== SMOOTH SCROLL FOR ANCHORS ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ========== UNMUTE PILL ==========
    const founderVideo = document.getElementById('founderVideo');
    const unmutePill   = document.getElementById('unmutePill');
    const pillText     = unmutePill && unmutePill.querySelector('.unmute-pill-text');

    if (founderVideo && unmutePill && pillText) {
        unmutePill.addEventListener('click', () => {
            founderVideo.muted = !founderVideo.muted;
            const isNowUnmuted = !founderVideo.muted;

            unmutePill.classList.toggle('is-unmuted', isNowUnmuted);
            pillText.textContent = isNowUnmuted ? 'Mute' : 'Tap to Unmute';
        });
    }

});
