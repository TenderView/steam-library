// game-detail.js - Исправленная версия

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

    const userGPU = localStorage.getItem('selectedGPU');
    const compatibility = userGPU ? checkCompatibility(userGPU, game.gpu) : null;
    const compatibilityClass = getCompatibilityClass(compatibility);
    const compatibilityMessage = getCompatibilityMessage(compatibility, userGPU, game.gpu);

    container.innerHTML = `
        <div class="game-detail-layout">
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

            <div class="compatibility-section">
                <div class="compatibility-header">
                    <div class="compatibility-icon ${compatibilityClass}"></div>
                    <h3 class="compatibility-title">Совместимость</h3>
                </div>
                <p class="compatibility-message">${compatibilityMessage}</p>
            </div>
        </div>
    `;

    loadScreenshots(game.screenshots);
}

// Загрузка скриншотов
function loadScreenshots(screenshots) {
    const track = document.getElementById('screenshotsTrack');
    const dots = document.getElementById('carouselDots');

    screenshotsData = screenshots && screenshots.length > 0 ? screenshots : [
        'https://via.placeholder.com/600x340/2a2a2a/00ffcc?text=Скриншот+1',
        'https://via.placeholder.com/600x340/2a2a2a/00ffcc?text=Скриншот+2',
        'https://via.placeholder.com/600x340/2a2a2a/00ffcc?text=Скриншот+3'
    ];

    track.innerHTML = '';
    if (dots) dots.innerHTML = '';

    screenshotsData.forEach((src, index) => {
        const slide = document.createElement('div');
        slide.className = 'screenshot-slide';
        slide.style.flex = '0 0 100%';
        slide.innerHTML = `<img src="${src}" alt="Скриншот ${index+1}"
                        onerror="this.src='https://via.placeholder.com/600x340/2a2a2a/00ffcc?text=Ошибка'">`;
        track.appendChild(slide);

        if (dots) {
            const dot = document.createElement('button');
            dot.className = `carousel-dot ${index===0?'active':''}`;
            dot.addEventListener('click', ()=> goToScreenshot(index));
            dots.appendChild(dot);
        }
    });

    currentScreenshotIndex = 0;
    updateCarousel();
    setupCarouselNavigation();
}

// Навигация карусели
function setupCarouselNavigation() {
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');

    if (prevBtn) prevBtn.addEventListener('click', ()=> {
        currentScreenshotIndex = (currentScreenshotIndex - 1 + screenshotsData.length) % screenshotsData.length;
        updateCarousel();
    });
    if (nextBtn) nextBtn.addEventListener('click', ()=> {
        currentScreenshotIndex = (currentScreenshotIndex + 1) % screenshotsData.length;
        updateCarousel();
    });

    document.addEventListener('keydown', e => {
        if(e.key==='ArrowLeft'){currentScreenshotIndex=(currentScreenshotIndex-1+screenshotsData.length)%screenshotsData.length; updateCarousel();}
        if(e.key==='ArrowRight'){currentScreenshotIndex=(currentScreenshotIndex+1)%screenshotsData.length; updateCarousel();}
    });
}

// Обновление карусели
function updateCarousel() {
    const track = document.getElementById('screenshotsTrack');
    const dots = document.querySelectorAll('.carousel-dot');
    if(track) track.style.transform = `translateX(-${currentScreenshotIndex*100}%)`;
    dots.forEach((dot,index)=>dot.classList.toggle('active', index===currentScreenshotIndex));
}

// Переход к скриншоту
function goToScreenshot(index){currentScreenshotIndex=index; updateCarousel();}

// Совместимость
function checkCompatibility(userGPU, gameGPU){
    if(!userGPU || !gameGPU) return null;
    const gpuRank=["GT 1030","GTX 1050","GTX 1060","GTX 1070","GTX 1080","RTX 2060","RTX 2070","RTX 2080","RTX 3060","RTX 3070","RTX 3080","RTX 4070","RTX 4080","RTX 5070"];
    const userIndex=gpuRank.findIndex(gpu=>userGPU.includes(gpu));
    const gameIndex=gpuRank.findIndex(gpu=>gameGPU.includes(gpu));
    if(userIndex===-1||gameIndex===-1) return null;
    return userIndex>=gameIndex;
}
function getCompatibilityClass(compatibility){return compatibility===true?'good':compatibility===false?'bad':'unknown';}
function getCompatibilityMessage(compatibility,userGPU,gameGPU){if(compatibility===true) return `✅ Ваш ПК потянет эту игру! Ваша видеокарта (${userGPU}) соответствует или превосходит минимальные требования (${gameGPU}).`; else if(compatibility===false) return `❌ Могут быть лаги. Ваша видеокарта
