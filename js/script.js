class FilmNavigation {
    constructor() {
        this.currentPage = 'home';
        this.pages = ['home', 'products', 'lore', 'timeline', 'events'];
        this.isAnimating = false;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.centerCurrentPage();
        this.setupAudio();
    }
    
    bindEvents() {
        // Обработчики для кинокадров
        document.querySelectorAll('.frame-cell').forEach(frame => {
            frame.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPage = frame.getAttribute('data-page');
                this.switchPage(targetPage);
            });
        });
        
        // Обработчик для хеша в URL
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.substring(1);
            if (this.pages.includes(hash)) {
                this.switchPage(hash);
            }
        });
        
        // Инициализация по хешу
        const initialHash = window.location.hash.substring(1);
        if (this.pages.includes(initialHash)) {
            this.switchPage(initialHash, false);
        }
    }
    
    setupAudio() {
        // Инициализация звуков
        this.projectorSound = document.getElementById('projectorSound');
        this.filmSound = document.getElementById('filmSound');
        
        // Воспроизведение звуков при переключении страниц
        document.querySelectorAll('.frame-cell').forEach(item => {
            item.addEventListener('click', () => {
                if (this.projectorSound) {
                    this.projectorSound.currentTime = 0;
                    this.projectorSound.play().catch(e => console.log('Audio play failed:', e));
                }
                if (this.filmSound) {
                    setTimeout(() => {
                        this.filmSound.currentTime = 0;
                        this.filmSound.play().catch(e => console.log('Audio play failed:', e));
                    }, 200);
                }
            });
        });
    }
    
    switchPage(targetPage, animate = true) {
        if (this.isAnimating || targetPage === this.currentPage) return;
        
        this.isAnimating = true;
        const targetIndex = this.pages.indexOf(targetPage);
        const currentIndex = this.pages.indexOf(this.currentPage);
        
        // Определяем направление анимации
        const isForward = targetIndex > currentIndex;
        
        // Запускаем анимации
        if (animate) {
            this.startFastAnimation(isForward);
        }
        
        this.updateButtons(targetIndex);
        
        if (animate) {
            setTimeout(() => {
                this.updateContent(targetPage);
                this.isAnimating = false;
            }, 800);
        } else {
            this.updateContent(targetPage);
            this.isAnimating = false;
        }
        
        // Обновляем URL
        window.history.pushState(null, null, `#${targetPage}`);
    }
    
    startFastAnimation(isForward) {
        const filmContainer = document.querySelector('.film-strip-container');
        const leftReel = document.querySelector('.left-reel .reel-inner');
        const rightReel = document.querySelector('.right-reel .reel-inner');
        
        // Включаем луч проектора
        document.querySelector('.projector-light').classList.add('active');
        
        // Временно останавливаем непрерывные анимации
        filmContainer.style.animationPlayState = 'paused';
        leftReel.style.animationPlayState = 'paused';
        rightReel.style.animationPlayState = 'paused';
        
        // Запускаем быстрые анимации
        filmContainer.classList.add('fast-move');
        leftReel.classList.add('fast-spin');
        rightReel.classList.add('fast-spin');
        
        // Направление для бобин
        if (!isForward) {
            leftReel.style.animationDirection = 'reverse';
            rightReel.style.animationDirection = 'reverse';
        } else {
            leftReel.style.animationDirection = 'normal';
            rightReel.style.animationDirection = 'normal';
        }
        
        // Возвращаем непрерывные анимации после быстрых
        setTimeout(() => {
            filmContainer.classList.remove('fast-move');
            leftReel.classList.remove('fast-spin');
            rightReel.classList.remove('fast-spin');
            
            filmContainer.style.animationPlayState = 'running';
            leftReel.style.animationPlayState = 'running';
            rightReel.style.animationPlayState = 'running';
            
            // Выключаем луч проектора
            document.querySelector('.projector-light').classList.remove('active');
        }, 800);
    }
    
    updateButtons(targetIndex) {
        // Снимаем активный класс со всех кнопок
        document.querySelectorAll('.frame-cell').forEach(frame => {
            frame.classList.remove('active');
        });
        
        // Добавляем активный класс целевой кнопке
        const targetButton = document.querySelectorAll('.frame-cell')[targetIndex];
        if (targetButton) {
            targetButton.classList.add('active');
        }
    }
    
    updateContent(targetPage) {
        // Скрываем все страницы
        document.querySelectorAll('.cinema-page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Показываем целевую страницу
        const targetElement = document.getElementById(targetPage);
        if (targetElement) {
            targetElement.classList.add('active');
        }
        
        this.currentPage = targetPage;
    }
    
    centerCurrentPage() {
        // Для статичных кнопок центрирование не требуется
        const currentIndex = this.pages.indexOf(this.currentPage);
        this.updateButtons(currentIndex);
    }
}

// Глобальная переменная для экземпляра навигации
let filmNavigationInstance;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    filmNavigationInstance = new FilmNavigation();
});

// Обработка кнопок браузера "назад/вперед"
window.addEventListener('popstate', () => {
    const hash = window.location.hash.substring(1);
    if (filmNavigationInstance && filmNavigationInstance.pages.includes(hash)) {
        filmNavigationInstance.switchPage(hash, true);
    }
});
