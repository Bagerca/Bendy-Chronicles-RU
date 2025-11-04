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
        this.startFilmAnimation(targetIndex, isForward, animate);
        this.startReelAnimation(isForward, animate);
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
    
    startFilmAnimation(targetIndex, isForward, animate) {
        const filmStrip = document.querySelector('.film-strip');
        
        if (animate) {
            // Включаем луч проектора
            document.querySelector('.projector-light').classList.add('active');
            
            // Рассчитываем смещение для пленки
            // Создаем эффект движения пленки под статичными кнопками
            const movement = isForward ? 100 : -100;
            filmStrip.style.transform = `translateX(${movement}px)`;
            
            // Возвращаем пленку на место с задержкой для создания циклического эффекта
            setTimeout(() => {
                filmStrip.style.transform = `translateX(0px)`;
            }, 400);
            
            // Выключаем луч после анимации
            setTimeout(() => {
                document.querySelector('.projector-light').classList.remove('active');
            }, 800);
        } else {
            filmStrip.style.transform = `translateX(0px)`;
        }
    }
    
    startReelAnimation(isForward, animate) {
        const leftReel = document.querySelector('.left-reel .reel-inner');
        const rightReel = document.querySelector('.right-reel .reel-inner');
        
        if (!animate) return;
        
        // Временно останавливаем непрерывное вращение
        leftReel.style.animationPlayState = 'paused';
        rightReel.style.animationPlayState = 'paused';
        
        // Сбрасываем предыдущие анимации
        leftReel.classList.remove('spin-forward', 'spin-backward');
        rightReel.classList.remove('spin-forward', 'spin-backward');
        
        // Запускаем новые анимации
        void leftReel.offsetWidth; // Trigger reflow
        void rightReel.offsetWidth;
        
        leftReel.classList.add(isForward ? 'spin-forward' : 'spin-backward');
        rightReel.classList.add(isForward ? 'spin-forward' : 'spin-backward');
        
        // Возвращаем непрерывное вращение после завершения анимации
        setTimeout(() => {
            leftReel.classList.remove('spin-forward', 'spin-backward');
            rightReel.classList.remove('spin-forward', 'spin-backward');
            leftReel.style.animationPlayState = 'running';
            rightReel.style.animationPlayState = 'running';
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
        // Активная кнопка уже будет выделена через CSS
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
