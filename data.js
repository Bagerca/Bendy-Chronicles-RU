// Данные о событиях Bendy Chronicles
const eventsData = [
    // 2017
    { date: '2017-01-30', type: 'trailer', title: 'Анонсирующий трейлер Bendy and the Ink Machine' },
    { date: '2017-02-10', type: 'game', title: 'Bendy and the Ink Machine - Глава 1: Moving Pictures (ПК, демо)' },
    { date: '2017-04-18', type: 'game', title: 'Bendy and the Ink Machine - Глава 2: The Old Song (ПК)' },
    { date: '2017-08-11', type: 'teaser', title: 'Анимированный короткометражный фильм Tombstone Picnic (тизер Главы 3)' },
    { date: '2017-09-28', type: 'game', title: 'Bendy and the Ink Machine - Глава 3: Rise and Fall (ПК)' },
    
    // 2018
    { date: '2018-01-26', type: 'announcement', title: 'Анонс игры Bendy in Nightmare Run' },
    { date: '2018-04-30', type: 'game', title: 'Bendy and the Ink Machine - Глава 4: Colossal Wonders (ПК)' },
    { date: '2018-08-15', type: 'game', title: 'Bendy in Nightmare Run (iOS, Android)' },
    { date: '2018-10-26', type: 'game', title: 'Bendy and the Ink Machine - Глава 5: The Last Reel (ПК)' },
    { date: '2018-11-20', type: 'game', title: 'Bendy and the Ink Machine - полное издание (PS4, Xbox One, Nintendo Switch)' },
    { date: '2018-12-21', type: 'game', title: 'Bendy and the Ink Machine (iOS, Android)' },
    
    // 2019
    { date: '2019-04-14', type: 'announcement', title: 'Анонс Bendy and the Dark Revival' },
    { date: '2019-06-24', type: 'trailer', title: 'Геймплейный трейлер Bendy and the Dark Revival' },
    
    // 2020
    { date: '2020-02-10', type: 'game', title: 'Boris and the Dark Survival (ПК)' },
    { date: '2020-06-01', type: 'trailer', title: 'Трейлер Bendy and the Dark Revival (анонс выхода целиком)' },
    
    // 2022
    { date: '2022-10-31', type: 'trailer', title: 'Финальный трейлер Bendy and the Dark Revival' },
    { date: '2022-11-15', type: 'game', title: 'Bendy and the Dark Revival (Windows ПК)' },
    
    // 2023
    { date: '2023-03-01', type: 'game', title: 'Bendy and the Dark Revival (PS4, PS5, Xbox One, Xbox Series X/S)' },
    { date: '2023-05-10', type: 'announcement', title: 'Прототип геймплея Bendy: The Silent City "официально" утёк' },
    { date: '2023-10-31', type: 'trailer', title: 'Анонсирующий трейлер Bendy: The Cage' },
    { date: '2023-12-25', type: 'announcement', title: 'Анонс экранизации Bendy and the Ink Machine' },
    
    // 2024
    { date: '2024-04-14', type: 'game', title: 'Bendy: Secrets of the Machine (ПК)' },
    { date: '2024-04-18', type: 'announcement', title: 'Официальный анонс третьей основной части серии (B3NDY)' },
    { date: '2024-08-15', type: 'game', title: 'Bendy: Lone Wolf (ПК)' },
    { date: '2024-10-31', type: 'announcement', title: 'Объявлен режиссёр фильма (Андре Эвредал) и официальное название' },
    { date: '2024-12-16', type: 'trailer', title: 'Первый трейлер Bendy: Lone Wolf' },
    
    // 2025
    { date: '2025-05-09', type: 'game', title: 'Bendy and the Ink Machine (PS5, Xbox Series X/S)' }
];

// Настройки календаря
const CALENDAR_CONFIG = {
    START_YEAR: 2017,
    END_YEAR: 2025,
    MONTHS: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    WEEKDAYS: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
};
