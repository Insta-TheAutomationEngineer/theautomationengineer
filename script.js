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

    // --- Email Obfuscation done above ---

    // =============================================
    //  SECURITY LAYER — Anti-Inspect & Protection
    // =============================================

    // 1. Disable right-click context menu
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
    });

    // 2. Disable text selection globally
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.msUserSelect = 'none';
    document.body.style.MozUserSelect = 'none';

    // 3. Disable drag
    document.addEventListener('dragstart', (e) => {
        e.preventDefault();
        return false;
    });

    // 4. Disable copy/cut/paste
    document.addEventListener('copy', (e) => e.preventDefault());
    document.addEventListener('cut', (e) => e.preventDefault());

    // 5. Block ALL keyboard shortcuts for inspect/devtools/source
    document.addEventListener('keydown', (e) => {
        // F12 — DevTools
        if (e.keyCode === 123) {
            e.preventDefault();
            return false;
        }
        // Ctrl+Shift+I — Inspect Element
        if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
            e.preventDefault();
            return false;
        }
        // Ctrl+Shift+J — Console
        if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
            e.preventDefault();
            return false;
        }
        // Ctrl+Shift+C — Inspect Element (alternate)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
            e.preventDefault();
            return false;
        }
        // Ctrl+U — View Source
        if (e.ctrlKey && e.keyCode === 85) {
            e.preventDefault();
            return false;
        }
        // Ctrl+S — Save Page
        if (e.ctrlKey && e.keyCode === 83) {
            e.preventDefault();
            return false;
        }
        // Ctrl+P — Print
        if (e.ctrlKey && e.keyCode === 80) {
            e.preventDefault();
            return false;
        }
        // Ctrl+A — Select All
        if (e.ctrlKey && e.keyCode === 65) {
            e.preventDefault();
            return false;
        }
        // Ctrl+C — Copy
        if (e.ctrlKey && e.keyCode === 67 && !e.shiftKey) {
            e.preventDefault();
            return false;
        }
        // Ctrl+Shift+K — Firefox Console
        if (e.ctrlKey && e.shiftKey && e.keyCode === 75) {
            e.preventDefault();
            return false;
        }
        // Ctrl+Shift+M — Responsive Design Mode
        if (e.ctrlKey && e.shiftKey && e.keyCode === 77) {
            e.preventDefault();
            return false;
        }
        // F5 / Ctrl+R — Refresh (optional, uncomment if needed)
        // Ctrl+G / Ctrl+F — Find
        if (e.ctrlKey && (e.keyCode === 70 || e.keyCode === 71)) {
            e.preventDefault();
            return false;
        }
    });

    // 6. DevTools detection via debugger + redirect
    (function detectDevTools() {
        const threshold = 160;
        const check = () => {
            const widthDiff = window.outerWidth - window.innerWidth > threshold;
            const heightDiff = window.outerHeight - window.innerHeight > threshold;
            if (widthDiff || heightDiff) {
                document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#000;color:#ff375f;font-family:Inter,sans-serif;text-align:center;padding:20px;"><div><h1 style="font-size:3rem;margin-bottom:16px;">Access Denied</h1><p style="color:#a1a1a6;font-size:1.1rem;">Developer tools are not allowed on this website.</p><p style="color:#6e6e73;margin-top:12px;">Close DevTools and refresh the page.</p></div></div>';
            }
        };
        setInterval(check, 1000);
    })();

    // 7. Debugger trap — freezes if devtools is open
    (function debuggerTrap() {
        setInterval(() => {
            const before = performance.now();
            debugger;
            const after = performance.now();
            if (after - before > 100) {
                document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#000;color:#ff375f;font-family:Inter,sans-serif;text-align:center;padding:20px;"><div><h1 style="font-size:3rem;margin-bottom:16px;">Access Denied</h1><p style="color:#a1a1a6;font-size:1.1rem;">Inspecting this website is not permitted.</p><p style="color:#6e6e73;margin-top:12px;">Close DevTools and refresh the page.</p></div></div>';
            }
        }, 3000);
    })();

    // 8. Disable image dragging
    document.querySelectorAll('img, svg').forEach(el => {
        el.setAttribute('draggable', 'false');
        el.addEventListener('dragstart', (e) => e.preventDefault());
    });

    // 9. Console warning
    console.log('%cStop!', 'color: #ff375f; font-size: 48px; font-weight: 900;');
    console.log('%cThis is a browser feature intended for developers. If someone told you to copy-paste something here, it is a scam.', 'color: #a1a1a6; font-size: 16px;');
    console.log('%cDesigned & Built by Achal Singh — TheAutomationEngineer', 'color: #2997ff; font-size: 14px;');

    // 10. Clear console repeatedly
    setInterval(() => {
        console.clear();
        console.log('%cStop!', 'color: #ff375f; font-size: 48px; font-weight: 900;');
        console.log('%cInspecting this website is not allowed.', 'color: #a1a1a6; font-size: 16px;');
    }, 2000);

    // 11. Detect Automation Tools (Selenium, Puppeteer, PhantomJS)
    (function detectBots() {
        const isBot = (
            navigator.webdriver ||
            window.__selenium_unwrapped ||
            window.__webdriver_evaluate ||
            window.__driver_evaluate ||
            window.__webdriver_unwrapped ||
            window.__fxdriver_unwrapped ||
            window._phantom ||
            window.callPhantom ||
            window.__nightmare ||
            navigator.languages === '' ||
            navigator.languages.length === 0
        );
        if (isBot) {
            document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#000;color:#ff375f;font-family:Inter,sans-serif;text-align:center;padding:20px;"><div><h1 style="font-size:3rem;margin-bottom:16px;">Access Blocked</h1><p style="color:#a1a1a6;font-size:1.1rem;">Automated access is not permitted.</p></div></div>';
        }
    })();

    // 12. Disable Print via JavaScript
    window.addEventListener('beforeprint', (e) => {
        document.body.style.display = 'none';
    });
    window.addEventListener('afterprint', () => {
        document.body.style.display = '';
    });

    // 13. Disable Page Save (Ctrl+S fallback via beforeunload)
    window.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.keyCode === 83) {
            e.preventDefault();
            return false;
        }
    });

    // 14. Block iframe embedding (JS level)
    if (window.top !== window.self) {
        window.top.location = window.self.location;
    }

    // 15. Detect Print Screen key
    document.addEventListener('keyup', (e) => {
        // PrintScreen key
        if (e.keyCode === 44) {
            document.body.style.filter = 'blur(10px)';
            setTimeout(() => {
                document.body.style.filter = 'none';
            }, 1500);
        }
    });

    // 16. Disable View Source via blank page trick
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.keyCode === 85) {
            e.preventDefault();
            window.location.href = 'about:blank';
            return false;
        }
    });

    // 17. Monitor for DOM tampering
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                // Detect injected scripts
                if (node.tagName === 'SCRIPT' && !node.src.includes(window.location.hostname)) {
                    node.remove();
                }
                // Detect devtools extensions injecting elements
                if (node.id && (node.id.includes('devtools') || node.id.includes('inspector'))) {
                    node.remove();
                }
            });
        });
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // 18. Disable middle-click (open in new tab)
    document.addEventListener('auxclick', (e) => {
        if (e.button === 1) {
            e.preventDefault();
        }
    });

    // 19. Anti-debugging: override console methods
    const noop = () => {};
    setTimeout(() => {
        Object.defineProperty(window, 'console', {
            value: {
                log: noop,
                warn: noop,
                error: noop,
                info: noop,
                debug: noop,
                clear: noop,
                dir: noop,
                table: noop,
                trace: noop,
                assert: noop,
                count: noop,
                countReset: noop,
                group: noop,
                groupCollapsed: noop,
                groupEnd: noop,
                time: noop,
                timeLog: noop,
                timeEnd: noop,
            },
            writable: false,
            configurable: false,
        });
    }, 5000);

});
