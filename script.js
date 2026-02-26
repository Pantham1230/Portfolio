// ============================================
// PAGE LOADER
// ============================================
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('pageLoader').classList.add('loaded');
    }, 1600);
});

// ============================================
// CUSTOM CURSOR
// ============================================
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX - 3 + 'px';
    cursorDot.style.top = mouseY - 3 + 'px';
});

function animateCursorRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    cursorRing.style.left = ringX - 18 + 'px';
    cursorRing.style.top = ringY - 18 + 'px';
    requestAnimationFrame(animateCursorRing);
}
animateCursorRing();

document.querySelectorAll('a, button, .tilt-card, .skill-tag, .cert-badge, .magnetic').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
});

// ============================================
// BINARY RAIN
// ============================================
function createBinaryRain() {
    const container = document.getElementById('binaryRain');
    const columns = 15;

    for (let i = 0; i < columns; i++) {
        const col = document.createElement('div');
        col.className = 'binary-column';
        col.style.left = (Math.random() * 100) + '%';
        col.style.animationDuration = (15 + Math.random() * 25) + 's';
        col.style.animationDelay = (Math.random() * 10) + 's';

        let text = '';
        const length = 30 + Math.floor(Math.random() * 40);
        for (let j = 0; j < length; j++) {
            text += Math.random() > 0.5 ? '1' : '0';
        }
        col.textContent = text;
        container.appendChild(col);
    }
}
createBinaryRain();

// ============================================
// NEURAL NETWORK PARTICLE SYSTEM
// ============================================
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let canvasMouseX = -999, canvasMouseY = -999;

function resizeCanvas() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Neuron {
    constructor() { this.reset(); }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2.5 + 0.8;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.baseOpacity = Math.random() * 0.5 + 0.15;
        this.opacity = this.baseOpacity;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.01 + Math.random() * 0.02;

        const colors = [
            [192, 132, 252],  // purple
            [0, 229, 255],    // cyan
            [96, 165, 250],   // blue
            [110, 231, 183],  // green
            [244, 114, 182]   // pink
        ];
        this.rgb = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Pulse
        this.pulsePhase += this.pulseSpeed;
        this.opacity = this.baseOpacity + Math.sin(this.pulsePhase) * 0.1;

        // Mouse attraction
        const dx = this.x - canvasMouseX;
        const dy = this.y - canvasMouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
            const force = (150 - dist) / 150;
            this.x += (dx / dist) * force * 1.5;
            this.y += (dy / dist) * force * 1.5;
            this.opacity = Math.min(this.opacity + force * 0.3, 0.8);
        }

        if (this.x < -20 || this.x > canvas.width + 20 || this.y < -20 || this.y > canvas.height + 20) {
            this.reset();
        }
    }

    draw() {
        const [r, g, b] = this.rgb;
        // Glow
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.opacity * 0.15})`;
        ctx.fill();
        // Core
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.opacity})`;
        ctx.fill();
    }
}

const neuronCount = Math.min(90, Math.floor((canvas.width * canvas.height) / 12000));
for (let i = 0; i < neuronCount; i++) {
    particles.push(new Neuron());
}

canvas.parentElement.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    canvasMouseX = e.clientX - rect.left;
    canvasMouseY = e.clientY - rect.top;
});

function drawSynapses() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 160) {
                const opacity = (1 - dist / 160) * 0.12;
                const [r, g, b] = particles[i].rgb;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
                ctx.lineWidth = 0.6;
                ctx.stroke();
            }
        }
    }
}

function animateNeuralNetwork() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawSynapses();
    requestAnimationFrame(animateNeuralNetwork);
}
animateNeuralNetwork();

// ============================================
// TYPEWRITER EFFECT
// ============================================
function typeWriter(element, text, speed = 80, callback) {
    let i = 0;
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else if (callback) callback();
    }
    type();
}

const roles = [
    'AI-powered applications',
    'neural network models',
    'computer vision tools',
    'NLP solutions',
    'intelligent systems',
    'secure web platforms'
];

