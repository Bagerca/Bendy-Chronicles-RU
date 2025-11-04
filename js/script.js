// CinemaNavigation - основной класс для навигации
class CinemaNavigation {
    constructor() {
        this.currentPage = 'home';
        this.pages = ['home', 'products', 'lore', 'timeline', 'events'];
        this.isTransitioning = false;
        this.transitionDuration = 800;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.initPageTransitions();
        console.log('🎬 Cinema Navigation initialized');
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
        // Инициализация переходов между страницами
        console.log('Page transitions initialized');
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
        // Активируем луч проектора
        this.activateProjectorLight();
        
        // Обновляем активную навигацию
        this.updateNavigation(targetPage);
        
        // Ждем немного перед сменой контента
        await this.delay(300);
        
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
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// CinemaEffects - класс для визуальных эффектов
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
                const brightness = 0.9 + Math.random() * 0.2;
                document.body.style.filter = `brightness(${brightness})`;
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
        
        for (let i = 0; i < 15; i++) {
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
        
        // Создаем уникальную анимацию для каждой частицы
        const animationName = `float-${Math.random().toString(36).substr(2, 9)}`;
        const duration = 10 + Math.random() * 20;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ${animationName} {
                0% { 
                    transform: translate(0, 0) rotate(0deg); 
                    opacity: 0; 
                }
                10% { 
                    opacity: 0.3; 
                }
                90% { 
                    opacity: 0.1; 
                }
                100% { 
                    transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(360deg); 
                    opacity: 0; 
                }
            }
        `;
        
        document.head.appendChild(style);
        particle.style.animation = `${animationName} ${duration}s linear infinite`;
        container.appendChild(particle);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Инициализация навигации
    const cinemaNav = new CinemaNavigation();
    
    // Инициализация визуальных эффектов
    const cinemaEffects = new CinemaEffects();
    
    // Сохраняем в глобальной области для отладки
    window.cinemaNav = cinemaNav;
    window.cinemaEffects = cinemaEffects;
    
    console.log('🎭 Bendy Chronicles website loaded successfully!');
});

// Обработка изменения размера окна
window.addEventListener('resize', () => {
    // Можно добавить адаптивную логику при необходимости
    console.log('Window resized:', window.innerWidth, 'x', window.innerHeight);
});
