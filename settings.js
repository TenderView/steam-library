// settings.js - Логика страницы настроек

// Инициализация страницы настроек
function initializeSettingsPage() {
    populateGPUOptions();
    populateCPUOptions();
    loadCurrentSettings();
    setupEventListeners();
}

// Заполнение опций видеокарт
function populateGPUOptions() {
    const gpuSelect = document.getElementById('gpuSelect');
    if (!gpuSelect) return;
    
    const gpuOptions = [
        "GT 1030", "GTX 1050", "GTX 1060", "GTX 1070", "GTX 1080",
        "RTX 2060", "RTX 2070", "RTX 2080", 
        "RTX 3060", "RTX 3070", "RTX 3080",
        "RTX 4070", "RTX 4080", "RTX 5070"
    ];
    
    gpuOptions.forEach(gpu => {
        const option = document.createElement('option');
        option.value = gpu;
        option.textContent = gpu;
        gpuSelect.appendChild(option);
    });
}

// Заполнение опций процессоров
function populateCPUOptions() {
    const cpuSelect = document.getElementById('cpuSelect');
    if (!cpuSelect) return;
    
    const cpuOptions = [
        "Intel Core i3",
        "Intel Core i5",
        "Intel Core i5-8400",
        "Intel Core i7",
        "Intel Core i7-4790",
        "Intel Core i9",
        "AMD Ryzen 3",
        "AMD Ryzen 5", 
        "AMD Ryzen 7",
        "AMD Ryzen 9"
    ];
    
    cpuOptions.forEach(cpu => {
        const option = document.createElement('option');
        option.value = cpu;
        option.textContent = cpu;
        cpuSelect.appendChild(option);
    });
}

// Загрузка текущих настроек
function loadCurrentSettings() {
    const gpuSelect = document.getElementById('gpuSelect');
    const cpuSelect = document.getElementById('cpuSelect');
    const ramSelect = document.getElementById('ramSelect');
    const settingsInfo = document.getElementById('settingsInfo');
    
    const savedGPU = localStorage.getItem('selectedGPU');
    const savedCPU = localStorage.getItem('selectedCPU');
    const savedRAM = localStorage.getItem('selectedRAM');
    
    if (savedGPU && gpuSelect) gpuSelect.value = savedGPU;
    if (savedCPU && cpuSelect) cpuSelect.value = savedCPU;
    if (savedRAM && ramSelect) ramSelect.value = savedRAM;
    
    updateSettingsDisplay();
}

// Обновление отображения настроек
function updateSettingsDisplay() {
    const settingsInfo = document.getElementById('settingsInfo');
    if (!settingsInfo) return;
    
    const savedGPU = localStorage.getItem('selectedGPU');
    const savedCPU = localStorage.getItem('selectedCPU');
    const savedRAM = localStorage.getItem('selectedRAM');
    
    if (savedGPU || savedCPU || savedRAM) {
        let infoHTML = '';
        if (savedGPU) infoHTML += `<strong>Видеокарта:</strong> ${savedGPU}<br>`;
        if (savedCPU) infoHTML += `<strong>Процессор:</strong> ${savedCPU}<br>`;
        if (savedRAM) infoHTML += `<strong>Оперативная память:</strong> ${savedRAM}<br>`;
        settingsInfo.innerHTML = infoHTML;
    } else {
        settingsInfo.innerHTML = 'Настройки не сохранены. Укажите характеристики вашего ПК для проверки совместимости.';
    }
}

// Настройка обработчиков событий
function setupEventListeners() {
    const saveBtn = document.getElementById('saveSettings');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveSettings);
    }
}

// Сохранение настроек
function saveSettings() {
    const gpuSelect = document.getElementById('gpuSelect');
    const cpuSelect = document.getElementById('cpuSelect');
    const ramSelect = document.getElementById('ramSelect');
    
    const selectedGPU = gpuSelect?.value;
    const selectedCPU = cpuSelect?.value;
    const selectedRAM = ramSelect?.value;
    
    if (selectedGPU) {
        localStorage.setItem('selectedGPU', selectedGPU);
    }
    if (selectedCPU) {
        localStorage.setItem('selectedCPU', selectedCPU);
    }
    if (selectedRAM) {
        localStorage.setItem('selectedRAM', selectedRAM);
    }
    
    // Показываем уведомление
    showNotification('✅ Настройки успешно сохранены!');
    
    // Обновляем отображение
    updateSettingsDisplay();
    
    // Если есть выбранная игра, обновляем страницу деталей
    const selectedGame = localStorage.getItem('selectedGame');
    if (selectedGame && window.location.pathname.includes('game-detail.html')) {
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
}

// Показать уведомление
function showNotification(message) {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--success-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: var(--shadow-medium);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Автоматическое скрытие
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', initializeSettingsPage);
