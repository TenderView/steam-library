// main.js - исправленная версия фильтрации
function filterAndSortGames() {
  const searchInput = document.getElementById('searchInput');
  const genreSelect = document.getElementById('genreSelect');
  const gpuSelect = document.getElementById('gpuSelect');
  const priceSelect = document.getElementById('priceSelect');
  const sortSelect = document.getElementById('sortSelect');
  const dateFromInput = document.getElementById('dateFrom');
  const dateToInput = document.getElementById('dateTo');
  
  let filtered = gamesData.filter(game => {
    // Поиск по названию
    const matchesSearch = !searchInput.value || 
      game.name.toLowerCase().includes(searchInput.value.toLowerCase());
    
    // Фильтр по жанру
    const matchesGenre = !genreSelect.value || game.genre === genreSelect.value;
    
    // Улучшенный фильтр по видеокарте
    const matchesGpu = !gpuSelect.value || 
      compareGPUsForFilter(gpuSelect.value, game.gpu);
    
    // Фильтр по цене
    const matchesPrice = !priceSelect.value || game.price === priceSelect.value;
    
    // Фильтр по дате выхода
    const gameDate = new Date(game.release_date);
    const fromDate = dateFromInput.value ? new Date(dateFromInput.value) : null;
    const toDate = dateToInput.value ? new Date(dateToInput.value) : null;
    
    const matchesDateFrom = !fromDate || gameDate >= fromDate;
    const matchesDateTo = !toDate || gameDate <= toDate;
    
    return matchesSearch && matchesGenre && matchesGpu && matchesPrice && 
           matchesDateFrom && matchesDateTo;
  });

  // Сортировка
  filtered.sort((a, b) => {
    const dateA = new Date(a.release_date);
    const dateB = new Date(b.release_date);
    
    if (sortSelect.value === "newest") {
      return dateB - dateA;
    } else if (sortSelect.value === "oldest") {
      return dateA - dateB;
    } else if (sortSelect.value === "rating") {
      return parseRating(b.rating) - parseRating(a.rating);
    } else {
      return a.name.localeCompare(b.name);
    }
  });

  return filtered;
}

// Вспомогательная функция для сравнения видеокарт в фильтрах
function compareGPUsForFilter(selectedGPU, gameGPU) {
  if (!selectedGPU || !gameGPU) return true;
  
  const gpuRank = [
    "GT 1030", "GTX 1050", "GTX 1060", "RTX 2060", 
    "RTX 3060", "RTX 4070", "RTX 5070"
  ];

  const selectedIndex = gpuRank.findIndex(gpu => selectedGPU.includes(gpu));
  const gameIndex = gpuRank.findIndex(gpu => gameGPU.includes(gpu));

  // Если не нашли в рейтинге, ищем текстовое совпадение
  if (selectedIndex === -1 || gameIndex === -1) {
    return gameGPU.toLowerCase().includes(selectedGPU.toLowerCase());
  }
  
  return gameIndex <= selectedIndex; // Игры, которые требуют <= выбранной карты
}

// Функция для парсинга рейтинга
function parseRating(rating) {
  if (!rating) return 0;
  const match = rating.match(/(\d+(\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
}

// Обновляем инициализацию фильтров
function initializeFilters() {
  populateGenreFilter();
  populateGPUFilter();
  populateCPUFilter();
  populateRAMFilter();
  setupDateFilters();
}

// Новая функция для настройки фильтров по дате
function setupDateFilters() {
  const dateFromInput = document.getElementById('dateFrom');
  const dateToInput = document.getElementById('dateTo');
  const clearDatesBtn = document.getElementById('clearDates');
  
  if (dateFromInput) {
    dateFromInput.addEventListener('change', () => handleFilterChange());
  }
  if (dateToInput) {
    dateToInput.addEventListener('change', () => handleFilterChange());
  }
  if (clearDatesBtn) {
    clearDatesBtn.addEventListener('click', () => {
      if (dateFromInput) dateFromInput.value = '';
      if (dateToInput) dateToInput.value = '';
      handleFilterChange();
    });
  }
}

// Добавляем новые фильтры
function populateCPUFilter() {
  const cpuSelect = document.getElementById('cpuSelect');
  if (!cpuSelect) return;
  
  const cpus = [...new Set(gamesData.map(game => game.cpu))].filter(Boolean);
  
  cpus.forEach(cpu => {
    const option = document.createElement('option');
    option.value = cpu;
    option.textContent = cpu;
    cpuSelect.appendChild(option);
  });
}

function populateRAMFilter() {
  const ramSelect = document.getElementById('ramSelect');
  if (!ramSelect) return;
  
  const rams = [...new Set(gamesData.map(game => game.ram))].filter(Boolean);
  
  rams.forEach(ram => {
    const option = document.createElement('option');
    option.value = ram;
    option.textContent = ram;
    ramSelect.appendChild(option);
  });
}
