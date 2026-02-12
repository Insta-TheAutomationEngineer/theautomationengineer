/* ============================================
   TheAutomationEngineer — Interactive Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- Navbar scroll effect ---
    const nav = document.getElementById('nav');

    const handleNavScroll = () => {
        if (window.scrollY > 20) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleNavScroll, { passive: true });

    // --- Mobile menu toggle ---
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // --- Scroll reveal animations ---
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animation for sibling elements
                const siblings = entry.target.parentElement.querySelectorAll('.reveal');
                let delay = 0;
                siblings.forEach((sibling) => {
                    if (sibling === entry.target) return;
                });

                setTimeout(() => {
                    entry.target.classList.add('active');
                }, index * 80);

                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Animated counters ---
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');

    const animateCounter = (el) => {
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 2000;
        const startTime = performance.now();

        const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);
            const current = Math.round(easedProgress * target);

            el.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };

        requestAnimationFrame(update);
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'));
                const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Active nav link on scroll ---
    const sections = document.querySelectorAll('section[id]');

    const highlightNav = () => {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('nav-active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('nav-active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', highlightNav, { passive: true });

    // --- Parallax effect on hero background text ---
    const heroBgText = document.querySelector('.hero-bg-text');

    if (heroBgText) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            if (scrolled < window.innerHeight) {
                heroBgText.style.transform = `translate(-50%, calc(-50% + ${scrolled * 0.2}px))`;
                heroBgText.style.opacity = 1 - (scrolled / window.innerHeight) * 0.8;
            }
        }, { passive: true });
    }

    // --- Skill cards tilt effect on hover ---
    document.querySelectorAll('.skill-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `translateY(-4px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) perspective(1000px) rotateX(0) rotateY(0)';
        });
    });

    // --- Email Obfuscation (anti-spam bot) ---
    const emailParts = ['er.achalsingh', 'sisodiya', '@', 'gmail', '.com'];
    const fullEmail = emailParts[0] + emailParts[1] + emailParts[2] + emailParts[3] + emailParts[4];

    const emailLink = document.getElementById('emailLink');
    const emailText = document.getElementById('emailText');
    const footerEmail = document.getElementById('footerEmail');

    if (emailText) {
        emailText.textContent = fullEmail;
    }
    if (emailLink) {
        emailLink.href = 'mailto:' + fullEmail;
        emailLink.onclick = null;
    }
    if (footerEmail) {
        footerEmail.href = 'mailto:' + fullEmail;
    }

    // --- Disable right-click context menu ---
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });

    // --- Disable text selection on sensitive areas ---
    document.querySelectorAll('.contact-link-value, .hero-name, .stat-number').forEach(el => {
        el.style.userSelect = 'none';
        el.style.webkitUserSelect = 'none';
    });

    // --- Block common keyboard shortcuts (Ctrl+U, Ctrl+S, F12) ---
    document.addEventListener('keydown', (e) => {
        // Ctrl+U (view source)
        if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
        }
        // Ctrl+S (save page)
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
        }
        // F12 (dev tools)
        if (e.key === 'F12') {
            e.preventDefault();
        }
        // Ctrl+Shift+I (dev tools)
        if (e.ctrlKey && e.shiftKey && e.key === 'I') {
            e.preventDefault();
        }
        // Ctrl+Shift+J (console)
        if (e.ctrlKey && e.shiftKey && e.key === 'J') {
            e.preventDefault();
        }
    });

    // --- Console warning for snoopers ---
    console.log('%cStop!', 'color: #ff375f; font-size: 48px; font-weight: 900;');
    console.log('%cThis is a browser feature intended for developers. If someone told you to copy-paste something here, it is a scam.', 'color: #a1a1a6; font-size: 16px;');
    console.log('%cDesigned & Built by Achal Singh — TheAutomationEngineer', 'color: #2997ff; font-size: 14px;');

});
