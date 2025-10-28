// games.js - Основная логика загрузки и отображения игр

let gamesData = [];
let currentPage = 1;
const ITEMS_PER_PAGE = 6;

// Загрузка данных из games.json
async function loadGamesData() {
    try {
        const response = await fetch('games.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        gamesData = await response.json();
        return gamesData;
    } catch (error) {
        console.error('Error loading games data:', error);
        gamesData = getFallbackGames();
        return gamesData;
    }
}

// Резервные данные
function getFallbackGames() {
    return [
        {
            id: 1,
            name: "Demo Game",
            genre: "Экшен",
            price: "free",
            release_date: "2023-01-01",
            rating: "8/10",
            cover: "https://via.placeholder.com/300x400/2a2a2a/00ffcc?text=Demo+Game",
            gpu: "GTX 1060",
            cpu: "Intel i5",
            ram: "8GB",
            screenshots: [
                "https://via.placeholder.com/600x340/2a2a2a/00ffcc?text=Screenshot+1",
                "https://via.placeholder.com/600x340/2a2a2a/00ffcc?text=Screenshot+2"
            ],
            description: "Демо-версия игры для тестирования"
        }
    ];
}

// Создание карточки игры
function createGameCard(game) {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.setAttribute('data-id', game.id);
    
    // Проверка совместимости для карточки
    const userGPU = localStorage.getItem('selectedGPU');
    const compatibility = userGPU ? checkCompatibility(userGPU, game.gpu) : 'unknown';
    const compatibilityClass = getCompatibilityClass(compatibility);
    const compatibilityIcon = getCompatibilityIcon(compatibility);
    
    // Создание звезд рейтинга
    const ratingStars = createRatingStars(game.rating);
    
    // Бейдж если есть
    const badge = game.badge ? `<div class="game-card-badge ${game.badge}">${game.badge === 'new' ? '🆕 Новинка' : '🔥 Популярная'}</div>` : '';
    
    card.innerHTML = `
        ${badge}
        <div class="game-card-content">
            <div class="game-card-image">
                <img src="${game.cover}" alt="${game.name}" 
                     onerror="this.src='https://via.placeholder.com/300x400/2a2a2a/00ffcc?text=No+Image'">
            </div>
            <div class="game-card-info">
                <div class="game-card-header">
                    <h3 class="game-card-title">${game.name}</h3>
                    <div class="game-card-compatibility ${compatibilityClass}">
                        ${compatibilityIcon}
                    </div>
                </div>
                <div class="game-card-meta">
                    <div class="game-card-meta-item genre">
                        ${game.genre}
                    </div>
                    <div class="game-card-meta-item ${game.price === 'free' ? 'free' : 'price'}">
                        ${game.price === 'free' ? 'Бесплатная' : 'Платная'}
                    </div>
                    <div class="game-card-meta-item date">
                        ${new Date(game.release_date).toLocaleDateString('ru-RU')}
                    </div>
                </div>
                <div class="game-card-rating">
                    ${ratingStars}
                    <span style="margin-left: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">
                        ${game.rating}
                    </span>
                </div>
            </div>
        </div>
    `;
    
    card.addEventListener('click', () => {
        localStorage.setItem('selectedGame', JSON.stringify(game));
        window.location.href = 'game-detail.html';
    });
    
    return card;
}

// Создание звезд рейтинга
function createRatingStars(rating) {
    const numericRating = parseFloat(rating.split('/')[0]);
    const maxRating = 10;
    const starRating = Math.round((numericRating / maxRating) * 5);
    
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<span class="rating-star ${i <= starRating ? 'filled' : ''}">${i <= starRating ? '★' : '☆'}</span>`;
    }
    return stars;
}

// Проверка совместимости
function checkCompatibility(userGPU, gameGPU) {
    if (!userGPU || !gameGPU) return null;
    
    const gpuRank = [
        "GT 1030", "GTX 1050", "GTX 1060", "GTX 1070", "GTX 1080",
        "RTX 2060", "RTX 2070", "RTX 2080", 
        "RTX 3060", "RTX 3070", "RTX 3080",
        "RTX 4070", "RTX 4080", "RTX 5070"
    ];

    const userIndex = gpuRank.findIndex(gpu => userGPU.includes(gpu));
    const gameIndex = gpuRank.findIndex(gpu => gameGPU.includes(gpu));

    if (userIndex === -1 || gameIndex === -1) return null;
    
    return userIndex >= gameIndex;
}

function getCompatibilityClass(compatibility) {
    if (compatibility === true) return 'good';
    if (compatibility === false) return 'bad';
    return 'unknown';
}

function getCompatibilityIcon(compatibility) {
    if (compatibility === true) return '✅';
    if (compatibility === false) return '❌';
    return '❓';
}

// Отображение списка игр
function displayGames(games, page = 1) {
    const gamesGrid = document.getElementById('gamesGrid');
    const gamesCount = document.getElementById('gamesCount');
    const gamesContainer = document.getElementById('gamesContainer');
    const noGamesMessage = document.getElementById('noGamesMessage');
    const loadingIndicator = document.getElementById('loadingIndicator');
    
    // Скрываем индикатор загрузки
    if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
    }
    
    // Обновляем счетчик
    if (gamesCount) {
        gamesCount.textContent = games.length;
    }
    
    // Очищаем сетку
    if (gamesGrid) {
        gamesGrid.innerHTML = '';
    }
    
    // Если игр нет, показываем сообщение
    if (games.length === 0) {
        if (gamesContainer) gamesContainer.style.display = 'none';
        if (noGamesMessage) noGamesMessage.style.display = 'block';
        return [];
    }
    
    // Если игры есть, скрываем сообщение и показываем контейнер
    if (noGamesMessage) noGamesMessage.style.display = 'none';
    if (gamesContainer) gamesContainer.style.display = 'block';
    
    // Пагинация
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const gamesToShow = games.slice(startIndex, endIndex);
    const totalPages = Math.ceil(games.length / ITEMS_PER_PAGE);
    
    // Добавляем карточки игр
    gamesToShow.forEach(game => {
        const card = createGameCard(game);
        if (gamesGrid) {
            gamesGrid.appendChild(card);
        }
    });
    
    // Обновляем пагинацию
    updatePagination(totalPages, page);
    
    return gamesToShow;
}

// Обновление пагинации
function updatePagination(totalPages, currentPage) {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    
    pagination.innerHTML = '';
    
    if (totalPages <= 1) return;
    
    // Кнопка "Назад"
    const prevBtn = document.createElement('button');
    prevBtn.className = `pagination-btn ${currentPage === 1 ? 'disabled' : ''}`;
    prevBtn.innerHTML = '‹';
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            window.currentPage = currentPage - 1;
            if (typeof window.filterAndDisplayGames === 'function') {
                window.filterAndDisplayGames();
            }
        }
    });
    pagination.appendChild(prevBtn);
    
    // Номера страниц
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => {
            window.currentPage = i;
            if (typeof window.filterAndDisplayGames === 'function') {
                window.filterAndDisplayGames();
            }
        });
        pagination.appendChild(pageBtn);
    }
    
    // Кнопка "Вперед"
    const nextBtn = document.createElement('button');
    nextBtn.className = `pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`;
    nextBtn.innerHTML = '›';
    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            window.currentPage = currentPage + 1;
            if (typeof window.filterAndDisplayGames === 'function') {
                window.filterAndDisplayGames();
            }
        }
    });
    pagination.appendChild(nextBtn);
}

// Инициализация страницы игр
async function initializeGamesPage() {
    await loadGamesData();
    
    // Если мы на странице games.html, инициализируем фильтры
    if (window.location.pathname.includes('games.html') || document.getElementById('gamesGrid')) {
        // Передаем данные в main.js для инициализации фильтров
        if (typeof window.initializeFilters === 'function') {
            window.initializeFilters(gamesData);
        }
        
        // Устанавливаем начальную страницу
        window.currentPage = 1;
        
        // Отображаем все игры
        if (typeof window.filterAndDisplayGames === 'function') {
            window.filterAndDisplayGames();
        }
    }
}

// Запускаем инициализацию при загрузке страницы
document.addEventListener('DOMContentLoaded', initializeGamesPage);
