// ===================================
// Script.js - Intranet CAS
// ===================================

// --- Carrusel Dinámico ---
let currentSlide = 0;

function moveCarousel(direction) {
    const track = document.getElementById('carouselTrack');
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');

    if (!track || slides.length === 0) return;

    currentSlide = (currentSlide + direction + slides.length) % slides.length;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;

    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function initCarousel() {
    const track = document.getElementById('carouselTrack');
    const dotsContainer = document.getElementById('carouselDots');
    const slides = document.querySelectorAll('.carousel-slide');

    if (!track || !dotsContainer || slides.length === 0) return;

    // Limpiar dots previos para evitar duplicados
    dotsContainer.innerHTML = '';

    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.onclick = () => {
            currentSlide = index;
            moveCarousel(0);
        };
        dotsContainer.appendChild(dot);
    });

    // Auto-play del carrusel cada 5s
    setInterval(() => moveCarousel(1), 5000);
}

// --- Inicialización General ---
document.addEventListener('DOMContentLoaded', () => {

    // Inicializar carrusel si existe en la página
    initCarousel();

    // Activar nav link seleccionado
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Efecto de entrada suave en tarjetas
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease forwards';
        card.style.transitionDelay = `${index * 0.08}s`;

        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 50);
    });

    // Expandir boletines (si existe en la página)
    window.toggleExpand = (button) => {
        const card = button.closest('.bulletin-card');
        const content = card.querySelector('.bulletin-expanded-content');
        const isActive = content.classList.contains('active');

        document.querySelectorAll('.bulletin-expanded-content').forEach(el => {
            if (el !== content) {
                el.classList.remove('active');
                const otherBtn = el.previousElementSibling?.querySelector('.btn-expand');
                if (otherBtn) otherBtn.innerHTML = 'Ver m&aacute;s &#9662;';
            }
        });

        content.classList.toggle('active');
        button.innerHTML = isActive ? 'Ver m&aacute;s &#9662;' : 'Cerrar &#9652;';
    };

    // Toast global (para páginas que no tienen el de admin)
    window.showToast = (message, type = 'success') => {
        const existing = document.querySelector('.global-toast');
        if (existing) existing.remove();
        const toast = document.createElement('div');
        toast.className = 'global-toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed; bottom: 2rem; right: 2rem;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white; padding: 1rem 1.5rem; border-radius: 0.75rem;
            font-weight: 600; z-index: 9999; font-family: 'Inter', sans-serif;
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.2);
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    };
});
