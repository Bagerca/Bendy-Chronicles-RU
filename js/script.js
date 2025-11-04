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
    }
    
    bindEvents() {
        // Обработчики для кинокадров
        document.querySelectorAll('.film-frame').forEach(frame => {
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
    
    switchPage(targetPage, animate = true) {
        if (this.isAnimating || targetPage === this.currentPage) return;
        
        this.isAnimating = true;
        const targetIndex = this.pages.indexOf(targetPage);
        const currentIndex = this.pages.indexOf(this.currentPage);
        
        // Определяем направление анимации
        const isForward = targetIndex > currentIndex;
        
        // Запускаем анимации
        this.startFilmAnimation(targetIndex, isForward, animate);
        this.startReelAnimation(isForward);
        
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
        const filmFrames = document.querySelectorAll('.film-frame');
        
        // Снимаем активный класс со всех кадров
        filmFrames.forEach(frame => frame.classList.remove('active'));
        
        // Добавляем активный класс целевому кадру
        filmFrames[targetIndex].classList.add('active');
        
        if (animate) {
            // Включаем луч проектора
            document.querySelector('.projector-beam').classList.add('active');
            
            // Рассчитываем смещение для центрирования
            const frameWidth = 160 + 25; // ширина кадра + gap
            const offset = (targetIndex - 2) * frameWidth;
            
            // Прокручиваем пленку
            filmStrip.style.transform = `translateX(calc(-50% + ${offset}px))`;
            
            // Выключаем луч после анимации
            setTimeout(() => {
                document.querySelector('.projector-beam').classList.remove('active');
            }, 800);
        } else {
            // Без анимации - сразу устанавливаем позицию
            const frameWidth = 160 + 25;
            const offset = (targetIndex - 2) * frameWidth;
            filmStrip.style.transform = `translateX(calc(-50% + ${offset}px))`;
        }
    }
    
    startReelAnimation(isForward) {
        const leftReel = document.querySelector('.left-reel .reel-rim');
        const rightReel = document.querySelector('.right-reel .reel-rim');
        
        // Сбрасываем предыдущие анимации
        leftReel.classList.remove('spin-forward', 'spin-backward');
        rightReel.classList.remove('spin-forward', 'spin-backward');
        
        // Запускаем новые анимации
        void leftReel.offsetWidth; // Trigger reflow
        void rightReel.offsetWidth;
        
        leftReel.classList.add(isForward ? 'spin-forward' : 'spin-backward');
        rightReel.classList.add(isForward ? 'spin-forward' : 'spin-backward');
        
        // Убираем классы анимации после завершения
        setTimeout(() => {
            leftReel.classList.remove('spin-forward', 'spin-backward');
            rightReel.classList.remove('spin-forward', 'spin-backward');
        }, 800);
    }
    
    updateContent(targetPage) {
        // Скрываем все страницы
        document.querySelectorAll('.page').forEach(page => {
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
        const currentIndex = this.pages.indexOf(this.currentPage);
        const filmStrip = document.querySelector('.film-strip');
        const frameWidth = 160 + 25;
        const offset = (currentIndex - 2) * frameWidth;
        
        filmStrip.style.transform = `translateX(calc(-50% + ${offset}px))`;
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new FilmNavigation();
});

// Обработка кнопок браузера "назад/вперед"
window.addEventListener('popstate', () => {
    const hash = window.location.hash.substring(1);
    const filmNav = new FilmNavigation();
    if (filmNav.pages.includes(hash)) {
        filmNav.switchPage(hash, true);
    }
});
