// ===== MOBILE-OPTIMIZED JS =====
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

// ===== TOUCH OPTIMIZATIONS =====
document.addEventListener('touchstart', function() {}, {passive: true});

// ===== PRELOADER =====
window.addEventListener('load', () => {
    setTimeout(() => {
        DOM.preloader.classList.add('loaded');
        setTimeout(() => {
            DOM.preloader.style.display = 'none';
        }, 300);
    }, 1000);
});

// ===== MOBILE MENU =====
function toggleMobileMenu() {
    const isActive = DOM.mobileMenu.classList.contains('active');
    
    if (isActive) {
        DOM.mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
        DOM.menuToggle?.classList.remove('active');
    } else {
        DOM.mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
        DOM.menuToggle?.classList.add('active');
        
        // Закрываем другие открытые модалки
        closeAllModals();
    }
}

// Инициализация меню
if (DOM.menuToggle) {
    DOM.menuToggle.addEventListener('click', toggleMobileMenu);
}

if (DOM.menuClose) {
    DOM.menuClose.addEventListener('click', toggleMobileMenu);
}

// Закрытие меню при клике на ссылку
document.querySelectorAll('.mobile-menu-link').forEach(link => {
    link.addEventListener('click', () => {
        toggleMobileMenu();
        
        // Плавный скролл к секции
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            setTimeout(() => {
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = DOM.header?.offsetHeight || 60;
                    const targetPosition = target.offsetTop - headerHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }, 300);
        }
    });
});

// ===== HEADER SCROLL EFFECT (OPTIMIZED) =====
let lastScroll = 0;
let ticking = false;

function updateHeader() {
    const currentScroll = window.scrollY;
    
    if (currentScroll > 100) {
        DOM.header.classList.add('scrolled');
        DOM.scrollTop?.classList.add('visible');
    } else {
        DOM.header.classList.remove('scrolled');
        DOM.scrollTop?.classList.remove('visible');
    }
    
    // Скрываем меню при скролле
    if (Math.abs(currentScroll - lastScroll) > 50) {
        DOM.mobileMenu?.classList.remove('active');
        DOM.menuToggle?.classList.remove('active');
        document.body.style.overflow = '';
        lastScroll = currentScroll;
    }
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateHeader();
            ticking = false;
        });
        ticking = true;
    }
}, {passive: true});

// ===== MODAL MANAGEMENT =====
let activeModal = null;

function openModal(modal) {
    if (activeModal) {
        closeModal(activeModal);
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    activeModal = modal;
    
    // Добавляем класс для предотвращения скролла
    document.body.classList.add('modal-open');
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    document.body.classList.remove('modal-open');
    activeModal = null;
}

function closeAllModals() {
    document.querySelectorAll('.modal.active').forEach(modal => {
        closeModal(modal);
    });
}

// Модальные окна
function openCalculator() {
    openModal(DOM.calculatorModal);
    updateCalculator();
}

function closeCalculator() {
    closeModal(DOM.calculatorModal);
}

function openWhatsAppModal() {
    openModal(DOM.whatsappModal);
}

function closeWhatsAppModal() {
    closeModal(DOM.whatsappModal);
}

function openInstagramModal() {
    openModal(DOM.instagramModal);
}

function closeInstagramModal() {
    closeModal(DOM.instagramModal);
}

// Закрытие по клику вне модалки
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
        }
    });
});

// Закрытие по Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && activeModal) {
        closeModal(activeModal);
    }
});

// ===== CALCULATOR (TOUCH OPTIMIZED) =====
const PRICES = {
    apartment: { base: 500, perRoom: 1000 },
    house: { base: 800, perRoom: 1200 },
    office: { base: 700, perRoom: 1500 },
    commercial: { base: 1000, perRoom: 2000 }
};

const ADDITIONAL_SERVICES = {
    windows: 2000,
    balcony: 1000,
    chandelier: 1500,
    disinfection: 1000
};

