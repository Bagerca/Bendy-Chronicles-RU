// Основной модуль календаря
const CalendarApp = (function() {
    // Приватные переменные
    let isEventsOnlyMode = false;
    let isDragging = false;
    let startX;
    let scrollLeft;
    let tooltipFixed = false;
    let tooltipPosition = 0;
    
    // Элементы DOM
    let filmStrip, currentMonthYear, eventsOnlyToggle, quickJumpBtn, tooltip, modal;
    let closeModal, yearSelect, monthSelect, daySelect, goToDateBtn;
    
    // Публичные методы
    return {
        init: function() {
            this.cacheDOM();
            this.bindEvents();
            this.generateCalendar();
            this.updateCurrentMonth();
            this.populateDateSelectors();
            this.addEventsToCalendar();
        },
        
        cacheDOM: function() {
            filmStrip = document.getElementById('filmStrip');
            currentMonthYear = document.getElementById('currentMonthYear');
            eventsOnlyToggle = document.getElementById('eventsOnlyToggle');
            quickJumpBtn = document.getElementById('quickJumpBtn');
            tooltip = document.getElementById('tooltip');
            modal = document.getElementById('modal');
            closeModal = document.querySelector('.close');
            yearSelect = document.getElementById('yearSelect');
            monthSelect = document.getElementById('monthSelect');
            daySelect = document.getElementById('daySelect');
            goToDateBtn = document.getElementById('goToDateBtn');
        },
        
        bindEvents: function() {
            filmStrip.addEventListener('scroll', this.updateCurrentMonth.bind(this));
            eventsOnlyToggle.addEventListener('click', this.toggleEventsOnlyMode.bind(this));
            quickJumpBtn.addEventListener('click', this.openModal.bind(this));
            closeModal.addEventListener('click', this.closeModalHandler.bind(this));
            goToDateBtn.addEventListener('click', this.goToSelectedDate.bind(this));
            
            // Обработчики для перетаскивания
            filmStrip.addEventListener('mousedown', this.startDrag.bind(this));
            filmStrip.addEventListener('mousemove', this.duringDrag.bind(this));
            filmStrip.addEventListener('mouseup', this.endDrag.bind(this));
            filmStrip.addEventListener('mouseleave', this.endDrag.bind(this));
            
            filmStrip.addEventListener('touchstart', this.startDragTouch.bind(this));
            filmStrip.addEventListener('touchmove', this.duringDragTouch.bind(this));
            filmStrip.addEventListener('touchend', this.endDrag.bind(this));
            
            // Обработчики для модального окна
            yearSelect.addEventListener('change', this.updateDays.bind(this));
            monthSelect.addEventListener('change', this.updateDays.bind(this));
            window.addEventListener('click', this.closeModalOnOutsideClick.bind(this));
            
            // Инициализация перетаскивания
            filmStrip.style.cursor = 'grab';
        },
        
        generateCalendar: function() {
            const startYear = 2017;
            const endYear = 2025;
            
            for (let year = startYear; year <= endYear; year++) {
                for (let month = 0; month < 12; month++) {
                    this.createMonthCalendar(year, month);
                }
            }
        },
        
        createMonthCalendar: function(year, month) {
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
                dayElement.addEventListener('mouseenter', this.showTooltip.bind(this));
                dayElement.addEventListener('mouseleave', this.hideTooltip.bind(this));
                dayElement.addEventListener('click', this.fixTooltip.bind(this));
                
                monthGrid.appendChild(dayElement);
            }
            
            monthContainer.appendChild(monthHeader);
            monthContainer.appendChild(monthGrid);
            filmStrip.appendChild(monthContainer);
        },
        
        addEventsToCalendar: function() {
            bendyEvents.forEach(event => {
                this.addEventToCalendar(event);
            });
        },
        
        addEventToCalendar: function(event) {
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
        },
        
        updateCurrentMonth: function() {
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
        },
        
        toggleEventsOnlyMode: function() {
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
            
            this.updateCurrentMonth();
        },
        
        showTooltip: function(e) {
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
        },
        
        hideTooltip: function() {
            if (!tooltipFixed) {
                tooltip.classList.add('hidden');
            }
        },
        
        fixTooltip: function(e) {
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
        },
        
        openModal: function() {
            modal.classList.remove('hidden');
        },
        
        closeModalHandler: function() {
            modal.classList.add('hidden');
        },
        
        closeModalOnOutsideClick: function(e) {
            if (e.target === modal) {
                this.closeModalHandler();
            }
        },
        
        populateDateSelectors: function() {
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
            
            // Устанавливаем текущую дату по умолчанию
            const today = new Date();
            yearSelect.value = today.getFullYear();
            monthSelect.value = today.getMonth();
            this.updateDays();
        },
        
        updateDays: function() {
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
        },
        
        goToSelectedDate: function() {
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
            
            this.closeModalHandler();
        },
        
        // Функции для перетаскивания
        startDrag: function(e) {
            isDragging = true;
            startX = e.pageX - filmStrip.offsetLeft;
            scrollLeft = filmStrip.scrollLeft;
            filmStrip.style.cursor = 'grabbing';
        },
        
        duringDrag: function(e) {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - filmStrip.offsetLeft;
            const walk = (x - startX) * 2;
            filmStrip.scrollLeft = scrollLeft - walk;
        },
        
        startDragTouch: function(e) {
            isDragging = true;
            startX = e.touches[0].pageX - filmStrip.offsetLeft;
            scrollLeft = filmStrip.scrollLeft;
        },
        
        duringDragTouch: function(e) {
            if (!isDragging) return;
            const x = e.touches[0].pageX - filmStrip.offsetLeft;
            const walk = (x - startX) * 2;
            filmStrip.scrollLeft = scrollLeft - walk;
        },
        
        endDrag: function() {
            isDragging = false;
            filmStrip.style.cursor = 'grab';
            this.snapToMonth();
        },
        
        snapToMonth: function() {
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
    };
})();

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    CalendarApp.init();
});
