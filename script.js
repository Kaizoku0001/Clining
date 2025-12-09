// ===== DOM ELEMENTS =====
const DOM = {
    preloader: document.querySelector('.preloader'),
    header: document.querySelector('.header'),
    menuToggle: document.getElementById('menuToggle'),
    menuClose: document.getElementById('menuClose'),
    mobileMenu: document.getElementById('mobileMenu'),
    scrollTop: document.getElementById('scrollTop'),
    calculatorModal: document.getElementById('calculatorModal'),
    whatsappModal: document.getElementById('whatsappModal'),
    instagramModal: document.getElementById('instagramModal'),
    closeCalculator: document.getElementById('closeCalculator'),
    closeWhatsApp: document.getElementById('closeWhatsApp'),
    closeInstagram: document.getElementById('closeInstagram'),
    areaInput: document.getElementById('area'),
    roomsInput: document.getElementById('rooms'),
    roomTypeSelect: document.getElementById('roomType'),
    totalPrice: document.getElementById('totalPrice')
};

// ===== GLOBAL STATE =====
let isModalOpen = false;

// ===== PRELOADER =====
window.addEventListener('load', () => {
    setTimeout(() => {
        DOM.preloader.classList.add('loaded');
        setTimeout(() => {
            DOM.preloader.style.display = 'none';
        }, 500);
    }, 1500);
});

// ===== HEADER SCROLL EFFECT =====
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        DOM.header.classList.add('scrolled');
        DOM.scrollTop.classList.add('visible');
    } else {
        DOM.header.classList.remove('scrolled');
        DOM.scrollTop.classList.remove('visible');
    }
});

// ===== MOBILE MENU =====
DOM.menuToggle?.addEventListener('click', () => {
    DOM.mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
    isModalOpen = true;
});

DOM.menuClose?.addEventListener('click', () => {
    DOM.mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
    isModalOpen = false;
});

// Close mobile menu when clicking on links
document.querySelectorAll('.mobile-menu-link').forEach(link => {
    link.addEventListener('click', () => {
        DOM.mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
        isModalOpen = false;
    });
});

// ===== MODAL FUNCTIONS =====
function openModal(modal) {
    if (isModalOpen) return;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    isModalOpen = true;
    
    // Add entrance animation
    modal.style.animation = 'modalFadeIn 0.3s ease';
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    isModalOpen = false;
}

// Calculator Modal
function openCalculator() {
    openModal(DOM.calculatorModal);
    updateCalculator();
}

function closeCalculator() {
    closeModal(DOM.calculatorModal);
}

// WhatsApp Modal
function openWhatsAppModal() {
    openModal(DOM.whatsappModal);
}

function closeWhatsAppModal() {
    closeModal(DOM.whatsappModal);
}

// Instagram Modal
function openInstagramModal() {
    openModal(DOM.instagramModal);
}

function closeInstagramModal() {
    closeModal(DOM.instagramModal);
}

// Close modals when clicking outside
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
        }
    });
});

// Close modals with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isModalOpen) {
        document.querySelectorAll('.modal.active').forEach(modal => {
            closeModal(modal);
        });
    }
});

// ===== CALCULATOR LOGIC =====
const PRICES = {
    apartment: {
        base: 500,
        perRoom: 1000
    },
    house: {
        base: 800,
        perRoom: 1200
    },
    office: {
        base: 700,
        perRoom: 1500
    },
    commercial: {
        base: 1000,
        perRoom: 2000
    }
};

const ADDITIONAL_SERVICES = {
    windows: 2000,
    balcony: 1000,
    chandelier: 1500,
    disinfection: 1000
};

function updateCalculator() {
    const roomType = DOM.roomTypeSelect.value;
    const area = parseInt(DOM.areaInput.value) || 50;
    const rooms = parseInt(DOM.roomsInput.value) || 2;
    
    // Get base price
    const basePrice = PRICES[roomType].base * (area / 50);
    const roomsPrice = PRICES[roomType].perRoom * rooms;
    
    // Calculate additional services
    let additionalPrice = 0;
    document.querySelectorAll('input[name]:checked').forEach(checkbox => {
        additionalPrice += ADDITIONAL_SERVICES[checkbox.name];
    });
    
    // Calculate total
    const total = Math.round(basePrice + roomsPrice + additionalPrice);
    
    // Update display
    DOM.totalPrice.textContent = total.toLocaleString('ru-RU') + ' ₸';
    
    // Update details
    updateResultDetails(basePrice, additionalPrice, total);
}

function updateResultDetails(base, additional, total) {
    const detailsContainer = document.querySelector('.result-details');
    if (detailsContainer) {
        detailsContainer.innerHTML = `
            <div class="detail-item">
                <span>Базовая уборка:</span>
                <span>${Math.round(base).toLocaleString('ru-RU')} ₸</span>
            </div>
            <div class="detail-item">
                <span>Дополнительные услуги:</span>
                <span>${additional.toLocaleString('ru-RU')} ₸</span>
            </div>
            <div class="detail-item total">
                <span>Итого:</span>
                <span>${total.toLocaleString('ru-RU')} ₸</span>
            </div>
        `;
    }
}

