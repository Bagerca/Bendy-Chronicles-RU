class BendyTimeline {
    constructor() {
        this.events = [];
        this.filteredEvents = [];
        this.pinnedEvents = new Set();
        this.currentFilter = 'all';
        this.searchTerm = '';
        
        this.filmStrip = document.getElementById('filmStrip');
        this.pinnedList = document.getElementById('pinnedList');
        this.searchInput = document.getElementById('searchInput');
        
        this.isDragging = false;
        this.startX = 0;
        this.scrollLeft = 0;
        this.autoScrollInterval = null;
        this.inactivityTimer = null;
        
        this.init();
    }
    
    async init() {
        await this.loadEvents();
        this.setupEventListeners();
        this.renderTimeline();
        this.startAutoScroll();
    }
    
    async loadEvents() {
        try {
            const response = await fetch('events.json');
            const data = await response.json();
            this.events = data.events.map(event => ({
                ...event,
                date: new Date(event.date),
                id: this.generateId(event)
            }));
            this.filteredEvents = [...this.events];
        } catch (error) {
            console.error('Ошибка загрузки событий:', error);
        }
    }
    
    generateId(event) {
        return `${event.date.getTime()}-${event.title}`;
    }
    
    setupEventListeners() {
        // Фильтры
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.applyFilters();
            });
        });
        
        // Поиск
        this.searchInput.addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.applyFilters();
        });
        
        // Перетаскивание плёнки
        this.filmStrip.addEventListener('mousedown', (e) => {
            this.stopAutoScroll();
            this.isDragging = true;
            this.startX = e.pageX - this.filmStrip.offsetLeft;
            this.scrollLeft = this.filmStrip.scrollLeft;
            this.filmStrip.style.cursor = 'grabbing';
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            e.preventDefault();
            const x = e.pageX - this.filmStrip.offsetLeft;
            const walk = (x - this.startX) * 2;
            this.filmStrip.scrollLeft = this.scrollLeft - walk;
        });
        
        document.addEventListener('mouseup', () => {
            this.isDragging = false;
            this.filmStrip.style.cursor = 'grab';
            this.resetInactivityTimer();
        });
        
        // Прокрутка колёсиком
        this.filmStrip.addEventListener('wheel', (e) => {
            this.stopAutoScroll();
            this.filmStrip.scrollLeft += e.deltaY;
            e.preventDefault();
            this.resetInactivityTimer();
        });
        
        // Восстановление автопрокрутки при отсутствии активности
        this.resetInactivityTimer();
    }
    
    applyFilters() {
        this.filteredEvents = this.events.filter(event => {
            const matchesFilter = this.currentFilter === 'all' || event.type === this.currentFilter;
            const matchesSearch = !this.searchTerm || 
                event.title.toLowerCase().includes(this.searchTerm) ||
                event.description.toLowerCase().includes(this.searchTerm);
            return matchesFilter && matchesSearch;
        });
        this.renderTimeline();
    }
    
    renderTimeline() {
        // Группировка событий по месяцам
        const eventsByMonth = this.groupEventsByMonth(this.filteredEvents);
        
        this.filmStrip.innerHTML = '';
        
        Object.keys(eventsByMonth).sort().forEach(monthKey => {
            const [year, month] = monthKey.split('-');
            const monthEvents = eventsByMonth[monthKey];
            
            const frame = document.createElement('div');
            frame.className = 'film-frame';
            
            const header = document.createElement('div');
            header.className = 'frame-header';
            header.innerHTML = `
                <div class="month">${this.getMonthName(month)}</div>
                <div class="year">${year}</div>
            `;
            
            const content = document.createElement('div');
            content.className = 'frame-content';
            
            monthEvents.forEach(event => {
                const eventDay = document.createElement('div');
                eventDay.className = `event-day has-event event-type-${event.type}`;
                eventDay.setAttribute('data-date', event.date.toISOString().split('T')[0]);
                
                eventDay.innerHTML = `
                    <div class="day-number">${event.date.getDate()}</div>
                    <div class="event-marker">${this.getEventIcon(event.type)}</div>
                    <div class="event-preview">${event.title}</div>
                `;
                
                // Всплывающее окно при наведении
                eventDay.addEventListener('mouseenter', (e) => {
                    this.showTooltip(e, event);
                });
                
                eventDay.addEventListener('mouseleave', () => {
                    this.hideTooltip();
                });
                
                content.appendChild(eventDay);
            });
            
            frame.appendChild(header);
            frame.appendChild(content);
            this.filmStrip.appendChild(frame);
        });
    }
    
    groupEventsByMonth(events) {
        return events.reduce((groups, event) => {
            const key = `${event.date.getFullYear()}-${event.date.getMonth()}`;
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(event);
            return groups;
        }, {});
    }
    
    getMonthName(month) {
        const months = [
            'ЯНВАРЬ', 'ФЕВРАЛЬ', 'МАРТ', 'АПРЕЛЬ', 'МАЙ', 'ИЮНЬ',
            'ИЮЛЬ', 'АВГУСТ', 'СЕНТЯБРЬ', 'ОКТЯБРЬ', 'НОЯБРЬ', 'ДЕКАБРЬ'
        ];
        return months[parseInt(month)];
    }
    
    getEventIcon(type) {
        const icons = {
            game: '🎮',
            trailer: '🎥',
            teaser: '📢',
            announcement: '⭐'
        };
        return icons[type] || '⭐';
    }
    
    showTooltip(event, eventData) {
        this.hideTooltip();
        
        const tooltip = document.createElement('div');
        tooltip.className = 'event-tooltip';
        tooltip.innerHTML = `
            <h4>${eventData.title}</h4>
            <p>${eventData.description}</p>
            <button class="pin-btn" data-id="${eventData.id}">
                ${this.pinnedEvents.has(eventData.id) ? '★ Открепить' : '☆ Закрепить'}
            </button>
        `;
        
        const rect = event.target.getBoundingClientRect();
        tooltip.style.left = '0';
        tooltip.style.top = '100%';
        
        event.target.appendChild(tooltip);
        
        // Обработчик кнопки закрепления
        tooltip.querySelector('.pin-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.togglePinEvent(eventData);
        });
    }
    
    hideTooltip() {
        const existingTooltip = document.querySelector('.event-tooltip');
        if (existingTooltip) {
            existingTooltip.remove();
        }
    }
    
    togglePinEvent(event) {
        if (this.pinnedEvents.has(event.id)) {
            this.pinnedEvents.delete(event.id);
        } else {
            this.pinnedEvents.add(event.id);
        }
        this.updatePinnedEvents();
        this.renderTimeline();
    }
    
    updatePinnedEvents() {
        this.pinnedList.innerHTML = '';
        
        this.pinnedEvents.forEach(eventId => {
            const event = this.events.find(e => e.id === eventId);
            if (event) {
                const pinnedEvent = document.createElement('div');
                pinnedEvent.className = 'pinned-event';
                pinnedEvent.innerHTML = `
                    <div class="pinned-event-info">
                        <div class="pinned-event-title">${event.title}</div>
                        <div class="pinned-event-date">${event.date.toLocaleDateString('ru-RU')}</div>
                    </div>
                    <button class="unpin-btn" data-id="${event.id}">×</button>
                `;
                
                pinnedEvent.querySelector('.unpin-btn').addEventListener('click', () => {
                    this.pinnedEvents.delete(event.id);
                    this.updatePinnedEvents();
                    this.renderTimeline();
                });
                
                this.pinnedList.appendChild(pinnedEvent);
            }
        });
    }
    
    startAutoScroll() {
        this.autoScrollInterval = setInterval(() => {
            const currentScroll = this.filmStrip.scrollLeft;
            const maxScroll = this.filmStrip.scrollWidth - this.filmStrip.clientWidth;
            
            if (currentScroll < maxScroll) {
                this.filmStrip.scrollLeft += 1;
            } else {
                this.filmStrip.scrollLeft = 0;
            }
        }, 30);
    }
    
    stopAutoScroll() {
        if (this.autoScrollInterval) {
            clearInterval(this.autoScrollInterval);
            this.autoScrollInterval = null;
        }
    }
    
    resetInactivityTimer() {
        if (this.inactivityTimer) {
            clearTimeout(this.inactivityTimer);
        }
        
        this.inactivityTimer = setTimeout(() => {
            this.startAutoScroll();
        }, 10000);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new BendyTimeline();
});
