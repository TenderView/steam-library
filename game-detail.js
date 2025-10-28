// Получаем название игры из URL
const params = new URLSearchParams(window.location.search);
const gameName = params.get('name');

const game = gamesData.find(g => g.name === gameName);
if(game){
  document.getElementById('gameTitle').textContent = game.name;
  document.getElementById('gameCover').src = game.cover;
  document.getElementById('cpuInfo').textContent = "CPU: " + game.cpu;
  document.getElementById('ramInfo').textContent = "RAM: " + game.ram;

  // Проверка совместимости GPU
  const userGpu = "GTX 1060";
  const gpuCheck = document.getElementById('gpuCheck');
  if(game.gpu === userGpu){
    gpuCheck.textContent = "Совместимо с вашей картой";
    gpuCheck.style.color = "#00ffcc";
  } else {
    gpuCheck.textContent = "Не совместимо с вашей картой";
    gpuCheck.style.color = "red";
  }
}
