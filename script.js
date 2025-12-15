// ===== TAZALYK CLEANING SERVICES - OPTIMIZED =====
const DOM = {
    preloader: document.querySelector('.preloader'),
    header: document.querySelector('.header'),
    mobileMenuLogo: document.getElementById('mobileMenuLogo'),
    mobileMenu: document.getElementById('mobileMenu'),
    menuOverlay: document.getElementById('menuOverlay'),
    menuClose: document.getElementById('menuClose'),
    scrollTop: document.getElementById('scrollTop'),
    calculatorModal: document.getElementById('calculatorModal'),
    whatsappModal: document.getElementById('whatsappModal'),
    instagramModal: document.getElementById('instagramModal'),
    closeCalculator: document.getElementById('closeCalculator'),
    closeWhatsApp: document.getElementById('closeWhatsApp'),
    closeInstagram: document.getElementById('closeInstagram'),
    areaInput: document.getElementById('area'),
    roomsInput: document.getElementById('rooms'),
    bathroomsInput: document.getElementById('bathrooms'),
    roomTypeSelect: document.getElementById('roomType'),
    totalPrice: document.getElementById('totalPrice')
};

// ===== СОХРАНЕНИЕ ПОЗИЦИИ ПРОКРУТКИ =====
let scrollPosition = 0;
let isModalOpen = false;

function saveScrollPosition() {
    scrollPosition = window.scrollY || document.documentElement.scrollTop;
    console.log('Сохранена позиция скролла:', scrollPosition);
}

function restoreScrollPosition() {
    if (scrollPosition > 0 && isModalOpen) {
        console.log('Восстанавливаем позицию скролла:', scrollPosition);
        window.scrollTo(0, scrollPosition);
        isModalOpen = false;
    }
}

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

// ===== MOBILE MENU WITH LOGO =====
// Создаем оверлей для меню если его нет
if (!DOM.menuOverlay) {
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    overlay.id = 'menuOverlay';
    document.body.appendChild(overlay);
    DOM.menuOverlay = overlay;
}

// Функция для клика по логотипу
function handleLogoClick() {
    if (window.innerWidth < 768) {
        // Только для мобильных
        const isActive = DOM.mobileMenu.classList.contains('active');
        
        if (isActive) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
        
        // Анимация клика
        DOM.mobileMenuLogo?.classList.add('clicked');
        setTimeout(() => {
            DOM.mobileMenuLogo?.classList.remove('clicked');
        }, 300);
    }
}

// Обновленная функция открытия меню
function openMobileMenu() {
    DOM.mobileMenu.classList.add('active');
    if (DOM.menuOverlay) {
        DOM.menuOverlay.classList.add('active');
    }
    document.body.style.overflow = 'hidden';
    document.body.classList.add('menu-open');
    
    closeAllModals();
}

// Обновленная функция закрытия меню
function closeMobileMenu() {
    DOM.mobileMenu.classList.remove('active');
    if (DOM.menuOverlay) {
        DOM.menuOverlay.classList.remove('active');
    }
    document.body.style.overflow = '';
    document.body.classList.remove('menu-open');
}

// Инициализация меню
if (DOM.mobileMenuLogo) {
    DOM.mobileMenuLogo.addEventListener('click', handleLogoClick);
}

if (DOM.menuClose) {
    DOM.menuClose.addEventListener('click', closeMobileMenu);
}

if (DOM.menuOverlay) {
    DOM.menuOverlay.addEventListener('click', closeMobileMenu);
}

// Закрытие меню при клике на ссылку
document.querySelectorAll('.mobile-menu-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        closeMobileMenu();
        
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

// Закрытие по Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && DOM.mobileMenu?.classList.contains('active')) {
        closeMobileMenu();
    }
});

