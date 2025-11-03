// Данные событий
const bendyEvents = {
    "2017-02-10": {
        type: "game_release",
        title: "Bendy and the Ink Machine - Chapter 1",
        description: "Релиз Главы 1: Moving Pictures (ПК, демо-версия)",
        link: "https://store.steampowered.com/app/622650/Bendy_and_the_Ink_Machine/",
        icon: "🎮"
    },
    "2017-04-18": {
        type: "game_release", 
        title: "Bendy and the Ink Machine - Chapter 2",
        description: "Релиз Главы 2: The Old Song (ПК)",
        link: "https://store.steampowered.com/app/622650/Bendy_and_the_Ink_Machine/",
        icon: "🎮"
    },
    "2017-09-28": {
        type: "game_release",
        title: "Bendy and the Ink Machine - Chapter 3", 
        description: "Релиз Главы 3: Rise and Fall (ПК)",
        link: "https://store.steampowered.com/app/622650/Bendy_and_the_Ink_Machine/",
        icon: "🎮"
    },
    "2018-04-30": {
        type: "game_release",
        title: "Bendy and the Ink Machine - Chapter 4",
        description: "Релиз Главы 4: Colossal Wonders (ПК)",
        link: "https://store.steampowered.com/app/622650/Bendy_and_the_Ink_Machine/",
        icon: "🎮"
    },
    "2018-10-26": {
        type: "game_release",
        title: "Bendy and the Ink Machine - Chapter 5",
        description: "Релиз Главы 5: The Last Reel (ПК), полный выпуск игры",
        link: "https://store.steampowered.com/app/622650/Bendy_and_the_Ink_Machine/",
        icon: "🎮"
    },
    "2018-11-20": {
        type: "game_release",
        title: "Bendy and the Ink Machine - Полное издание",
        description: "Выпуск полного издания на PlayStation 4, Xbox One и Nintendo Switch",
        link: "https://store.playstation.com/app/bendy-and-the-ink-machine",
        icon: "🎮"
    },
    "2022-11-15": {
        type: "game_release",
        title: "Bendy and the Dark Revival",
        description: "Релиз продолжения на Windows (ПК)",
        link: "https://store.steampowered.com/app/1716620/Bendy_and_the_Dark_Revival/",
        icon: "🎮"
    }
};

// Основной код
document.addEventListener('DOMContentLoaded', function() {
    const filmStrip = document.getElementById('filmStrip');
    const modal = document.getElementById('eventModal');
    const closeModal = document.getElementById('closeModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalLink = document.getElementById('modalLink');
    
    let isDragging = false;
    let startX;
    let scrollLeft;
    
    // Генерация календаря
    function generateCalendar() {
        const startYear = 2017;
        const endYear = 2025;
        
        for (let year = startYear; year <= endYear; year++) {
            // Добавляем разделитель года
            const yearSeparator = document.createElement('div');
            yearSeparator.className = 'film-frame year-separator';
            yearSeparator.innerHTML = `
                <div style="font-size: 2em;">${year}</div>
                <div style="font-size: 0.8em; margin-top: 8px;">BENDY</div>
            `;
            filmStrip.appendChild(yearSeparator);
            
            // Добавляем дни
            for (let month = 0; month < 12; month++) {
                const daysInMonth = new Date(year, month + 1, 0).getDate();
                
                for (let day = 1; day <= daysInMonth; day++) {
                    const date = new Date(year, month, day);
                    const dateStr = formatDate(date);
                    const event = bendyEvents[dateStr];
                    
                    const dayFrame = document.createElement('div');
                    dayFrame.className = 'film-frame' + (event ? ' event-day' : '');
                    
                    const monthNames = ['ЯНВ', 'ФЕВ', 'МАР', 'АПР', 'МАЙ', 'ИЮН', 'ИЮЛ', 'АВГ', 'СЕН', 'ОКТ', 'НОЯ', 'ДЕК'];
                    const monthName = monthNames[month];
                    
                    dayFrame.innerHTML = `
                        <div class="date-number">${day}</div>
                        <div class="month-name">${monthName}</div>
                        ${event ? `<div class="event-indicator">${event.icon}</div>` : ''}
                    `;
                    
                    if (event) {
                        dayFrame.addEventListener('click', function() {
                            openModal(event);
                        });
                    }
                    
                    filmStrip.appendChild(dayFrame);
                }
            }
        }
    }
    
    // Открытие модального окна
    function openModal(event) {
        modalTitle.textContent = event.title;
        modalDescription.textContent = event.description;
        modalLink.href = event.link;
        modalLink.textContent = 'Подробнее';
        modal.style.display = 'flex';
    }
    
    // Закрытие модального окна
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Навигация по годам
    document.querySelectorAll('.navigation button').forEach(button => {
        button.addEventListener('click', function() {
            const year = this.getAttribute('data-year');
            scrollToYear(year);
        });
    });
    
    function scrollToYear(year) {
        const yearElements = filmStrip.getElementsByClassName('year-separator');
        for (let element of yearElements) {
            if (element.textContent.includes(year)) {
                const containerWidth = filmStrip.parentElement.clientWidth;
                const targetPosition = element.offsetLeft - containerWidth / 2 + element.offsetWidth / 2;
                
                filmStrip.scrollTo({
                    left: targetPosition,
                    behavior: 'smooth'
                });
                break;
            }
        }
    }
    
    // Перетаскивание плёнки
    filmStrip.addEventListener('mousedown', function(e) {
        isDragging = true;
        startX = e.pageX - filmStrip.offsetLeft;
        scrollLeft = filmStrip.scrollLeft;
        filmStrip.style.cursor = 'grabbing';
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - filmStrip.offsetLeft;
        const walk = (x - startX) * 2;
        filmStrip.scrollLeft = scrollLeft - walk;
    });
    
    document.addEventListener('mouseup', function() {
        isDragging = false;
        filmStrip.style.cursor = 'grab';
    });
    
    // Скролл колесом
    filmStrip.addEventListener('wheel', function(e) {
        e.preventDefault();
        filmStrip.scrollLeft += e.deltaY;
    });
    
    // Вспомогательная функция
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    // Запуск
    generateCalendar();
});