// Initialize calculator events
DOM.areaInput?.addEventListener('input', updateCalculator);
DOM.roomsInput?.addEventListener('input', updateCalculator);
DOM.roomTypeSelect?.addEventListener('change', updateCalculator);

document.querySelectorAll('input[name]').forEach(checkbox => {
    checkbox.addEventListener('change', updateCalculator);
});

// Send calculation via WhatsApp
function sendCalculation() {
    const roomType = DOM.roomTypeSelect.options[DOM.roomTypeSelect.selectedIndex].text;
    const area = DOM.areaInput.value;
    const rooms = DOM.roomsInput.value;
    const total = DOM.totalPrice.textContent;
    
    let additionalServices = [];
    document.querySelectorAll('input[name]:checked').forEach(checkbox => {
        additionalServices.push(checkbox.nextElementSibling.textContent.trim());
    });
    
    const message = `📋 *Расчет стоимости уборки*
    
🏠 Тип помещения: ${roomType}
📏 Площадь: ${area} м²
🚪 Комнат: ${rooms}
💰 Итоговая стоимость: ${total}

✨ Дополнительные услуги:
${additionalServices.length > 0 ? additionalServices.map(s => `• ${s}`).join('\n') : 'Не выбраны'}

💬 *Хочу заказать эту услугу!*`;
    
    const encodedMessage = encodeURIComponent(message);
    const phone = '77474507959';
    const url = `https://wa.me/${phone}?text=${encodedMessage}`;
    
    window.open(url, '_blank');
    closeCalculator();
}

// ===== ANIMATED COUNTERS =====
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const increment = target / 200;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current).toLocaleString('ru-RU');
                setTimeout(updateCounter, 10);
            } else {
                counter.textContent = target.toLocaleString('ru-RU') + (counter.getAttribute('data-count') === '98' ? '%' : '+');
            }
        };
        
        updateCounter();
    });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Animate counters when hero section is visible
                if (entry.target.classList.contains('hero')) {
                    animateCounters();
                }
            }
        });
    }, observerOptions);
    
    // Observe sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
    
    // Observe service cards
    document.querySelectorAll('.service-card').forEach(card => {
        observer.observe(card);
    });
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            // Close mobile menu if open
            if (DOM.mobileMenu.classList.contains('active')) {
                DOM.mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
                isModalOpen = false;
            }
            
            // Scroll to target
            const headerHeight = DOM.header.offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
    
    // Scroll to top button
    DOM.scrollTop?.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== PARTICLE ANIMATION =====
function enhanceParticles() {
    const particles = document.querySelectorAll('.particle');
    
    particles.forEach((particle, index) => {
        // Randomize animation
        const duration = 15 + Math.random() * 10;
        const delay = Math.random() * 5;
        
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        
        // Add mouse interaction
        particle.addEventListener('mouseenter', () => {
            particle.style.transform = 'scale(1.5)';
            particle.style.opacity = '0.3';
        });
        
        particle.addEventListener('mouseleave', () => {
            particle.style.transform = '';
            particle.style.opacity = '';
        });
    });
}

// ===== SERVICE CARDS INTERACTION =====
function enhanceServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('.service-icon i');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(10deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.service-icon i');
            if (icon) {
                icon.style.transform = '';
            }
        });
        
        // Click effect
        card.addEventListener('click', (e) => {
            if (e.target.classList.contains('service-btn')) return;
            
            card.style.transform = 'scale(0.98)';
            setTimeout(() => {
                card.style.transform = '';
            }, 200);
        });
    });
}

// ===== FORM INPUT ANIMATIONS =====
function enhanceFormInputs() {
    const inputs = document.querySelectorAll('input, select');
    
    inputs.forEach(input => {
        // Focus effect
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
    });
}

// ===== BUTTON ANIMATIONS =====
function enhanceButtons() {
    // Add hover effect to all buttons
    document.querySelectorAll('button, .btn-primary, .btn-secondary, .service-btn, .social-btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
        
        // Ripple effect
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.7);
                transform: scale(0);
                animation: ripple 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                top: ${y}px;
                left: ${x}px;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// ===== INITIALIZE EVERYTHING =====
function init() {
    // Close modals event listeners
    DOM.closeCalculator?.addEventListener('click', closeCalculator);
    DOM.closeWhatsApp?.addEventListener('click', closeWhatsAppModal);
    DOM.closeInstagram?.addEventListener('click', closeInstagramModal);
    
    // Initialize features
    initSmoothScrolling();
    initScrollAnimations();
    enhanceParticles();
    enhanceServiceCards();
    enhanceFormInputs();
    enhanceButtons();
    
    // Add CSS for ripple effect
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .form-group.focused label {
            color: #00bfff;
            transform: translateY(-5px);
        }
    `;
    document.head.appendChild(style);
    
    // Initialize calculator
    if (DOM.areaInput && DOM.roomsInput && DOM.roomTypeSelect) {
        updateCalculator();
    }
}

// ===== START EVERYTHING =====
document.addEventListener('DOMContentLoaded', init);