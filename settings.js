document.addEventListener('DOMContentLoaded', function() {
  const gpuSelect = document.getElementById('gpuSelect');
  const saveBtn = document.getElementById('saveSettings');
  const currentSettings = document.getElementById('currentSettings');
  
  const gpuOptions = [
    "GT 1030", "GTX 1050", "GTX 1060", "RTX 2060", 
    "RTX 3060", "RTX 4070", "RTX 5070"
  ];
  
  // Заполняем выбор видеокарты
  gpuOptions.forEach(gpu => {
    const option = document.createElement('option');
    option.value = gpu;
    option.textContent = gpu;
    gpuSelect.appendChild(option);
  });
  
  // Загружаем сохраненную видеокарту
  const savedGPU = localStorage.getItem('selectedGPU');
  if (savedGPU) {
    gpuSelect.value = savedGPU;
    currentSettings.textContent = `Текущая видеокарта: ${savedGPU}`;
  }
  
  // Сохраняем настройки
  saveBtn.addEventListener('click', function() {
    const selectedGPU = gpuSelect.value;
    if (selectedGPU) {
      localStorage.setItem('selectedGPU', selectedGPU);
      currentSettings.textContent = `Текущая видеокарта: ${selectedGPU}`;
      alert('✅ Настройки сохранены!');
    } else {
      alert('❌ Выберите видеокарту!');
    }
  });
});
