```javascript
// main.js - логика фильтрации, пагинации и управления UI
const ITEMS_PER_PAGE = 6;
let currentPage = 1;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  initializeFilters();
  renderPage(currentPage);
  setupEventListeners();
});

// Инициализация фильтров
function initializeFilters() {
  populateGenreFilter();
  populateGPUFilter();
}

// Заполнение фильтра жанров
function populateGenreFilter() {
  const genreSelect = document.getElementById('genreSelect');
  const genres = [...new Set(gamesData.map(game => game.genre))];
  
  genres.forEach(genre => {
    const option = document.createElement('option');
    option.value = genre;
    option.textContent = genre;
    genreSelect.appendChild(option);
  });
}

// Заполнение фильтра видеокарт
function populateGPUFilter() {
  const gpuSelect = document.getElementById('gpuSelect');
  const gpus = [...new Set(gamesData.map(game => game.gpu))];
  
  gpus.sort((a, b) => {
    const gpuRank = ["GTX 750", "GTX 1050", "GTX 1060", "RTX 2060", "RTX 3060", "RTX 4070"];
    return gpuRank.indexOf(a) - gpuRank.indexOf(b);
  });
  
  gpus.forEach(gpu => {
    const option = document.createElement('option');
    option.value = gpu;
    option.textContent = gpu;
    gpuSelect.appendChild(option);
  });
}

// Фильтрация и сортировка игр
function filterAndSortGames() {
  const searchInput = document.getElementById('searchInput');
  const genreSelect = document.getElementById('genreSelect');
  const gpuSelect = document.getElementById('gpuSelect');
  const priceSelect = document.getElementById('priceSelect');
  const sortSelect = document.getElementById('sortSelect');
  
  let filtered = gamesData.filter(game => {
    const matchesSearch = game.name.toLowerCase().includes(searchInput.value.toLowerCase());
    const matchesGenre = !genreSelect.value || game.genre === genreSelect.value;
    const matchesGpu = !gpuSelect.value || game.gpu === gpuSelect.value;
    const matchesPrice = !priceSelect.value || game.price === priceSelect.value;
    
    return matchesSearch && matchesGenre && matchesGpu && matchesPrice;
  });

  // Сортировка по дате выхода
  filtered.sort((a, b) => {
    const dateA = new Date(a.release_date);
    const dateB = new Date(b.release_date);
    return sortSelect.value === "newest" ? dateB - dateA : dateA - dateB;
  });

  return filtered;
}

// Отображение страницы с играми
function renderPage(page = 1) {
  const gameList = document.getElementById('gameList');
  const pagination = document.getElementById('pagination');
  
  gameList.innerHTML = "";
  const filteredGames = filterAndSortGames();
  const totalPages = Math.ceil(filteredGames.length / ITEMS_PER_PAGE);

  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const pageGames = filteredGames.slice(start, end);

  pageGames.forEach(game => {
    const card = createGameCard(game);
    gameList.appendChild(card);
  });

  renderPagination(totalPages, page);
}

// Отображение пагинации
function renderPagination(totalPages, activePage) {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = "";
  
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === activePage) btn.classList.add("active");
    btn.addEventListener("click", () => {
      currentPage = i;
      renderPage(currentPage);
    });
    pagination.appendChild(btn);
  }
}

// Настройка обработчиков событий
function setupEventListeners() {
  const searchInput = document.getElementById('searchInput');
  const genreSelect = document.getElementById('genreSelect');
  const gpuSelect = document.getElementById('gpuSelect');
  const priceSelect = document.getElementById('priceSelect');
  const sortSelect = document.getElementById('sortSelect');
  const resetBtn = document.getElementById('resetBtn');
  
  searchInput.addEventListener("input", () => {
    currentPage = 1;
    renderPage(currentPage);
  });
  
  genreSelect.addEventListener("change", () => {
    currentPage = 1;
    renderPage(currentPage);
  });
  
  gpuSelect.addEventListener("change", () => {
    currentPage = 1;
    renderPage(currentPage);
  });
  
  priceSelect.addEventListener("change", () => {
    currentPage = 1;
    renderPage(currentPage);
  });
  
  sortSelect.addEventListener("change", () => {
    currentPage = 1;
    renderPage(currentPage);
  });
  
  resetBtn.addEventListener("click", () => {
    searchInput.value = "";
    genreSelect.value = "";
    gpuSelect.value = "";
    priceSelect.value = "";
    sortSelect.value = "newest";
    currentPage = 1;
    renderPage(currentPage);
  });
}
```