// ===== HEADER SCROLL EFFECT =====
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
    
    if (Math.abs(currentScroll - lastScroll) > 50) {
        if (window.innerWidth < 768) {
            closeMobileMenu();
        }
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

// ===== MODAL MANAGEMENT (С СОХРАНЕНИЕМ ПОЗИЦИИ) =====
let activeModal = null;

function openModal(modal) {
    saveScrollPosition();
    isModalOpen = true;
    
    if (activeModal) {
        closeModal(activeModal);
    }
    
    closeMobileMenu();
    
    modal.classList.add('active');
    document.body.classList.add('modal-open');
    activeModal = modal;
    
    // Блокируем скролл body при открытом модальном окне
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    
    console.log('Модалка открыта, позиция сохранена:', scrollPosition);
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
    activeModal = null;
    
    // Восстанавливаем скролл body
    const scrollY = parseInt(document.body.style.top || '0') * -1;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    
    // Восстанавливаем позицию прокрутки
    setTimeout(() => {
        window.scrollTo(0, scrollY || scrollPosition);
        console.log('Позиция восстановлена:', scrollY || scrollPosition);
    }, 10);
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
    
    setTimeout(() => {
        DOM.roomTypeSelect?.focus();
    }, 100);
}

function openCalculatorWithService(serviceId) {
    openCalculator();
    
    // Устанавливаем соответствующий тип помещения в зависимости от услуги
    switch(serviceId) {
        case 1: // Уборка после ремонта
            DOM.roomTypeSelect.value = 'apartment';
            break;
        case 2: // Мойка окон
            // Включаем чекбокс "Мойка окон"
            const windowsCheck = document.getElementById('windowsCheck');
            if (windowsCheck) windowsCheck.checked = true;
            break;
        case 3: // Генеральная уборка
            DOM.roomTypeSelect.value = 'apartment';
            break;
        case 4: // Коммерческая уборка
            DOM.roomTypeSelect.value = 'office';
            break;
        case 5: // Регулярное обслуживание
            DOM.roomTypeSelect.value = 'apartment';
            break;
    }
    
    // Обновляем калькулятор
    updateCalculator();
    
    // Обновляем визуальное состояние чекбоксов
    updateAllCheckboxes();
}

function closeCalculator() {
    closeModal(DOM.calculatorModal);
    isModalOpen = false;
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
        isModalOpen = false;
    }
});

// ===== КАЛЬКУЛЯТОР (УЛУЧШЕННАЯ ВЕРСИЯ) =====
const PRICES = {
    apartment: { base: 500, perRoom: 1000, perBathroom: 500 },
    house: { base: 800, perRoom: 1200, perBathroom: 600 },
    office: { base: 700, perRoom: 1500, perBathroom: 700 },
    commercial: { base: 1000, perRoom: 2000, perBathroom: 800 }
};

const ADDITIONAL_SERVICES = {
    windows: { price: 2000, label: "Мойка окон" },
    balcony: { price: 1000, label: "Уборка балкона" },
    chandelier: { price: 1500, label: "Мытье люстр" },
    disinfection: { price: 1000, label: "Дезинфекция" },
    fridge: { price: 1200, label: "Мытье холодильника" },
    oven: { price: 1800, label: "Чистка духовки" }
};

// Храним выбранные доп. услуги
let selectedServices = {
    windows: false,
    balcony: false,
    chandelier: false,
    disinfection: false,
    fridge: false,
    oven: false
};

// Функции для управления калькулятором
function changeArea(value) {
    if (!DOM.areaInput) return;
    let current = parseInt(DOM.areaInput.value) || 50;
    let newValue = current + value;
    
    // Ограничиваем значения
    if (newValue < 10) newValue = 10;
    if (newValue > 500) newValue = 500;
    
    DOM.areaInput.value = newValue;
    
    // Обновляем range slider
    const areaRange = document.getElementById('areaRange');
    if (areaRange) {
        areaRange.value = newValue;
    }
    
    updateCalculator();
}

function changeRooms(value) {
    if (!DOM.roomsInput) return;
    let current = parseInt(DOM.roomsInput.value) || 2;
    let newValue = current + value;
    
    // Ограничиваем значения
    if (newValue < 1) newValue = 1;
    if (newValue > 10) newValue = 10;
    
    DOM.roomsInput.value = newValue;
    
    // Обновляем отображение
    const roomsDisplay = document.getElementById('roomsDisplay');
    if (roomsDisplay) {
        roomsDisplay.textContent = getRoomText(newValue);
    }
    
    updateCalculator();
}

function changeBathrooms(value) {
    if (!DOM.bathroomsInput) return;
    let current = parseInt(DOM.bathroomsInput.value) || 1;
    let newValue = current + value;
    
    // Ограничиваем значения
    if (newValue < 1) newValue = 1;
    if (newValue > 5) newValue = 5;
    
    DOM.bathroomsInput.value = newValue;
    
    // Обновляем отображение
    const bathroomsDisplay = document.getElementById('bathroomsDisplay');
    if (bathroomsDisplay) {
        bathroomsDisplay.textContent = getBathroomText(newValue);
    }
    
    updateCalculator();
}

function getRoomText(count) {
    if (count === 1) return '1 комната';
    if (count >= 2 && count <= 4) return `${count} комнаты`;
    return `${count} комнат`;
}

