class CinemaNavigation {
    constructor() {
        this.currentPage = 'home';
        this.pages = ['home', 'products', 'lore', 'timeline', 'events'];
        this.isTransitioning = false;
        this.transitionDuration = 800;
        
        this.init();
    }
    
    init() {
        this.createAudioContext();
        this.bindEvents();
        this.initPageTransitions();
        console.log('🎬 Cinema Navigation initialized');
    }
    
    createAudioContext() {
        // Создаем контекст для звуковых эффектов
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.projectorSound = document.getElementById('projectorSound');
        this.filmSound = document.getElementById('filmSound');
    }
    
    bindEvents() {
        // Обработчики для навигации
        document.querySelectorAll('.frame-cell').forEach(cell => {
            cell.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPage = cell.getAttribute('data-page');
                this.navigateToPage(targetPage);
            });
        });
        
        // Обработчик хеша URL
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.substring(1);
            if (this.pages.includes(hash) && hash !== this.currentPage) {
                this.navigateToPage(hash);
            }
        });
        
        // Инициализация по хешу
        const initialHash = window.location.hash.substring(1);
        if (this.pages.includes(initialHash)) {
            this.navigateToPage(initialHash, false);
        }
    }
    
    initPageTransitions() {
        // Предзагрузка звуков
        if (this.projectorSound) this.projectorSound.volume = 0.3;
        if (this.filmSound) this.filmSound.volume = 0.2;
    }
    
    async navigateToPage(targetPage, animate = true) {
        if (this.isTransitioning || targetPage === this.currentPage) return;
        
        this.isTransitioning = true;
        
        try {
            if (animate) {
                await this.playTransitionAnimation(targetPage);
            } else {
                this.updatePageContent(targetPage);
            }
            
            this.currentPage = targetPage;
            window.history.replaceState(null, null, `#${targetPage}`);
            
        } catch (error) {
            console.error('Navigation error:', error);
        } finally {
            this.isTransitioning = false;
        }
    }
    
    async playTransitionAnimation(targetPage) {
        // Воспроизводим звук проектора
        await this.playSound(this.projectorSound);
        
        // Активируем луч проектора
        this.activateProjectorLight();
        
        // Обновляем активную навигацию
        this.updateNavigation(targetPage);
        
        // Ждем немного перед сменой контента
        await this.delay(300);
        
        // Воспроизводим звук пленки
        await this.playSound(this.filmSound);
        
        // Обновляем контент страницы
        this.updatePageContent(targetPage);
        
        // Деактивируем луч проектора
        await this.delay(500);
        this.deactivateProjectorLight();
    }
    
    activateProjectorLight() {
        const light = document.getElementById('projectorLight');
        if (light) {
            light.classList.add('active');
        }
    }
    
    deactivateProjectorLight() {
        const light = document.getElementById('projectorLight');
        if (light) {
            light.classList.remove('active');
        }
    }
    
    updateNavigation(targetPage) {
        // Обновляем активный элемент навигации
        document.querySelectorAll('.frame-cell').forEach(cell => {
            cell.classList.remove('active');
        });
        
        const targetCell = document.querySelector(`[data-page="${targetPage}"]`);
        if (targetCell) {
            targetCell.classList.add('active');
        }
    }
    
    updatePageContent(targetPage) {
        // Скрываем все страницы
        document.querySelectorAll('.cinema-page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Показываем целевую страницу
        const targetPageElement = document.getElementById(targetPage);
        if (targetPageElement) {
            targetPageElement.classList.add('active');
        }
    }
    
    playSound(audioElement) {
        return new Promise((resolve) => {
            if (!audioElement) {
                resolve();
                return;
            }
            
            audioElement.currentTime = 0;
            const playPromise = audioElement.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    setTimeout(resolve, audioElement.duration * 1000);
                }).catch(resolve);
            } else {
                resolve();
            }
        });
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Дополнительные эффекты для атмосферы
class CinemaEffects {
    constructor() {
        this.init();
    }
    
    init() {
        this.createFlickerEffect();
        this.createDustParticles();
    }
    
    createFlickerEffect() {
        // Случайные мерцания как в старом кино
        setInterval(() => {
            if (Math.random() > 0.7) {
                document.body.style.filter = `brightness(${0.9 + Math.random() * 0.2})`;
                setTimeout(() => {
                    document.body.style.filter = 'brightness(1)';
                }, 50 + Math.random() * 100);
            }
        }, 3000);
    }
    
    createDustParticles() {
        // Создаем частицы пыли для атмосферы кинотеатра
        const overlay = document.querySelector('.projector-overlay');
        if (!overlay) return;
        
        for (let i = 0; i < 20; i++) {
            this.createDustParticle(overlay);
        }
    }
    
    createDustParticle(container) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            pointer-events: none;
        `;
        
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animation = `float ${10 + Math.random() * 20}s linear infinite`;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
                10% { opacity: 0.3; }
                90% { opacity: 0.1; }
                100% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(360deg); opacity: 0; }
            }
        `;
        
        document.head.appendChild(style);
        container.appendChild(particle);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Инициализация навигации
    window.cinemaNav = new CinemaNavigation();
    
    // Инициализация визуальных эффектов
    window.cinemaEffects = new CinemaEffects();
    
    // Предотвращаем контекстное меню для Immersion
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
});

// Обработка изменения размера окна
window.addEventListener('resize', () => {
    // Можно добавить адаптивную логику при необходимости
});
