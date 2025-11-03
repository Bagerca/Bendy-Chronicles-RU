// Данные событий Bendy
const bendyEvents = {
    // Bendy and the Ink Machine - релизы глав
    "2017-02-10": {
        type: "game_release",
        title: "Bendy and the Ink Machine - Chapter 1: Moving Pictures",
        description: "Релиз Главы 1: Moving Pictures (ПК, демо-версия)",
        link: "https://store.steampowered.com/app/622650/Bendy_and_the_Ink_Machine/",
        icon: "🎮"
    },
    "2017-04-18": {
        type: "game_release",
        title: "Bendy and the Ink Machine - Chapter 2: The Old Song",
        description: "Релиз Главы 2: The Old Song (ПК)",
        link: "https://store.steampowered.com/app/622650/Bendy_and_the_Ink_Machine/",
        icon: "🎮"
    },
    "2017-09-28": {
        type: "game_release",
        title: "Bendy and the Ink Machine - Chapter 3: Rise and Fall",
        description: "Релиз Главы 3: Rise and Fall (ПК)",
        link: "https://store.steampowered.com/app/622650/Bendy_and_the_Ink_Machine/",
        icon: "🎮"
    },
    "2018-04-30": {
        type: "game_release",
        title: "Bendy and the Ink Machine - Chapter 4: Colossal Wonders",
        description: "Релиз Главы 4: Colossal Wonders (ПК)",
        link: "https://store.steampowered.com/app/622650/Bendy_and_the_Ink_Machine/",
        icon: "🎮"
    },
    "2018-10-26": {
        type: "game_release",
        title: "Bendy and the Ink Machine - Chapter 5: The Last Reel",
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
    "2018-12-21": {
        type: "game_release",
        title: "Bendy and the Ink Machine - Мобильная версия",
        description: "Выпуск на iOS и Android",
        link: "https://apps.apple.com/app/bendy-and-the-ink-machine/id1440519476",
        icon: "📱"
    },

    // Bendy in Nightmare Run
    "2018-08-15": {
        type: "game_release",
        title: "Bendy in Nightmare Run",
        description: "Релиз спин-оффа на iOS и Android",
        link: "https://apps.apple.com/app/bendy-in-nightmare-run/id1384910822",
        icon: "📱"
    },

    // Boris and the Dark Survival
    "2020-02-10": {
        type: "game_release",
        title: "Boris and the Dark Survival",
        description: "Релиз спин-оффа/приквела на ПК",
        link: "https://store.steampowered.com/app/1024890/Boris_and_the_Dark_Survival/",
        icon: "🎮"
    },

    // Bendy and the Dark Revival
    "2022-11-15": {
        type: "game_release",
        title: "Bendy and the Dark Revival",
        description: "Релиз продолжения на Windows (ПК)",
        link: "https://store.steampowered.com/app/1716620/Bendy_and_the_Dark_Revival/",
        icon: "🎮"
    },
    "2023-03-01": {
        type: "game_release",
        title: "Bendy and the Dark Revival - Консольные версии",
        description: "Релиз на PlayStation 4, PlayStation 5, Xbox One и Xbox Series X/S",
        link: "https://store.playstation.com/app/bendy-and-the-dark-revival",
        icon: "🎮"
    },

    // Bendy: Secrets of the Machine
    "2024-04-14": {
        type: "game_release",
        title: "Bendy: Secrets of the Machine",
        description: "Релиз сайд-стори на ПК",
        link: "https://store.steampowered.com/app/2774470/Bendy_Secrets_of_the_Machine/",
        icon: "🎮"
    },

    // Bendy: Lone Wolf
    "2024-08-15": {
        type: "game_release",
        title: "Bendy: Lone Wolf",
        description: "Релиз преемника Boris and the Dark Survival на ПК",
        link: "https://store.steampowered.com/app/2861550/Bendy_Lone_Wolf/",
        icon: "🎮"
    },

    // Анонсы, тизеры и трейлеры
    "2017-01-30": {
        type: "trailer",
        title: "Анонсирующий трейлер Bendy and the Ink Machine",
        description: "Первый анонсирующий трейлер игры Bendy and the Ink Machine",
        link: "https://youtube.com/watch?v=js3Uhtu-egU",
        icon: "🎬"
    },
    "2017-08-11": {
        type: "teaser",
        title: "Tombstone Picnic - тизер Главы 3",
        description: "Первый анимированный короткометражный фильм, служащий тизером Главы 3",
        link: "https://youtube.com/watch?v=abcdefg",
        icon: "📢"
    },
    "2018-01-26": {
        type: "announcement",
        title: "Анонс Bendy in Nightmare Run",
        description: "Официальный анонс игры Bendy in Nightmare Run",
        link: "https://youtube.com/watch?v=abcdefg",
        icon: "📢"
    },
    "2019-04-14": {
        type: "announcement",
        title: "Анонс Bendy and the Dark Revival",
        description: "Первый анонс сиквела Bendy and the Dark Revival",
        link: "https://youtube.com/watch?v=abcdefg",
        icon: "📢"
    },
    "2019-06-24": {
        type: "trailer",
        title: "Геймплейный трейлер Bendy and the Dark Revival",
        description: "Первый геймплейный трейлер Bendy and the Dark Revival",
        link: "https://youtube.com/watch?v=abcdefg",
        icon: "🎬"
    },
    "2020-06-01": {
        type: "trailer",
        title: "Трейлер Bendy and the Dark Revival",
        description: "Трейлер, анонсирующий выход игры целиком",
        link: "https://youtube.com/watch?v=abcdefg",
        icon: "🎬"
    },
    "2022-10-31": {
        type: "trailer",
        title: "Финальный трейлер Bendy and the Dark Revival",
        description: "Финальный трейлер перед релизом Bendy and the Dark Revival",
        link: "https://youtube.com/watch?v=abcdefg",
        icon: "🎬"
    },
    "2023-10-31": {
        type: "announcement",
        title: "Анонсирующий трейлер Bendy: The Cage",
        description: "Анонс новой игры Bendy: The Cage",
        link: "https://youtube.com/watch?v=abcdefg",
        icon: "📢"
    },
    "2023-12-25": {
        type: "announcement",
        title: "Анонс экранизации Bendy and the Ink Machine",
        description: "Официальный анонс фильма по вселенной Bendy",
        link: "https://www.hollywoodreporter.com/movies/movie-news/bendy-ink-machine-movie-1235756895/",
        icon: "🎥"
    },
    "2024-04-18": {
        type: "announcement",
        title: "Анонс третьей основной части серии (B3NDY)",
        description: "Официальный анонс третьей основной части серии Bendy",
        link: "https://twitter.com/Bendy/status/xyz",
        icon: "📢"
    },
    "2024-10-31": {
        type: "announcement",
        title: "Объявление режиссёра фильма",
        description: "Объявлен режиссёр фильма (Андре Эвредал) и официальное название (Бенди и чернильная машина)",
        link: "https://www.hollywoodreporter.com/movies/movie-news/bendy-ink-machine-movie-director-1235987521/",
        icon: "🎥"
    },
    "2024-12-16": {
        type: "trailer",
        title: "Первый трейлер Bendy: Lone Wolf",
        description: "Показан первый трейлер игры Bendy: Lone Wolf",
        link: "https://youtube.com/watch?v=abcdefg",
        icon: "🎬"
    },

    // Будущие проекты
    "2025-05-09": {
        type: "game_release",
        title: "Bendy and the Ink Machine - Next Gen",
        description: "Выпуск на PlayStation 5 и Xbox Series X/S",
        link: "https://store.playstation.com/app/bendy-and-the-ink-machine-ps5",
        icon: "🎮"
    },
    "2025-08-01": {
        type: "announcement",
        title: "Начало съёмок фильма Bendy",
        description: "Начало съёмок фильма по вселенной Bendy and the Ink Machine",
        link: "https://www.hollywoodreporter.com/movies/movie-news/bendy-movie-filming-1236000000/",
        icon: "🎥"
    }
};

// Дополнительные данные для фильтрации по типам
const eventTypes = {
    "game_release": { name: "Релизы игр", color: "#8B4513", icon: "🎮" },
    "trailer": { name: "Трейлеры", color: "#654321", icon: "🎬" },
    "teaser": { name: "Тизеры", color: "#A0522D", icon: "📢" },
    "announcement": { name: "Анонсы", color: "#D2691E", icon: "📢" }
};
