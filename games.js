// Список всех игр (пример)
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
    ram: "16GB"
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
    ram: "16GB"
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
    ram: "8GB"
  },
  {
    name: "StarCraft II",
    genre: "Стратегии в реальном времени",
    price: "free",
    release_date: "2018-11-21",
    rating: "8/10",
    cover: "https://cdn.akamai.steamstatic.com/steam/apps/393380/header.jpg",
    gpu: "GTX 750",
    cpu: "Intel i3",
    ram: "4GB"
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
    ram: "16GB"
  }
  // Добавляй остальные игры сюда
];

// Функция для создания карточки игры
function createGameCard(game) {
  const li = document.createElement("li");
  li.className = "game-card";

  // Сохраняем данные для деталей
  li.dataset.name = game.name;
  li.dataset.genre = game.genre;
  li.dataset.price = game.price;
  li.dataset.release_date = game.release_date;
  li.dataset.rating = game.rating;
  li.dataset.cover = game.cover;
  li.dataset.gpu = game.gpu;
  li.dataset.cpu = game.cpu;
  li.dataset.ram = game.ram;

  li.innerHTML = `
    <img src="${game.cover}" alt="${game.name}">
    <h3>${game.name}</h3>
    <p>Жанр: ${game.genre}</p>
    <p>Цена: ${game.price === "paid" ? "Платная" : "Бесплатная"}</p>
    <p>Дата выхода: ${game.release_date}</p>
  `;

  // Переход на страницу деталей
  li.addEventListener("click", () => {
    // Сохраняем данные выбранной игры в localStorage
    localStorage.setItem("selectedGame", JSON.stringify(game));
    window.location.href = "game-detail.html";
  });

  return li;
}
