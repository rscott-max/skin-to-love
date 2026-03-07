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
        const payload = {
            full_name: fullName,
            email: email,
            mobile: mobile,
            consent_terms: termsChecked,
            consent_stl: document.getElementById('consent_stl').checked,
            consent_ab: document.getElementById('consent_ab').checked
        };

        // ---- Supabase REST insert ----
        const SUPABASE_URL = 'https://basaskslxsmyvoqreekj.supabase.co';
        const SUPABASE_ANON_KEY = 'sb_publishable_Y9C5tCWI2_7A8-ymgNLBPg_27a5nsI_';

        fetch(`${SUPABASE_URL}/rest/v1/registrations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify(payload)
        })
            .then(async response => {
                if (!response.ok) {
                    const err = await response.json().catch(() => ({}));
                    throw new Error(err.message || 'Error submitting registration');
                }

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
            })
            .catch(err => {
                console.error('Submission error:', err);

                // Reset button state
                btnText.hidden = false;
                btnLoader.hidden = true;
                submitBtn.disabled = false;

                // Show user-friendly error
                formError.textContent = 'Something went wrong submitting your registration. Please try again.';
                formError.hidden = false;
                formError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
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
    const unmutePill = document.getElementById('unmutePill');
    const pillText = unmutePill && unmutePill.querySelector('.unmute-pill-text');

    if (founderVideo && unmutePill && pillText) {
        unmutePill.addEventListener('click', () => {
            founderVideo.muted = !founderVideo.muted;
            const isNowUnmuted = !founderVideo.muted;

            unmutePill.classList.toggle('is-unmuted', isNowUnmuted);
            pillText.textContent = isNowUnmuted ? 'Mute' : 'Tap to Unmute';
        });
    }

});
