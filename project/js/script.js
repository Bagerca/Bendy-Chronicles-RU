document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const pageSections = document.querySelectorAll('.page-section');
    const pageTransition = document.getElementById('pageTransition');

    // Функция переключения страниц с анимацией
    function switchPage(targetPage) {
        // Активируем анимацию перехода
        pageTransition.classList.add('active');
        
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
            
            // Завершаем анимацию перехода
            setTimeout(() => {
                pageTransition.classList.remove('active');
            }, 500);
            
        }, 500);
    }

    // Обработчики кликов для навигации
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');
            switchPage(targetPage);
        });
    });

    // Добавляем эффект "проектора" при загрузке
    setTimeout(() => {
        document.querySelector('.projector-effect').style.animation = 'projectorScan 3s linear infinite';
    }, 1000);
});
