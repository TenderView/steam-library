// game-detail.js - Логика страницы деталей игры

let currentScreenshotIndex = 0;
let screenshotsData = [];

// Инициализация страницы деталей
function initializeGameDetailPage() {
    const selectedGame = JSON.parse(localStorage.getItem('selectedGame'));
    
    if (!selectedGame) {
        window.location.href = 'games.html';
        return;
    }
    
    displayGameDetails(selectedGame);
    setupComments(selectedGame.name);
}

// Отображение деталей игры
function displayGameDetails(game) {
    const container = document.getElementById('gameDetailContainer');
    if (!container) return;
    
    // Проверка совместимости
    const userGPU = localStorage.getItem('selectedGPU');
    const compatibility = userGPU ? checkCompatibility(userGPU, game.gpu) : null;
    const compatibilityClass = getCompatibilityClass(compatibility);
    const compatibilityMessage = getCompatibilityMessage(compatibility, userGPU, game.gpu);
    
    container.innerHTML = `
        <div class="game-detail-layout">
            <!-- Левая панель - обложка и информация -->
            <div class="game-detail-sidebar">
                <img src="${game.cover}" alt="${game.name}" class="game-cover"
                     onerror="this.src='https://via.placeholder.com/300x400/2a2a2a/00ffcc?text=No+Image'">
                
                <div class="game-info">
                    <div class="game-info-item">
                        <span class="game-info-label">Жанр:</span>
                        <span class="game-info-value">${game.genre}</span>
                    </div>
                    <div class="game-info-item">
                        <span class="game-info-label">Цена:</span>
                        <span class="game-info-value ${game.price === 'free' ? 'free' : 'paid'}">
                            ${game.price === 'free' ? '🆓 Бесплатная' : '💲 Платная'}
                        </span>
                    </div>
                    <div class="game-info-item">
                        <span class="game-info-label">Дата выхода:</span>
                        <span class="game-info-value">${new Date(game.release_date).toLocaleDateString('ru-RU')}</span>
                    </div>
                    <div class="game-info-item">
                        <span class="game-info-label">Рейтинг:</span>
                        <span class="game-info-value">${game.rating}</span>
                    </div>
                </div>
            </div>
            
            <!-- Центральная панель - описание и скриншоты -->
            <div class="game-detail-main">
                <h1 class="game-detail-title">${game.name}</h1>
                <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 2rem;">
                    ${game.description}
                </p>
                
                <div class="screenshots-section">
                    <h3 class="screenshots-title">📸 Скриншоты</h3>
                    <div class="screenshots-carousel">
                        <div class="screenshots-track" id="screenshotsTrack"></div>
                        <button class="carousel-nav carousel-prev">❮</button>
                        <button class="carousel-nav carousel-next">❯</button>
                        <div class="carousel-dots" id="carouselDots"></div>
                    </div>
                </div>
                
                <!-- Системные требования -->
                <div class="game-detail-section">
                    <h3>🖥️ Системные требования</h3>
                    <div class="compatibility-details">
                        <div class="compatibility-detail">
                            <span class="detail-label">Минимальная видеокарта:</span>
                            <span class="detail-value">${game.gpu}</span>
                        </div>
                        <div class="compatibility-detail">
                            <span class="detail-label">Процессор:</span>
                            <span class="detail-value">${game.cpu}</span>
                        </div>
                        <div class="compatibility-detail">
                            <span class="detail-label">Оперативная память:</span>
                            <span class="detail-value">${game.ram}</span>
                        </div>
                    </div>
                </div>
                
                <!-- Комментарии -->
                <div class="comments-section">
                    <h3 class="comments-title">💬 Комментарии</h3>
                    <ul class="comments-list" id="commentsList"></ul>
                    <div class="comment-form">
                        <textarea class="comment-input" id="commentInput" 
                                  placeholder="Оставьте ваш комментарий..."></textarea>
                        <button id="addCommentBtn" class="btn btn-primary">Добавить комментарий</button>
                    </div>
                </div>
            </div>
            
            <!-- Правая панель - совместимость -->
            <div class="compatibility-section">
                <div class="compatibility-header">
                    <div class="compatibility-icon ${compatibilityClass}"></div>
                    <h3 class="compatibility-title">Совместимость</h3>
                </div>
                <p class="compatibility-message">${compatibilityMessage}</p>
                
                <div class="compatibility-details">
                    <div class="compatibility-detail">
                        <span class="detail-label">Ваша видеокарта:</span>
                        <span class="detail-value">${userGPU || 'Не выбрана'}</span>
                    </div>
                    <div class="compatibility-detail">
                        <span class="detail-label">Требуется:</span>
                        <span class="detail-value">${game.gpu}</span>
                    </div>
                    <div class="compatibility-detail">
                        <span class="detail-label">Статус:</span>
                        <div class="detail-status ${compatibilityClass}">
                            ${compatibility === true ? '✅ Совместимо' : 
                              compatibility === false ? '❌ Не совместимо' : '❓ Неизвестно'}
                        </div>
                    </div>
                </div>
                
                ${!userGPU ? `
                    <div style="margin-top: 1.5rem; padding: 1rem; background: var(--bg-primary); border-radius: 8px;">
                        <p style="margin-bottom: 1rem; color: var(--text-secondary);">
                            Для проверки совместимости укажите вашу видеокарту в настройках
                        </p>
                        <a href="settings.html" class="btn btn-primary" style="width: 100%; text-align: center;">
                            ⚙️ Перейти к настройкам
                        </a>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    
    // Загружаем скриншоты
    loadScreenshots(game.screenshots);
}

