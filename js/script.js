document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const pageSections = document.querySelectorAll('.page-section');
    const filmStrip = document.querySelector('.film-strip');
    const leftReel = document.querySelector('.reel-left');
    const rightReel = document.querySelector('.reel-right');
    const projectorLight = document.querySelector('.projector-light');
    
    let currentPage = 'home';
    const pageOrder = ['home', 'products', 'lore', 'timeline', 'events'];

    // Функция для получения индекса страницы
    function getPageIndex(page) {
        return pageOrder.indexOf(page);
    }

    // Функция переключения страниц с анимацией
    function switchPage(targetPage) {
        if (targetPage === currentPage) return;

        const currentIndex = getPageIndex(currentPage);
        const targetIndex = getPageIndex(targetPage);
        
        // Определяем направление перемотки
        const isForward = targetIndex > currentIndex;
        
        // Активируем свет проектора
        projectorLight.classList.add('active');
        
        // Запускаем анимацию бобин
        leftReel.classList.add(isForward ? 'spin-forward' : 'spin-backward');
        rightReel.classList.add(isForward ? 'spin-forward' : 'spin-backward');
        
        // Вычисляем смещение для кинопленки
        const linkWidth = 140 + 40; // ширина кнопки + gap
        const offset = (targetIndex - 2) * linkWidth; // Центрируем активный элемент
        
        // Прокручиваем кинопленку
        filmStrip.style.transform = `translateX(calc(-50% + ${offset}px))`;
        
        // Ждем завершения анимации прокрутки
        setTimeout(() => {
            // Скрываем все страницы
            pageSections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Показываем целевую страницу
            const targetSection = document.getElementById(targetPage);
            if (targetSection) {
                targetSection.classList.add('active');
            }
            
            // Обновляем активную ссылку в навигации
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-page') === targetPage) {
                    link.classList.add('active');
                }
            });
            
            // Сбрасываем анимации бобин
            setTimeout(() => {
                leftReel.classList.remove('spin-forward', 'spin-backward');
                rightReel.classList.remove('spin-forward', 'spin-backward');
                projectorLight.classList.remove('active');
            }, 200);
            
            currentPage = targetPage;
        }, 800);
    }

    // Обработчики кликов для навигации
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');
            switchPage(targetPage);
        });
    });

    // Инициализация - центрируем начальную позицию
    setTimeout(() => {
        const homeIndex = getPageIndex('home');
        const linkWidth = 140 + 40;
        const initialOffset = (homeIndex - 2) * linkWidth;
        filmStrip.style.transform = `translateX(calc(-50% + ${initialOffset}px))`;
    }, 100);
});
