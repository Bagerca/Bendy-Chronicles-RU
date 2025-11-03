class BendyCalendar {
    constructor() {
        this.monthsTrack = document.getElementById('monthsTrack');
        this.tooltip = document.getElementById('eventTooltip');
        this.currentPosition = 0;
        this.monthWidth = 280;
        this.gap = 30;
        this.compactMode = false;
        this.activeFilter = 'all';
        this.isDragging = false;
        this.startX = 0;
        this.currentX = 0;
        
        this.init();
    }

    init() {
        this.generateMonths();
        this.setupEventListeners();
        this.centerOnCurrentMonth();
    }

    generateMonths() {
        // Создаем только месяцы, в которых есть события
        const monthsWithEvents = this.getMonthsWithEvents();
        
        monthsWithEvents.forEach(({ year, month }) => {
            const monthElement = this.createMonthElement(year, month);
            this.monthsTrack.appendChild(monthElement);
        });
    }

    getMonthsWithEvents() {
        const monthsSet = new Set();
        
        eventsData.forEach(event => {
            const date = new Date(event.date);
            const year = date.getFullYear();
            const month = date.getMonth();
            monthsSet.add(`${year}-${month}`);
        });
        
        // Преобразуем обратно в массив объектов
        return Array.from(monthsSet).map(monthStr => {
            const [year, month] = monthStr.split('-').map(Number);
            return { year, month };
        }).sort((a, b) => {
            // Сортируем по дате
            return new Date(a.year, a.month) - new Date(b.year, b.month);
        });
    }

    createMonthElement(year, month) {
        const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 
                           'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
        
        const monthDiv = document.createElement('div');
        monthDiv.className = 'month';
        monthDiv.dataset.year = year;
        monthDiv.dataset.month = month;
        
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();
        
        let html = `
            <div class="month-header">${monthNames[month]} ${year}</div>
            <div class="days-grid">
        `;
        
        // Дни недели
        const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
        dayNames.forEach(day => {
            html += `<div class="day-header">${day}</div>`;
        });
        
        // Пустые ячейки перед первым днем
        for (let i = 0; i < firstDay; i++) {
            html += '<div class="day other-month"></div>';
        }
        
        // Дни месяца
        let hasEvents = false;
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayEvents = this.getEventsForDate(dateStr);
            const isToday = year === today.getFullYear() && month === today.getMonth() && day === today.getDate();
            
            let dayClass = 'day';
            if (isToday) dayClass += ' today';
            if (dayEvents.length > 0) {
                dayClass += ' has-event';
                // Добавляем класс для каждого типа события
                dayEvents.forEach(event => {
                    dayClass += ` event-${event.type}`;
                });
                hasEvents = true;
            }
            
            html += `<div class="${dayClass}" data-date="${dateStr}">${day}</div>`;
        }
        
        // Пустые ячейки после последнего дня
        const lastDay = new Date(year, month, daysInMonth).getDay();
        for (let i = lastDay + 1; i < 7; i++) {
            html += '<div class="day other-month"></div>';
        }
        
        html += '</div>';
        monthDiv.innerHTML = html;
        
        if (hasEvents) {
            monthDiv.classList.add('has-events');
        }
        
        return monthDiv;
    }

    getEventsForDate(dateStr) {
        return eventsData.filter(event => {
            if (this.activeFilter !== 'all' && event.type !== this.activeFilter) {
                return false;
            }
            return event.date === dateStr;
        });
    }

    setupEventListeners() {
        // Навигационные кнопки
        document.querySelector('.prev').addEventListener('click', () => this.scroll(-1));
        document.querySelector('.next').addEventListener('click', () => this.scroll(1));
        
        // Фильтры
        document.querySelectorAll('.filter-btn').forEach(btn => {
            if (btn.id !== 'compactMode') {
                btn.addEventListener('click', (e) => {
                    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    this.activeFilter = e.target.dataset.filter;
                    this.updateCalendar();
                });
            }
        });
        
        // Компактный режим
        document.getElementById('compactMode').addEventListener('click', () => {
            this.compactMode = !this.compactMode;
            document.getElementById('compactMode').classList.toggle('active');
            document.querySelector('.calendar-container').classList.toggle('compact');
        });
        
        // Переход к дате
        document.getElementById('goToDate').addEventListener('click', () => {
            this.goToSelectedDate();
        });

        // Кнопка "Сегодня"
        document.getElementById('todayBtn').addEventListener('click', () => {
            this.centerOnCurrentMonth();
        });
        
        // События дней
        this.monthsTrack.addEventListener('mouseover', (e) => {
            const dayElement = e.target.closest('.day');
            if (dayElement && dayElement.dataset.date) {
                this.showTooltip(dayElement, dayElement.dataset.date);
            }
        });
        
        this.monthsTrack.addEventListener('mouseout', () => {
            this.hideTooltip();
        });

        // Свайпы
        this.setupSwipe();
        
        // Ресайз
        window.addEventListener('resize', () => {
            this.updateActiveMonth();
        });
    }

    scroll(direction) {
        const scrollAmount = (this.monthWidth + this.gap) * direction;
        this.currentPosition += scrollAmount;
        this.updatePosition();
        this.snapToMonth();
    }

    updatePosition() {
        this.monthsTrack.style.transform = `translateX(${this.currentPosition}px)`;
    }

    setupSwipe() {
        const track = this.monthsTrack;

        track.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.startX = e.clientX;
            this.currentX = this.currentPosition;
            track.style.transition = 'none';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            const delta = e.clientX - this.startX;
            this.currentPosition = this.currentX + delta;
            this.updatePosition();
        });

        document.addEventListener('mouseup', () => {
            if (!this.isDragging) return;
            this.isDragging = false;
            track.style.transition = 'transform 0.3s ease';
            this.snapToMonth();
        });

        // Touch events
        track.addEventListener('touchstart', (e) => {
            this.isDragging = true;
            this.startX = e.touches[0].clientX;
            this.currentX = this.currentPosition;
            track.style.transition = 'none';
        });

        document.addEventListener('touchmove', (e) => {
            if (!this.isDragging) return;
            const delta = e.touches[0].clientX - this.startX;
            this.currentPosition = this.currentX + delta;
            this.updatePosition();
        });

        document.addEventListener('touchend', () => {
            if (!this.isDragging) return;
            this.isDragging = false;
            track.style.transition = 'transform 0.3s ease';
            this.snapToMonth();
        });
    }

    snapToMonth() {
        const months = Array.from(document.querySelectorAll('.month'));
        if (months.length === 0) return;

        const containerCenter = window.innerWidth / 2;
        
        let closestMonth = null;
        let minDistance = Infinity;
        
        months.forEach(month => {
            const rect = month.getBoundingClientRect();
            const monthCenter = rect.left + rect.width / 2;
            const distance = Math.abs(containerCenter - monthCenter);
            
            if (distance < minDistance) {
                minDistance = distance;
                closestMonth = month;
            }
        });
        
        if (closestMonth) {
            const targetPosition = -closestMonth.offsetLeft + (window.innerWidth - closestMonth.offsetWidth) / 2;
            this.animateToPosition(targetPosition);
        }
    }

    animateToPosition(targetPosition) {
        this.currentPosition = targetPosition;
        this.updatePosition();
        this.updateActiveMonth();
    }

    updateActiveMonth() {
        const months = document.querySelectorAll('.month');
        const containerCenter = window.innerWidth / 2;
        
        months.forEach(month => {
            const rect = month.getBoundingClientRect();
            const monthCenter = rect.left + rect.width / 2;
            const distance = Math.abs(containerCenter - monthCenter);
            
            month.classList.toggle('active', distance < rect.width / 2);
        });
    }

    showTooltip(dayElement, dateStr) {
        const events = this.getEventsForDate(dateStr);
        if (events.length === 0) return;
        
        let tooltipHTML = '';
        events.forEach(event => {
            tooltipHTML += `
                <div class="event-item">
                    <h3>${event.title}</h3>
                    <span class="event-type ${event.type}">${this.getTypeLabel(event.type)}</span>
                    <p>${event.description}</p>
                </div>
            `;
        });
        
        this.tooltip.innerHTML = tooltipHTML;
        this.tooltip.classList.add('visible');
        
        const rect = dayElement.getBoundingClientRect();
        const tooltipRect = this.tooltip.getBoundingClientRect();
        
        // Позиционирование тултипа
        let left = rect.left;
        let top = rect.bottom + 10;
        
        // Проверяем, чтобы тултип не выходил за экран
        if (left + tooltipRect.width > window.innerWidth) {
            left = window.innerWidth - tooltipRect.width - 20;
        }
        
        if (top + tooltipRect.height > window.innerHeight) {
            top = rect.top - tooltipRect.height - 10;
        }
        
        this.tooltip.style.left = Math.max(10, left) + 'px';
        this.tooltip.style.top = Math.max(10, top) + 'px';
    }

    hideTooltip() {
        this.tooltip.classList.remove('visible');
    }

    getTypeLabel(type) {
        const labels = {
            'game': 'Игра',
            'trailer': 'Трейлер',
            'announcement': 'Анонс',
            'future': 'Будущее'
        };
        return labels[type] || type;
    }

    centerOnCurrentMonth() {
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();
        
        const currentMonthElement = document.querySelector(`.month[data-year="${currentYear}"][data-month="${currentMonth}"]`);
        
        if (currentMonthElement) {
            const targetPosition = -currentMonthElement.offsetLeft + (window.innerWidth - currentMonthElement.offsetWidth) / 2;
            this.animateToPosition(targetPosition);
        } else {
            // Если текущего месяца нет в отображаемых, показываем самый близкий
            this.showClosestMonth(currentYear, currentMonth);
        }
    }

    showClosestMonth(targetYear, targetMonth) {
        const months = Array.from(document.querySelectorAll('.month'));
        if (months.length === 0) return;

        const targetDate = new Date(targetYear, targetMonth);
        
        let closestMonth = null;
        let minDiff = Infinity;
        
        months.forEach(month => {
            const monthYear = parseInt(month.dataset.year);
            const monthMonth = parseInt(month.dataset.month);
            const monthDate = new Date(monthYear, monthMonth);
            const diff = Math.abs(targetDate - monthDate);
            
            if (diff < minDiff) {
                minDiff = diff;
                closestMonth = month;
            }
        });
        
        if (closestMonth) {
            const targetPosition = -closestMonth.offsetLeft + (window.innerWidth - closestMonth.offsetWidth) / 2;
            this.animateToPosition(targetPosition);
        }
    }

    goToSelectedDate() {
        const input = document.getElementById('monthInput');
        const [year, month] = input.value.split('-').map(Number);
        
        const targetMonthElement = document.querySelector(`.month[data-year="${year}"][data-month="${month - 1}"]`);
        
        if (targetMonthElement) {
            const targetPosition = -targetMonthElement.offsetLeft + (window.innerWidth - targetMonthElement.offsetWidth) / 2;
            this.animateToPosition(targetPosition);
        } else {
            this.showClosestMonth(year, month - 1);
        }
    }

    updateCalendar() {
        const months = document.querySelectorAll('.month');
        months.forEach(month => {
            const year = parseInt(month.dataset.year);
            const monthNum = parseInt(month.dataset.month);
            const days = month.querySelectorAll('.day[data-date]');
            
            let monthHasEvents = false;
            
            days.forEach(day => {
                const dateStr = day.dataset.date;
                const events = this.getEventsForDate(dateStr);
                
                // Обновляем классы событий
                day.classList.remove('has-event', 'event-game', 'event-trailer', 'event-announcement', 'event-future');
                
                if (events.length > 0) {
                    day.classList.add('has-event');
                    events.forEach(event => {
                        day.classList.add(`event-${event.type}`);
                    });
                    monthHasEvents = true;
                }
            });
            
            // Обновляем статус месяца
            if (monthHasEvents) {
                month.classList.add('has-events');
            } else {
                month.classList.remove('has-events');
            }
        });
    }
}

// Инициализация календаря
document.addEventListener('DOMContentLoaded', () => {
    new BendyCalendar();
});
