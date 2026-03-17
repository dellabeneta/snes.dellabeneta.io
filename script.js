const games = [
    { name: "Super Mario World", rom: "smw.sfc", thumb: "smw.png" },
    { name: "Donkey Kong Country", rom: "dkc1.sfc", thumb: "dkc1.png" },
    { name: "Donkey Kong Country 2", rom: "dkc2.sfc", thumb: "dkc2.png" },
    { name: "Donkey Kong Country 3", rom: "dkc3.sfc", thumb: "dkc3.png" },
    { name: "Super Mario Kart", rom: "mario-kart.sfc", thumb: "mario-kart.png" },
    { name: "Zelda: A Link to the Past", rom: "zelda-alttp.sfc", thumb: "zelda-alttp.png" },
    { name: "Street Fighter II", rom: "sf2.sfc", thumb: "sf2.png" },
    { name: "Chrono Trigger", rom: "chrono.sfc", thumb: "chrono.png" },
    { name: "Mega Man X", rom: "mmx.sfc", thumb: "mmx.png" },
    { name: "Top Gear", rom: "top-gear.sfc", thumb: "top-gear.png" },
    { name: "Super Mario All-Stars", rom: "mario-allstars.sfc", thumb: "mario-allstars.png" }
];

const grid = document.getElementById('game-grid');

games.forEach((game, index) => {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.dataset.index = index;
    card.innerHTML = `
        <img src="assets/caps/${game.thumb}" alt="${game.name}">
        <div class="snes-label">SUPER NINTENDO ENTERTAINMENT SYSTEM</div>
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

document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('emulator-modal');
    
    // When the game is running (modal is visible)
    if (modal && !modal.classList.contains('hidden')) {
        if (e.key === 'Escape') {
            closeGame();
        }
        return; // Prevent navigating the grid in the background
    }

    // When navigating the grid (modal is hidden)
    if (modal && modal.classList.contains('hidden')) {
        const gridStyle = window.getComputedStyle(grid);
        // Calculate number of columns based on how many auto-fit columns current layout allowed
        const columnsStr = gridStyle.getPropertyValue('grid-template-columns');
        const cols = columnsStr ? columnsStr.split(' ').length : 1;

        if (e.key === 'ArrowRight') {
            if (currentIndex < games.length - 1) {
                currentIndex++;
                updateSelection();
            }
        } else if (e.key === 'ArrowLeft') {
            if (currentIndex > 0) {
                currentIndex--;
                updateSelection();
            }
        } else if (e.key === 'ArrowDown') {
            if (currentIndex + cols < games.length) {
                currentIndex += cols;
                updateSelection();
            } else if (currentIndex < games.length - 1) {
                // If on the last row but not the last item, jump to the last item
                currentIndex = games.length - 1;
                updateSelection();
            }
        } else if (e.key === 'ArrowUp') {
            if (currentIndex - cols >= 0) {
                currentIndex -= cols;
                updateSelection();
            }
        } else if (e.key === 'Enter') {
            cards[currentIndex].click();
        }
    }
});

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

// --- Hide Cursor Logic ---
// Show cursor when mouse moves
document.addEventListener('mousemove', () => {
    document.body.classList.remove('hide-cursor');
});

// Hide cursor when keyboard is used
document.addEventListener('keydown', () => {
    document.body.classList.add('hide-cursor');
});