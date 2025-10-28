// game-detail.js - исправленная версия
function compareGPUs(userGPU, gameGPU) {
  if (!userGPU || !gameGPU) return null;
  
  const gpuRank = [
    "GT 1030", "GTX 1050", "GTX 1060", "GTX 1070", "GTX 1080",
    "RTX 2060", "RTX 2070", "RTX 2080", 
    "RTX 3060", "RTX 3070", "RTX 3080",
    "RTX 4070", "RTX 4080", "RTX 5070"
  ];

  // Находим индексы в рейтинге
  const userIndex = gpuRank.findIndex(gpu => userGPU.includes(gpu));
  const gameIndex = gpuRank.findIndex(gpu => gameGPU.includes(gpu));

  console.log(`Сравнение: ${userGPU} (${userIndex}) vs ${gameGPU} (${gameIndex})`);
  
  if (userIndex === -1 || gameIndex === -1) {
    console.log('Одна из видеокарт не найдена в рейтинге');
    return null;
  }
  
  // Пользовательская карта должна быть >= минимальной требований игры
  return userIndex >= gameIndex;
}

function checkCompatibility(gameGPU) {
  const compatibilityEl = document.getElementById('compatibility');
  const selectedGPU = localStorage.getItem("selectedGPU");

  if (!selectedGPU) {
    compatibilityEl.innerHTML = "ℹ️ <strong>Совместимость:</strong> Выберите видеокарту в <a href='settings.html' style='color: #00ffcc;'>настройках</a>";
    compatibilityEl.className = "compatibility";
    return;
  }

  const isCompatible = compareGPUs(selectedGPU, gameGPU);
  
  if (isCompatible === true) {
    compatibilityEl.innerHTML = `✅ <strong>Совместимость:</strong> Игра потянет! (Ваша: ${selectedGPU})`;
    compatibilityEl.className = "compatibility green";
  } else if (isCompatible === false) {
    compatibilityEl.innerHTML = `❌ <strong>Совместимость:</strong> Могут быть лаги (Ваша: ${selectedGPU})`;
    compatibilityEl.className = "compatibility red";
  } else {
    compatibilityEl.innerHTML = `❓ <strong>Совместимость:</strong> Неизвестно (Ваша: ${selectedGPU})`;
    compatibilityEl.className = "compatibility";
  }
}
// Карусель скриншотов
let currentScreenshotIndex = 0;
let screenshotsData = [];

function loadScreenshots(screenshots) {
  const track = document.getElementById('screenshotsTrack');
  const dots = document.getElementById('screenshotsDots');
  
  if (!track) return;
  
  track.innerHTML = '';
  dots.innerHTML = '';
  screenshotsData = screenshots || [
    'https://via.placeholder.com/600x340/1e1e1e/00ffcc?text=Скриншот+1',
    'https://via.placeholder.com/600x340/1e1e1e/00ffcc?text=Скриншот+2',
    'https://via.placeholder.com/600x340/1e1e1e/00ffcc?text=Скриншот+3'
  ];

  // Создаем слайды
  screenshotsData.forEach((src, index) => {
    const slide = document.createElement('div');
    slide.className = 'screenshot-slide';
    slide.innerHTML = `<img src="${src}" alt="Скриншот ${index + 1}" loading="lazy">`;
    track.appendChild(slide);

    // Создаем точки навигации
    const dot = document.createElement('button');
    dot.className = 'screenshot-dot';
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToScreenshot(index));
    dots.appendChild(dot);
  });

  // Обновляем трек
  updateScreenshotsTrack();
  
  // Настраиваем навигацию
  setupScreenshotsNavigation();
}

function setupScreenshotsNavigation() {
  const prevBtn = document.querySelector('.screenshot-prev');
  const nextBtn = document.querySelector('.screenshot-next');
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentScreenshotIndex = (currentScreenshotIndex - 1 + screenshotsData.length) % screenshotsData.length;
      updateScreenshotsTrack();
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentScreenshotIndex = (currentScreenshotIndex + 1) % screenshotsData.length;
      updateScreenshotsTrack();
    });
  }
  
  // Добавляем клавиатурную навигацию
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      currentScreenshotIndex = (currentScreenshotIndex - 1 + screenshotsData.length) % screenshotsData.length;
      updateScreenshotsTrack();
    } else if (e.key === 'ArrowRight') {
      currentScreenshotIndex = (currentScreenshotIndex + 1) % screenshotsData.length;
      updateScreenshotsTrack();
    }
  });
}

function updateScreenshotsTrack() {
  const track = document.getElementById('screenshotsTrack');
  const dots = document.querySelectorAll('.screenshot-dot');
  
  if (track) {
    track.style.transform = `translateX(-${currentScreenshotIndex * 100}%)`;
  }
  
  // Обновляем активную точку
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentScreenshotIndex);
  });
}

function goToScreenshot(index) {
  currentScreenshotIndex = index;
  updateScreenshotsTrack();
}
// Система пользовательского рейтинга
function setupUserRating(gameName) {
  const ratingContainer = document.getElementById('userRating');
  if (!ratingContainer) return;
  
  const userRatings = JSON.parse(localStorage.getItem(`ratings_${gameName}`)) || { total: 0, sum: 0 };
  const userVote = localStorage.getItem(`userVote_${gameName}`);
  
  updateRatingDisplay(userRatings, userVote);
  
  // Создаем звезды для голосования
  const starsContainer = document.createElement('div');
  starsContainer.className = 'user-rating-stars';
  
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement('span');
    star.className = 'rating-star';
    star.innerHTML = '☆';
    star.dataset.rating = i;
    
    if (userVote && i <= userVote) {
      star.innerHTML = '★';
      star.classList.add('active');
    }
    
    star.addEventListener('click', () => voteForGame(gameName, i, userRatings));
    star.addEventListener('mouseover', () => highlightStars(i));
    starsContainer.appendChild(star);
  }
  
  ratingContainer.appendChild(starsContainer);
  
  // Сбрасываем подсветку при уходе мыши
  starsContainer.addEventListener('mouseleave', () => {
    highlightStars(userVote || 0);
  });
}

function highlightStars(rating) {
  const stars = document.querySelectorAll('.rating-star');
  stars.forEach((star, index) => {
    if (index < rating) {
      star.innerHTML = '★';
      star.classList.add('highlight');
    } else {
      star.innerHTML = '☆';
      star.classList.remove('highlight');
    }
  });
}

function voteForGame(gameName, rating, userRatings) {
  const previousVote = localStorage.getItem(`userVote_${gameName}`);
  
  if (previousVote) {
    userRatings.sum -= parseInt(previousVote);
    userRatings.total -= 1;
  }
  
  userRatings.sum += rating;
  userRatings.total += 1;
  
  localStorage.setItem(`ratings_${gameName}`, JSON.stringify(userRatings));
  localStorage.setItem(`userVote_${gameName}`, rating.toString());
  
  updateRatingDisplay(userRatings, rating);
  highlightStars(rating);
}

function updateRatingDisplay(ratings, userVote) {
  const ratingValue = document.getElementById('userRatingValue');
  const ratingCount = document.getElementById('userRatingCount');
  
  if (ratingValue) {
    const average = ratings.total > 0 ? (ratings.sum / ratings.total).toFixed(1) : '0.0';
    ratingValue.textContent = `${average}/5`;
  }
  
  if (ratingCount) {
    ratingCount.textContent = `(${ratings.total} голосов)`;
  }
  
  // Обновляем звезды
  const stars = document.querySelectorAll('.rating-star');
  stars.forEach((star, index) => {
    star.classList.toggle('active', userVote && index < userVote);
  });
}
