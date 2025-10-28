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
