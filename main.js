const ITEMS_PER_PAGE = 6;
let currentPage = 1;
let filteredGames = [];

// Инициализация страницы
function initializePage() {
  initializeFilters();
  renderPage(1);
  setupEventListeners();
}

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
  
  // Сортируем видеокарты по производительности
  const gpuRank = ["GT 1030", "GTX 1050", "GTX 1060", "RTX 2060", "RTX 3060", "RTX 4070", "RTX 5070"];
  gpus.sort((a, b) => {
    const aIndex = gpuRank.findIndex(gpu => a.includes(gpu));
    const bIndex = gpuRank.findIndex(gpu => b.includes(gpu));
    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
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
    const matchesGpu = !gpuSelect.value || game.gpu.includes(gpuSelect.value);
    const matchesPrice = !priceSelect.value || game.price === priceSelect.value;
    
    return matchesSearch && matchesGenre && matchesGpu && matchesPrice;
  });

  // Сортировка
  filtered.sort((a, b) => {
    const dateA = new Date(a.release_date);
    const dateB = new Date(b.release_date);
    
    if (sortSelect.value === "newest") {
      return dateB - dateA;
    } else {
      return dateA - dateB;
    }
  });

  return filtered;
}

// Отображение страницы
function renderPage(page = 1) {
  const gameList = document.getElementById('gameList');
  const pagination = document.getElementById('pagination');
  
  if (!gameList) return;
  
  gameList.innerHTML = "";
  filteredGames = filterAndSortGames();
  const totalPages = Math.ceil(filteredGames.length / ITEMS_PER_PAGE);

  // Корректируем текущую страницу если нужно
  if (page > totalPages && totalPages > 0) {
    page = totalPages;
    currentPage = page;
  }

  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const pageGames = filteredGames.slice(start, end);

  pageGames.forEach(game => {
    const card = createGameCard(game);
    gameList.appendChild(card);
  });

  renderPagination(totalPages, page);
}

// Пагинация
function renderPagination(totalPages, activePage) {
  const pagination = document.getElementById('pagination');
  if (!pagination) return;
  
  pagination.innerHTML = "";
  
  if (totalPages <= 1) return;
  
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === activePage) {
      btn.classList.add("active");
      btn.disabled = true;
    }
    btn.addEventListener("click", () => {
      currentPage = i;
      renderPage(currentPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
  
  if (searchInput) searchInput.addEventListener("input", () => handleFilterChange());
  if (genreSelect) genreSelect.addEventListener("change", () => handleFilterChange());
  if (gpuSelect) gpuSelect.addEventListener("change", () => handleFilterChange());
  if (priceSelect) priceSelect.addEventListener("change", () => handleFilterChange());
  if (sortSelect) sortSelect.addEventListener("change", () => handleFilterChange());
  if (resetBtn) resetBtn.addEventListener("click", resetFilters);
}

function handleFilterChange() {
  currentPage = 1;
  renderPage(currentPage);
}

function resetFilters() {
  const searchInput = document.getElementById('searchInput');
  const genreSelect = document.getElementById('genreSelect');
  const gpuSelect = document.getElementById('gpuSelect');
  const priceSelect = document.getElementById('priceSelect');
  const sortSelect = document.getElementById('sortSelect');
  
  if (searchInput) searchInput.value = "";
  if (genreSelect) genreSelect.value = "";
  if (gpuSelect) gpuSelect.value = "";
  if (priceSelect) priceSelect.value = "";
  if (sortSelect) sortSelect.value = "newest";
  
  currentPage = 1;
  renderPage(currentPage);
}

// Экспортируем для доступа из games.js
window.initializePage = initializePage;
