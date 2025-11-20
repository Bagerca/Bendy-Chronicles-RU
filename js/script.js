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
        this.setupReels(); // Это теперь важно для управления скоростью
        
        const hash = window.location.hash.substring(1);
        if (this.pages.includes(hash)) {
            this.switchPage(hash, false);
        }
    }
    
    bindEvents() {
        document.querySelectorAll('.frame-cell').forEach(frame => {
            frame.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPage = frame.getAttribute('data-page');
                this.switchPage(targetPage);
            });
        });
        
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
        } catch (error) { console.log('Audio setup error', error); }
    }
    
    setupReels() {
        // Добавляем интерактивность при клике на сами бобины
        document.querySelectorAll('.header-reel').forEach(reel => {
            reel.addEventListener('click', () => {
                this.triggerFastSpin();
            });
        });
    }
    
    // Функция ускорения анимации (вызывается при клике на навигацию или бобину)
    triggerFastSpin() {
        const root = document.documentElement;
        
        // Устанавливаем быструю скорость (3с вместо 20с)
        root.style.setProperty('--reel-speed', '3s');
        
        // Звуки
        if (this.filmSound) {
            this.filmSound.currentTime = 0;
            this.filmSound.play().catch(()=>{});
        }

        // Возвращаем нормальную скорость через 2 секунды
        setTimeout(() => {
            root.style.setProperty('--reel-speed', '20s');
        }, 2000);
    }
    
    switchPage(targetPage, animate = true) {
        if (this.isAnimating || targetPage === this.currentPage) return;
        this.isAnimating = true;
        
        document.querySelectorAll('.frame-cell').forEach(frame => frame.classList.remove('active'));
        const targetBtn = document.querySelector(`[data-page="${targetPage}"]`);
        if (targetBtn) targetBtn.classList.add('active');
        
        if (animate) {
            this.startAnimations(); // Запускает визуальные эффекты
            this.triggerFastSpin(); // Ускоряет пленку
            
            setTimeout(() => {
                this.updateContent(targetPage);
                this.isAnimating = false;
            }, 800);
        } else {
            this.updateContent(targetPage);
            this.isAnimating = false;
        }
        
        window.history.pushState(null, null, `#${targetPage}`);
    }
    
    startAnimations() {
        const projectorLight = document.querySelector('.projector-light');
        if (projectorLight) {
            projectorLight.classList.add('active');
            setTimeout(() => projectorLight.classList.remove('active'), 800);
        }
        
        if (this.projectorSound) {
            this.projectorSound.currentTime = 0;
            this.projectorSound.play().catch(()=>{});
        }
    }
    
    updateContent(targetPage) {
        document.querySelectorAll('.cinema-page').forEach(page => page.classList.remove('active'));
        const targetElement = document.getElementById(targetPage);
        if (targetElement) targetElement.classList.add('active');
        this.currentPage = targetPage;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new FilmNavigation();
});
