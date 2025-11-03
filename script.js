class BendyCalendar {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = null;
        this.initializeElements();
        this.init();
    }

    initializeElements() {
        this.calendarElement = document.getElementById('calendar');
        this.yearSelect = document.getElementById('yearSelect');
        this.monthSelect = document.getElementById('monthSelect');
        this.todayBtn = document.getElementById('todayBtn');
        this.prevMonthBtn = document.getElementById('prevMonth');
        this.nextMonthBtn = document.getElementById('nextMonth');
        this.currentMonthElement = document.getElementById('currentMonth');
        this.selectedDateElement = document.getElementById('selectedDate');
        this.eventsListElement = document.getElementById('eventsList');
    }

    init() {
        this.generateYearOptions();
        this.generateMonthOptions();
        this.renderCalendar();
        this.setupEventListeners();
        this.updateCurrentMonthDisplay();
        this.showTodaysEvents();
    }

    generateYearOptions() {
        this.yearSelect.innerHTML = '<option value="">Год</option>';
        for (let year = CALENDAR_CONFIG.START_YEAR; year <= CALENDAR_CONFIG.END_YEAR; year++) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            this.yearSelect.appendChild(option);
        }
    }

    generateMonthOptions() {
        this.monthSelect.innerHTML = '<option value="">Месяц</option>';
        CALENDAR_CONFIG.MONTHS.forEach((month, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = month;
            this.monthSelect.appendChild(option);
        });
    }

    renderCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        this.calendarElement.innerHTML = '';

        // Добавляем заголовки дней недели
        const weekdaysContainer = document.createElement('div');
        weekdaysContainer.className = 'weekdays';
        CALENDAR_CONFIG.WEEKDAYS.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'weekday';
            dayElement.textContent = day;
            weekdaysContainer.appendChild(dayElement);
        });
        this.calendarElement.appendChild(weekdaysContainer);

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

        // Добавляем пустые ячейки для дней предыдущего месяца
        for (let i = 0; i < startingDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'day';
            this.calendarElement.appendChild(emptyDay);
        }

        // Добавляем дни текущего месяца
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'day current-month';
            dayElement.textContent = day;
            
            const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            dayElement.dataset.date = dateString;

            // Проверяем, сегодня ли это
            const today = new Date();
            if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
                dayElement.classList.add('today');
            }

            // Проверяем события
            const events = this.getEventsForDate(dateString);
            if (events.length > 0) {
                dayElement.classList.add('has-event');
                // Используем тип первого события для цвета
                dayElement.classList.add(events[0].type);
            }

            dayElement.addEventListener('click', () => this.selectDate(dateString));
            this.calendarElement.appendChild(dayElement);
        }
    }

    getEventsForDate(dateString) {
        return eventsData.filter(event => event.date === dateString);
    }

    selectDate(dateString) {
        // Убираем выделение с предыдущей даты
        document.querySelectorAll('.day.active').forEach(day => {
            day.classList.remove('active');
        });

        // Выделяем новую дату
        const selectedDay = document.querySelector(`[data-date="${dateString}"]`);
        if (selectedDay) {
            selectedDay.classList.add('active');
        }

        this.selectedDate = dateString;
        this.showEventsForDate(dateString);
    }

    showEventsForDate(dateString) {
        const events = this.getEventsForDate(dateString);
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        this.selectedDateElement.textContent = formattedDate;

        if (events.length === 0) {
            this.eventsListElement.innerHTML = '<div class="empty-events">Нет событий на эту дату</div>';
            return;
        }

        this.eventsListElement.innerHTML = events.map(event => `
            <div class="event-item">
                <span class="event-type ${event.type}">${this.getEventTypeName(event.type)}</span>
                <div class="event-title">${event.title}</div>
            </div>
        `).join('');
    }

    showTodaysEvents() {
        const today = new Date();
        const todayString = today.toISOString().split('T')[0];
        this.selectDate(todayString);
        
        // Находим и выделяем сегодняшний день
        const todayElement = document.querySelector(`[data-date="${todayString}"]`);
        if (todayElement) {
            todayElement.classList.add('active');
        }
    }

    getEventTypeName(type) {
        const names = {
            'teaser': 'Тизер',
            'trailer': 'Трейлер', 
            'game': 'Игра',
            'announcement': 'Анонс'
        };
        return names[type] || type;
    }

    navigateMonth(direction) {
        this.currentDate.setMonth(this.currentDate.getMonth() + direction);
        this.renderCalendar();
        this.updateCurrentMonthDisplay();
        this.updateSelects();
        this.showTodaysEvents();
    }

    updateCurrentMonthDisplay() {
        const monthName = CALENDAR_CONFIG.MONTHS[this.currentDate.getMonth()];
        const year = this.currentDate.getFullYear();
        this.currentMonthElement.textContent = `${monthName} ${year}`;
    }

    updateSelects() {
        this.yearSelect.value = this.currentDate.getFullYear();
        this.monthSelect.value = this.currentDate.getMonth();
    }

    goToToday() {
        this.currentDate = new Date();
        this.renderCalendar();
        this.updateCurrentMonthDisplay();
        this.updateSelects();
        this.showTodaysEvents();
    }

    setupEventListeners() {
        this.prevMonthBtn.addEventListener('click', () => this.navigateMonth(-1));
        this.nextMonthBtn.addEventListener('click', () => this.navigateMonth(1));
        this.todayBtn.addEventListener('click', () => this.goToToday());

        this.yearSelect.addEventListener('change', (e) => {
            if (e.target.value) {
                this.currentDate.setFullYear(parseInt(e.target.value));
                this.renderCalendar();
                this.updateCurrentMonthDisplay();
            }
        });

        this.monthSelect.addEventListener('change', (e) => {
            if (e.target.value) {
                this.currentDate.setMonth(parseInt(e.target.value));
                this.renderCalendar();
                this.updateCurrentMonthDisplay();
            }
        });
    }
}

// Инициализация календаря при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new BendyCalendar();
});
