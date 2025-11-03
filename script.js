// Основная логика приложения Bendy Chronicles RU

// Навигация по разделам
document.querySelectorAll('.nav-btn').forEach(button => {
    button.addEventListener('click', function() {
        // Убираем активный класс у всех кнопок
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Добавляем активный класс текущей кнопке
        this.classList.add('active');
        
        // Скрываем все разделы
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Показываем целевой раздел
        const targetId = this.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');
        
        // При переключении на календарь обновляем его отображение
        if (targetId === 'calendar') {
            renderCalendar(currentDate);
        }
    });
});

// Фильтрация для доски почёта
document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', function() {
        // Убираем активный класс у всех кнопок фильтра
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Добавляем активный класс текущей кнопке
        this.classList.add('active');
        
        const category = this.getAttribute('data-category');
        renderHofCards(category);
    });
});

// Функция для рендера карточек доски почёта
function renderHofCards(category = 'all') {
    const hofGrid = document.querySelector('.hof-grid');
    hofGrid.innerHTML = '';
    
    const filteredData = category === 'all' 
        ? hofData 
        : hofData.filter(person => person.category === category);
    
    filteredData.forEach(person => {
        const card = document.createElement('div');
        card.className = 'hof-card';
        
        // Определяем иконки для социальных сетей
        let socialIcons = '';
        if (person.social.youtube) socialIcons += `<a href="${person.social.youtube}" class="social-icon" target="_blank"><i class="fab fa-youtube"></i></a>`;
        if (person.social.vk) socialIcons += `<a href="${person.social.vk}" class="social-icon" target="_blank"><i class="fab fa-vk"></i></a>`;
        if (person.social.telegram) socialIcons += `<a href="${person.social.telegram}" class="social-icon" target="_blank"><i class="fab fa-telegram"></i></a>`;
        if (person.social.deviantart) socialIcons += `<a href="${person.social.deviantart}" class="social-icon" target="_blank"><i class="fab fa-deviantart"></i></a>`;
        if (person.social.instagram) socialIcons += `<a href="${person.social.instagram}" class="social-icon" target="_blank"><i class="fab fa-instagram"></i></a>`;
        if (person.social.artstation) socialIcons += `<a href="${person.social.artstation}" class="social-icon" target="_blank"><i class="fab fa-artstation"></i></a>`;
        if (person.social.github) socialIcons += `<a href="${person.social.github}" class="social-icon" target="_blank"><i class="fab fa-github"></i></a>`;
        if (person.social.discord) socialIcons += `<a href="${person.social.discord}" class="social-icon" target="_blank"><i class="fab fa-discord"></i></a>`;
        if (person.social.tiktok) socialIcons += `<a href="${person.social.tiktok}" class="social-icon" target="_blank"><i class="fab fa-tiktok"></i></a>`;
        
        // Определяем категорию для отображения
        let categoryText = '';
        switch(person.category) {
            case 'content': categoryText = 'Автор контента'; break;
            case 'art': categoryText = 'Художник'; break;
            case 'mods': categoryText = 'Мододел'; break;
            case 'community': categoryText = 'Организатор'; break;
        }
        
        card.innerHTML = `
            <div class="hof-name">${person.name}</div>
            <div class="hof-category">${categoryText}</div>
            <div class="hof-description">${person.description}</div>
            <div class="hof-social">${socialIcons}</div>
        `;
        
        hofGrid.appendChild(card);
    });
}

// Календарь
let currentDate = new Date(2017, 1, 1); // Февраль 2017 для демо

