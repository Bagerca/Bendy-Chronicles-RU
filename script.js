// --- CALENDAR DATA ---
// type: 'game' (Золотой ромб) или 'media' (Белая точка)
// img: Ссылка на картинку (поставь заглушку или реальную)
const calendarData = [
    {
        year: 2017, month: 1, // 1 = Февраль (JS счет 0-11)
        label: "February 2017",
        events: [
            { day: 10, title: "BATIM Chapter 1", type: "game", desc: "Генри возвращается в студию. Первая глава Moving Pictures выходит в свет.", img: "https://placehold.co/600x400/111/gold?text=Chapter+1" }
        ]
    },
    {
        year: 2017, month: 3, // Апрель
        label: "April 2017",
        events: [
            { day: 18, title: "BATIM Chapter 2", type: "game", desc: "The Old Song. Появление Сэмми Лоуренса.", img: "https://placehold.co/600x400/111/gold?text=Chapter+2" },
            { day: 25, title: "Build Our Machine", type: "media", desc: "Культовая песня от DAGames, ставшая гимном фэндома.", img: "https://placehold.co/600x400/111/fff?text=DAGames" }
        ]
    },
    {
        year: 2017, month: 8, // Сентябрь
        label: "September 2017",
        events: [
            { day: 28, title: "BATIM Chapter 3", type: "game", desc: "Rise and Fall. Встреча с Искаженной Элис и Борисом.", img: "https://placehold.co/600x400/111/gold?text=Chapter+3" }
        ]
    },
    {
        year: 2022, month: 10, // Ноябрь
        label: "November 2022",
        events: [
            { day: 15, title: "Dark Revival", type: "game", desc: "Долгожданный сиквел. История Одри.", img: "https://placehold.co/600x400/330000/gold?text=Dark+Revival" }
        ]
    }
];

// --- CALENDAR LOGIC ---
let currentMonthIdx = 0;
const monthLabel = document.getElementById('cal-month-label');
const daysGrid = document.getElementById('cal-days-grid');
const inspector = document.getElementById('cal-inspector');

// Elements to update in Inspector
const inspPlaceholder = document.querySelector('.inspector-placeholder');
const inspDetails = document.getElementById('inspector-details');
const inspType = document.getElementById('insp-type');
const inspTitle = document.getElementById('insp-title');
const inspDate = document.getElementById('insp-date-text');
const inspDesc = document.getElementById('insp-desc');
const inspImg = document.getElementById('insp-img');

function renderCalendar(idx) {
    const data = calendarData[idx];
    monthLabel.innerText = data.label;
    daysGrid.innerHTML = '';

    // Логика дней
    const daysInMonth = new Date(data.year, data.month + 1, 0).getDate();
    const firstDayIndex = new Date(data.year, data.month, 1).getDay(); 
    
    // Корректировка для понедельника (0=Sun -> 6, 1=Mon -> 0)
    const startOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    // Пустые ячейки до начала месяца
    for(let i=0; i<startOffset; i++) {
        daysGrid.innerHTML += `<div class="day-cell"></div>`;
    }

    // Дни месяца
    for(let day=1; day<=daysInMonth; day++) {
        const dayEl = document.createElement('div');
        dayEl.className = 'day-cell';
        dayEl.innerText = day;

        // Проверяем, есть ли событие
        const event = data.events.find(e => e.day === day);
        
        if(event) {
            dayEl.classList.add('has-event');
            // Добавляем маркер
            const marker = document.createElement('div');
            marker.className = `marker ${event.type}`;
            dayEl.appendChild(marker);

            // Клик по событию
            dayEl.addEventListener('click', () => {
                // Подсветка активного
                document.querySelectorAll('.day-cell').forEach(c => c.classList.remove('active'));
                dayEl.classList.add('active');
                showInspector(event, data.year, data.label);
            });
        }

        daysGrid.appendChild(dayEl);
    }
}

function changeMonth(dir) {
    // Листаем только существующие месяцы с событиями
    currentMonthIdx += dir;
    if (currentMonthIdx < 0) currentMonthIdx = calendarData.length - 1;
    if (currentMonthIdx >= calendarData.length) currentMonthIdx = 0;
    
    renderCalendar(currentMonthIdx);
    // Сброс инспектора при смене месяца
    inspPlaceholder.style.display = 'block';
    inspDetails.classList.add('hidden');
}

function showInspector(event, year, monthStr) {
    inspPlaceholder.style.display = 'none';
    inspDetails.classList.remove('hidden');

    inspType.innerText = event.type === 'game' ? 'GAME RELEASE' : 'MEDIA EVENT';
    inspType.style.background = event.type === 'game' ? 'var(--accent-gold)' : '#fff';
    inspTitle.innerText = event.title;
    inspDate.innerText = `${event.day} ${monthStr.split(' ')[0]} ${year}`; // Примитивное форматирование
    inspDesc.innerText = event.desc;
    
    // Картинка
    if(event.img) {
        inspImg.style.backgroundImage = `url('${event.img}')`;
        inspImg.style.display = 'block';
    } else {
        inspImg.style.display = 'none';
    }
}

// Инициализация (рендерим первый месяц из данных)
renderCalendar(0);
