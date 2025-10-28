// Получаем данные выбранной игры из localStorage
const selectedGame = JSON.parse(localStorage.getItem("selectedGame"));

// Если игры нет — возвращаем на games.html
if (!selectedGame) {
  window.location.href = "games.html";
}

// Элементы на странице
const gameCover = document.getElementById("gameCover");
const gameName = document.getElementById("gameName");
const gameGenre = document.getElementById("gameGenre");
const gamePrice = document.getElementById("gamePrice");
const gameRelease = document.getElementById("gameRelease");
const gameRating = document.getElementById("gameRating");
const gameCPU = document.getElementById("gameCPU");
const gameGPU = document.getElementById("gameGPU");
const gameRAM = document.getElementById("gameRAM");
const compatibilityEl = document.getElementById("compatibility");
const screenshotsContainer = document.getElementById("screenshots");

const commentInput = document.getElementById("commentInput");
const addCommentBtn = document.getElementById("addCommentBtn");
const commentsList = document.getElementById("commentsList");

// Подставляем данные игры
gameCover.src = selectedGame.cover || "https://via.placeholder.com/250";
gameCover.alt = selectedGame.name;
gameName.textContent = selectedGame.name;
gameGenre.textContent = `Жанр: ${selectedGame.genre}`;
gamePrice.textContent = `Цена: ${selectedGame.price === "paid" ? "Платная" : "Бесплатная"}`;
gameRelease.textContent = `Дата выхода: ${selectedGame.release_date}`;
gameRating.textContent = `Оценка: ${selectedGame.rating}`;

gameCPU.textContent = `Процессор: ${selectedGame.cpu || "Неизвестно"}`;
gameGPU.textContent = `Видеокарта: ${selectedGame.gpu || "Неизвестно"}`;
gameRAM.textContent = `Оперативная память: ${selectedGame.ram || "Неизвестно"}`;

// Проверка совместимости выбранной карты
// Предполагаем, что выбранная карта хранится в localStorage под key 'selectedGPU'
const selectedGPU = localStorage.getItem("selectedGPU"); // пример: "GTX 1060"

function checkCompatibility(userGPU, gameGPU) {
  if (!userGPU) return null; // если карта не выбрана
  // Сравнение моделей (простая проверка: если пользовательская карта >= минимальной)
  // В реальности можно сделать массив ранга карт
  const gpuRank = [
    "GTX 750","GTX 960","GTX 970","GTX 1050","GTX 1060","GTX 1070","GTX 1080",
    "RTX 2060","RTX 2070","RTX 2080","RTX 3060","RTX 3070","RTX 3080",
    "RTX 4060","RTX 4070","RTX 4080","RTX 5070"
  ];

  const userIndex = gpuRank.indexOf(userGPU);
  const gameIndex = gpuRank.indexOf(gameGPU);

  if (userIndex === -1 || gameIndex === -1) return null;
  return userIndex >= gameIndex;
}

const isCompatible = checkCompatibility(selectedGPU, selectedGame.gpu);
if (isCompatible === true) {
  compatibilityEl.textContent = `Совместимость: подходит ✅`;
  compatibilityEl.classList.add("green");
} else if (isCompatible === false) {
  compatibilityEl.textContent = `Совместимость: не подходит ❌`;
  compatibilityEl.classList.add("red");
} else {
  compatibilityEl.textContent = `Совместимость: неизвестно`;
}

// Скриншоты (пример)
const screenshots = selectedGame.screenshots || [
  "https://via.placeholder.com/300x170?text=Gameplay+1",
  "https://via.placeholder.com/300x170?text=Gameplay+2",
  "https://via.placeholder.com/300x170?text=Gameplay+3"
];

screenshots.forEach(src => {
  const img = document.createElement("img");
  img.src = src;
  screenshotsContainer.appendChild(img);
});

// Комментарии
let comments = JSON.parse(localStorage.getItem(`comments_${selectedGame.name}`)) || [];

function renderComments() {
  commentsList.innerHTML = "";
  comments.forEach(c => {
    const li = document.createElement("li");
    li.textContent = c;
    commentsList.appendChild(li);
  });
}

addCommentBtn.addEventListener("click", () => {
  const text = commentInput.value.trim();
  if (text) {
    comments.push(text);
    localStorage.setItem(`comments_${selectedGame.name}`, JSON.stringify(comments));
    renderComments();
    commentInput.value = "";
  }
});

// Инициализация
renderComments();