// Загрузка скриншотов
function loadScreenshots(screenshots) {
    const track = document.getElementById('screenshotsTrack');
    const dots = document.getElementById('carouselDots');
    
    if (!track) return;
    
    screenshotsData = screenshots || [
        'https://via.placeholder.com/600x340/2a2a2a/00ffcc?text=Скриншот+1',
        'https://via.placeholder.com/600x340/2a2a2a/00ffcc?text=Скриншот+2',
        'https://via.placeholder.com/600x340/2a2a2a/00ffcc?text=Скриншот+3'
    ];
    
    // Очищаем трек и точки
    track.innerHTML = '';
    if (dots) dots.innerHTML = '';
    
    // Создаем слайды
    screenshotsData.forEach((src, index) => {
        const slide = document.createElement('div');
        slide.className = 'screenshot-slide';
        slide.innerHTML = `
            <img src="${src}" alt="Скриншот ${index + 1}" 
                 onerror="this.src='https://via.placeholder.com/600x340/2a2a2a/00ffcc?text=Ошибка+загрузки'">
        `;
        track.appendChild(slide);
        
        // Создаем точки навигации
        if (dots) {
            const dot = document.createElement('button');
            dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => goToScreenshot(index));
            dots.appendChild(dot);
        }
    });
    
    // Настраиваем навигацию
    setupCarouselNavigation();
}

// Настройка навигации карусели
function setupCarouselNavigation() {
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentScreenshotIndex = (currentScreenshotIndex - 1 + screenshotsData.length) % screenshotsData.length;
            updateCarousel();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentScreenshotIndex = (currentScreenshotIndex + 1) % screenshotsData.length;
            updateCarousel();
        });
    }
    
    // Клавиатурная навигация
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            currentScreenshotIndex = (currentScreenshotIndex - 1 + screenshotsData.length) % screenshotsData.length;
            updateCarousel();
        } else if (e.key === 'ArrowRight') {
            currentScreenshotIndex = (currentScreenshotIndex + 1) % screenshotsData.length;
            updateCarousel();
        }
    });
}

// Обновление карусели
function updateCarousel() {
    const track = document.getElementById('screenshotsTrack');
    const dots = document.querySelectorAll('.carousel-dot');
    
    if (track) {
        track.style.transform = `translateX(-${currentScreenshotIndex * 100}%)`;
    }
    
    // Обновляем активную точку
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentScreenshotIndex);
    });
}

// Переход к конкретному скриншоту
function goToScreenshot(index) {
    currentScreenshotIndex = index;
    updateCarousel();
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

function getCompatibilityMessage(compatibility, userGPU, gameGPU) {
    if (compatibility === true) {
        return `✅ Ваш ПК потянет эту игру! Ваша видеокарта (${userGPU}) соответствует или превосходит минимальные требования (${gameGPU}).`;
    } else if (compatibility === false) {
        return `❌ Могут быть лаги. Ваша видеокарта (${userGPU}) слабее минимальных требований (${gameGPU}).`;
    } else if (!userGPU) {
        return 'ℹ️ Для проверки совместимости укажите вашу видеокарту в настройках.';
    } else {
        return '❓ Не удалось определить совместимость. Проверьте настройки вашего оборудования.';
    }
}

// Система комментариев
function setupComments(gameName) {
    const commentInput = document.getElementById('commentInput');
    const addCommentBtn = document.getElementById('addCommentBtn');
    const commentsList = document.getElementById('commentsList');
    
    if (!commentInput || !addCommentBtn || !commentsList) return;
    
    let comments = JSON.parse(localStorage.getItem(`comments_${gameName}`)) || [];
    
    // Функция отображения комментариев
    function renderComments() {
        commentsList.innerHTML = '';
        
        if (comments.length === 0) {
            commentsList.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                    <p>Пока нет комментариев. Будьте первым!</p>
                </div>
            `;
            return;
        }
        
        comments.forEach((comment, index) => {
            const commentItem = document.createElement('li');
            commentItem.className = 'comment-item';
            commentItem.innerHTML = `
                <div class="comment-header">
                    <div class="comment-avatar">👤</div>
                    <div>
                        <div class="comment-author">Пользователь</div>
                        <div class="comment-date">${new Date().toLocaleDateString('ru-RU')}</div>
                    </div>
                </div>
                <div class="comment-text">${comment}</div>
            `;
            commentsList.appendChild(commentItem);
        });
    }
    
    // Функция добавления комментария
    function add