function renderCalendar(date) {
    const calendarGrid = document.querySelector('.calendar-grid');
    // Очищаем предыдущие дни (кроме заголовков)
    while (calendarGrid.children.length > 7) {
        calendarGrid.removeChild(calendarGrid.lastChild);
    }
    
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Обновляем заголовок
    const monthNames = ["ЯНВАРЬ", "ФЕВРАЛЬ", "МАРТ", "АПРЕЛЬ", "МАЙ", "ИЮНЬ",
        "ИЮЛЬ", "АВГУСТ", "СЕНТЯБРЬ", "ОКТЯБРЬ", "НОЯБРЬ", "ДЕКАБРЬ"];
    document.getElementById('current-month').textContent = `${monthNames[month]} ${year}`;
    
    // Первый день месяца
    const firstDay = new Date(year, month, 1);
    // Последний день месяца
    const lastDay = new Date(year, month + 1, 0);
    
    // День недели первого дня (0 - воскресенье, 1 - понедельник и т.д.)
    let firstDayOfWeek = firstDay.getDay();
    // Корректируем для отображения понедельника первым
    if (firstDayOfWeek === 0) firstDayOfWeek = 7;
    
    // Добавляем пустые ячейки для дней до первого дня месяца
    for (let i = 1; i < firstDayOfWeek; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarGrid.appendChild(emptyDay);
    }
    
    // Добавляем дни месяца
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayEvents = eventsData[dateString] || [];
        
        // Добавляем номер дня
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        dayElement.appendChild(dayNumber);
        
        // Если есть события, добавляем класс event-day для неонового эффекта
        if (dayEvents.length > 0) {
            dayElement.classList.add('event-day');
            
            // Добавляем всплывающую подсказку
            dayElement.title = `${dayEvents.length} событие(ий) - кликните для подробностей`;
            
            // Добавляем обработчик клика для показа деталей
            dayElement.addEventListener('click', () => showEventDetails(dateString, dayEvents));
        } else {
            // Для дней без событий тоже добавляем базовый обработчик
            dayElement.addEventListener('click', () => {
                if (dayEvents.length === 0) {
                    showNoEventsMessage(dateString);
                }
            });
        }
        
        calendarGrid.appendChild(dayElement);
    }
    
    // Обновляем список событий для текущего месяца
    updateEventsList(year, month);
}

function updateEventsList(year, month) {
    const eventsContainer = document.getElementById('events-container');
    eventsContainer.innerHTML = '';
    
    // Находим все события для текущего месяца
    const monthEvents = [];
    Object.keys(eventsData).forEach(dateStr => {
        const eventDate = new Date(dateStr);
        if (eventDate.getFullYear() === year && eventDate.getMonth() === month) {
            eventsData[dateStr].forEach(event => {
                monthEvents.push({
                    date: dateStr,
                    ...event
                });
            });
        }
    });
    
    // Сортируем события по дате
    monthEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Добавляем события в список
    if (monthEvents.length === 0) {
        eventsContainer.innerHTML = '<div class="event-item"><div>В этом месяце нет запланированных событий.</div></div>';
    } else {
        monthEvents.forEach(event => {
            const eventDate = new Date(event.date);
            const eventElement = document.createElement('div');
            eventElement.className = 'event-item';
            
            let typeIcon = '';
            let typeText = '';
            switch(event.type) {
                case 'game': 
                    typeIcon = '<i class="fas fa-gamepad"></i>';
                    typeText = 'Игра';
                    break;
                case 'trailer': 
                    typeIcon = '<i class="fas fa-film"></i>';
                    typeText = 'Трейлер';
                    break;
                case 'teaser': 
                    typeIcon = '<i class="fas fa-bullhorn"></i>';
                    typeText = 'Тизер';
                    break;
                default: 
                    typeIcon = '<i class="fas fa-star"></i>';
                    typeText = 'Событие';
            }
            
            eventElement.innerHTML = `
                <div>
                    <div class="event-date">${eventDate.getDate()} ${getMonthName(eventDate.getMonth())} ${eventDate.getFullYear()} 
                        <span class="event-type">${typeText}</span>
                    </div>
                    <div><strong>${typeIcon} ${event.title}</strong></div>
                    <div>${event.description}</div>
                </div>
            `;
            
            // Добавляем обработчик клика для события в списке
            eventElement.addEventListener('click', () => {
                showEventDetails(event.date, [event]);
            });
            
            eventsContainer.appendChild(eventElement);
        });
    }
}

function getMonthName(monthIndex) {
    const monthNames = ["января", "февраля", "марта", "апреля", "мая", "июня",
        "июля", "августа", "сентября", "октября", "ноября", "декабря"];
    return monthNames[monthIndex];
}

