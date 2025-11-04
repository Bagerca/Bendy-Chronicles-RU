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
        } catch (error) {
            console.log('Audio setup:', error);
        }
    }
    
    switchPage(targetPage, animate = true) {
        if (this.isAnimating || targetPage === this.currentPage) return;
        
        this.isAnimating = true;
        
        document.querySelectorAll('.frame-cell').forEach(frame => {
            frame.classList.remove('active');
        });
        document.querySelector(`[data-page="${targetPage}"]`).classList.add('active');
        
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
        
        window.history.pushState(null, null, `#${targetPage}`);
    }
    
    startAnimations() {
        const projectorLight = document.querySelector('.projector-light');
        if (projectorLight) {
            projectorLight.classList.add('active');
            setTimeout(() => projectorLight.classList.remove('active'), 800);
        }
        
        const reels = document.querySelectorAll('.reel-body');
        reels.forEach(reel => {
            reel.style.animationPlayState = 'paused';
            setTimeout(() => {
                reel.style.animationPlayState = 'running';
            }, 800);
        });
        
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

let filmNavigation;
document.addEventListener('DOMContentLoaded', () => {
    filmNavigation = new FilmNavigation();
});
