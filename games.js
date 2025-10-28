// games.js - исправленная версия
let gamesData = [];

// Функция для безопасной загрузки изображений
function getSafeImageUrl(originalUrl) {
  // Если изображение уже загружено, используем его
  if (originalUrl && originalUrl.includes('steamstatic.com')) {
    return originalUrl;
  }
  // Иначе используем placeholder
  return 'https://via.placeholder.com/300x400/1e1e1e/00ffcc?text=Загрузка...';
}

// Загружаем данные из games.json
fetch('games.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    gamesData = data.map(game => ({
      ...game,
      cover: getSafeImageUrl(game.cover),
      screenshots: game.screenshots || [
        'https://via.placeholder.com/300x170/1e1e1e/00ffcc?text=Скриншот+1',
        'https://via.placeholder.com/300x170/1e1e1e/00ffcc?text=Скриншот+2'
      ]
    }));
    
    if (typeof initializePage === 'function') {
      initializePage();
    }
  })
  .catch(error => {
    console.error('Error loading games data:', error);
    gamesData = getFallbackGames();
    if (typeof initializePage === 'function') {
      initializePage();
    }
  });

function getFallbackGames() {
  return [
    {
      name: "Cyberpunk 2077",
      genre: "Ролевые экшены",
      price: "paid",
      release_date: "2020-12-10",
      rating: "9/10",
      cover: "https://via.placeholder.com/300x400/1e1e1e/00ffcc?text=Cyberpunk+2077",
      gpu: "RTX 2060",
      cpu: "Intel Core i7-4790",
      ram: "12 GB",
      screenshots: [
        "https://via.placeholder.com/300x170/1e1e1e/00ffcc?text=Геймплей+1",
        "https://via.placeholder.com/300x170/1e1e1e/00ffcc?text=Геймплей+2"
      ]
    },
    {
      name: "Elden Ring", 
      genre: "РПГ",
      price: "paid",
      release_date: "2022-02-25",
      rating: "10/10",
      cover: "https://via.placeholder.com/300x400/1e1e1e/00ffcc?text=Elden+Ring",
      gpu: "GTX 1060",
      cpu: "Intel Core i5-8400",
      ram: "12 GB",
      screenshots: [
        "https://via.placeholder.com/300x170/1e1e1e/00ffcc?text=Геймплей+1",
        "https://via.placeholder.com/300x170/1e1e1e/00ffcc?text=Геймплей+2"
      ]
    }
  ];
}

function createGameCard(game) {
  const li = document.createElement("li");
  li.className = "game-card";
  li.innerHTML = `
    <img src="${game.cover}" alt="${game.name}" 
         onerror="this.src='https://via.placeholder.com/300x400/1e1e1e/00ffcc?text=Ошибка+загрузки'"
         loading="lazy">
    <h3>${game.name}</h3>
    <p><strong>Жанр:</strong> ${game.genre}</p>
    <p><strong>Цена:</strong> ${game.price === "paid" ? "💲 Платная" : "🆓 Бесплатная"}</p>
    <p><strong>Рейтинг:</strong> ${game.rating}</p>
  `;

  li.addEventListener("click", () => {
    localStorage.setItem("selectedGame", JSON.stringify(game));
    window.location.href = "game-detail.html";
  });

  return li;
}
