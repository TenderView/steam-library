// ====== ДАННЫЕ ИГР ======
const gamesData = [
  {
    name: "Elden Ring",
    genre: "РПГ",
    gpu: "RTX 2060",
    price: "paid",
    release_date: "2022-02-25",
    rating: 9.0,
    cover: "https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg",
    cpu: "Intel i5",
    ram: "16GB"
  },
  {
    name: "Cyberpunk 2077",
    genre: "Ролевые экшены",
    gpu: "RTX 2060",
    price: "paid",
    release_date: "2020-12-10",
    rating: 7.0,
    cover: "https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg",
    cpu: "Intel i7",
    ram: "16GB"
  }
  // Добавляй сюда свои игры
];

// ====== ЭЛЕМЕНТЫ ======
const searchInput = document.getElementById("searchInput");
const genreSelect = document.getElementById("genre");
const gpuSelect = document.getElementById("gpu");
const priceSelect = document.getElementById("price");
const sortSelect = document.getElementById("sort");
const resetBtn = document.getElementById("resetBtn");
const gameList = document.getElementById("gameList");
const pagination = document.getElementById("pagination");

// ====== Заполняем фильтры ======
const allGenres = [...new Set(gamesData.map(g => g.genre))];
allGenres.forEach(g => genreSelect.innerHTML += `<option value="${g}">${g}</option>`);

const allGpus = [...new Set(gamesData.map(g => g.gpu))];
allGpus.forEach(g => gpuSelect.innerHTML += `<option value="${g}">${g}</option>`);

// ====== Пагинация ======
let currentPage = 1;
const perPage = 15;

// ====== Отображение игр ======
function displayGames() {
  const searchValue = searchInput.value.toLowerCase();
  const genre = genreSelect.value;
  const gpu = gpuSelect.value;
  const price = priceSelect.value;
  const sortOrder = sortSelect.value;

  let filtered = gamesData.filter(game => 
    game.name.toLowerCase().includes(searchValue) &&
    (!genre || game.genre === genre) &&
    (!gpu || game.gpu === gpu) &&
    (!price || game.price === price)
  );

  filtered.sort((a,b) => {
    if(sortOrder === "rating") return b.rating - a.rating;
    const dateA = new Date(a.release_date);
    const dateB = new Date(b.release_date);
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  if(currentPage > totalPages) currentPage = 1;

  gameList.innerHTML = '';
  filtered.slice((currentPage-1)*perPage, currentPage*perPage).forEach(game => {
    const li = document.createElement('li');
    li.className = 'game-card';
    li.innerHTML = `
      <img src="${game.cover}" alt="${game.name}" class="game-cover">
      <div class="game-info">
        <h3>${game.name}</h3>
        <p>Жанр: ${game.genre}</p>
        <p>Цена: ${game.price}</p>
        <p>Рейтинг: ${game.rating}/10</p>
      </div>
    `;

    // Совместимость GPU (пример)
    const userGpu = "GTX 1060"; // позже можно сделать выбор пользователем
    const compat = document.createElement('p');
    compat.textContent = (game.gpu===userGpu) ? "Совместимо" : "Не совместимо";
    compat.style.color = (game.gpu===userGpu) ? "#00ffcc" : "red";
    li.querySelector('.game-info').appendChild(compat);

    li.addEventListener('click', ()=> {
      window.location.href = `game-detail.html?name=${encodeURIComponent(game.name)}`;
    });

    gameList.appendChild(li);
  });

  // Пагинация
  pagination.innerHTML = '';
  for(let i=1;i<=totalPages;i++){
    const btn = document.createElement('button');
    btn.textContent = i;
    if(i===currentPage) btn.style.backgroundColor="#00ffcc";
    btn.addEventListener('click', ()=> { currentPage=i; displayGames(); });
    pagination.appendChild(btn);
  }
}

// ====== События ======
searchInput.addEventListener('input', ()=>{currentPage=1; displayGames();});
genreSelect.addEventListener('change', ()=>{currentPage=1; displayGames();});
gpuSelect.addEventListener('change', ()=>{currentPage=1; displayGames();});
priceSelect.addEventListener('change', ()=>{currentPage=1; displayGames();});
sortSelect.addEventListener('change', ()=>{currentPage=1; displayGames();});
resetBtn.addEventListener('click', ()=>{
  searchInput.value=''; genreSelect.value=''; gpuSelect.value=''; priceSelect.value=''; sortSelect.value='newest';
  currentPage=1;
  displayGames();
});

// ====== Инициализация ======
displayGames();
