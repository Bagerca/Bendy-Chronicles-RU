class BendyTimeline {
    constructor() {
        this.events = this.getDefaultEvents(); // Используем встроенные данные
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
    
    getDefaultEvents() {
        return [
            {
                date: new Date("2017-01-30"),
                title: "Анонсирующий трейлер BATIM",
                type: "trailer",
                description: "Первый анонс игры Bendy and the Ink Machine",
                id: "2017-01-30-trailer"
            },
            {
                date: new Date("2017-02-10"),
                title: "Bendy and the Ink Machine - Глава 1",
                type: "game",
                description: "Релиз Главы 1: Moving Pictures (ПК, демо-версия)",
                id: "2017-02-10-game"
            },
            {
                date: new Date("2017-04-18"),
                title: "Bendy and the Ink Machine - Глава 2", 
                type: "game",
                description: "Релиз Главы 2: The Old Song (ПК)",
                id: "2017-04-18-game"
            },
            {
                date: new Date("2017-08-11"),
                title: "Tombstone Picnic",
                type: "teaser", 
                description: "Анимированный короткометражный фильм, тизер Главы 3",
                id: "2017-08-11-teaser"
            },
            {
                date: new Date("2017-09-28"),
                title: "Bendy and the Ink Machine - Глава 3",
                type: "game",
                description: "Релиз Главы 3: Rise and Fall (ПК)",
                id: "2017-09-28-game"
            },
            {
                date: new Date("2018-01-26"),
                title: "Анонс Bendy in Nightmare Run",
                type: "announcement",
                description: "Анонс спин-оффа игры",
                id: "2018-01-26-announcement"
            },
            {
                date: new Date("2018-04-30"),
                title: "Bendy and the Ink Machine - Глава 4",
                type: "game",
                description: "Релиз Главы 4: Colossal Wonders (ПК)",
                id: "2018-04-30-game"
            },
            {
                date: new Date("2018-08-15"), 
                title: "Bendy in Nightmare Run",
                type: "game",
                description: "Релиз на iOS и Android",
                id: "2018-08-15-game"
            },
            {
                date: new Date("2018-10-26"),
                title: "Bendy and the Ink Machine - Глава 5", 
                type: "game",
                description: "Релиз Главы 5: The Last Reel (ПК)",
                id: "2018-10-26-game"
            },
            {
                date: new Date("2018-11-20"),
                title: "Bendy and the Ink Machine - Полное издание",
                type: "game",
                description: "Выпуск на PlayStation 4, Xbox One и Nintendo Switch",
                id: "2018-11-20-game"
            },
            {
                date: new Date("2018-12-21"),
                title: "Bendy and the Ink Machine - Мобильная версия",
                type: "game", 
                description: "Выпуск на iOS и Android",
                id: "2018-12-21-game"
            },
            {
                date: new Date("2019-04-14"),
                title: "Анонс Bendy and the Dark Revival", 
                type: "announcement",
                description: "Анонс продолжения игры",
                id: "2019-04-14-announcement"
            },
            {
                date: new Date("2019-06-24"),
                title: "Геймплейный трейлер BATDR",
                type: "trailer",
                description: "Первый геймплейный трейлер Bendy and the Dark Revival",
                id: "2019-06-24-trailer"
            },
            {
                date: new Date("2020-02-10"),
                title: "Boris and the Dark Survival",
                type: "game",
                description: "Релиз спин-оффа на ПК",
                id: "2020-02-10-game"
            },
            {
                date: new Date("2020-06-01"), 
                title: "Трейлер BATDR о выходе игры целиком",
                type: "trailer",
                description: "Трейлер, анонсирующий выход игры целиком",
                id: "2020-06-01-trailer"
            },
            {
                date: new Date("2022-10-31"),
                title: "Финальный трейлер BATDR", 
                type: "trailer",
                description: "Финальный трейлер перед релизом",
                id: "2022-10-31-trailer"
            },
            {
                date: new Date("2022-11-15"),
                title: "Bendy and the Dark Revival",
                type: "game",
                description: "Релиз на Windows (ПК)",
                id: "2022-11-15-game"
            },
            {
                date: new Date("2023-03-01"),
                title: "Bendy and the Dark Revival - Консольные версии",
                type: "game",
                description: "Релиз на PlayStation 4, PS5, Xbox One и Xbox Series X/S",
                id: "2023-03-01-game"
            },
            {
                date: new Date("2023-05-10"),
                title: "Утечка прототипа Bendy: The Silent City",
                type: "announcement", 
                description: "Прототип геймплея 'официально' утёк",
                id: "2023-05-10-announcement"
            },
            {
                date: new Date("2023-10-31"),
                title: "Анонсирующий трейлер Bendy: The Cage", 
                type: "trailer",
                description: "Анонс новой игры",
                id: "2023-10-31-trailer"
            },
            {
                date: new Date("2023-12-25"), 
                title: "Анонс экранизации BATIM",
                type: "announcement",
                description: "Анонс фильма по Bendy and the Ink Machine",
                id: "2023-12-25-announcement"
            },
            {
                date: new Date("2024-04-14"),
                title: "Bendy: Secrets of the Machine",
                type: "game",
                description: "Релиз сайд-стори на ПК",
                id: "2024-04-14-game"
            },
            {
                date: new Date("2024-04-18"),
                title: "Анонс третьей основной части (B3NDY)",
                type: "announcement", 
                description: "Официальный анонс третьей основной части серии",
                id: "2024-04-18-announcement"
            },
            {
                date: new Date("2024-08-15"),
                title: "Bendy: Lone Wolf", 
                type: "game",
                description: "Релиз преемника Boris and the Dark Survival на ПК",
                id: "2024-08-15-game"
            },
            {
                date: new Date("2024-10-31"),
                title: "Анонс режиссёра фильма",
                type: "announcement",
                description: "Объявлен режиссёр (Андре Эвредал) и официальное название фильма",
                id: "2024-10-31-announcement"
            },
            {
                date: new Date("2024-12-16"),
                title: "Первый трейлер Bendy: Lone Wolf",
                type: "trailer", 
                description: "Показан первый трейлер игры",
                id: "2024-12-16-trailer"
            },
            {
                date: new Date("2025-05-09"),
                title: "Bendy and the Ink Machine - Next Gen", 
                type: "game",
                description: "Выпуск на PlayStation 5 и Xbox Series X/S",
                id: "2025-05-09-game"
            }
        ];
    }
    
    init() {
        this.filteredEvents = [...this.events];
        this.setupEventListeners();
        this.renderTimeline();
        this.startAutoScroll();
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
