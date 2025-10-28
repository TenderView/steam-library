const searchInput = document.getElementById("searchInput");
const genreSelect = document.getElementById("genreSelect");
const gpuSelect = document.getElementById("gpuSelect");
const priceSelect = document.getElementById("priceSelect");
const sortSelect = document.getElementById("sortSelect");
const resetBtn = document.getElementById("resetBtn");
const gameList = document.getElementById("gameList");
const pagination = document.getElementById("pagination");

const ITEMS_PER_PAGE = 15;
let currentPage = 1;

// Пример данных (можно добавить реальные игры)
const gamesData = [
  {
    name: "Elden Ring",
    genre: "Ролевые экшены",
    gpu: "RTX 2060",
    price: "paid",
    release_date: "2022-02-25",
    rating: "9/10",
    cover: "https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg",
    cpu: "Intel i5",
    ram: "16GB"
  },
  {
    name: "Cyberpunk 2077",
    genre: "Ролевые экшены",
    gpu: "RTX 2060",
    price: "paid",
    release_date: "2020-12-10",
    rating: "7/10",
    cover: "https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg",
    cpu: "Intel i7",
    ram: "16GB"
  },
  // Добавь остальные игры
];

// Фильтрация и сортировка
function filterGames() {
  const searchValue = searchInput.value.toLowerCase();
  const genre = genreSelect.value;
  const gpu = gpuSelect.value;
  const price = priceSelect.value;
  const sortOrder = sortSelect.value;

  let filtered = gamesData.filter(game => {
    const matchesSearch = game.name.toLowerCase().includes(searchValue);
    const matchesGenre = genre === "all" || game.genre === genre;
    const matchesGpu = gpu === "all" || game.gpu === gpu;
    const matchesPrice = price === "all" || game.price === price;
    return matchesSearch && matchesGenre && matchesGpu && matchesPrice;
  });

  filtered.sort((a,b) => {
    const dateA = new Date(a.release_date);
    const dateB = new Date(b.release_date);
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  return filtered;
}

// Создание карточек
function renderPage(page = 1) {
  gameList.innerHTML = "";
  const filtered = filterGames();
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  currentPage = Math.min(page, totalPages);

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const pageGames = filtered.slice(start, end);

  pageGames.forEach(game => {
    const li = document.createElement("li");
    li.className = "game-card";

    li.innerHTML = `
      <div class="game-header">
        <img src="${game.cover}" class="game-cover">
        <div class="game-info">
          <h3 class="game-title">${game.name}</h3>
          <p>Цена: ${game.price}</p>
          <p>Дата выхода: ${game.release_date}</p>
          <p>Оценка: ${game.rating}</p>
          <button class="details-btn">Подробнее</button>
        </div>
      </div>
    `;

    li.querySelector(".details-btn").addEventListener("click", () => {
      // открытие отдельной страницы с деталями
      window.location.href = `game-detail.html?name=${encodeURIComponent(game.name)}`;
    });

    gameList.appendChild(li);
  });

  renderPagination(totalPages);
}

// Пагинация
function renderPagination(totalPages) {
  pagination.innerHTML = "";
  if(totalPages <= 1) return;

  for(let i=1; i<=totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if(i === currentPage) btn.disabled = true;
    btn.addEventListener("click", () => renderPage(i));
    pagination.appendChild(btn);
  }
}

// Сброс фильтров
resetBtn.addEventListener("click", () => {
  searchInput.value = "";
  genreSelect.value = "all";
  gpuSelect.value = "all";
  priceSelect.value = "all";
  sortSelect.value = "newest";
  renderPage(1);
});

// События фильтров
searchInput.addEventListener("input", () => renderPage(1));
genreSelect.addEventListener("change", () => renderPage(1));
gpuSelect.addEventListener("change", () => renderPage(1));
priceSelect.addEventListener("change", () => renderPage(1));
sortSelect.addEventListener("change", () => renderPage(1));

// Инициализация
renderPage(1);
