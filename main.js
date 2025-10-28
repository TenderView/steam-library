// main.js - Фильтрация, пагинация и управление UI

let filteredGames = [];
window.currentPage = 1;

// Инициализация фильтров
function initializeFilters(gamesData) {
    populateGenreFilter(gamesData);
    populateGPUFilter(gamesData);
    populateCPUFilter(gamesData);
    populateRAMFilter(gamesData);
    setupEventListeners(gamesData);
    
    // Первоначальное отображение игр
    filterAndDisplayGames();
}

// Заполнение фильтра жанров
function populateGenreFilter(gamesData) {
    const genreSelect = document.getElementById('genreSelect');
    if (!genreSelect) return;
    
    const genres = [...new Set(gamesData.map(game => game.genre))].sort();
    
    genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        genreSelect.appendChild(option);
    });
}

// Заполнение фильтра видеокарт
function populateGPUFilter(gamesData) {
    const gpuSelect = document.getElementById('gpuSelect');
    if (!gpuSelect) return;
    
    const gpus = [...new Set(gamesData.map(game => game.gpu))].sort((a, b) => {
        const gpuRank = ["GT 1030", "GTX 1050", "GTX 1060", "RTX 2060", "RTX 3060", "RTX 4070"];
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

// Заполнение фильтра процессоров
function populateCPUFilter(gamesData) {
    const cpuSelect = document.getElementById('cpuSelect');
    if (!cpuSelect) return;
    
    const cpus = [...new Set(gamesData.map(game => game.cpu))].sort();
    
    cpus.forEach(cpu => {
        const option = document.createElement('option');
        option.value = cpu;
        option.textContent = cpu;
        cpuSelect.appendChild(option);
    });
}

// Заполнение фильтра оперативной памяти
function populateRAMFilter(gamesData) {
    const ramSelect = document.getElementById('ramSelect');
    if (!ramSelect) return;
    
    const rams = [...new Set(gamesData.map(game => game.ram))].sort((a, b) => {
        const aGB = parseInt(a);
        const bGB = parseInt(b);
        return aGB - bGB;
    });
    
    rams.forEach(ram => {
        const option = document.createElement('option');
        option.value = ram;
        option.textContent = ram;
        ramSelect.appendChild(option);
    });
}

// Настройка обработчиков событий
function setupEventListeners(gamesData) {
    const searchInput = document.getElementById('searchInput');
    const genreSelect = document.getElementById('genreSelect');
    const gpuSelect = document.getElementById('gpuSelect');
    const priceSelect = document.getElementById('priceSelect');
    const sortSelect = document.getElementById('sortSelect');
    const cpuSelect = document.getElementById('cpuSelect');
    const ramSelect = document.getElementById('ramSelect');
    const dateFrom = document.getElementById('dateFrom');
    const dateTo = document.getElementById('dateTo');
    const resetBtn = document.getElementById('resetBtn');
    const resetFiltersBtn = document.getElementById('resetFiltersBtn');
    
    // Обработчики для фильтров
    if (searchInput) searchInput.addEventListener('input', handleFilterChange);
    if (genreSelect) genreSelect.addEventListener('change', handleFilterChange);
    if (gpuSelect) gpuSelect.addEventListener('change', handleFilterChange);
    if (priceSelect) priceSelect.addEventListener('change', handleFilterChange);
    if (sortSelect) sortSelect.addEventListener('change', handleFilterChange);
    if (cpuSelect) cpuSelect.addEventListener('change', handleFilterChange);
    if (ramSelect) ramSelect.addEventListener('change', handleFilterChange);
    if (dateFrom) dateFrom.addEventListener('change', handleFilterChange);
    if (dateTo) dateTo.addEventListener('change', handleFilterChange);
    
    // Обработчики для кнопок сброса
    if (resetBtn) resetBtn.addEventListener('click', resetFilters);
    if (resetFiltersBtn) resetFiltersBtn.addEventListener('click', resetFilters);
}

// Обработчик изменения фильтров
function handleFilterChange() {
    window.currentPage = 1;
    filterAndDisplayGames();
}

// Сброс фильтров
function resetFilters() {
    const searchInput = document.getElementById('searchInput');
    const genreSelect = document.getElementById('genreSelect');
    const gpuSelect = document.getElementById('gpuSelect');
    const priceSelect = document.getElementById('priceSelect');
    const sortSelect = document.getElementById('sortSelect');
    const cpuSelect = document.getElementById('cpuSelect');
    const ramSelect = document.getElementById('ramSelect');
    const dateFrom = document.getElementById('dateFrom');
    const dateTo = document.getElementById('dateTo');
    
    if (searchInput) searchInput.value = '';
    if (genreSelect) genreSelect.value = '';
    if (gpuSelect) gpuSelect.value = '';
    if (priceSelect) priceSelect.value = '';
    if (sortSelect) sortSelect.value = 'newest';
    if (cpuSelect) cpuSelect.value = '';
    if (ramSelect) ramSelect.value = '';
    if (dateFrom) dateFrom.value = '';
    if (dateTo) dateTo.value = '';
    
    window.currentPage = 1;
    filterAndDisplayGames();
}

// Фильтрация и отображение игр
function filterAndDisplayGames() {
    const filtered = filterGames();
    const sorted = sortGames(filtered);
    filteredGames = sorted;
    
    if (typeof displayGames === 'function') {
        displayGames(filteredGames, window.currentPage);
    }
}

// Фильтрация игр
function filterGames() {
    const searchInput = document.getElementById('searchInput');
    const genreSelect = document.getElementById('genreSelect');
    const gpuSelect = document.getElementById('gpuSelect');
    const priceSelect = document.getElementById('priceSelect');
    const cpuSelect = document.getElementById('cpuSelect');
    const ramSelect = document.getElementById('ramSelect');
    const dateFrom = document.getElementById('dateFrom');
    const dateTo = document.getElementById('dateTo');
    
    return window.gamesData.filter(game => {
        // Поиск по названию
        const matchesSearch = !searchInput?.value || 
            game.name.toLowerCase().includes(searchInput.value.toLowerCase());
        
        // Фильтр по жанру
        const matchesGenre = !genreSelect?.value || game.genre === genreSelect.value;
        
        // Фильтр по видеокарте
        const matchesGpu = !gpuSelect?.value || game.gpu === gpuSelect.value;
        
        // Фильтр по цене
        const matchesPrice = !priceSelect?.value || game.price === priceSelect.value;
        
        // Фильтр по процессору
        const matchesCpu = !cpuSelect?.value || game.cpu === cpuSelect.value;
        
        // Фильтр по оперативной памяти
        const matchesRam = !ramSelect?.value || game.ram === ramSelect.value;
        
        // Фильтр по дате выхода
        const gameDate = new Date(game.release_date);
        const fromDate = dateFrom?.value ? new Date(dateFrom.value) : null;
        const toDate = dateTo?.value ? new Date(dateTo.value) : null;
        
        const matchesDateFrom = !fromDate || gameDate >= fromDate;
        const matchesDateTo = !toDate || gameDate <= toDate;
        
        return matchesSearch && matchesGenre && matchesGpu && matchesPrice && 
               matchesCpu && matchesRam && matchesDateFrom && matchesDateTo;
    });
}

// Сортировка игр
function sortGames(games) {
    const sortSelect = document.getElementById('sortSelect');
    if (!sortSelect) return games;
    
    const sortBy = sortSelect.value;
    
    return [...games].sort((a, b) => {
        switch (sortBy) {
            case 'newest':
                return new Date(b.release_date) - new Date(a.release_date);
            case 'oldest':
                return new Date(a.release_date) - new Date(b.release_date);
            case 'rating':
                return parseRating(b.rating) - parseRating(a.rating);
            case 'name':
                return a.name.localeCompare(b.name);
            default:
                return 0;
        }
    });
}

// Парсинг рейтинга
function parseRating(rating) {
    if (!rating) return 0;
    const match = rating.match(/(\d+(\.\d+)?)/);
    return match ? parseFloat(match[1]) : 0;
}

// Экспортируем функции в глобальную область видимости
window.initializeFilters = initializeFilters;
window.filterAndDisplayGames = filterAndDisplayGames;
window.filterGames = filterGames;
window.sortGames = sortGames;
