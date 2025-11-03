// Данные для календаря (примеры событий)
const eventsData = {
    "2017-02-10": [
        { type: "game", title: "Bendy and the Ink Machine - Глава 1", description: "Релиз первой главы на Game Jolt" }
    ],
    "2017-04-18": [
        { type: "game", title: "Bendy and the Ink Machine - Глава 2", description: "Релиз второй главы на Game Jolt" }
    ],
    "2017-09-28": [
        { type: "game", title: "Bendy and the Ink Machine - Глава 3", description: "Релиз третьей главы в Steam" }
    ],
    "2017-01-30": [
        { type: "teaser", title: "Первый тизер игры", description: "Анонс разработки Bendy and the Ink Machine" }
    ],
    "2017-03-27": [
        { type: "trailer", title: "Трейлер Главы 2", description: "Официальный трейлер второй главы" }
    ],
    "2017-08-11": [
        { type: "trailer", title: "Трейлер Главы 3", description: "Официальный трейлер третьей главы" }
    ],
    "2017-11-17": [
        { type: "other", title: "Анонс Главы 4", description: "Начало разработки четвёртой главы" }
    ],
    "2018-10-13": [
        { type: "game", title: "Bendy and the Ink Machine - Глава 4", description: "Релиз четвёртой главы" }
    ],
    "2018-12-20": [
        { type: "trailer", title: "Трейлер Главы 5", description: "Официальный трейлер финальной главы" }
    ],
    "2020-11-20": [
        { type: "game", title: "Bendy and the Dark Revival", description: "Анонс новой игры" }
    ]
};

// Данные для доски почёта
const hofData = [
    {
        id: 1,
        name: "Ink Researcher",
        category: "content",
        description: "Автор самого популярного русскоязычного паблика о Bendy. Создатель детальных анализов лора и символики игры.",
        social: { youtube: "#", vk: "#", telegram: "#" }
    },
    {
        id: 2,
        name: "Cartoon Master",
        category: "art",
        description: "Талантливый художник, создающий фан-арты в уникальном стиле, максимально приближенном к оригинальной эстетике Bendy.",
        social: { deviantart: "#", instagram: "#", artstation: "#" }
    },
    {
        id: 3,
        name: "Boris The Helper",
        category: "mods",
        description: "Разработчик модификаций и фанатских игр по вселенной Bendy. Создатель популярного мода 'Boris Adventure'.",
        social: { github: "#", discord: "#" }
    },
    {
        id: 4,
        name: "Ink Community",
        category: "community",
        description: "Организатор крупнейшего русскоязычного сообщества Bendy. Модератор и создатель мероприятий для фанатов.",
        social: { vk: "#", discord: "#" }
    },
    {
        id: 5,
        name: "Lore Seeker",
        category: "content",
        description: "Исследователь скрытых деталей и секретов игр серии Bendy. Автор теории о связи всех игр вселенной.",
        social: { youtube: "#", telegram: "#" }
    },
    {
        id: 6,
        name: "Animation Devil",
        category: "art",
        description: "Аниматор, создающий короткометражки и забавные видео с персонажами Bendy. Работает в стиле старых мультфильмов.",
        social: { youtube: "#", tiktok: "#" }
    },
    {
        id: 7,
        name: "Ink Translator",
        category: "content",
        description: "Автор русских субтитров и озвучек для всех трейлеров и новостей по вселенной Bendy.",
        social: { youtube: "#", vk: "#" }
    },
    {
        id: 8,
        name: "Archive Keeper",
        category: "community",
        description: "Создатель самой полной базы знаний по Bendy на русском языке. Ведущий архива разработки и концепт-артов.",
        social: { telegram: "#", discord: "#" }
    }
];