let roleIndex = 0;
const typedRole = document.getElementById('typedRole');

function typeRole() {
    const text = roles[roleIndex];
    let i = 0;
    function typeChar() {
        if (i < text.length) {
            typedRole.textContent += text.charAt(i);
            i++;
            setTimeout(typeChar, 55);
        } else { setTimeout(deleteRole, 2200); }
    }
    function deleteRole() {
        if (typedRole.textContent.length > 0) {
            typedRole.textContent = typedRole.textContent.slice(0, -1);
            setTimeout(deleteRole, 25);
        } else {
            roleIndex = (roleIndex + 1) % roles.length;
            setTimeout(typeRole, 400);
        }
    }
    typeChar();
}

setTimeout(() => {
    typeWriter(document.getElementById('typedGreeting'), 'Hello, I\'m', 100, () => {
        setTimeout(typeRole, 500);
    });
}, 1800);

// ============================================
// NAVBAR
// ============================================
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);

    const scrollPos = window.scrollY + 150;
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-links a[href="#${id}"]`);
        if (link) {
            link.classList.toggle('active', scrollPos >= top && scrollPos < top + height);
        }
    });
});

// Mobile menu
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => navLinks.classList.toggle('active'));
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('active'));
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

// ============================================
// SCROLL REVEAL
// ============================================
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const parent = entry.target.parentElement;
            const siblings = Array.from(parent.querySelectorAll('.reveal'));
            const index = siblings.indexOf(entry.target);
            setTimeout(() => entry.target.classList.add('visible'), index * 100);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ============================================
// COUNTER ANIMATION
// ============================================
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.target);
            const suffix = el.dataset.suffix || '';
            const duration = 1500;
            const start = performance.now();

            function updateCounter(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.floor(eased * target) + (progress >= 1 ? suffix : '');
                if (progress < 1) requestAnimationFrame(updateCounter);
            }
            requestAnimationFrame(updateCounter);
            counterObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));

// ============================================
// SKILL BAR ANIMATION
// ============================================
const skillBarObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bars = entry.target.querySelectorAll('.skill-bar-fill');
            bars.forEach((bar, i) => {
                setTimeout(() => {
                    bar.style.setProperty('--bar-width', bar.dataset.width + '%');
                    bar.classList.add('animated');
                }, i * 200);
            });
            skillBarObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-bars').forEach(el => skillBarObserver.observe(el));

// ============================================
// 3D TILT EFFECT
// ============================================
document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -6;
        const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 6;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

        const glow = card.querySelector('.card-glow');
        if (glow) { glow.style.left = x + 'px'; glow.style.top = y + 'px'; }
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        card.style.transition = 'transform 0.5s ease';
        setTimeout(() => { card.style.transition = ''; }, 500);
    });

    card.addEventListener('mouseenter', () => { card.style.transition = 'none'; });
});

// ============================================
// MAGNETIC BUTTON EFFECT
// ============================================
document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0, 0)';
        el.style.transition = 'transform 0.4s ease';
        setTimeout(() => { el.style.transition = ''; }, 400);
    });
    el.addEventListener('mouseenter', () => { el.style.transition = 'none'; });
});

// ============================================
// CHATBOT WIDGET
// ============================================
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotWindow = document.getElementById('chatbotWindow');
const chatbotClose = document.getElementById('chatbotClose');
const chatbotIcon = document.getElementById('chatbotIcon');

let chatOpen = false;

chatbotToggle.addEventListener('click', () => {
    chatOpen = !chatOpen;
    chatbotWindow.classList.toggle('open', chatOpen);
    chatbotIcon.innerHTML = chatOpen
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-robot"></i>';
});

chatbotClose.addEventListener('click', () => {
    chatOpen = false;
    chatbotWindow.classList.remove('open');
    chatbotIcon.innerHTML = '<i class="fas fa-robot"></i>';
});
