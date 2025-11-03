// Элементы DOM
const filmStrip = document.getElementById('filmStrip');
const yearSelect = document.getElementById('yearSelect');
const monthSelect = document.getElementById('monthSelect');
const daySelect = document.getElementById('daySelect');
const goToDateBtn = document.getElementById('goToDate');
const todayBtn = document.getElementById('todayBtn');

// Инициализация
function init() {
    generateYearOptions();
    generateCalendar();
    setupEventListeners();
}

// Генерация опций выбора годов
function generateYearOptions() {
    for (let year = CALENDAR_CONFIG.START_YEAR; year <= CALENDAR_CONFIG.END_YEAR; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
}

// Генерация календаря
function generateCalendar() {
    filmStrip.innerHTML = '';
    
    for (let year = CALENDAR_CONFIG.START_YEAR; year <= CALENDAR_CONFIG.END_YEAR; year++) {
        for (let month = 0; month < 12; month++) {
            const monthSection = createMonthSection(year, month);
            filmStrip.appendChild(monthSection);
        }
    }
}

// Создание секции месяца
function createMonthSection(year, month) {
    const section = document.createElement('div');
    section.className = 'month-section';
    section.dataset.year = year;
    section.dataset.month = month;
    
    const monthName = CALENDAR_CONFIG.MONTHS[month];
    section.innerHTML = `
        <div class="month-header">${monthName} ${year}</div>
        <div class="days-grid" id="days-${year}-${month}"></div>
    `;
    
    const daysGrid = section.querySelector('.days-grid');
    populateDaysGrid(daysGrid, year, month);
    
    return section;
}

// Заполнение сетки дней
function populateDaysGrid(daysGrid, year, month) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Пустые ячейки для дней перед первым числом
    for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'day empty';
        daysGrid.appendChild(emptyDay);
    }
    
    // Дни месяца
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'day';
        dayElement.textContent = day;
        dayElement.dataset.date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        // Проверка на события
        const event = eventsData.find(event => event.date === dayElement.dataset.date);
        if (event) {
            dayElement.classList.add('event', event.type);
            dayElement.innerHTML += `<div class="event-marker"></div>`;
            dayElement.title = event.title;
        }
        
        daysGrid.appendChild(dayElement);
    }
}

// Настройка обработчиков событий
function setupEventListeners() {
    goToDateBtn.addEventListener('click', scrollToSelectedDate);
    todayBtn.addEventListener('click', scrollToToday);
    
    yearSelect.addEventListener('change', updateMonthOptions);
    monthSelect.addEventListener('change', updateDayOptions);
    
    // Клик по дню
    filmStrip.addEventListener('click', (e) => {
        if (e.target.classList.contains('day') && !e.target.classList.contains('empty')) {
            const date = e.target.dataset.date;
            showEventDetails(date);
        }
    });
}

// Обновление опций месяцев
function updateMonthOptions() {
    monthSelect.innerHTML = '<option value="">Выберите месяц</option>';
    daySelect.innerHTML = '<option value="">Выберите день</option>';
    
    if (yearSelect.value) {
        CALENDAR_CONFIG.MONTHS.forEach((month, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = month;
            monthSelect.appendChild(option);
        });
    }
}

// Обновление опций дней
function updateDayOptions() {
    daySelect.innerHTML = '<option value="">Выберите день</option>';
    
    if (yearSelect.value && monthSelect.value) {
        const year = parseInt(yearSelect.value);
        const month = parseInt(monthSelect.value);
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        for (let day = 1; day <= daysInMonth; day++) {
            const option = document.createElement('option');
            option.value = day;
            option.textContent = day;
            daySelect.appendChild(option);
        }
    }
}

// Прокрутка к выбранной дате
function scrollToSelectedDate() {
    const year = yearSelect.value;
    const month = monthSelect.value;
    const day = daySelect.value;
    
    if (!year || !month) {
        alert('Пожалуйста, выберите год и месяц');
        return;
    }
    
    const targetDate = `${year}-${String(parseInt(month) + 1).padStart(2, '0')}-${String(day || 1).padStart(2, '0')}`;
    const targetElement = document.querySelector(`.month-section[data-year="${year}"][data-month="${month}"]`);
    
    if (targetElement) {
        smoothScrollToElement(targetElement);
        
        // Подсветка выбранного дня
        if (day) {
            setTimeout(() => {
                const dayElement = document.querySelector(`.day[data-date="${targetDate}"]`);
                if (dayElement) {
                    dayElement.style.background = '#555';
                    dayElement.style.borderColor = '#ff4444';
                    setTimeout(() => {
                        dayElement.style.background = '';
                        dayElement.style.borderColor = '';
                    }, 2000);
                }
            }, 1000);
        }
    }
}

// Прокрутка к текущей дате
function scrollToToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const day = today.getDate();
    
    yearSelect.value = year;
    updateMonthOptions();
    monthSelect.value = month;
    updateDayOptions();
    daySelect.value = day;
    
    scrollToSelectedDate();
}

// Плавная прокрутка к элементу
function smoothScrollToElement(element) {
    const startPosition = filmStrip.scrollLeft;
    const targetPosition = element.offsetLeft - (filmStrip.offsetWidth - element.offsetWidth) / 2;
    const distance = targetPosition - startPosition;
    const duration = 1500;
    let startTime = null;

    function animation(currentTime) {
        if (!startTime) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        // Эффект easeInOut
        const easeProgress = progress < 0.5 
            ? 2 * progress * progress 
            : -1 + (4 - 2 * progress) * progress;
        
        filmStrip.scrollLeft = startPosition + (distance * easeProgress);
        
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }
    
    requestAnimationFrame(animation);
}

// Показать детали события
function showEventDetails(date) {
    const event = eventsData.find(event => event.date === date);
    if (event) {
        alert(`Событие: ${event.title}\nДата: ${date}\nТип: ${getEventTypeName(event.type)}`);
    }
}

// Получить название типа события
function getEventTypeName(type) {
    const names = {
        'teaser': 'Тизер',
        'trailer': 'Трейлер', 
        'game': 'Игра'
    };
    return names[type] || type;
}

// Запуск при загрузке
document.addEventListener('DOMContentLoaded', init);
