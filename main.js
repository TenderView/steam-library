function initializeFilters(games) {
    const searchInput=document.getElementById('searchInput');
    const genreSelect=document.getElementById('genreSelect');
    const priceSelect=document.getElementById('priceSelect');
    const sortSelect=document.getElementById('sortSelect');
    const resetBtn=document.getElementById('resetBtn');

    [...new Set(games.map(g=>g.genre))].forEach(genre=>{
        genreSelect.innerHTML+=`<option value="${genre}">${genre}</option>`;
    });

    window.filterAndDisplayGames=()=>{
        let filtered=games.filter(g=>{
            const matchName=g.name.toLowerCase().includes(searchInput.value.toLowerCase());
            const matchGenre=genreSelect.value?g.genre===genreSelect.value:true;
            const matchPrice=priceSelect.value?g.price===priceSelect.value:true;
            return matchName && matchGenre && matchPrice;
        });

        if(sortSelect.value==='newest') filtered.sort((a,b)=>new Date(b.release_date)-new Date(a.release_date));
        else if(sortSelect.value==='oldest') filtered.sort((a,b)=>new Date(a.release_date)-new Date(b.release_date));
        else if(sortSelect.value==='rating') filtered.sort((a,b)=>parseFloat(b.rating)-parseFloat(a.rating));
        else if(sortSelect.value==='name') filtered.sort((a,b)=>a.name.localeCompare(b.name));

        displayGames(filtered,currentPage);
    };

    searchInput.addEventListener('input',window.filterAndDisplayGames);
    genreSelect.addEventListener('change',window.filterAndDisplayGames);
    priceSelect.addEventListener('change',window.filterAndDisplayGames);
    sortSelect.addEventListener('change',window.filterAndDisplayGames);
    resetBtn.addEventListener('click',()=>{
        searchInput.value='';
        genreSelect.value='';
        priceSelect.value='';
        sortSelect.value='newest';
        window.filterAndDisplayGames();
    });
}