function showEventDetails(dateString, events) {
    const eventDate = new Date(dateString);
    const formattedDate = `${eventDate.getDate()} ${getMonthName(eventDate.getMonth())} ${eventDate.getFullYear()}`;
    
    let eventDetails = `📅 ${formattedDate}\n\n`;
    
    events.forEach((event, index) => {
        let eventIcon = '';
        switch(event.type) {
            case 'game': eventIcon = '🎮'; break;
            case 'trailer': eventIcon = '🎬'; break;
            case 'teaser': eventIcon = '📢'; break;
            default: eventIcon = '⭐';
        }
        
        eventDetails += `${eventIcon} ${event.title}\n`;
        eventDetails += `📝 ${event.description}\n`;
        
        if (index < events.length - 1) {
            eventDetails += '\n';
        }
    });
    
    // В реальном приложении здесь можно показать красивое модальное окно
    alert(eventDetails);
}

function showNoEventsMessage(dateString) {
    const date = new Date(dateString);
    const formattedDate = `${date.getDate()} ${getMonthName(date.getMonth())} ${date.getFullYear()}`;
    alert(`📅 ${formattedDate}\n\nВ этот день не было значимых событий Bendy.`);
}

// Расширенная функция для получения типа события
function getEventTypeDisplay(type) {
    const typeMap = {
        'game': { text: 'Релиз игры', icon: '🎮', color: '#ff6b00' },
        'trailer': { text: 'Трейлер', icon: '🎬', color: '#2a52be' },
        'teaser': { text: 'Тизер', icon: '📢', color: '#50c878' },
        'other': { text: 'Событие', icon: '⭐', color: '#d4af37' }
    };
    
    return typeMap[type] || { text: 'Событие', icon: '⭐', color: '#d4af37' };
}

// Функция для переключения на конкретный месяц и год
function goToDate(year, month) {
    currentDate = new Date(year, month, 1);
    renderCalendar(currentDate);
}

// Функция для добавления события через интерфейс (для будущего расширения)
function addEvent(dateString, event) {
    if (!eventsData[dateString]) {
        eventsData[dateString] = [];
    }
    eventsData[dateString].push(event);
    renderCalendar(currentDate);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация календаря
    renderCalendar(currentDate);
    
    // Инициализация доски почёта
    renderHofCards();

    // Обработчики для навигации по месяцам
    document.getElementById('prev-month').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
    });

    document.getElementById('next-month').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
    });

    document.getElementById('today').addEventListener('click', () => {
        currentDate = new Date();
        renderCalendar(currentDate);
    });

    // Добавляем обработчики клавиатуры для навигации
    document.addEventListener('keydown', (e) => {
        if (document.getElementById('calendar').classList.contains('active')) {
            switch(e.key) {
                case 'ArrowLeft':
                    currentDate.setMonth(currentDate.getMonth() - 1);
                    renderCalendar(currentDate);
                    break;
                case 'ArrowRight':
                    currentDate.setMonth(currentDate.getMonth() + 1);
                    renderCalendar(currentDate);
                    break;
                case 'Home':
                    currentDate = new Date(2017, 0, 1); // Начало хронологии Bendy
                    renderCalendar(currentDate);
                    break;
            }
        }
    });

    // Показываем приветственное сообщение
    setTimeout(() => {
        console.log(`
░█▀▄░█▀▀░█▀█░█▀█░█▀▀░█░█░░░█▀▀░█▀█░█▀█░█▀▀░▀█▀░█▀▀░█▀▄
░█▀▄░█▀▀░█▀▀░█░█░█░░░█▀█░░░█▀▀░█▀█░█░█░█▀▀░░█░░█▀▀░█▀▄
░▀░▀░▀▀▀░▀░░░▀░▀░▀▀▀░▀░▀░░░▀░░░▀░▀░▀░▀░▀░░░▀▀▀░▀▀▀░▀░▀

        Добро пожаловать в Bendy Chronicles RU!
        Используйте стрелки ← → для навигации по месяцам
        `);
    }, 1000);
});

// Экспорт функций для глобального использования (если нужно)
window.BendyCalendar = {
    goToDate,
    addEvent,
    renderCalendar,
    currentDate: () => currentDate
};
