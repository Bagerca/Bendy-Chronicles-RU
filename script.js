// Основная логика приложения

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
        if (person.social.youtube) socialIcons += `<a href="${person.social.youtube}" class="social-icon"><i class="fab fa-youtube"></i></a>`;
        if (person.social.vk) socialIcons += `<a href="${person.social.vk}" class="social-icon"><i class="fab fa-vk"></i></a>`;
        if (person.social.telegram) socialIcons += `<a href="${person.social.telegram}" class="social-icon"><i class="fab fa-telegram"></i></a>`;
        if (person.social.deviantart) socialIcons += `<a href="${person.social.deviantart}" class="social-icon"><i class="fab fa-deviantart"></i></a>`;
        if (person.social.instagram) socialIcons += `<a href="${person.social.instagram}" class="social-icon"><i class="fab fa-instagram"></i></a>`;
        if (person.social.artstation) socialIcons += `<a href="${person.social.artstation}" class="social-icon"><i class="fab fa-artstation"></i></a>`;
        if (person.social.github) socialIcons += `<a href="${person.social.github}" class="social-icon"><i class="fab fa-github"></i></a>`;
        if (person.social.discord) socialIcons += `<a href="${person.social.discord}" class="social-icon"><i class="fab fa-discord"></i></a>`;
        if (person.social.tiktok) socialIcons += `<a href="${person.social.tiktok}" class="social-icon"><i class="fab fa-tiktok"></i></a>`;
        
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
    for (let i = calendarGrid.children.length - 1; i >= 7; i--) {
        calendarGrid.removeChild(calendarGrid.children[i]);
    }
    
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Обновляем заголовок
    const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
        "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
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
        
        // Добавляем индикаторы событий
        if (dayEvents.length > 0) {
            const indicators = document.createElement('div');
            indicators.className = 'event-indicators';
            
            dayEvents.forEach(event => {
                const indicator = document.createElement('div');
                indicator.className = `event-indicator event-${event.type}`;
                indicator.title = event.title;
                indicators.appendChild(indicator);
            });
            
            dayElement.appendChild(indicators);
            
            // Добавляем обработчик клика для показа деталей
            dayElement.addEventListener('click', () => showEventDetails(dateString, dayEvents));
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
        eventsContainer.innerHTML = '<p>В этом месяце нет запланированных событий.</p>';
    } else {
        monthEvents.forEach(event => {
            const eventDate = new Date(event.date);
            const eventElement = document.createElement('div');
            eventElement.className = 'event-item';
            
            let typeIcon = '';
            switch(event.type) {
                case 'game': typeIcon = '<i class="fas fa-gamepad"></i>'; break;
                case 'trailer': typeIcon = '<i class="fas fa-film"></i>'; break;
                case 'teaser': typeIcon = '<i class="fas fa-bullhorn"></i>'; break;
                default: typeIcon = '<i class="fas fa-star"></i>';
            }
            
            eventElement.innerHTML = `
                <div>
                    <div class="event-date">${eventDate.getDate()} ${getMonthName(eventDate.getMonth())} ${eventDate.getFullYear()}</div>
                    <div><strong>${typeIcon} ${event.title}</strong></div>
                    <div>${event.description}</div>
                </div>
            `;
            
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
    // В реальном приложении здесь можно показать модальное окно с деталями
    alert(`События ${dateString}:\n\n${events.map(e => `• ${e.title}: ${e.description}`).join('\n')}`);
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
});
