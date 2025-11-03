class BendyCalendar {
    constructor() {
        this.monthsTrack = document.getElementById('monthsTrack');
        this.tooltip = document.getElementById('eventTooltip');
        this.currentPosition = 0;
        this.monthWidth = 320;
        this.gap = 40;
        this.compactMode = false;
        this.activeFilter = 'all';
        this.monthsWithEvents = new Set();
        
        this.init();
    }

    init() {
        this.calculateMonthsWithEvents();
        this.generateMonths();
        this.setupEventListeners();
        this.centerOnCurrentMonth();
    }

    calculateMonthsWithEvents() {
        eventsData.forEach(event => {
            const date = new Date(event.date);
            const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
            this.monthsWithEvents.add(monthKey);
        });
    }

    generateMonths() {
        const startYear = 2017;
        const endYear = 2025;
        
        for (let year = startYear; year <= endYear; year++) {
            for (let month = 0; month < 12; month++) {
                const monthKey = `${year}-${month}`;
                
                // Показываем только месяцы с событиями
                if (this.monthsWithEvents.has(monthKey)) {
                    const monthElement = this.createMonthElement(year, month);
                    this.monthsTrack.appendChild(monthElement);
                }
            }
        }
    }

    createMonthElement(year, month) {
        const monthDate = new Date(year, month, 1);
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
                dayEvents.forEach(event => {
                    dayClass += ` event-${event.type}`;
                });
                hasEvents = true;
            }
            
            html += `<div class="${dayClass}" data-date="${dateStr}">${day}</div>`;
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
        
        // Свайпы
        this.setupSwipe();
        
        // События дней
        this.monthsTrack.addEventListener('mouseover', (e) => {
            if (e.target.classList.contains('day') && e.target.dataset.date) {
                this.showTooltip(e.target, e.target.dataset.date);
            }
        });
        
        this.monthsTrack.addEventListener('mouseout', () => {
            this.hideTooltip();
        });

        // Обновление активного месяца при скролле
        window.addEventListener('scroll', () => this.updateActiveMonth());
        window.addEventListener('resize', () => this.updateActiveMonth());
    }

    scroll(direction) {
        const scrollAmount = (this.monthWidth + this.gap) * direction;
        this.currentPosition += scrollAmount;
        this.updatePosition();
    }

    updatePosition() {
        this.monthsTrack.style.transform = `translateX(${this.currentPosition}px)`;
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
        
        // Позиционируем тултип так, чтобы он не выходил за экран
        let left = rect.left;
        let top = rect.bottom + 10;
        
        if (left + tooltipRect.width > window.innerWidth) {
            left = window.innerWidth - tooltipRect.width - 20;
        }
        
        if (top + tooltipRect.height > window.innerHeight) {
            top = rect.top - tooltipRect.height - 10;
        }
        
        this.tooltip.style.left = left + 'px';
        this.tooltip.style.top = top + 'px';
    }

    hideTooltip() {
        this.tooltip.classList.remove('visible');
    }

    getTypeLabel(type) {
        const labels = {
            'game': '🎮 Игра',
            'trailer': '🎬 Трейлер',
            'announcement': '📢 Анонс',
            'future': '🔮 Будущее'
        };
        return labels[type] || type;
    }

    setupSwipe() {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        this.monthsTrack.addEventListener('mousedown', (e) => {
            startX = e.clientX;
            currentX = this.currentPosition;
            isDragging = true;
            this.monthsTrack.style.transition = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const delta = e.clientX - startX;
            this.currentPosition = currentX + delta;
            this.updatePosition();
        });

        document.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            this.monthsTrack.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            this.snapToMonth();
        });

        // Touch events для мобильных
        this.monthsTrack.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            currentX = this.currentPosition;
            isDragging = true;
            this.monthsTrack.style.transition = 'none';
        });

        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const delta = e.touches[0].clientX - startX;
            this.currentPosition = currentX + delta;
            this.updatePosition();
        });

        document.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;
            this.monthsTrack.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            this.snapToMonth();
        });
    }

    snapToMonth() {
        const months = document.querySelectorAll('.month');
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
    }

    centerOnCurrentMonth() {
        const today = new Date();
        const currentMonthKey = `${today.getFullYear()}-${today.getMonth()}`;
        
        if (this.monthsWithEvents.has(currentMonthKey)) {
            const currentMonthElement = document.querySelector(`.month[data-year="${today.getFullYear()}"][data-month="${today.getMonth()}"]`);
            
            if (currentMonthElement) {
                const targetPosition = -currentMonthElement.offsetLeft + (window.innerWidth - currentMonthElement.offsetWidth) / 2;
                this.animateToPosition(targetPosition);
            }
        }
    }

    goToSelectedDate() {
        const input = document.getElementById('monthInput');
        const [year, month] = input.value.split('-').map(Number);
        const monthKey = `${year}-${month - 1}`;
        
        if (this.monthsWithEvents.has(monthKey)) {
            const targetMonthElement = document.querySelector(`.month[data-year="${year}"][data-month="${month - 1}"]`);
            
            if (targetMonthElement) {
                const targetPosition = -targetMonthElement.offsetLeft + (window.innerWidth - targetMonthElement.offsetWidth) / 2;
                this.animateToPosition(targetPosition);
            }
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
