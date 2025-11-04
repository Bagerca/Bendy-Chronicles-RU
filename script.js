// Загрузка данных о событиях
const events = JSON.parse(document.getElementById('events').textContent);

// Получение элементов DOM
const calendarContainer = document.getElementById('calendar-container');
const currentMonthYear = document.getElementById('current-month-year');
const calendar = document.getElementById('calendar');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');

// Текущая дата
let currentDate = new Date();
let currentYear = currentDate.getFullYear();
let currentMonth = currentDate.getMonth();

// Отображение текущего месяца и года
function displayCurrentMonthYear() {
  currentMonthYear.innerText = `${currentDate.toLocaleString('ru-RU', { month: 'long' })} ${currentYear}`;
}

// Создание месяцев на календаре
function createMonths() {
  calendar.innerHTML = '';
  for (let year = 2017; year <= 2025; year++) {
    for (let month = 0; month < 12; month++) {
      const monthElement = document.createElement('div');
      monthElement.classList.add('month');
      monthElement.innerText = `${month + 1}.${year}`;
      monthElement.dataset.year = year;
      monthElement.dataset.month = month;
      calendar.appendChild(monthElement);
    }
  }
  highlightActiveMonth();
}

// Выделение активного месяца
function highlightActiveMonth() {
  const activeMonth = calendar.querySelector(`.month[data-year="${currentYear}"][data-month="${currentMonth}"]`);
  if (activeMonth) {
      activeMonth.classList.add('active');
  } else {
      calendar.querySelector('.month').classList.add('active');
  }
}

// Обработка клика по месяцу
calendar.addEventListener('click', (event) => {
  if (event.target.classList.contains('month')) {
    currentYear = parseInt(event.target.dataset.year, 10);
    currentMonth = parseInt(event.target.dataset.month, 10);
    highlightActiveMonth();
    displayCurrentMonthYear();
    showEventsForMonth();
  }
});

// Навигация по месяцам
prevMonthBtn.addEventListener('click', () => {
  if (currentMonth === 0) {
    currentMonth = 11;
    currentYear--;
  } else {
    currentMonth--;
  }
  highlightActiveMonth();
  displayCurrentMonthYear();
  showEventsForMonth();
});

nextMonthBtn.addEventListener('click', () => {
  if (currentMonth === 11) {
    currentMonth = 0;
    currentYear++;
  } else {
    currentMonth++;
  }
  highlightActiveMonth();
  displayCurrentMonthYear();
  showEventsForMonth();
});

// Отображение событий для выбранного месяца
function showEventsForMonth() {
  // Логика отображения событий
}

// При наведении на событие показывать всплывающее окно
calendar.addEventListener('mouseover', (event) => {
  if (event.target.classList.contains('event')) {
    // Логика показа всплывающего окна
  }
});

// Инициализация календаря
displayCurrentMonthYear();
createMonths();
showEventsForMonth();