function updateCalculator() {
    if (!DOM.roomTypeSelect || !DOM.areaInput || !DOM.roomsInput) return;
    
    const roomType = DOM.roomTypeSelect.value;
    const area = parseInt(DOM.areaInput.value) || 50;
    const rooms = parseInt(DOM.roomsInput.value) || 2;
    
    // Расчет
    const basePrice = PRICES[roomType].base * (area / 50);
    const roomsPrice = PRICES[roomType].perRoom * rooms;
    
    let additionalPrice = 0;
    document.querySelectorAll('input[name]:checked').forEach(checkbox => {
        additionalPrice += ADDITIONAL_SERVICES[checkbox.name];
    });
    
    const total = Math.round(basePrice + roomsPrice + additionalPrice);
    
    // Обновление интерфейса
    if (DOM.totalPrice) {
        DOM.totalPrice.textContent = total.toLocaleString('ru-RU') + ' ₸';
    }
    
    // Обновление деталей
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

// Инициализация калькулятора
if (DOM.areaInput && DOM.roomsInput && DOM.roomTypeSelect) {
    // Добавляем слушатели с учетом touch
    ['input', 'change'].forEach(event => {
        DOM.areaInput.addEventListener(event, updateCalculator, {passive: true});
        DOM.roomsInput.addEventListener(event, updateCalculator, {passive: true});
        DOM.roomTypeSelect.addEventListener(event, updateCalculator, {passive: true});
    });
    
    document.querySelectorAll('input[name]').forEach(checkbox => {
        checkbox.addEventListener('change', updateCalculator, {passive: true});
    });
}

// ===== WHATSAPP INTEGRATION =====
function sendCalculation() {
    if (!DOM.roomTypeSelect || !DOM.areaInput || !DOM.roomsInput) return;
    
    const roomType = DOM.roomTypeSelect.options[DOM.roomTypeSelect.selectedIndex].text;
    const area = DOM.areaInput.value;
    const rooms = DOM.roomsInput.value;
    const total = DOM.totalPrice?.textContent || '0 ₸';
    
    let additionalServices = [];
    document.querySelectorAll('input[name]:checked').forEach(checkbox => {
        additionalServices.push(checkbox.nextElementSibling?.textContent?.trim() || '');
    });
    
    const message = `📋 *Расчет стоимости уборки*%0A%0A🏠 Тип помещения: ${roomType}%0A📏 Площадь: ${area} м²%0A🚪 Комнат: ${rooms}%0A💰 Итоговая стоимость: ${total}%0A%0A✨ Дополнительные услуги:%0A${additionalServices.length > 0 ? additionalServices.map(s => `• ${s}`).join('%0A') : 'Не выбраны'}%0A%0A💬 *Хочу заказать эту услугу!*`;
    
    const phone = '77474507959';
    const url = `https://wa.me/${phone}?text=${message}`;
    
    window.open(url, '_blank');
    closeCalculator();
}

// ===== ANIMATED COUNTERS (OPTIMIZED) =====
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                const increment = target / 100;
                let current = 0;
                
                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        counter.textContent = Math.ceil(current).toLocaleString('ru-RU');
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target.toLocaleString('ru-RU') + 
                            (counter.getAttribute('data-count') === '98' ? '%' : '+');
                    }
                };
                
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    // Внутренние ссылки
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (!target) return;
            
            e.preventDefault();
            
            // Закрываем меню если открыто
            if (DOM.mobileMenu?.classList.contains('active')) {
                toggleMobileMenu();
            }
            
            // Закрываем модалки
            closeAllModals();
            
            // Скролл
            const headerHeight = DOM.header?.offsetHeight || 60;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
    
    // Кнопка "Наверх"
    DOM.scrollTop?.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== ORIENTATION CHANGE HANDLER =====
function handleOrientationChange() {
    // Пересчитываем высоту viewport
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    // Закрываем меню при повороте
    if (DOM.mobileMenu?.classList.contains('active')) {
        toggleMobileMenu();
    }
    
    // Пересчитываем модальные окна
    if (activeModal) {
        setTimeout(() => {
            activeModal.scrollTop = 0;
        }, 300);
    }
}

// ===== INITIALIZATION =====
function init() {
    // Инициализация слушателей
    DOM.closeCalculator?.addEventListener('click', closeCalculator);
    DOM.closeWhatsApp?.addEventListener('click', closeWhatsAppModal);
    DOM.closeInstagram?.addEventListener('click', closeInstagramModal);
    
    // Инициализация функций
    initSmoothScrolling();
    animateCounters();
    
    // Обработка смены ориентации
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);
    
    // Инициализация высоты viewport для мобильных
    handleOrientationChange();
    
    // Инициализация калькулятора
    if (DOM.areaInput && DOM.roomsInput && DOM.roomTypeSelect) {
        updateCalculator();
    }
    
    console.log('✅ Tazalyk Service - Mobile optimized version loaded');
}

// ===== START APP =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ===== GLOBAL FUNCTIONS (для onclick в HTML) =====
window.openCalculator = openCalculator;
window.closeCalculator = closeCalculator;
window.openWhatsAppModal = openWhatsAppModal;
window.closeWhatsAppModal = closeWhatsAppModal;
window.openInstagramModal = openInstagramModal;
window.closeInstagramModal = closeInstagramModal;
window.sendCalculation = sendCalculation;