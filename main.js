// Элементы фильтров и списка
const gameList = document.getElementById("gameList");
const searchInput = document.getElementById("searchInput");
const genreSelect = document.getElementById("genreSelect");
const gpuSelect = document.getElementById("gpuSelect");
const priceSelect = document.getElementById("priceSelect");
const sortSelect = document.getElementById("sortSelect");
const resetBtn = document.getElementById("resetBtn");

// Добавление карточки игры
function addGameCard(game) {
  const li = document.createElement("li");
  li.className = "game-card";
  li.dataset.genre = game.genre || "Неизвестно";
  li.dataset.price = game.priceType || "paid";
  li.dataset.gpu = game.gpu || "Неизвестно";
  li.dataset.date = game.release_date || "2000-01-01";

  li.innerHTML = `
    <div class="game-header">
      <img src="${game.cover || 'https://via.placeholder.com/150'}" class="game-cover">
      <div class="game-info">
        <h3 class="game-title">${game.name}</h3>
        <p class="game-price">Цена: ${game.price}</p>
        <p class="game-release">Дата выхода: ${game.release_date || "Неизвестно"}</p>
        <p class="game-rating">Оценка: ${game.rating || "N/A"}</p>
      </div>
    </div>
    <button class="toggle-details">Показать характеристики</button>
    <div class="game-details" style="display:none;">
      <ul>
        <li>Жанр: ${game.genre}</li>
        <li>Видеокарта: ${game.gpu || "Неизвестно"}</li>
        <li>Процессор: ${game.cpu || "Неизвестно"}</li>
        <li>Оперативная память: ${game.ram || "Неизвестно"}</li>
      </ul>
    </div>
    <div class="comments-section">
      <h4>Комментарии:</h4>
      <ul class="comments-list"></ul>
      <input type="text" class="comment-input" placeholder="Написать комментарий...">
      <button class="add-comment">Добавить</button>
    </div>
  `;

  gameList.appendChild(li);

  // Раскрытие характеристик
  li.querySelector(".toggle-details").addEventListener("click", () => {
    const details = li.querySelector(".game-details");
    details.style.display = details.style.display === "none" ? "block" : "none";
  });

  // Добавление комментариев
  li.querySelector(".add-comment").addEventListener("click", () => {
    const input = li.querySelector(".comment-input");
    const text = input.value.trim();
    if (text) {
      const commentLi = document.createElement("li");
      commentLi.textContent = text;
      li.querySelector(".comments-list").appendChild(commentLi);
      input.value = "";
    }
  });
}

// Пример тестовых данных
const gamesData = [
  {
    name: "Elden Ring",
    genre: "РПГ",
    price: "$60",
    priceType: "paid",
    release_date: "2022-02-25",
    rating: "9/10",
    cover: "https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg",
    gpu: "RTX 2060",
    cpu: "Intel i5",
    ram: "16GB"
  },
  {
    name: "Cyberpunk 2077",
    genre: "Ролевые экшены",
    price: "$50",
    priceType: "paid",
    release_date: "2020-12-10",
    rating: "7/10",
    cover: "https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg",
    gpu: "RTX 2060",
    cpu: "Intel i7",
    ram: "16GB"
  },
  {
    name: "Stardew Valley",
    genre: "Инди",
    price: "Бесплатно",
    priceType: "free",
    release_date: "2016-02-26",
    rating: "9/10",
    cover: "https://cdn.akamai.steamstatic.com/steam/apps/413150/header.jpg",
    gpu: "GTX 750",
    cpu: "Intel i3",
    ram: "4GB"
  }
];

// Добавляем все игры на страницу
gamesData.forEach(addGameCard);

// Фильтры и поиск
function filterAndSortGames() {
  const searchValue = searchInput.value.toLowerCase();
  const genre = genreSelect.value;
  const gpu = gpuSelect.value;
  const price = priceSelect.value;
  const sortOrder = sortSelect.value;

  const games = Array.from(document.querySelectorAll(".game-card"));

  // Сортировка по дате
  games.sort((a, b) => {
    const dateA = new Date(a.dataset.date);
    const dateB = new Date(b.dataset.date);
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  games.forEach(game => gameList.appendChild(game));

  // Фильтры
  games.forEach(game => {
    const text = game.querySelector(".game-title").textContent.toLowerCase();
    const matchesSearch = text.includes(searchValue);
    const matchesGenre = genre === "all" || game.dataset.genre === genre;
    const matchesGpu = gpu === "all" || game.dataset.gpu === gpu;
    const matchesPrice = price === "all" || game.dataset.price === price;

    game.style.display = matchesSearch && matchesGenre && matchesGpu && matchesPrice ? "block" : "none";
  });
}

// События фильтров и кнопка сброса
searchInput.addEventListener("input", filterAndSortGames);
genreSelect.addEventListener("change", filterAndSortGames);
gpuSelect.addEventListener("change", filterAndSortGames);
priceSelect.addEventListener("change", filterAndSortGames);
sortSelect.addEventListener("change", filterAndSortGames);

resetBtn.addEventListener("click", () => {
  searchInput.value = "";
  genreSelect.value = "all";
  gpuSelect.value = "all";
  priceSelect.value = "all";
  sortSelect.value = "newest";
  filterAndSortGames();
});

filterAndSortGames();
