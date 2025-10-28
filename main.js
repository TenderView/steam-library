// Элементы фильтров и списка
const searchInput = document.getElementById("searchInput");
const genreSelect = document.getElementById("genreSelect");
const gpuSelect = document.getElementById("gpuSelect");
const priceSelect = document.getElementById("priceSelect");
const sortSelect = document.getElementById("sortSelect");
const resetBtn = document.getElementById("resetBtn");
const gameList = document.getElementById("gameList");
const pagination = document.getElementById("pagination");

const ITEMS_PER_PAGE = 15; // Количество игр на страницу
let currentPage = 1;

// Фильтрация и сортировка
function filterAndSortGames() {
  let filtered = gamesData.filter(game => {
    const matchesSearch = game.name.toLowerCase().includes(searchInput.value.toLowerCase());
    const matchesGenre = !genreSelect.value || game.genre === genreSelect.value;
    const matchesGpu = !gpuSelect.value || game.gpu === gpuSelect.value;
    const matchesPrice = !priceSelect.value || game.price === priceSelect.value;
    return matchesSearch && matchesGenre && matchesGpu && matchesPrice;
  });

  filtered.sort((a, b) => {
    const dateA = new Date(a.release_date);
    const dateB = new Date(b.release_date);
    return sortSelect.value === "newest" ? dateB - dateA : dateA - dateB;
  });

  return filtered;
}

// Показ игр на странице
function renderPage(page = 1) {
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

// Пагинация
function renderPagination(totalPages, activePage) {
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

// Сброс фильтров
resetBtn.addEventListener("click", () => {
  searchInput.value = "";
  genreSelect.value = "";
  gpuSelect.value = "";
  priceSelect.value = "";
  sortSelect.value = "newest";
  currentPage = 1;
  renderPage(currentPage);
});

// События фильтров
searchInput.addEventListener("input", () => renderPage(1));
genreSelect.addEventListener("change", () => renderPage(1));
gpuSelect.addEventListener("change", () => renderPage(1));
priceSelect.addEventListener("change", () => renderPage(1));
sortSelect.addEventListener("change", () => renderPage(1));

// Инициализация страницы
renderPage(currentPage);
