let gamesData = [];

// Загружаем данные из games.json
fetch('games.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    gamesData = data;
    // После загрузки данных инициализируем страницу
    if (typeof initializePage === 'function') {
      initializePage();
    }
  })
  .catch(error => {
    console.error('Error loading games data:', error);
    // Fallback - если JSON не загрузился, используем тестовые данные
    gamesData = [
      {
        name: "Test Game",
        genre: "Экшен",
        price: "paid",
        release_date: "2023-01-01",
        rating: "8/10",
        cover: "https://via.placeholder.com/300x400/1e1e1e/00ffcc?text=Test+Game",
        gpu: "GTX 1060",
        cpu: "Intel i5",
        ram: "8GB"
      }
    ];
    if (typeof initializePage === 'function') {
      initializePage();
    }
  });

// Функция для создания карточки игры
function createGameCard(game) {
  const li = document.createElement("li");
  li.className = "game-card";
  
  li.innerHTML = `
    <img src="${game.cover}" alt="${game.name}" 
         onerror="this.src='https://via.placeholder.com/300x400/1e1e1e/00ffcc?text=No+Image'">
    <h3>${game.name}</h3>
    <p><strong>Жанр:</strong> ${game.genre}</p>
    <p><strong>Цена:</strong> ${game.price === "paid" ? "💲 Платная" : "🆓 Бесплатная"}</p>
    <p><strong>Рейтинг:</strong> ${game.rating}</p>
    <p><strong>Дата выхода:</strong> ${new Date(game.release_date).toLocaleDateString('ru-RU')}</p>
  `;

  li.addEventListener("click", () => {
    localStorage.setItem("selectedGame", JSON.stringify(game));
    window.location.href = "game-detail.html";
  });

  return li;
}
