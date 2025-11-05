class FilmNavigation {
    constructor() {
        this.currentPage = 'home';
        this.pages = ['home', 'products', 'lore', 'timeline', 'events'];
        this.isAnimating = false;
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setupAudio();
        this.setupReels();
        
        // Инициализация по хешу
        const hash = window.location.hash.substring(1);
        if (this.pages.includes(hash)) {
            this.switchPage(hash, false);
        }
    }
    
    bindEvents() {
        // Обработчики для кнопок
        document.querySelectorAll('.frame-cell').forEach(frame => {
            frame.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPage = frame.getAttribute('data-page');
                this.switchPage(targetPage);
            });
        });
        
        // Обработчик хеша
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.substring(1);
            if (this.pages.includes(hash) && hash !== this.currentPage) {
                this.switchPage(hash);
            }
        });
    }
    
    setupAudio() {
        try {
            this.projectorSound = document.getElementById('projectorSound');
            this.filmSound = document.getElementById('filmSound');
        } catch (error) {
            console.log('Audio setup:', error);
        }
    }
    
    setupReels() {
        // Интерактивность для бобин в шапке
        document.querySelectorAll('.header-reel .reel-base').forEach(reel => {
            reel.addEventListener('click', function() {
                this.style.animationDuration = '5s';
                setTimeout(() => {
                    this.style.animationDuration = '40s';
                }, 3000);
            });
        });
    }
    
    switchPage(targetPage, animate = true) {
        if (this.isAnimating || targetPage === this.currentPage) return;
        
        this.isAnimating = true;
        
        // Обновляем кнопки
        document.querySelectorAll('.frame-cell').forEach(frame => {
            frame.classList.remove('active');
        });
        document.querySelector(`[data-page="${targetPage}"]`).classList.add('active');
        
        // Запускаем анимации
        if (animate) {
            this.startAnimations();
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
    
    startAnimations() {
        // Луч проектора
        const projectorLight = document.querySelector('.projector-light');
        if (projectorLight) {
            projectorLight.classList.add('active');
            setTimeout(() => projectorLight.classList.remove('active'), 800);
        }
        
        // Быстрая прокрутка пленки
        const filmStrip = document.querySelector('.film-strip');
        if (filmStrip) {
            filmStrip.classList.add('fast-move');
            setTimeout(() => filmStrip.classList.remove('fast-move'), 800);
        }
        
        // Ускоренное вращение бобин при переключении
        const reels = document.querySelectorAll('.header-reel .reel-base');
        reels.forEach(reel => {
            reel.style.animationDuration = '3s';
            setTimeout(() => {
                reel.style.animationDuration = '40s';
            }, 3000);
        });
        
        // Звуки
        if (this.projectorSound) {
            this.projectorSound.currentTime = 0;
            this.projectorSound.play().catch(() => {});
        }
        if (this.filmSound) {
            setTimeout(() => {
                this.filmSound.currentTime = 0;
                this.filmSound.play().catch(() => {});
            }, 200);
        }
    }
    
    updateContent(targetPage) {
        document.querySelectorAll('.cinema-page').forEach(page => {
            page.classList.remove('active');
        });
        
        const targetElement = document.getElementById(targetPage);
        if (targetElement) {
            targetElement.classList.add('active');
        }
        
        this.currentPage = targetPage;
    }
}

// Инициализация
let filmNavigation;
document.addEventListener('DOMContentLoaded', () => {
    filmNavigation = new FilmNavigation();
});