function getBathroomText(count) {
    if (count === 1) return '1 санузел';
    if (count >= 2 && count <= 4) return `${count} санузла`;
    return `${count} санузлов`;
}

// Инициализация чекбоксов из сохраненных значений
function initializeCheckboxes() {
    const checkboxes = document.querySelectorAll('input[name]');
    checkboxes.forEach(checkbox => {
        const serviceName = checkbox.name;
        
        // Загружаем сохраненное состояние
        try {
            const saved = localStorage.getItem(`tazalyk_service_${serviceName}`);
            if (saved !== null) {
                selectedServices[serviceName] = saved === 'true';
                checkbox.checked = selectedServices[serviceName];
            }
        } catch (e) {
            console.log('Не удалось загрузить сохраненные настройки');
        }
        
        // Добавляем обработчик
        checkbox.addEventListener('change', function() {
            selectedServices[serviceName] = this.checked;
            
            // Сохраняем в localStorage
            try {
                localStorage.setItem(`tazalyk_service_${serviceName}`, this.checked);
            } catch (e) {
                console.log('Не удалось сохранить настройки');
            }
            
            updateCheckboxVisual(this);
            updateCalculator();
        });
        
        // Инициализируем визуальное состояние
        updateCheckboxVisual(checkbox);
    });
}

// Обновление всех чекбоксов
function updateAllCheckboxes() {
    const checkboxes = document.querySelectorAll('input[name]');
    checkboxes.forEach(checkbox => {
        updateCheckboxVisual(checkbox);
    });
}

// Обновление визуального состояния чекбокса
function updateCheckboxVisual(checkbox) {
    const label = checkbox.closest('.checkbox-label-large');
    if (!label) return;
    
    if (checkbox.checked) {
        label.classList.add('checked');
    } else {
        label.classList.remove('checked');
    }
}

// Функция расчета стоимости
function updateCalculator() {
    if (!DOM.roomTypeSelect || !DOM.areaInput || !DOM.roomsInput || !DOM.bathroomsInput) return;
    
    const roomType = DOM.roomTypeSelect.value;
    const area = parseInt(DOM.areaInput.value) || 50;
    const rooms = parseInt(DOM.roomsInput.value) || 2;
    const bathrooms = parseInt(DOM.bathroomsInput.value) || 1;
    
    // Валидация ввода
    if (area < 10) DOM.areaInput.value = 10;
    if (area > 500) DOM.areaInput.value = 500;
    if (rooms < 1) DOM.roomsInput.value = 1;
    if (rooms > 10) DOM.roomsInput.value = 10;
    if (bathrooms < 1) DOM.bathroomsInput.value = 1;
    if (bathrooms > 5) DOM.bathroomsInput.value = 5;
    
    // Расчет базовой стоимости
    const basePrice = Math.round(PRICES[roomType].base * (area / 50));
    const roomsPrice = PRICES[roomType].perRoom * rooms;
    const bathroomsPrice = PRICES[roomType].perBathroom * bathrooms;
    
    // Расчет дополнительных услуг
    let additionalPrice = 0;
    let selectedServicesList = [];
    
    Object.keys(selectedServices).forEach(service => {
        if (selectedServices[service]) {
            additionalPrice += ADDITIONAL_SERVICES[service].price;
            selectedServicesList.push(ADDITIONAL_SERVICES[service].label);
        }
    });
    
    const total = basePrice + roomsPrice + bathroomsPrice + additionalPrice;
    
    // Обновление интерфейса
    if (DOM.totalPrice) {
        const priceAmount = DOM.totalPrice.querySelector('.price-amount');
        if (priceAmount) {
            priceAmount.textContent = total.toLocaleString('ru-RU');
        }
    }
    
    // Обновление деталей с выбранными услугами
    updateResultDetails(basePrice, roomsPrice, bathroomsPrice, additionalPrice, selectedServicesList, total);
}

