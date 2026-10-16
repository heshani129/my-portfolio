// ===== Mobile menu =====
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', nav.classList.contains('open'));
        const icon = menuToggle.querySelector('i');
        if (icon) icon.className = nav.classList.contains('open') ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    });
}

// Close menu when a link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (!nav || !menuToggle) return;
        nav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        const icon = menuToggle.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
    });
});

// ===== Header shadow, active link, back-to-top =====
const header = document.getElementById('header');
const toTop = document.getElementById('toTop');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 20);
    if (toTop) toTop.classList.toggle('show', window.scrollY > 500);

    let current = 'home';
    sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
    });
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
});

if (toTop) {
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Show initials when the local profile image is unavailable.
document.querySelectorAll('img[data-fallback]').forEach(image => {
    const showFallback = () => image.parentElement.classList.add('image-missing');
    image.addEventListener('error', showFallback, { once: true });
    if (image.complete && image.naturalWidth === 0) showFallback();
});

// ===== Scroll reveal =====
const revealTargets = document.querySelectorAll(
    '.card, .tech-item, .about-grid > *, .contact-grid > *, .hero-text'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

revealTargets.forEach(el => observer.observe(el));

// ===== Contact form =====
// Option 1 (easy): sign up free at https://formspree.io, create a form,
// and paste your endpoint below (e.g. https://formspree.io/f/xxxxxxx).
// Leave empty to fall back to opening the visitor's email app.
const FORM_ENDPOINT = '';
const YOUR_EMAIL = 'you@example.com';

const form = document.getElementById('contactForm');
const statusEl = document.getElementById('formStatus');

if (form) form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);

    if (FORM_ENDPOINT) {
        try {
            const res = await fetch(FORM_ENDPOINT, {
                method: 'POST',
                body: data,
                headers: { Accept: 'application/json' }
            });
            if (res.ok) {
                if (statusEl) {
                    statusEl.style.color = '#2dd4bf';
                    statusEl.textContent = 'Message sent! I will get back to you soon.';
                }
                form.reset();
            } else throw new Error();
        } catch {
            if (statusEl) {
                statusEl.style.color = '#f87171';
                statusEl.textContent = 'Something went wrong. Please try again.';
            }
        }
    } else {
        const subject = encodeURIComponent('Portfolio enquiry from ' + data.get('name'));
        const body = encodeURIComponent(data.get('message') + '\n\nFrom: ' + data.get('name') + ' (' + data.get('email') + ')');
        window.location.href = `mailto:${YOUR_EMAIL}?subject=${subject}&body=${body}`;
    }
});

// Contact-section particles
const particleCanvas = document.getElementById('contactParticles');
const contactSection = document.getElementById('contact');

if (particleCanvas && contactSection) {
    const context = particleCanvas.getContext('2d');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const particles = [];
    let canvasWidth = 0;
    let canvasHeight = 0;
    let animationFrame;

    const resizeParticleCanvas = () => {
        const bounds = contactSection.getBoundingClientRect();
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        canvasWidth = bounds.width;
        canvasHeight = bounds.height;
        particleCanvas.width = Math.round(canvasWidth * pixelRatio);
        particleCanvas.height = Math.round(canvasHeight * pixelRatio);
        particleCanvas.style.width = `${canvasWidth}px`;
        particleCanvas.style.height = `${canvasHeight}px`;
        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

        const particleCount = Math.max(45, Math.floor((canvasWidth * canvasHeight) / 11000));
        particles.length = 0;
        for (let index = 0; index < particleCount; index += 1) {
            const square = Math.random() < 0.08;
            particles.push({
                x: Math.random() * canvasWidth,
                y: Math.random() * canvasHeight,
                size: square ? 2 + Math.random() * 2 : .5 + Math.random() * 1.5,
                speedX: (Math.random() - .5) * .18,
                speedY: (Math.random() - .5) * .18,
                alpha: .18 + Math.random() * .52,
                square
            });
        }
        drawParticles();
    };

    const drawParticles = () => {
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        particles.forEach(particle => {
            context.globalAlpha = particle.alpha;
            context.fillStyle = particle.square || Math.random() < .45 ? '#22d3ee' : '#e2faff';
            if (particle.square) {
                context.fillRect(particle.x, particle.y, particle.size, particle.size);
            } else {
                context.beginPath();
                context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                context.fill();
            }

            if (!reducedMotion) {
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                if (particle.x < 0) particle.x = canvasWidth;
                if (particle.x > canvasWidth) particle.x = 0;
                if (particle.y < 0) particle.y = canvasHeight;
                if (particle.y > canvasHeight) particle.y = 0;
            }
        });
        context.globalAlpha = 1;
    };

    if (context) {
        resizeParticleCanvas();
        window.addEventListener('resize', resizeParticleCanvas);

        if (!reducedMotion) {
            const animateParticles = () => {
                drawParticles();
                animationFrame = window.requestAnimationFrame(animateParticles);
            };
            animationFrame = window.requestAnimationFrame(animateParticles);
        }

        window.addEventListener('beforeunload', () => {
            if (animationFrame) window.cancelAnimationFrame(animationFrame);
        }, { once: true });
    }
}

// ===== Footer year =====
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();