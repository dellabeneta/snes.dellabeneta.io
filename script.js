const games = [
    { name: "Super Mario World", rom: "smw.sfc", thumb: "smw.png", saveType: "sram" },
    { name: "Donkey Kong Country", rom: "dkc1.sfc", thumb: "dkc1.png", saveType: "sram" },
    { name: "Donkey Kong Country 2", rom: "dkc2.sfc", thumb: "dkc2.png", saveType: "sram" },
    { name: "Donkey Kong Country 3", rom: "dkc3.sfc", thumb: "dkc3.png", saveType: "sram" },
    { name: "Super Mario Kart", rom: "mario-kart.sfc", thumb: "mario-kart.png", saveType: "sram" },
    { name: "Zelda: A Link to the Past", rom: "zelda-alttp.sfc", thumb: "zelda-alttp.png", saveType: "sram" },
    { name: "Street Fighter II", rom: "sf2.sfc", thumb: "sf2.png", saveType: null },
    { name: "Chrono Trigger", rom: "chrono.sfc", thumb: "chrono.png", saveType: "sram" },
    { name: "Mega Man X", rom: "mmx.sfc", thumb: "mmx.png", saveType: "password" },
    { name: "Top Gear", rom: "top-gear.sfc", thumb: "top-gear.png", saveType: "password" },
    { name: "Super Mario All-Stars", rom: "mario-allstars.sfc", thumb: "mario-allstars.png", saveType: "sram" },
    { name: "Bugs Bunny Rabbit Rampage", rom: "bb-rabbit-ramp.sfc", thumb: "bb-rabbit-ramp.png", saveType: "password" },
    { name: "International Superstar Soccer Deluxe", rom: "iss-deluxe.sfc", thumb: "iss-deluxe.png", saveType: "password" },
    { name: "The Mask", rom: "mask.sfc", thumb: "mask.png", saveType: null },
    { name: "Sunset Riders", rom: "sunset-riders.sfc", thumb: "sunset-riders.png", saveType: null },
    { name: "International Superstar Soccer", rom: "iss.smc", thumb: "iss.png", saveType: "password" },
    { name: "Street Fighter II Turbo", rom: "sf2t.smc", thumb: "sf2t.png", saveType: null },
    { name: "Ultimate Mortal Kombat 3", rom: "umk3.sfc", thumb: "umk3.png", saveType: null },
    { name: "Aero Fighters", rom: "aerof.smc", thumb: "aerof.png", saveType: null },
    { name: "Choplifter III", rom: "chop3.smc", thumb: "chop3.png", saveType: "password" },
    { name: "Final Fight", rom: "ff.smc", thumb: "ff.png", saveType: null },
    { name: "Final Fight 2", rom: "ff2.smc", thumb: "ff2.png", saveType: null },
    { name: "Final Fight 3", rom: "ff3.smc", thumb: "ff3.png", saveType: null },
    { name: "F-Zero", rom: "fzero.smc", thumb: "fzero.png", saveType: "sram" },
    { name: "Mortal Kombat", rom: "mk.smc", thumb: "mk.png", saveType: null },
    { name: "Mortal Kombat II", rom: "mk2.smc", thumb: "mk2.png", saveType: null },
    { name: "NBA Jam", rom: "nbajam.smc", thumb: "nbajam.png", saveType: "password" },
    { name: "Rock n' Roll Racing", rom: "rarr.smc", thumb: "rarr.png", saveType: "password" },
    { name: "Samurai Shodown", rom: "samuraisho.smc", thumb: "samuraisho.png", saveType: null },
    { name: "Side Pocket", rom: "sidepock.smc", thumb: "sidepock.png", saveType: "password" },
    { name: "Super Soccer", rom: "ssa2.smc", thumb: "ssa2.png", saveType: "password" },
    { name: "TMNT IV: Turtles in Time", rom: "teenagemtt.smc", thumb: "teenagemtt.png", saveType: null },
    { name: "Top Gear 2", rom: "topgear2.smc", thumb: "topgear2.png", saveType: "password" },
    { name: "WWF WrestleMania: The Arcade Game", rom: "wwftag.sfc", thumb: "wwftag.png", saveType: null }
];

document.getElementById('game-count').innerText = games.length;

const grid = document.getElementById('game-grid');

games.sort((a, b) => a.name.localeCompare(b.name));

games.forEach((game, index) => {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.dataset.index = index;
    
    card.innerHTML = `
        <img src="assets/caps/${game.thumb}" alt="${game.name}">
        <p class="game-title">${game.name}</p>
    `;
    
    card.addEventListener('click', () => {
        currentIndex = index;
        updateSelection();
        loadGame(game.rom);
    });
    grid.appendChild(card);
});

// Navigation Logic
let currentIndex = 0;
const cards = document.getElementsByClassName('game-card');

function updateSelection() {
    Array.from(cards).forEach((c, i) => {
        if (i === currentIndex) {
            c.classList.add('active');
            c.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        } else {
            c.classList.remove('active');
        }
    });
}
updateSelection();



