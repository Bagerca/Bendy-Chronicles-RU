class FilmCalendar {
    constructor() {
        this.filmStrip = document.getElementById('filmStrip');
        this.modal = document.getElementById('eventModal');
        this.isDragging = false;
        this.startX = 0;
        this.scrollLeft = 0;
        
        this.init();
    }

    init() {
        this.generateFilm();
        this.setupEventListeners();
    }

    generateFilm() {
        const startYear = 2017;
        const endYear = 2025;
        
        for (let year = startYear; year <= endYear; year++) {
            this.filmStrip.appendChild(this.createYearSeparator(year));
            
            for (let month = 0; month < 12; month++) {
                const daysInMonth = new Date(year, month + 1, 0).getDate();
                
                for (let day = 1; day <= daysInMonth; day++) {
                    const date = new Date(year, month, day);
                    const dateStr = this.formatDate(date);
                    const event = bendyEvents[dateStr];
                    this.filmStrip.appendChild(this.createDayFrame(date, event));
                }
            }
        }
    }

    createYearSeparator(year) {
        const separator = document.createElement('div');
        separator.className = 'film-frame year-separator';
        separator.innerHTML = `
            <div style="font-size: 2em;">${year}</div>
            <div style="font-size: 0.8em; margin-top: 8px;">BENDY</div>
        `;
        return separator;
    }

    createDayFrame(date, event) {
        const frame = document.createElement('div');
        frame.className = 'film-frame' + (event ? ' event-day' : '');
        
        const day = date.getDate();
        const monthNames = ['ЯНВ', 'ФЕВ', 'МАР', 'АПР', 'МАЙ', 'ИЮН', 'ИЮЛ', 'АВГ', 'СЕН', 'ОКТ', 'НОЯ', 'ДЕК'];
        const month = monthNames[date.getMonth()];
        
        frame.innerHTML = `
            <div class="date-number">${day}</div>
            <div class="month-name">${month}</div>
            ${event ? `<div class="event-indicator">${event.icon}</div>` : ''}
        `;
        
        if (event) {
            frame.addEventListener('click', () => this.openModal(event));
        }
        
        return frame;
    }

    setupEventListeners() {
        // Навигация по годам
        document.querySelectorAll('.navigation button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const year = parseInt(e.target.dataset.year);
                this.scrollToYear(year);
            });
        });

        // Перетаскивание плёнки
        this.filmStrip.addEventListener('mousedown', this.startDrag.bind(this));
        document.addEventListener('mousemove', this.drag.bind(this));
        document.addEventListener('mouseup', this.endDrag.bind(this));

        // Скролл колесом
        this.filmStrip.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.filmStrip.scrollLeft += e.deltaY;
        });

        // Закрытие модального окна
        document.getElementById('closeModal').addEventListener('click', () => {
            this.modal.style.display = 'none';
        });

        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.modal.style.display = 'none';
            }
        });
    }

    startDrag(e) {
        this.isDragging = true;
        this.startX = e.pageX - this.filmStrip.offsetLeft;
        this.scrollLeft = this.filmStrip.scrollLeft;
        this.filmStrip.style.cursor = 'grabbing';
    }

    drag(e) {
        if (!this.isDragging) return;
        e.preventDefault();
        const x = e.pageX - this.filmStrip.offsetLeft;
        const walk = (x - this.startX) * 2;
        this.filmStrip.scrollLeft = this.scrollLeft - walk;
    }

    endDrag() {
        this.isDragging = false;
        this.filmStrip.style.cursor = 'grab';
    }

    scrollToYear(year) {
        const yearElements = this.filmStrip.getElementsByClassName('year-separator');
        for (let element of yearElements) {
            if (element.textContent.includes(year)) {
                const containerWidth = this.filmStrip.clientWidth;
                const targetPos = element.offsetLeft - containerWidth / 2 + element.offsetWidth / 2;
                
                this.filmStrip.scrollTo({
                    left: targetPos,
                    behavior: 'smooth'
                });
                break;
            }
        }
    }

    openModal(event) {
        document.getElementById('modalTitle').textContent = event.title;
        document.getElementById('modalDescription').textContent = event.description;
        document.getElementById('modalLink').href = event.link;
        
        if (event.type === 'game_release') {
            document.getElementById('modalLink').textContent = 'Купить в Steam';
        } else {
            document.getElementById('modalLink').textContent = 'Смотреть видео';
        }
        
        this.modal.style.display = 'flex';
    }

    formatDate(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }
}

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new FilmCalendar();
});