// Обновление деталей расчета
function updateResultDetails(base, rooms, bathrooms, additional, services, total) {
    const detailsContainer = document.querySelector('.result-details-large');
    if (!detailsContainer) return;
    
    let servicesHTML = '';
    
    if (services.length > 0) {
        servicesHTML = `
            <div class="detail-row">
                <span class="detail-label">Дополнительные услуги:</span>
                <span class="detail-value">${additional.toLocaleString('ru-RU')} ₸</span>
            </div>
        `;
    } else {
        servicesHTML = `
            <div class="detail-row">
                <span class="detail-label">Дополнительные услуги:</span>
                <span class="detail-value">0 ₸</span>
            </div>
        `;
    }
    
    const roomsCount = DOM.roomsInput?.value || 0;
    const bathroomsCount = DOM.bathroomsInput?.value || 0;
    const areaValue = DOM.areaInput?.value || 50;
    
    detailsContainer.innerHTML = `
        <div class="detail-row">
            <span class="detail-label">Базовая уборка (${areaValue} м²):</span>
            <span class="detail-value">${base.toLocaleString('ru-RU')} ₸</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Комнаты (${roomsCount} шт.):</span>
            <span class="detail-value">${rooms.toLocaleString('ru-RU')} ₸</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Санузлы (${bathroomsCount} шт.):</span>
            <span class="detail-value">${bathrooms.toLocaleString('ru-RU')} ₸</span>
        </div>
        ${servicesHTML}
        <div class="detail-row total">
            <span class="detail-label">Итого к оплате:</span>
            <span class="detail-value">${total.toLocaleString('ru-RU')} ₸</span>
        </div>
    `;
}

// ===== WHATSAPP INTEGRATION =====
function sendCalculation() {
    if (!DOM.roomTypeSelect || !DOM.areaInput || !DOM.roomsInput) return;
    
    const roomType = DOM.roomTypeSelect.options[DOM.roomTypeSelect.selectedIndex].text;
    const area = DOM.areaInput.value;
    const rooms = DOM.roomsInput.value;
    const bathrooms = DOM.bathroomsInput?.value || 1;
    
    const totalElement = document.querySelector('.price-amount');
    const total = totalElement ? totalElement.textContent + ' ₸' : '0 ₸';
    
    let selectedServicesList = [];
    Object.keys(selectedServices).forEach(service => {
        if (selectedServices[service]) {
            selectedServicesList.push(ADDITIONAL_SERVICES[service].label);
        }
    });
    
    const message = `📋 *РАСЧЕТ СТОИМОСТИ УБОРКИ*%0A%0A` +
                   `🏠 *Тип помещения:* ${roomType}%0A` +
                   `📏 *Площадь:* ${area} м²%0A` +
                   `🚪 *Комнат:* ${rooms}%0A` +
                   `🚽 *Санузлов:* ${bathrooms}%0A` +
                   `💰 *Предварительная стоимость:* ${total}%0A%0A` +
                   `✨ *Дополнительные услуги:*%0A` +
                   (selectedServicesList.length > 0 ? 
                    selectedServicesList.map(s => `✅ ${s}`).join('%0A') : 
                    '❌ Не выбраны') + 
                   `%0A%0A💬 *Хочу заказать эту услугу!*`;
    
    const phone = '77474507959';
    const url = `https://wa.me/${phone}?text=${message}`;
    
    window.open(url, '_blank');
    closeCalculator();
}

// Функция копирования расчета
function copyCalculation() {
    if (!DOM.roomTypeSelect || !DOM.areaInput || !DOM.roomsInput) return;
    
    const roomType = DOM.roomTypeSelect.options[DOM.roomTypeSelect.selectedIndex].text;
    const area = DOM.areaInput.value;
    const rooms = DOM.roomsInput.value;
    const bathrooms = DOM.bathroomsInput?.value || 1;
    
    const totalElement = document.querySelector('.price-amount');
    const total = totalElement ? totalElement.textContent + ' ₸' : '0 ₸';
    
    let selectedServicesList = [];
    Object.keys(selectedServices).forEach(service => {
        if (selectedServices[service]) {
            selectedServicesList.push(ADDITIONAL_SERVICES[service].label);
        }
    });
    
    const text = `РАСЧЕТ СТОИМОСТИ УБОРКИ\n\n` +
                 `Тип помещения: ${roomType}\n` +
                 `Площадь: ${area} м²\n` +
                 `Комнат: ${rooms}\n` +
                 `Санузлов: ${bathrooms}\n` +
                 `Предварительная стоимость: ${total}\n\n` +
                 `Дополнительные услуги:\n` +
                 (selectedServicesList.length > 0 ? 
                  selectedServicesList.map(s => `✅ ${s}`).join('\n') : 
                  '❌ Не выбраны');
    
    // Используем Clipboard API для копирования
    navigator.clipboard.writeText(text)
        .then(() => {
            // Показываем уведомление об успехе
            alert('Расчет скопирован в буфер обмена!');
        })
        .catch(err => {
            console.error('Ошибка при копировании: ', err);
            // Fallback для старых браузеров
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('Расчет скопирован в буфер обмена!');
        });
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        if (anchor.classList.contains('mobile-menu-link')) return;
        
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (!target) return;
            
            e.preventDefault();
            
            closeMobileMenu();
            closeAllModals();
            
            const headerHeight = DOM.header?.offsetHeight || 60;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
    
    DOM.scrollTop?.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== ORIENTATION CHANGE HANDLER =====
function handleOrientationChange() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    closeMobileMenu();
    
    if (activeModal) {
        setTimeout(() => {
            activeModal.scrollTop = 0;
        }, 300);
    }
}

