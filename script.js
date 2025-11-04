// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const filmStrip = document.getElementById('filmStrip');
    const currentMonthYear = document.getElementById('currentMonthYear');
    const eventsOnlyToggle = document.getElementById('eventsOnlyToggle');
    const quickJumpBtn = document.getElementById('quickJumpBtn');
    const tooltip = document.getElementById('tooltip');
    const modal = document.getElementById('modal');
    const closeModal = document.querySelector('.close');
    const yearSelect = document.getElementById('yearSelect');
    const monthSelect = document.getElementById('monthSelect');
    const daySelect = document.getElementById('daySelect');
    const goToDateBtn = document.getElementById('goToDateBtn');
    
    // Переменные состояния
    let isEventsOnlyMode = false;
    let isDragging = false;
    let startX;
    let scrollLeft;
    let tooltipFixed = false;
    let tooltipPosition = 0;
    
    // Инициализация календаря
    initCalendar();
    
    // Обработчики событий
    filmStrip.addEventListener('scroll', updateCurrentMonth);
    eventsOnlyToggle.addEventListener('click', toggleEventsOnlyMode);
    quickJumpBtn.addEventListener('click', openModal);
    closeModal.addEventListener('click', closeModalHandler);
    goToDateBtn.addEventListener('click', goToSelectedDate);
    
    // Обработчики для перетаскивания
    filmStrip.addEventListener('mousedown', startDrag);
    filmStrip.addEventListener('mousemove', duringDrag);
    filmStrip.addEventListener('mouseup', endDrag);
    filmStrip.addEventListener('mouseleave', endDrag);
    
    filmStrip.addEventListener('touchstart', startDragTouch);
    filmStrip.addEventListener('touchmove', duringDragTouch);
    filmStrip.addEventListener('touchend', endDrag);
    
    // Инициализация календаря
    function initCalendar() {
        generateCalendar();
        updateCurrentMonth();
        populateDateSelectors();
        
        // Добавляем события в календарь
        bendyEvents.forEach(event => {
            addEventToCalendar(event);
        });
    }
    
    // Генерация календаря (2017-2025)
    function generateCalendar() {
        const startYear = 2017;
        const endYear = 2025;
        
        for (let year = startYear; year <= endYear; year++) {
            for (let month = 0; month < 12; month++) {
                createMonthCalendar(year, month);
            }
        }
    }
    
    // Создание календаря для конкретного месяца
    function createMonthCalendar(year, month) {
        const monthNames = [
            "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
            "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
        ];
        
        const monthContainer = document.createElement('div');
        monthContainer.className = 'month-container';
        monthContainer.dataset.year = year;
        monthContainer.dataset.month = month;
        
        const monthHeader = document.createElement('div');
        monthHeader.className = 'month-header';
        monthHeader.textContent = `${monthNames[month]} ${year}`;
        
        const monthGrid = document.createElement('div');
        monthGrid.className = 'month-grid';
        
        // Добавляем заголовки дней недели
        const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        dayNames.forEach(dayName => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'day-header';
            dayHeader.textContent = dayName;
            monthGrid.appendChild(dayHeader);
        });
        
        // Получаем первый день месяца и количество дней
        const firstDay = new Date(year, month, 1).getDay();
        // Корректируем для российского формата (понедельник - первый день)
        const firstDayIndex = firstDay === 0 ? 6 : firstDay - 1;
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Добавляем пустые ячейки для дней до начала месяца
        for (let i = 0; i < firstDayIndex; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'day empty';
            monthGrid.appendChild(emptyDay);
        }
        
        // Добавляем дни месяца
        const today = new Date();
        const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
        
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'day';
            dayElement.textContent = day;
            dayElement.dataset.date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            
            // Проверяем, является ли день текущим
            if (isCurrentMonth && day === today.getDate()) {
                dayElement.classList.add('current');
            }
            
            // Добавляем обработчики для tooltip
            dayElement.addEventListener('mouseenter', showTooltip);
            dayElement.addEventListener('mouseleave', hideTooltip);
            dayElement.addEventListener('click', fixTooltip);
            
            monthGrid.appendChild(dayElement);
        }
        
        monthContainer.appendChild(monthHeader);
        monthContainer.appendChild(monthGrid);
        filmStrip.appendChild(monthContainer);
    }
    
    // Добавление события в календарь
    function addEventToCalendar(event) {
        const date = new Date(event.date);
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        
        // Находим соответствующий месяц
        const monthContainer = document.querySelector(`.month-container[data-year="${year}"][data-month="${month}"]`);
        if (!monthContainer) return;
        
        // Находим соответствующий день
        const dayElement = monthContainer.querySelector(`.day[data-date="${event.date}"]`);
        if (!dayElement) return;
        
        // Добавляем класс события и сохраняем данные
        dayElement.classList.add('has-event', event.type);
        dayElement.dataset.eventTitle = event.title;
        dayElement.dataset.eventType = event.type;
        dayElement.dataset.eventDescription = event.description;
    }
    
    // Обновление отображаемого месяца и года
    function updateCurrentMonth() {
        const months = document.querySelectorAll('.month-container');
        const filmStripRect = filmStrip.getBoundingClientRect();
        const filmStripCenter = filmStripRect.left + filmStripRect.width / 2;
        
        let closestMonth = null;
        let minDistance = Infinity;
        
        months.forEach(month => {
            const monthRect = month.getBoundingClientRect();
            const monthCenter = monthRect.left + monthRect.width / 2;
            const distance = Math.abs(monthCenter - filmStripCenter);
            
            if (distance < minDistance) {
                minDistance = distance;
                closestMonth = month;
            }
        });
        
        if (closestMonth) {
            const year = parseInt(closestMonth.dataset.year);
            const month = parseInt(closestMonth.dataset.month);
            const monthNames = [
                "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
                "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
            ];
            
            currentMonthYear.textContent = `${monthNames[month]} ${year}`;
        }
    }
    
    // Режим "Только события"
    function toggleEventsOnlyMode() {
        isEventsOnlyMode = !isEventsOnlyMode;
        eventsOnlyToggle.textContent = isEventsOnlyMode ? "Все даты" : "Только события";
        
        const months = document.querySelectorAll('.month-container');
        const days = document.querySelectorAll('.day');
        
        if (isEventsOnlyMode) {
            // Скрываем пустые месяцы и дни без событий
            months.forEach(month => {
                const hasEvents = month.querySelector('.day.has-event');
                month.style.display = hasEvents ? 'block' : 'none';
            });
            
            days.forEach(day => {
                if (!day.classList.contains('has-event') && !day.classList.contains('empty')) {
                    day.style.visibility = 'hidden';
                }
            });
        } else {
            // Показываем все месяцы и дни
            months.forEach(month => {
                month.style.display = 'block';
            });
            
            days.forEach(day => {
                day.style.visibility = 'visible';
            });
        }
        
        // Обновляем отображение текущего месяца
        updateCurrentMonth();
    }
    
    // Показать tooltip
    function showTooltip(e) {
        if (tooltipFixed) return;
        
        const day = e.currentTarget;
        if (!day.classList.contains('has-event')) return;
        
        const eventTitle = day.dataset.eventTitle;
        const eventType = day.dataset.eventType;
        const eventDescription = day.dataset.eventDescription;
        
        const typeLabels = {
            'game_release': 'Релиз игры',
            'trailer': 'Трейлер',
            'announcement': 'Анонс',
            'teaser': 'Тизер',
            'future': 'Будущее событие'
        };
        
        const typeColors = {
            'game_release': 'var(--game-release)',
            'trailer': 'var(--trailer)',
            'announcement': 'var(--announcement)',
            'teaser': 'var(--teaser)',
            'future': 'var(--future)'
        };
        
        tooltip.innerHTML = `
            <h3>${eventTitle}</h3>
            <div class="event-type" style="background-color: ${typeColors[eventType]}">${typeLabels[eventType]}</div>
            <div class="event-description">${eventDescription}</div>
        `;
        
        tooltip.classList.remove('hidden');
        
        // Позиционируем tooltip рядом с курсором
        const rect = day.getBoundingClientRect();
        tooltip.style.left = `${rect.left + window.scrollX}px`;
        tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight - 10}px`;
    }
    
    // Скрыть tooltip
    function hideTooltip() {
        if (!tooltipFixed) {
            tooltip.classList.add('hidden');
        }
    }
    
    // Закрепить tooltip
    function fixTooltip(e) {
        const day = e.currentTarget;
        if (!day.classList.contains('has-event')) return;
        
        if (!tooltipFixed) {
            tooltipFixed = true;
            tooltip.classList.add('fixed');
            
            // Позиционируем tooltip в одном из углов экрана
            const positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
            tooltip.classList.remove(...positions);
            tooltip.classList.add(positions[tooltipPosition]);
            
            tooltipPosition = (tooltipPosition + 1) % positions.length;
        } else {
            // Снимаем закрепление
            tooltipFixed = false;
            tooltip.classList.remove('fixed');
            tooltip.classList.add('hidden');
        }
    }
    
    // Открыть модальное окно для быстрого перехода
    function openModal() {
        modal.classList.remove('hidden');
    }
    
    // Закрыть модальное окно
    function closeModalHandler() {
        modal.classList.add('hidden');
    }
    
    // Заполнить селекторы дат
    function populateDateSelectors() {
        // Годы (2017-2025)
        for (let year = 2017; year <= 2025; year++) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        }
        
        // Месяцы
        const monthNames = [
            "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
            "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
        ];
        
        monthNames.forEach((month, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = month;
            monthSelect.appendChild(option);
        });
        
        // Дни (обновляются при выборе месяца и года)
        yearSelect.addEventListener('change', updateDays);
        monthSelect.addEventListener('change', updateDays);
        
        // Устанавливаем текущую дату по умолчанию
        const today = new Date();
        yearSelect.value = today.getFullYear();
        monthSelect.value = today.getMonth();
        updateDays();
    }
    
    // Обновить список дней
    function updateDays() {
        const year = parseInt(yearSelect.value);
        const month = parseInt(monthSelect.value);
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Очищаем список дней
        daySelect.innerHTML = '';
        
        // Добавляем дни
        for (let day = 1; day <= daysInMonth; day++) {
            const option = document.createElement('option');
            option.value = day;
            option.textContent = day;
            daySelect.appendChild(option);
        }
    }
    
    // Перейти к выбранной дате
    function goToSelectedDate() {
        const year = parseInt(yearSelect.value);
        const month = parseInt(monthSelect.value);
        const day = parseInt(daySelect.value);
        
        const targetDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        // Находим соответствующий месяц
        const monthContainer = document.querySelector(`.month-container[data-year="${year}"][data-month="${month}"]`);
        if (!monthContainer) return;
        
        // Прокручиваем к месяцу
        monthContainer.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
        });
        
        // Подсвечиваем день
        const dayElement = monthContainer.querySelector(`.day[data-date="${targetDate}"]`);
        if (dayElement) {
            // Убираем предыдущее выделение
            document.querySelectorAll('.day.highlighted').forEach(day => {
                day.classList.remove('highlighted');
            });
            
            // Добавляем новое выделение
            dayElement.classList.add('highlighted');
            
            // Через 3 секунды убираем выделение
            setTimeout(() => {
                dayElement.classList.remove('highlighted');
            }, 3000);
        }
        
        // Закрываем модальное окно
        closeModalHandler();
    }
    
    // Функции для перетаскивания
    function startDrag(e) {
        isDragging = true;
        startX = e.pageX - filmStrip.offsetLeft;
        scrollLeft = filmStrip.scrollLeft;
        filmStrip.style.cursor = 'grabbing';
    }
    
    function duringDrag(e) {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - filmStrip.offsetLeft;
        const walk = (x - startX) * 2;
        filmStrip.scrollLeft = scrollLeft - walk;
    }
    
    function endDrag() {
        isDragging = false;
        filmStrip.style.cursor = 'grab';
        
        // Примагничивание к ближайшему месяцу
        snapToMonth();
    }
    
    // Touch события
    function startDragTouch(e) {
        isDragging = true;
        startX = e.touches[0].pageX - filmStrip.offsetLeft;
        scrollLeft = filmStrip.scrollLeft;
    }
    
    function duringDragTouch(e) {
        if (!isDragging) return;
        const x = e.touches[0].pageX - filmStrip.offsetLeft;
        const walk = (x - startX) * 2;
        filmStrip.scrollLeft = scrollLeft - walk;
    }
    
    // Примагничивание к месяцу
    function snapToMonth() {
        const months = document.querySelectorAll('.month-container');
        const filmStripRect = filmStrip.getBoundingClientRect();
        const filmStripCenter = filmStripRect.left + filmStripRect.width / 2;
        
        let closestMonth = null;
        let minDistance = Infinity;
        
        months.forEach(month => {
            const monthRect = month.getBoundingClientRect();
            const monthCenter = monthRect.left + monthRect.width / 2;
            const distance = Math.abs(monthCenter - filmStripCenter);
            
            if (distance < minDistance) {
                minDistance = distance;
                closestMonth = month;
            }
        });
        
        if (closestMonth) {
            closestMonth.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'center'
            });
        }
    }
    
    // Закрытие модального окна при клике вне его
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModalHandler();
        }
    });
    
    // Инициализация перетаскивания при загрузке
    filmStrip.style.cursor = 'grab';
});
