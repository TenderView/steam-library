```javascript
// game-detail.js - логика страницы деталей игры
document.addEventListener('DOMContentLoaded', function() {
  const selectedGame = JSON.parse(localStorage.getItem("selectedGame"));

  if (!selectedGame) {
    window.location.href = "games.html";
    return;
  }

  initializeGameDetails(selectedGame);
  setupComments(selectedGame.name);
});

// Инициализация деталей игры
function initializeGameDetails(game) {
  // Заполнение основной информации
  document.getElementById('gameCover').src = game.cover || 'https://via.placeholder.com/250x350?text=No+Image';
  document.getElementById('gameCover').alt = game.name;
  document.getElementById('gameName').textContent = game.name;
  document.getElementById('gameGenre').textContent = `Жанр: ${game.genre}`;
  document.getElementById('gamePrice').textContent = `Цена: ${game.price === "paid" ? "Платная" : "Бесплатная"}`;
  document.getElementById('gameRelease').textContent = `Дата выхода: ${formatDate(game.release_date)}`;
  document.getElementById('gameRating').textContent = `Оценка: ${game.rating}`;

  // Заполнение характеристик
  document.getElementById('gameCPU').textContent = `Процессор: ${game.cpu || "Не указано"}`;
  document.getElementById('gameGPU').textContent = `Видеокарта: ${game.gpu || "Не указано"}`;
  document.getElementById('gameRAM').textContent = `Оперативная память: ${game.ram || "Не указано"}`;

  // Проверка совместимости
  checkCompatibility(game.gpu);
  
  // Загрузка скриншотов
  loadScreenshots(game.screenshots);
}

// Форматирование даты
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('ru-RU', options);
}

// Проверка совместимости
function checkCompatibility(gameGPU) {
  const compatibilityEl = document.getElementById('compatibility');
  const selectedGPU = localStorage.getItem("selectedGPU");

  if (!selectedGPU) {
    compatibilityEl.textContent = "Совместимость: выберите видеокарту в настройках";
    return;
  }

  const isCompatible = compareGPUs(selectedGPU, gameGPU);
  
  if (isCompatible === true) {
    compatibilityEl.textContent = `Совместимость: подходит ✅ (Ваша: ${selectedGPU})`;
    compatibilityEl.className = "compatibility green";
  } else if (isCompatible === false) {
    compatibilityEl.textContent = `Совместимость: не подходит ❌ (Ваша: ${selectedGPU})`;
    compatibilityEl.className = "compatibility red";
  } else {
    compatibilityEl.textContent = `Совместимость: неизвестно (Ваша: ${selectedGPU})`;
    compatibilityEl.className = "compatibility";
  }
}

// Сравнение видеокарт
function compareGPUs(userGPU, gameGPU) {
  const gpuRank = [
    "GTX 750", "GTX 1050", "GTX 1060", "RTX 2060", 
    "RTX 3060", "RTX 4070", "RTX 5070"
  ];

  const userIndex = gpuRank.indexOf(userGPU);
  const gameIndex = gpuRank.indexOf(gameGPU);

  if (userIndex === -1 || gameIndex === -1) return null;
  return userIndex >= gameIndex;
}

// Загрузка скриншотов
function loadScreenshots(screenshots) {
  const container = document.getElementById('screenshots');
  const defaultScreenshots = [
    'https://via.placeholder.com/300x170?text=Gameplay+1',
    'https://via.placeholder.com/300x170?text=Gameplay+2'
  ];

  const screenshotsToShow = screenshots || defaultScreenshots;
  
  screenshotsToShow.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'Скриншот игры';
    img.onerror = function() {
      this.src = 'https://via.placeholder.com/300x170?text=Image+Error';
    };
    container.appendChild(img);
  });
}

// Настройка системы комментариев
function setupComments(gameName) {
  const commentInput = document.getElementById('commentInput');
  const addCommentBtn = document.getElementById('addCommentBtn');
  const commentsList = document.getElementById('commentsList');
  
  let comments = JSON.parse(localStorage.getItem(`comments_${gameName}`)) || [];

  function renderComments() {
    commentsList.innerHTML = "";
    comments.forEach(comment => {
      const li = document.createElement('li');
      li.textContent = comment;
      commentsList.appendChild(li);
    });
  }

  addCommentBtn.addEventListener('click', () => {
    const text = commentInput.value.trim();
    if (text) {
      comments.push(text);
      localStorage.setItem(`comments_${gameName}`, JSON.stringify(comments));
      renderComments();
      commentInput.value = "";
    }
  });

  // Добавление комментария по Enter
  commentInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addCommentBtn.click();
    }
  });

  renderComments();
}
```