// ===== ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ =====
function init() {
    // Инициализация слушателей
    DOM.closeCalculator?.addEventListener('click', closeCalculator);
    DOM.closeWhatsApp?.addEventListener('click', closeWhatsAppModal);
    DOM.closeInstagram?.addEventListener('click', closeInstagramModal);
    
    // Инициализация клика по логотипу для мобильного меню
    if (DOM.mobileMenuLogo) {
        DOM.mobileMenuLogo.addEventListener('click', handleLogoClick);
    }
    
    // Инициализация оверлея для меню
    if (DOM.menuOverlay) {
        DOM.menuOverlay.addEventListener('click', closeMobileMenu);
    }
    
    // Инициализация клика по ссылкам в мобильном меню
    document.querySelectorAll('.mobile-menu-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            closeMobileMenu();
            
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
    
    // Инициализация калькулятора
    if (DOM.areaInput && DOM.roomsInput && DOM.roomTypeSelect) {
        initializeCheckboxes();
        
        // Слушатели для полей ввода
        const inputs = [DOM.areaInput, DOM.roomsInput, DOM.bathroomsInput, DOM.roomTypeSelect];
        inputs.forEach(input => {
            if (input) {
                input.addEventListener('input', updateCalculator);
                input.addEventListener('change', updateCalculator);
            }
        });
        
        // Слушатель для range slider
        const areaRange = document.getElementById('areaRange');
        if (areaRange) {
            areaRange.addEventListener('input', function() {
                DOM.areaInput.value = this.value;
                updateCalculator();
            });
        }
        
        // Обновление отображения комнат и санузлов
        if (DOM.roomsInput) {
            DOM.roomsInput.addEventListener('input', function() {
                const roomsDisplay = document.getElementById('roomsDisplay');
                if (roomsDisplay) {
                    roomsDisplay.textContent = getRoomText(parseInt(this.value) || 2);
                }
            });
        }
        
        if (DOM.bathroomsInput) {
            DOM.bathroomsInput.addEventListener('input', function() {
                const bathroomsDisplay = document.getElementById('bathroomsDisplay');
                if (bathroomsDisplay) {
                    bathroomsDisplay.textContent = getBathroomText(parseInt(this.value) || 1);
                }
            });
        }
        
        // Обновление калькулятора при открытии
        updateCalculator();
    }
    
    // Инициализация других функций
    initSmoothScrolling();
    
    // Обработка смены ориентации
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);
    
    // Инициализация высоты viewport
    handleOrientationChange();
    
    // Закрытие меню по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && DOM.mobileMenu?.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    console.log('✅ Tazalyk Cleaning Services загружен успешно');
}

// ===== START APP =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ===== GLOBAL FUNCTIONS =====
window.openCalculator = openCalculator;
window.openCalculatorWithService = openCalculatorWithService;
window.closeCalculator = closeCalculator;
window.openWhatsAppModal = openWhatsAppModal;
window.closeWhatsAppModal = closeWhatsAppModal;
window.openInstagramModal = openInstagramModal;
window.closeInstagramModal = closeInstagramModal;
window.sendCalculation = sendCalculation;
window.copyCalculation = copyCalculation;
window.handleLogoClick = handleLogoClick;
window.changeArea = changeArea;
window.changeRooms = changeRooms;
window.changeBathrooms = changeBathrooms;

// ===== ВОССТАНОВЛЕНИЕ ПРИ ОБНОВЛЕНИИ СТРАНИЦЫ =====
window.addEventListener('beforeunload', () => {
    // Сохраняем состояние в localStorage
    try {
        localStorage.setItem('tazalyk_selected_services', JSON.stringify(selectedServices));
    } catch (e) {
        console.log('Не удалось сохранить настройки');
    }
});

// Загрузка сохраненного состояния при старте
try {
    const saved = localStorage.getItem('tazalyk_selected_services');
    if (saved) {
        selectedServices = JSON.parse(saved);
    }
} catch (e) {
    console.log('Не удалось загрузить сохраненные настройки');
}