function loadGame(romName) {
    console.log("Iniciando:", romName);
    
    // Show the modal
    const modal = document.getElementById('emulator-modal');
    modal.classList.remove('hidden');

    // Make sure we have the EJS object available from the loader
    // If it's already running a game, we might need a page reload or a way to reset EmulatorJS.
    // For a cleaner experience, since EmulatorJS doesn't always handle dynamic game switching well without a reload,
    // we set the game URL and then load the emulator system.
    
    // Set the game URL specifically for EmulatorJS
    window.EJS_gameUrl = `roms/${romName}`;
    
    // We check if the emulator was already loaded once
    if (typeof window.EJS_emulator === 'undefined' || !document.querySelector('#game iframe')) {
        // Load the emulator script if it's the first time
        const script = document.createElement('script');
        script.src = 'https://cdn.emulatorjs.org/stable/data/loader.js';
        document.body.appendChild(script);
    } else {
        // If already loaded, the easiest way to ensure a clean slate is to reload the page with a parameter,
        // but for now, we'll suggest a full reload on close to keep it simple and bug-free for this demo.
        alert("Para jogar outro jogo, por favor recarregue a página após fechar o atual.");
    }
    
    // Dá foco dinâmico apenas se o iframe não existir ainda
    const checkIframe = setInterval(() => {
        const iframe = document.querySelector('#game iframe');
        if (iframe) {
             iframe.focus();
             clearInterval(checkIframe);
        }
    }, 100);
}

function closeGame() {
    console.log("Fechando jogo");
    const modal = document.getElementById('emulator-modal');
    modal.classList.add('hidden');
    
    // To completely stopping the emulator audio/process without errors, 
    // the safest and cleanest approach for EmulatorJS is simply reloading the UI state.
    window.location.reload();
}

// Show cursor when mouse moves
document.addEventListener('mousemove', () => {
    document.body.classList.remove('hide-cursor');
});

// Hide cursor when keyboard is used
document.addEventListener('keydown', () => {
    document.body.classList.add('hide-cursor');
});

// --- Search Functionality ---
const searchTrigger = document.getElementById('search-trigger');
const searchTextHint = document.getElementById('search-text-hint');
const footerSearchInput = document.getElementById('footer-search-input');
const gameCountValue = document.getElementById('game-count');

function toggleSearch(show) {
    if (show) {
        if (searchTextHint) searchTextHint.classList.add('hidden');
        if (footerSearchInput) {
            footerSearchInput.classList.remove('hidden');
            footerSearchInput.focus();
        }
    } else {
        if (searchTextHint) searchTextHint.classList.remove('hidden');
        if (footerSearchInput) {
            footerSearchInput.classList.add('hidden');
            footerSearchInput.value = '';
        }
        filterGames('');
    }
}

// Ativar ao clicar na legenda do rodapé
if (searchTrigger) {
    searchTrigger.addEventListener('click', (e) => {
        if (e.target !== footerSearchInput) {
            toggleSearch(true);
        }
    });
}

// Fechar ao clicar fora (perder o foco)
if (footerSearchInput) {
    footerSearchInput.addEventListener('blur', () => {
        // Pequeno delay para permitir que cliques em jogos funcionem antes de fechar
        setTimeout(() => {
            toggleSearch(false);
        }, 200);
    });
}

function filterGames(query) {
    const q = query.toLowerCase().trim();
    let visibleCount = 0;
    let firstMatch = -1;

    Array.from(cards).forEach((card, index) => {
        const name = games[index].name.toLowerCase();
        if (name.includes(q)) {
            card.style.display = 'flex';
            if (firstMatch === -1) firstMatch = index;
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // Update count display
    if (q === '') {
        gameCountValue.innerText = games.length;
    } else {
        gameCountValue.innerText = `${visibleCount}/${games.length}`;
    }

    // Move selection to first match if current is hidden
    if (firstMatch !== -1 && (cards[currentIndex] && cards[currentIndex].style.display === 'none')) {
        currentIndex = firstMatch;
        updateSelection();
    }
}

if (footerSearchInput) {
    footerSearchInput.addEventListener('input', (e) => {
        filterGames(e.target.value);
    });
}

// Update keyboard listener
document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('emulator-modal');
    const isSearchOpen = footerSearchInput && !footerSearchInput.classList.contains('hidden');
    
    // When the game is running (modal is visible)
    if (modal && !modal.classList.contains('hidden')) {
        if (e.key === 'Escape') {
            closeGame();
        }
        return; 
    }

    if (isSearchOpen) {
        if (e.key === 'Escape') {
            toggleSearch(false);
            return;
        }
        if (e.key === 'Enter') {
            if (cards[currentIndex] && cards[currentIndex].style.display !== 'none') {
                cards[currentIndex].click();
            }
            return;
        }
        // Allow arrows even with search open
    }

    // Grid Navigation (considering visibility)
    if (modal && modal.classList.contains('hidden')) {
        const gridStyle = window.getComputedStyle(grid);
        const columnsStr = gridStyle.getPropertyValue('grid-template-columns');
        const cols = columnsStr ? columnsStr.split(' ').length : 1;

        if (e.key === 'ArrowRight') {
            let next = currentIndex + 1;
            while (next < games.length && cards[next].style.display === 'none') next++;
            if (next < games.length) {
                currentIndex = next;
                updateSelection();
            }
        } else if (e.key === 'ArrowLeft') {
            let prev = currentIndex - 1;
            while (prev >= 0 && cards[prev].style.display === 'none') prev--;
            if (prev >= 0) {
                currentIndex = prev;
                updateSelection();
            }
        } else if (e.key === 'ArrowDown') {
            // Simplificado: pula um bloco de colunas e busca o próximo visível
            let target = currentIndex + cols;
            while (target < games.length && cards[target].style.display === 'none') target++;
            if (target < games.length) {
                currentIndex = target;
                updateSelection();
            }
        } else if (e.key === 'ArrowUp') {
            let target = currentIndex - cols;
            while (target >= 0 && cards[target].style.display === 'none') target--;
            if (target >= 0) {
                currentIndex = target;
                updateSelection();
            }
        } else if (e.key === 'Enter' && !isSearchOpen) {
            cards[currentIndex].click();
        }
    }
});