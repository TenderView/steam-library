```javascript
// games.js - данные игр и создание карточек
const gamesData = [
  {
    name: "Cyberpunk 2077",
    genre: "Ролевые экшены",
    price: "paid",
    release_date: "2020-12-10",
    rating: "7/10",
    cover: "https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg",
    gpu: "RTX 2060",
    cpu: "Intel i7",
    ram: "16GB",
    screenshots: [
      "https://cdn.akamai.steamstatic.com/steam/apps/1091500/ss_1.jpg",
      "https://cdn.akamai.steamstatic.com/steam/apps/1091500/ss_2.jpg"
    ]
  },
  {
    name: "Elden Ring",
    genre: "РПГ",
    price: "paid",
    release_date: "2022-02-25",
    rating: "9/10",
    cover: "https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg",
    gpu: "RTX 2060",
    cpu: "Intel i5",
    ram: "16GB",
    screenshots: [
      "https://cdn.akamai.steamstatic.com/steam/apps/1245620/ss_1.jpg",
      "https://cdn.akamai.steamstatic.com/steam/apps/1245620/ss_2.jpg"
    ]
  },
  {
    name: "Hollow Knight",
    genre: "Приключенческая ролевая игра",
    price: "paid",
    release_date: "2017-02-26",
    rating: "9/10",
    cover: "https://cdn.akamai.steamstatic.com/steam/apps/367520/header.jpg",
    gpu: "GTX 1050",
    cpu: "Intel i5",
    ram: "8GB",
    screenshots: [
      "https://cdn.akamai.steamstatic.com/steam/apps/367520/ss_1.jpg",
      "https://cdn.akamai.steamstatic.com/steam/apps/367520/ss_2.jpg"
    ]
  },
  {
    name: "StarCraft II",
    genre: "Стратегии в реальном времени",
    price: "free",
    release_date: "2018-11-21",
    rating: "8/10",
    gpu: "GTX 750",
    cpu: "Intel i5",
    ram: "8GB",
    cover: "https://cdn.akamai.steamstatic.com/steam/apps/58190/header.jpg",
    screenshots: [
      "https://cdn.akamai.steamstatic.com/steam/apps/58190/ss_1.jpg",
      "https://cdn.akamai.steamstatic.com/steam/apps/58190/ss_2.jpg"
    ]
  },
  {
    name: "Forza Horizon 5",
    genre: "Гонки",
    price: "paid",
    release_date: "2023-02-08",
    rating: "9/10",
    cover: "https://cdn.akamai.steamstatic.com/steam/apps/1551360/header.jpg",
    gpu: "RTX 3060",
    cpu: "Intel i5",
    ram: "16GB",
    screenshots: [
      "https://cdn.akamai.steamstatic.com/steam/apps/1551360/ss_1.jpg",
      "https://cdn.akamai.steamstatic.com/steam/apps/1551360/ss_2.jpg"
    ]
  }
];

// Функция для создания карточки игры
function createGameCard(game) {
  const li = document.createElement("li");
  li.className = "game-card";
  li.innerHTML = `
    <img src="${game.cover}" alt="${game.name}" onerror="this.src='https://via.placeholder.com/300x400?text=No+Image'">
    <h3>${game.name}</h3>
    <p>Жанр: ${game.genre}</p>
    <p>Цена: ${game.price === "paid" ? "Платная" : "Бесплатная"}</p>
    <p>Рейтинг: ${game.rating}</p>
  `;

  li.addEventListener("click", () => {
    localStorage.setItem("selectedGame", JSON.stringify(game));
    window.location.href = "game-detail.html";
  });

  return li;
}
```
