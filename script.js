// Данные событий Bendy
const bendyEvents = {
    "2017-02-10": {
        type: "game_release",
        title: "Bendy and the Ink Machine - Chapter 1",
        description: "Вышла первая глава культовой игры Bendy and the Ink Machine",
        link: "https://store.steampowered.com/app/622650/Bendy_and_the_Ink_Machine/",
        icon: "🎮"
    },
    "2017-12-21": {
        type: "game_release", 
        title: "Bendy and the Ink Machine - Chapter 2",
        description: "Вышла вторая глава игры, добавляющая новые локации и механики",
        link: "https://store.steampowered.com/app/622650/Bendy_and_the_Ink_Machine/",
        icon: "🎮"
    },
    "2018-09-24": {
        type: "trailer",
        title: "Трейлер Chapter 3",
        description: "Официальный трейлер третьей главы Bendy and the Ink Machine",
        link: "https://youtube.com",
        icon: "🎬"
    },
    "2018-11-13": {
        type: "game_release",
        title: "Bendy and the Ink Machine - Chapter 3", 
        description: "Третья глава игры с новыми головоломками и врагами",
        link: "https://store.steampowered.com/app/622650/Bendy_and_the_Ink_Machine/",
        icon: "🎮"
    },
    "2019-04-23": {
        type: "teaser",
        title: "Тизер Chapter 4",
        description: "Первый тизер четвертой главы с новыми персонажами",
        link: "https://youtube.com",
        icon: "📢"
    },
    "2019-06-25": {
        type: "game_release",
        title: "Bendy and the Ink Machine - Chapter 4",
        description: "Четвертая глава, приближающая к развязке истории",
        link: "https://store.steampowered.com/app/622650/Bendy_and_the_Ink_Machine/",
        icon: "🎮"
    },
    "2020-07-20": {
        type: "trailer",
        title: "Трейлер Bendy and the Dark Revival",
        description: "Анонс сиквела - Bendy and the Dark Revival",
        link: "https://youtube.com",
        icon: "🎬"
    },
    "2022-11-15": {
        type: "game_release",
        title: "Bendy and the Dark Revival",
        description: "Полный релиз сиквела Bendy and the Dark Revival",
        link: "https://store.steampowered.com/app/1716620/Bendy_and_the_Dark_Revival/",
        icon: "🎮"
    }
};

// Переменные для управления плёнкой
let isDragging = false;
let startX;
let scrollLeft;
let velocity = 0;
let lastX;
let lastTime;
let animationFrame;

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    generateFilmFrames();
    setupFilmDrag();
    setupWheelScroll();
});

// Генерация кадров плёнки
function generateFilmFrames() {
    const filmStrip = document.getElementById('filmStrip');
    const startYear = 2017;
    const endYear = 2023;
    
    for (let year = startYear; year <= endYear; year++) {
        // Добавляем разделитель года
        filmStrip.appendChild(createYearSeparator(year));
        
        // Добавляем месяцы и дни
        for (let month = 0; month < 12; month++) {
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            
            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(year, month, day);
                const dateString = formatDate(date);
                const event = bendyEvents[dateString];
                
                filmStrip.appendChild(createFilmFrame(date, event));
            }
        }
    }
}

// Создание разделителя года
function createYearSeparator(year) {
    const separator = document.createElement('div');
    separator.className = 'film-frame year-separator';
    separator.innerHTML = `
        <div style="font-size: 2.5em; color: #e8e8e8;">${year}</div>
        <div style="font-size: 1em; color: #1a1a1a; margin-top: 10px;">ГОД БЕНДИ</div>
    `;
    return separator;
}

// Создание кадра дня
function createFilmFrame(date, event) {
    const frame = document.createElement('div');
    frame.className = 'film-frame' + (event ? ' event-day' : '');
    
    const day = date.getDate();
    const monthNames = ['ЯНВАРЬ', 'ФЕВРАЛЬ', 'МАРТ', 'АПРЕЛЬ', 'МАЙ', 'ИЮНЬ', 
                       'ИЮЛЬ', 'АВГУСТ', 'СЕНТЯБРЬ', 'ОКТЯБРЬ', 'НОЯБРЬ', 'ДЕКАБРЬ'];
    const month = monthNames[date.getMonth()];
    
    frame.innerHTML = `
        <div class="date-number">${day}</div>
        <div class="month-name">${month}</div>
        ${event ? `<div class="event-indicator">${event.icon}</div>` : ''}
    `;
    
    if (event) {
        frame.addEventListener('click', () => openModal(event));
    }
    
    return frame;
}

// Настройка перетаскивания плёнки
function setupFilmDrag() {
    const filmStrip = document.getElementById('filmStrip');
    
    filmStrip.addEventListener('mousedown', startDrag);
    filmStrip.addEventListener('touchstart', startDragTouch);
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', dragTouch);
    
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);
}

