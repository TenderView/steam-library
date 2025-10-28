let gamesData = [];
let currentPage = 1;
const ITEMS_PER_PAGE = 6;

// Загрузка данных
async function loadGamesData() {
    try {
        const response = await fetch('games.json');
        if(!response.ok) throw new Error('Ошибка загрузки данных');
        gamesData = await response.json();
        return gamesData;
    } catch(e) {
        console.error('Ошибка загрузки:', e);
        gamesData = getFallbackGames();
        return gamesData;
    }
}

function getFallbackGames() {
    return [
        {
            id: 0,
            name: "Demo Game",
            genre: "Экшен",
            price: "free",
            release_date: "2023-01-01",
            rating: "8/10",
            cover: "https://via.placeholder.com/300x400?text=Demo",
            gpu: "GTX 1060",
            cpu: "Intel i5",
            ram: "8 GB",
            screenshots: [
                "https://via.placeholder.com/600x340?text=SS1",
                "https://via.placeholder.com/600x340?text=SS2"
            ],
            description: "Демо-игра"
        }
    ];
}

// Создание карточки игры
function createGameCard(game) {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.innerHTML = `
        <div class="game-card-badge">${game.badge ? (game.badge==='new'?'🆕 Новинка':'🔥 Популярная') : ''}</div>
        <img src="${game.cover}" alt="${game.name}" onerror="this.src='https://via.placeholder.com/300x400?text=No+Image'">
        <h3>${game.name}</h3>
        <p>${game.genre}</p>
        <p>${game.price==='free'?'Бесплатная':'Платная'}</p>
        <p>${new Date(game.release_date).toLocaleDateString('ru-RU')}</p>
        <p>${game.rating}</p>
    `;
    card.addEventListener('click', () => {
        localStorage.setItem('selectedGame', JSON.stringify(game));
        window.location.href = 'game-detail.html';
    });
    return card;
}

// Отображение игр с пагинацией
function displayGames(games, page = 1) {
    const container = document.getElementById('gamesGrid');
    const gamesCount = document.getElementById('gamesCount');
    const noGames = document.getElementById('noGamesMessage');
    const loading = document.getElementById('loadingIndicator');
    
    if(loading) loading.style.display = 'none';
    if(gamesCount) gamesCount.textContent = games.length;
    if(container) container.innerHTML = '';
    
    if(games.length === 0) {
        if(container) container.parentElement.style.display='none';
        if(noGames) noGames.style.display='block';
        return;
    } else {
        if(container) container.parentElement.style.display='block';
        if(noGames) noGames.style.display='none';
    }

    const start = (page-1)*ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const visibleGames = games.slice(start, end);
    
    visibleGames.forEach(g => container.appendChild(createGameCard(g)));
    updatePagination(Math.ceil(games.length/ITEMS_PER_PAGE), page);
}

// Пагинация
function updatePagination(totalPages, page) {
    const pagination = document.getElementById('pagination');
    if(!pagination) return;
    pagination.innerHTML = '';
    
    if(totalPages <= 1) return;
    
    const createBtn = (text, disabled=false, clickHandler=null, active=false) => {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.disabled = disabled;
        if(active) btn.classList.add('active');
        if(clickHandler) btn.addEventListener('click', clickHandler);
        return btn;
    };

    pagination.appendChild(createBtn('‹', page===1, ()=>{currentPage--; filterAndDisplayGames();}));
    
    for(let i=1;i<=totalPages;i++){
        pagination.appendChild(createBtn(i, false, ()=>{currentPage=i; filterAndDisplayGames();}, i===page));
    }

    pagination.appendChild(createBtn('›', page===totalPages, ()=>{currentPage++; filterAndDisplayGames();}));
}

// Совместимость GPU
function checkCompatibility(userGPU, gameGPU) {
    if(!userGPU||!gameGPU) return null;
    const rank=["GT 1030","GTX 1050","GTX 1060","GTX 1070","GTX 1080","RTX 2060","RTX 2070","RTX 2080","RTX 3060","RTX 3070","RTX 3080","RTX 4070","RTX 4080","RTX 5070"];
    const u=rank.findIndex(g=>userGPU.includes(g));
    const g=rank.findIndex(g=>gameGPU.includes(g));
    if(u===-1||g===-1) return null;
    return u>=g;
}

async function initializeGamesPage() {
    await loadGamesData();
    window.currentPage = 1;
    if(typeof window.initializeFilters==='function') initializeFilters(gamesData);
    if(typeof window.filterAndDisplayGames==='function') filterAndDisplayGames();
}

document.addEventListener('DOMContentLoaded', initializeGamesPage);