function startDrag(e) {
    isDragging = true;
    const filmStrip = document.getElementById('filmStrip');
    startX = e.pageX - filmStrip.offsetLeft;
    scrollLeft = filmStrip.scrollLeft;
    lastX = startX;
    lastTime = Date.now();
    
    filmStrip.style.cursor = 'grabbing';
    filmStrip.style.transition = 'none';
    
    cancelAnimationFrame(animationFrame);
}

function startDragTouch(e) {
    isDragging = true;
    const filmStrip = document.getElementById('filmStrip');
    startX = e.touches[0].pageX - filmStrip.offsetLeft;
    scrollLeft = filmStrip.scrollLeft;
    lastX = startX;
    lastTime = Date.now();
    
    filmStrip.style.transition = 'none';
    
    cancelAnimationFrame(animationFrame);
}

function drag(e) {
    if (!isDragging) return;
    e.preventDefault();
    
    const filmStrip = document.getElementById('filmStrip');
    const x = e.pageX - filmStrip.offsetLeft;
    const walk = (x - startX) * 2;
    filmStrip.scrollLeft = scrollLeft - walk;
    
    // Расчет скорости для инерции
    const currentTime = Date.now();
    const deltaX = x - lastX;
    const deltaTime = currentTime - lastTime;
    
    if (deltaTime > 0) {
        velocity = deltaX / deltaTime;
    }
    
    lastX = x;
    lastTime = currentTime;
}

function dragTouch(e) {
    if (!isDragging) return;
    e.preventDefault();
    
    const filmStrip = document.getElementById('filmStrip');
    const x = e.touches[0].pageX - filmStrip.offsetLeft;
    const walk = (x - startX) * 2;
    filmStrip.scrollLeft = scrollLeft - walk;
    
    // Расчет скорости для инерции
    const currentTime = Date.now();
    const deltaX = x - lastX;
    const deltaTime = currentTime - lastTime;
    
    if (deltaTime > 0) {
        velocity = deltaX / deltaTime;
    }
    
    lastX = x;
    lastTime = currentTime;
}

function endDrag() {
    isDragging = false;
    const filmStrip = document.getElementById('filmStrip');
    filmStrip.style.cursor = 'grab';
    
    // Применяем инерцию
    applyInertia();
}

function applyInertia() {
    const filmStrip = document.getElementById('filmStrip');
    const friction = 0.95;
    
    function animate() {
        if (Math.abs(velocity) > 0.1) {
            filmStrip.scrollLeft -= velocity * 20;
            velocity *= friction;
            animationFrame = requestAnimationFrame(animate);
        }
    }
    
    animate();
}

// Настройка скролла колесом мыши
function setupWheelScroll() {
    const filmContainer = document.querySelector('.film-container');
    
    filmContainer.addEventListener('wheel', (e) => {
        e.preventDefault();
        const filmStrip = document.getElementById('filmStrip');
        filmStrip.scrollLeft += e.deltaY * 2;
    });
}

// Прокрутка к году
function scrollToYear(year) {
    const filmStrip = document.getElementById('filmStrip');
    const yearElements = filmStrip.getElementsByClassName('year-separator');
    let targetElement = null;
    
    for (let element of yearElements) {
        if (element.textContent.includes(year.toString())) {
            targetElement = element;
            break;
        }
    }
    
    if (targetElement) {
        const containerWidth = document.querySelector('.film-container').offsetWidth;
        const targetPosition = targetElement.offsetLeft - containerWidth / 2 + targetElement.offsetWidth / 2;
        
        // Анимация с ускорением и замедлением
        animateScroll(filmStrip.scrollLeft, targetPosition, 1000);
    }
}

function animateScroll(start, target, duration) {
    const filmStrip = document.getElementById('filmStrip');
    const startTime = performance.now();
    
    function scrollStep(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing функция для ускорения и замедления
        const easeProgress = easeInOutCubic(progress);
        
        filmStrip.scrollLeft = start + (target - start) * easeProgress;
        
        if (progress < 1) {
            requestAnimationFrame(scrollStep);
        }
    }
    
    requestAnimationFrame(scrollStep);
}

function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Работа с модальным окном
function openModal(event) {
    const modal = document.getElementById('eventModal');
    const title = document.getElementById('modalTitle');
    const description = document.getElementById('modalDescription');
    const link = document.getElementById('modalLink');
    
    title.textContent = event.title;
    description.textContent = event.description;
    link.href = event.link;
    link.textContent = event.type === 'game_release' ? 'Купить в Steam' : 'Смотреть видео';
    
    modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('eventModal');
    modal.style.display = 'none';
}

// Вспомогательные функции
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Закрытие модального окна по клику вне его
window.addEventListener('click', (e) => {
    const modal = document.getElementById('eventModal');
    if (e.target === modal) {
        closeModal();
    }
});

// Предотвращаем выделение текста при перетаскивании
document.addEventListener('selectstart', (e) => {
    if (isDragging) {
        e.preventDefault();
    }
});
