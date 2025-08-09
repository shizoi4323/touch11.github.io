/* touch11LegendsUpdated.js - Updated Formation Game Logic */

class Touch11LegendsGame {
    constructor() {
        this.countries = [];
        this.playersByCountry = {};
        this.playerPositions = {};
        this.formations = {};
        this.currentFormation = null;
        this.currentCountryIndex = 0;
        this.currentCountry = null;
        this.gameOver = false;
        this.completedPositions = 0;
        this.gameStarted = false;
        this.selectedSuggestionIndex = -1;
        this.currentSuggestions = [];
        this.hardMode = false; // Hard mode toggle
        this.filledPositions = {};
        this.surrendered = false;

        // DOM elements
        this.gameInfoSection = null;
        this.gameSection = null;
        this.currentCountryFlag = null;
        this.currentCountryName = null;
        this.playerInput = null;
        this.suggestions = null;
        this.gameOverModal = null;
        this.formationContainer = null;
        this.positionChoiceModal = null;
        this.hardModeToggle = null;

        // Flag URLs for the specified countries
        this.flagUrls = {
            'CO': 'https://flagpedia.net/data/flags/w580/co.webp',
            'BR': 'https://flagpedia.net/data/flags/w580/br.webp',
            'MX': 'https://flagpedia.net/data/flags/w580/mx.webp',
            'AR': 'https://flagpedia.net/data/flags/w580/ar.webp',
            'UY': 'https://flagpedia.net/data/flags/w580/uy.webp',
            'EC': 'https://flagpedia.net/data/flags/w580/ec.webp',
            'ES': 'https://flagpedia.net/data/flags/w580/es.webp',
            'PE': 'https://flagpedia.net/data/flags/w580/pe.webp',
            'BO': 'https://flagpedia.net/data/flags/w580/bo.webp',
            'PR': 'https://flagpedia.net/data/flags/w580/pr.webp',
            'DO': 'https://flagpedia.net/data/flags/w580/do.webp',
            'US': 'https://flagpedia.net/data/flags/w580/us.webp',
            'CR': 'https://flagpedia.net/data/flags/w580/cr.webp',
            'PY': 'https://flagpedia.net/data/flags/w580/py.webp',
            'PA': 'https://flagpedia.net/data/flags/w580/pa.webp',
            'JM': 'https://flagpedia.net/data/flags/w580/jm.webp',
            'VE': 'https://flagpedia.net/data/flags/w580/ve.webp',
            'PH': 'https://flagpedia.net/data/flags/w580/ph.webp',
            'SV': 'https://flagpedia.net/data/flags/w580/sv.webp',
            'GT': 'https://flagpedia.net/data/flags/w580/gt.webp',
            'HN': 'https://flagpedia.net/data/flags/w580/hn.webp',
            'CL': 'https://flagpedia.net/data/flags/w580/cl.webp',
            'CU': 'https://flagpedia.net/data/flags/w580/cu.webp',
            'AD': 'https://flagpedia.net/data/flags/w580/ad.webp',
            'BE': 'https://flagpedia.net/data/flags/w580/be.webp',
            'PT': 'https://flagpedia.net/data/flags/w580/pt.webp'
        };
    }

    async init() {
        console.log('Initializing Touch11 Legends Game Updated...');

        try {
            await this.loadGameData();
            this.initializeDOM();
            this.setupEventListeners();
            this.setupDailyFormation();
            console.log('✅ Touch11 Legends Game initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize game:', error);
        }
    }

    async loadGameData() {
        try {
            const response = await fetch('touch11_players_updated.json');
            if (!response.ok) {
                throw new Error('Failed to load player data');
            }

            const data = await response.json();
            this.countries = data.countries;
            this.playersByCountry = data.playersByCountry;
            this.playerPositions = data.playerPositions || {};
            this.formations = data.formations || {};

            if (!data.playerPositions) {
                this.createPlayerPositions();
            }

            if (!data.formations) {
                this.createFormations();
            }

            console.log('📊 Loaded data:', {
                countries: this.countries.length,
                formations: Object.keys(this.formations).length,
                totalPlayers: Object.values(this.playersByCountry).reduce((sum, players) => sum + players.length, 0)
            });

        } catch (error) {
            console.error('⚠️ Using fallback data due to error:', error);
            this.loadFallbackData();
        }
    }

    createFormations() {
        this.formations = {
            "4-3-3": {
                "name": "Classic 4-3-3",
                "positions": [
                    { position: "GK", row: "goalkeeper" },
                    { position: "LB", row: "defense" },
                    { position: "CB", row: "defense" },
                    { position: "CB", row: "defense" },
                    { position: "RB", row: "defense" },
                    { position: "CDM", row: "midfield" },
                    { position: "CM", row: "midfield" },
                    { position: "CM", row: "midfield" },
                    { position: "LW", row: "attack" },
                    { position: "ST", row: "attack" },
                    { position: "RW", row: "attack" }
                ]
            },
            "4-2-3-1": {
                "name": "Balanced 4-2-3-1",
                "positions": [
                    { position: "GK", row: "goalkeeper" },
                    { position: "LB", row: "defense" },
                    { position: "CB", row: "defense" },
                    { position: "CB", row: "defense" },
                    { position: "RB", row: "defense" },
                    { position: "CDM", row: "midfield" },
                    { position: "CDM", row: "midfield" },
                    { position: "LW", row: "attack-mid" },
                    { position: "CAM", row: "attack-mid" },
                    { position: "RW", row: "attack-mid" },
                    { position: "ST", row: "attack" }
                ]
            }
        };
    }

    createPlayerPositions() {
        // Simplified positions with CB and CM
        this.playerPositions = {
            "SHIZOI": ["RW", "CAM", "CM"],
            "POLIN": ["LW", "RW", "CM"],
            "XTRATOSKI": ["LW", "RW", "CM"],
            "KINGALE": ["LW", "RW", "ST"],
            "FRANSU": ["GK", "CM", "LW"],
            "SHADIX": ["GK", "LW"],
            "ILLUSION": ["CM", "ST"],
            "POLIKITO": ["RW", "LW", "CM"],
            "THOR": ["GK", "CM", "LW"],
            "DAVID": ["RW", "CDM"],
            "VERDE": ["CDM", "CM", "GK"],
            "SOPADECARNE": ["CM", "CDM"],
            "NIKKO": ["GK", "CDM", "ST"],
            "DRAKZ": ["LW", "RW"],
            "ALONE": ["LW", "RW"],
            "TAKO": ["GK"],
            "BLUEX": ["RW", "LW"],
            "GARAEL": ["GK", "ST"],
            "RABG": ["GK", "CDM"],
            "XIMAST": ["GK"],
            "ZACK": ["GK", "RW"],
            "RELO": ["GK", "CDM", "CAM"],
            "ERNI": ["GK", "CM", "ST"],
            "IVAN": ["RW", "LW"],
            "REAPER": ["LW", "RW", "CDM"],
            "ECHEVERRI": ["RW", "LW"],
            "KRAZY": ["GK"],
            "NICKXYZ": ["LW", "RW", "RB"],
            "BRYAN": ["GK", "RW"],
            "LITHAN": ["LW", "RW", "CDM"],
            "PABLO": ["GK", "CM", "LW"],
            "DAVICHO": ["RW", "LW"],
            "MIAMII": ["CDM", "LW"],
            "PYRO": ["LW", "ST"],
            "JAKE": ["LW", "RW", "ST"],
            "SPLITZ": ["LW"],
            "FALOPALEX": ["CDM", "CB", "CM"],
            "FEMUR": ["CDM"],
            "SANCHO": ["GK"],
            "SAMUU": ["LW", "RW"],
            "DAHA": ["CDM", "ST"],
            "ETHERIDGE": ["GK"],
            "PEACE": ["RW"],
            "WICHO": ["CDM", "RW"],
            "DEN": ["RW", "LW", "CDM"],
            "PYRA": ["LW", "RW"],
            "PIBBLE": ["GK"],
            "EXIT": ["RW"],
            "BULL": ["LW", "CDM", "RB"],
            "LOLSKG": ["CDM", "ST"],
            "CHINO": ["CDM"],
            "HXRRYX": ["LW", "RW"],
            "ALEX": ["RW", "LW", "CM"],
            "ZERO": ["LW", "RW", "CDM"],
            "DEMIAN": ["GK"],
            "LUKY": ["GK", "CDM"],
            "COCONUNS": ["CDM"],
            "EMILY": ["ST", "CDM", "GK"],
            "LAUVADER": ["GK"],
            "MATIGOL": ["ST", "LW", "RW"],
            "DONERKEBAB": ["LW", "CDM", "RW"],
            "RATOYOON": ["CDM"],
            "DYNO": ["GK", "CDM"],
            "ELIAS": ["ST"],
            "JUAN": ["RW"],
            "BALLER": ["CDM"],
            "JUSTIN": ["CDM", "LW"],
            "NAVAS": ["GK"],
            "VICTOR": ["GK", "LB", "CB"],
            "ANSUFATI": ["RW", "CDM", "LW"],
            "MARTINELLI": ["GK", "CDM"],
            "JUJOMO": ["CF", "ST", "RW"],
            "POLLO": ["CM", "CDM", "CAM"],
            "DEV": ["LW", "RW"],
            "FROSTBITE": ["CDM", "CM", "CAM"],
            "ICY": ["GK", "CB", "CAM"],
            "GOTITA": ["CDM", "CM", "CAM"],
            "BORIC": ["CDM", "CM", "CAM"],
            "CHICHA": ["LW", "RW", "ST"],
            "TER": ["LW", "RW", "CM"],
            "ANGELUIGI": ["LW", "RW"],
            "WARRIOR": ["GK", "ST"],
            "LUXORYAN": ["GK"],
            "FTSANTI": ["CB", "LB", "RB"],
            "AMANDA": ["CB", "CDM", "LW"],
            "JULIO": ["LW", "CDM", "CM"],
            "LOTTO": ["LW", "CDM", "RW"],
            "HUGO": ["LW", "CDM", "GK"],
            "ALICIA": ["LW", "GK", "RW"],
            "MRALEX": ["GK"],
            "MARIO": ["LW", "CDM", "RW"],
            "BLACKBEAR": ["GK", "RW"],
            "GENGAR": ["CM", "CDM", "CAM"],
            "EMI": ["GK", "CDM"],
            "ZYRO": ["GK", "ST"],
            "DIABETOJR": ["LW", "ST", "RW"],
            "MEZT": ["LW", "CDM", "RW"],
            "VANZ": ["LW", "CM", "RW"],
            "FREN": ["LW", "CAM", "RW"],
            "WASAKA": ["LW", "RW"]
        };

        // Add default positions for players not explicitly defined
        Object.keys(this.playersByCountry).forEach(countryCode => {
            this.playersByCountry[countryCode].forEach(player => {
                if (!this.playerPositions[player]) {
                    // Assign default positions
                    if (['OSPINA', 'ALISSON', 'NEUER', 'LLORIS', 'COURTOIS', 'MARTINEZ', 'ARMANI', 'EDERSON', 'PATRICIO', 'MUSLERA', 'OCHOA', 'BRAVO', 'GALLESE', 'GALINDEZ', 'VARGAS'].includes(player)) {
                        this.playerPositions[player] = ['GK'];
                    } else {
                        this.playerPositions[player] = ['CM'];
                    }
                }
            });
        });
    }

    loadFallbackData() {
        // Same as before but with simplified positions
        this.countries = [
            { "code": "CO", "name": "COLOMBIA" },
            { "code": "BR", "name": "BRAZIL" },
            { "code": "MX", "name": "MEXICO" },
            { "code": "AR", "name": "ARGENTINA" },
            { "code": "UY", "name": "URUGUAY" },
            { "code": "EC", "name": "ECUADOR" },
            { "code": "ES", "name": "ESPAÑA" },
            { "code": "PE", "name": "PERU" },
            { "code": "BO", "name": "BOLIVIA" },
            { "code": "PR", "name": "PUERTO RICO" },
            { "code": "DO", "name": "REPUBLICA DOMINICANA" },
            { "code": "US", "name": "USA" },
            { "code": "CR", "name": "COSTA RICA" },
            { "code": "PY", "name": "PARAGUAY" },
            { "code": "PA", "name": "PANAMA" },
            { "code": "JM", "name": "JAMAICA" },
            { "code": "VE", "name": "VENEZUELA" },
            { "code": "PH", "name": "FILIPINAS" },
            { "code": "SV", "name": "EL SALVADOR" },
            { "code": "GT", "name": "GUATEMALA" },
            { "code": "HN", "name": "HONDURAS" },
            { "code": "CL", "name": "CHILE" },
            { "code": "CU", "name": "CUBA" },
            { "code": "AD", "name": "ANDORRA" },
            { "code": "BE", "name": "BELGICA" },
            { "code": "PT", "name": "PORTUGAL" }
        ];

        this.playersByCountry = {
            "CO": [
              "SHIZOI", "LITHAN", "PYRA", "PIBBLE", "BULL", "LOLSKG", "RATOYOON", "ELIAS", "MARTINELLI", "JUJOMO", "LUXORYAN", "FTSANTI"
            ],
            "BR": [
              "POLIN"
            ],
            "MX": [
              "XTRATOSKI", "NIKKO", "TAKO", "XIMAST", "IVAN", "LUKY", "COCONUNS", "DYNO", "BALLER", "CHICHA", "TER", "AMANDA"
            ],
            "AR": [
              "KINGALE", "SHADIX", "KRAZY", "DEMIAN", "LAUVADER", "ANGELUIGI", "ZYRO", "DIABETOJR"
            ],
            "UY": [
              "FRANSU", "VERDE", "FROSTBITE", "EMI"
            ],
            "EC": [
              "ILLUSION", "BLUEX", "DAVICHO", "EXIT", "EMILY"
            ],
            "ES": [
              "POLIKITO", "DAVID", "GARAEL", "SANCHO", "ALEX", "DONERKEBAB", "JUAN", "ANSUFATI", "ICY", "HUGO", "MRALEX", "MARIO"
            ],
            "PE": [
              "THOR", "SOPADECARNE", "RABG", "NICKXYZ", "MIAMII", "HXRRYX"
            ],
            "BO": [
              "DRAKZ", "FALOPALEX", "BORIC", "FREN"
            ],
            "PR": [
              "ALONE", "REAPER"
            ],
            "DO": [
              "ZACK", "SAMUU"
            ],
            "US": [
              "RELO", "BRYAN", "DEN"
            ],
            "CR": [
              "ERNI", "PYRO", "NAVAS", "WARRIOR", "LOTTO", "GENGAR", "VANZ"
            ],
            "PY": [
              "ECHEVERRI", "PABLO"
            ],
            "PA": [
              "JAKE", "VICTOR", "DEV"
            ],
            "JM": [
              "SPLITZ"
            ],
            "VE": [
              "FEMUR", "DAHA", "MEZT"
            ],
            "PH": [
              "ETHERIDGE"
            ],
            "SV": [
              "PEACE", "CHINO", "JUSTIN"
            ],
            "GT": [
              "WICHO"
            ],
            "HN": [
              "ZERO"
            ],
            "CL": [
              "MATIGOL", "POLLO", "GOTITA"
            ],
            "CU": [
              "JULIO"
            ],
            "AD": [
              "ALICIA"
            ],
            "BE": [
              "BLACKBEAR"
            ],
            "PT": [
              "WASAKA"
            ]
        };

        this.createPlayerPositions();
        this.createFormations();
    }

setupDailyFormation() {
        const dateStr = this.colombianDate();
        let hash = 0;
        for (let i = 0; i < dateStr.length; i++) {
            const char = dateStr.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }

        const formationKeys = Object.keys(this.formations);
        const index = Math.abs(hash) % formationKeys.length;
        const formationKey = formationKeys[index];

        this.currentFormation = {
            key: formationKey,
            ...this.formations[formationKey]
        };

        console.log('📅 Today\'s formation:', this.currentFormation.name);
    }

    colombianDate() {
        const now = new Date();
        const local = new Date(now.getTime() + (-5) * 3.6e6); // Colombia UTC-5
        return local.toISOString().split('T')[0];
    }

    initializeDOM() {
        this.gameInfoSection = document.getElementById('gameInfoSection');
        this.gameSection = document.getElementById('gameSection');
        this.currentCountryFlag = document.getElementById('currentCountryFlag');
        this.currentCountryName = document.getElementById('currentCountryName');
        this.playerInput = document.getElementById('playerInput');
        this.suggestions = document.getElementById('suggestions');
        this.gameOverModal = document.getElementById('gameOverModal');
        this.formationContainer = document.getElementById('formationContainer');
        this.positionChoiceModal = document.getElementById('positionChoiceModal');
        this.hardModeToggle = document.getElementById('hardModeToggle');
        this.surrenderBtn = document.getElementById('surrenderBtn');
        this.surrenderModal = document.getElementById('surrenderModal');
        this.statsModal = document.getElementById('statsModal');
        this.closeStatsBtn = document.getElementById('closeStatsBtn');
    }

    setupEventListeners() {
        document.getElementById('startGameBtn').addEventListener('click', () => {
            this.startGame();
        });

        // Hard mode toggle
        if (this.hardModeToggle) {
            this.hardModeToggle.addEventListener('change', (e) => {
                this.hardMode = e.target.checked;
                console.log('Hard mode:', this.hardMode ? 'ON' : 'OFF');
            });
        }

        this.playerInput.addEventListener('input', (e) => {
            this.handlePlayerInput(e.target.value);
        });

        this.playerInput.addEventListener('keydown', (e) => {
            this.handleKeyDown(e);
        });

        document.getElementById('backToMenuStatsBtn')?.addEventListener('click', () => {
            this.backToMenu();
        });

        // New event listener for close stats button
        document.getElementById('closeStatsBtn')?.addEventListener('click', () => {
            this.hideStatsModal();
        });

        // Nuevos event listeners para surrender
        if (this.surrenderBtn) {
            this.surrenderBtn.addEventListener('click', () => {
                this.showSurrenderModal();
            });
        }

        document.getElementById('confirmSurrenderBtn')?.addEventListener('click', () => {
            this.confirmSurrender();
        });

        document.getElementById('cancelSurrenderBtn')?.addEventListener('click', () => {
            this.hideSurrenderModal();
        });

        document.getElementById('playAgainStatsBtn')?.addEventListener('click', () => {
            this.backToMenu();
        });

        document.getElementById('backToMenuStatsBtn')?.addEventListener('click', () => {
            this.backToMenu();
        });
    }

    startGame() {
        console.log('🎮 Starting game... Hard mode:', this.hardMode);

        // Check if already completed today
        const savedGameState = this.loadCompleteGameState();
        if (savedGameState) {
            console.log('Game already completed today:', savedGameState.won ? 'WON' : 'LOST');
            this.gameOver = true;
            this.surrendered = savedGameState.surrendered || false;
            this.filledPositions = savedGameState.filledPositions || {};
            this.completedPositions = savedGameState.completedPositions || 0;

            // Disable input and surrender button
            this.playerInput.disabled = true;
            if (this.surrenderBtn) {
                this.surrenderBtn.disabled = true;
            }
        } else {
            // Check for in-progress game
            const progressState = this.loadGameProgress();
            if (progressState) {
                console.log('Loading game in progress...');
                this.restoreGameProgress(progressState);
            }
        }

        // UI transition
        this.gameInfoSection.classList.add('fade-out');
        setTimeout(() => {
            this.gameInfoSection.classList.add('hidden');
            this.gameSection.classList.remove('hidden');
            this.gameSection.classList.add('fade-in');
        }, 500);

        // Generate formation and restore state
        this.generateFormationGrid();

        if (savedGameState) {
            // Restore completed game
            this.restoreFormationFromState(savedGameState);
            setTimeout(() => {
                this.showStatsModal();
            }, 1000);
        } else if (this.loadGameProgress()) {
            // Continue in-progress game
            console.log('Continuing previous game...');
        } else {
            // Start new game
            this.resetGame();
            this.shuffleCountries();
            this.nextCountry();
            this.gameStarted = true;
            setTimeout(() => {
                this.playerInput.focus();
            }, 600);
        }
    }

    restoreGameProgress(progressState) {
        this.filledPositions = progressState.filledPositions || {};
        this.currentCountryIndex = progressState.currentCountryIndex || 0;
        this.currentCountry = progressState.currentCountry || null;
        this.completedPositions = progressState.completedPositions || 0;
        this.gameStarted = progressState.gameStarted || false;

        // Restore formation if needed
        if (progressState.formation && this.formations[progressState.formation]) {
            this.currentFormation = {
                key: progressState.formation,
                ...this.formations[progressState.formation]
            };
        }

        // Set current country if exists
        if (this.currentCountry) {
            this.updateCurrentCountryDisplay();
        } else if (this.countries && this.countries.length > 0) {
            this.nextCountry();
        }
    }
    
    restoreFormationFromState(gameState) {
        Object.keys(gameState.filledPositions).forEach(positionId => {
            const playerData = gameState.filledPositions[positionId];
            // ✅ Maneja TANTO formato original como string simple
            const playerName = playerData.player || playerData.playerName || playerData;
            const countryCode = playerData.country ? playerData.country.code : 'CO';
        });
    }

    generateFormationGrid() {
        if (!this.currentFormation) return;

        this.formationContainer.innerHTML = '';
        this.formationContainer.className = `formation-${this.currentFormation.key}`;

        // Group positions by row
        const rowGroups = {};
        this.currentFormation.positions.forEach((pos, index) => {
            if (!rowGroups[pos.row]) {
                rowGroups[pos.row] = [];
            }
            rowGroups[pos.row].push({
                ...pos,
                id: `pos-${index}`
            });
        });

        // Create formation rows
        const rowOrder = ['attack', 'attack-mid', 'midfield', 'defense', 'goalkeeper'];
        rowOrder.forEach(rowName => {
            if (rowGroups[rowName]) {
                const row = document.createElement('div');
                row.className = `formation-row ${rowName}`;

                rowGroups[rowName].forEach(pos => {
                    const slot = document.createElement('div');
                    slot.className = 'formation-slot';
                    slot.dataset.position = pos.position;
                    slot.dataset.positionId = pos.id;
                    slot.innerHTML = `<div class="position-label">${pos.position}</div>`;
                    row.appendChild(slot);
                });

                this.formationContainer.appendChild(row);
            }
        });
    }

    resetGame() {
        this.gameOver = false;
        this.completedPositions = 0;
        this.currentCountryIndex = 0;
        this.filledPositions = {};
        this.selectedSuggestionIndex = -1;
        this.currentSuggestions = [];

        this.playerInput.value = '';
        this.suggestions.innerHTML = '';
        this.suggestions.classList.add('hidden');
    }

    shuffleCountries() {
        for (let i = this.countries.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.countries[i], this.countries[j]] = [this.countries[j], this.countries[i]];
        }
    }

    nextCountry() {
        if (this.currentCountryIndex >= this.countries.length) {
            this.shuffleCountries();
            this.currentCountryIndex = 0;
        }

        this.currentCountry = this.countries[this.currentCountryIndex];
        this.currentCountryIndex++;

        console.log('🌍 Current country:', this.currentCountry);

        this.updateCurrentCountryDisplay();
        this.playerInput.value = '';
        this.suggestions.innerHTML = '';
        this.suggestions.classList.add('hidden');
        this.selectedSuggestionIndex = -1;
        this.currentSuggestions = [];

        // Save progress with new country
        this.saveGameProgress();
    }

    updateCurrentCountryDisplay() {
        if (this.currentCountryFlag && this.currentCountryName && this.currentCountry) {
            const flagUrl = this.flagUrls[this.currentCountry.code];
            this.currentCountryFlag.src = flagUrl;
            this.currentCountryFlag.alt = `${this.currentCountry.name} Flag`;
            this.currentCountryName.textContent = this.currentCountry.name;
        }
    }

    handlePlayerInput(value) {
        if (!this.currentCountry || this.gameOver) return;

        // In hard mode, don't show suggestions
        if (this.hardMode) {
            this.suggestions.classList.add('hidden');
            this.currentSuggestions = [];
            this.selectedSuggestionIndex = -1;
            return;
        }

        const players = this.playersByCountry[this.currentCountry.code] || [];

        if (!value.trim()) {
            this.suggestions.classList.add('hidden');
            this.currentSuggestions = [];
            this.selectedSuggestionIndex = -1;
            return;
        }

        const filteredPlayers = players.filter(player => 
            player.toLowerCase().includes(value.toLowerCase())
        );

        this.currentSuggestions = filteredPlayers;
        this.selectedSuggestionIndex = -1;
        this.displaySuggestions(filteredPlayers);
    }

    displaySuggestions(players) {
        this.suggestions.innerHTML = '';

        if (players.length === 0 || this.hardMode) {
            this.suggestions.classList.add('hidden');
            return;
        }

        players.forEach((player, index) => {
            const suggestion = document.createElement('div');
            suggestion.className = 'suggestion-item';
            suggestion.textContent = player;
            suggestion.addEventListener('click', () => {
                this.selectPlayer(player);
            });
            this.suggestions.appendChild(suggestion);
        });

        this.suggestions.classList.remove('hidden');
    }

    handleKeyDown(e) {
        if (this.hardMode || !this.currentSuggestions.length) {
            if (e.key === 'Enter') {
                const value = this.playerInput.value.trim().toUpperCase();
                if (value) {
                    this.selectPlayer(value);
                }
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.selectedSuggestionIndex = Math.min(
                    this.selectedSuggestionIndex + 1,
                    this.currentSuggestions.length - 1
                );
                this.updateSuggestionSelection();
                break;

            case 'ArrowUp':
                e.preventDefault();
                this.selectedSuggestionIndex = Math.max(this.selectedSuggestionIndex - 1, -1);
                this.updateSuggestionSelection();
                break;

            case 'Enter':
                e.preventDefault();
                if (this.selectedSuggestionIndex >= 0) {
                    this.selectPlayer(this.currentSuggestions[this.selectedSuggestionIndex]);
                } else if (this.currentSuggestions.length > 0) {
                    this.selectPlayer(this.currentSuggestions[0]);
                } else {
                    const value = this.playerInput.value.trim().toUpperCase();
                    if (value) {
                        this.selectPlayer(value);
                    }
                }
                break;

            case 'Escape':
                this.suggestions.classList.add('hidden');
                this.selectedSuggestionIndex = -1;
                break;
        }
    }

    updateSuggestionSelection() {
        const suggestionItems = this.suggestions.querySelectorAll('.suggestion-item');
        suggestionItems.forEach((item, index) => {
            if (index === this.selectedSuggestionIndex) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
    }

    selectPlayer(playerName) {
        if (this.gameOver) return;

        playerName = playerName.toUpperCase();

        const currentCountryPlayers = this.playersByCountry[this.currentCountry.code] || [];
        if (!currentCountryPlayers.includes(playerName)) {
            this.showMessage(`"${playerName}" is not from ${this.currentCountry.name}`, 'error');
            return;
        }

        const playerPositions = this.playerPositions[playerName] || ['CM'];
        const availablePositions = playerPositions.filter(pos => {
            const slots = document.querySelectorAll(`[data-position="${pos}"]`);
            return Array.from(slots).some(slot => !slot.classList.contains('filled'));
        });

        if (availablePositions.length === 0) {
            this.showMessage(`No available positions for ${playerName}`, 'error');
            return;
        }

        if (availablePositions.length === 1) {
            this.placePlayer(playerName, availablePositions[0]);
        } else {
            this.showPositionChoice(playerName, availablePositions);
        }
    }

    showPositionChoice(playerName, positions) {
        const modal = this.positionChoiceModal;
        const text = document.getElementById('positionChoiceText');
        const buttons = document.getElementById('positionChoiceButtons');

        text.textContent = `Where do you want to place ${playerName}?`;
        buttons.innerHTML = '';

        positions.forEach(position => {
            const button = document.createElement('button');
            button.className = 'position-choice-btn';
            button.textContent = this.getPositionFullName(position);
            button.addEventListener('click', () => {
                modal.style.display = 'none';
                this.placePlayer(playerName, position);
            });
            buttons.appendChild(button);
        });

        modal.style.display = 'flex';
    }

    placePlayer(playerName, position) {
        const slots = document.querySelectorAll(`[data-position="${position}"]`);
        const availableSlot = Array.from(slots).find(slot => !slot.classList.contains('filled'));

        if (!availableSlot) {
            this.showMessage(`Position ${position} is not available`, 'error');
            return;
        }

        // ✅ ACTUALIZAR DOM - agregar esto que faltaba
        availableSlot.classList.add('filled');
        availableSlot.innerHTML = `
            <div class="player-name">${playerName}</div>
            <div style="font-size: 8px; opacity: 0.8;">
                <img src="${this.flagUrls[this.currentCountry.code]}" style="width: 12px; height: 8px; display: inline-block;">
            </div>
        `;

        // Guardar datos
        this.filledPositions[availableSlot.dataset.positionId] = {
            player: playerName,
            country: this.currentCountry,
            position: position
        };

        // ✅ INCREMENTAR CONTADOR - agregar esto que faltaba
        this.completedPositions++;

        console.log('✅ Placed', playerName, 'at', position, 'for', this.currentCountry.name);

        // ✅ LIMPIAR INTERFAZ - agregar esto que faltaba
        this.playerInput.value = '';
        this.suggestions.classList.add('hidden');
        this.selectedSuggestionIndex = -1;
        this.currentSuggestions = [];

        // Autoguardado
        this.saveGameProgress();

        // ✅ MOSTRAR MENSAJE - agregar esto que faltaba
        this.showMessage(`${playerName} placed at ${this.getPositionFullName(position)}!`, 'success');

        // ✅ VERIFICAR VICTORIA - agregar esto que faltaba
        if (this.completedPositions >= this.currentFormation.positions.length) {
            setTimeout(() => {
                this.gameWon();
            }, 1000);
            return;
        }

        // ✅ SIGUIENTE PAÍS - agregar esto que faltaba
        setTimeout(() => {
            this.nextCountry();
            this.playerInput.focus();
        }, 1500);
    }

    gameWon() {
        this.gameOver = true;
        console.log('🎉 Game won!');

        if (window.dailyGameManager) {
            window.dailyGameManager.registerResult(true);
        }

        this.gameOverModal.style.display = 'flex';

        // En el lugar donde se determina que el juego se ganó, agrega:
        if (this.completedPositions >= this.currentFormation.positions.length) {
            this.endGameWithVictory();
        }

    }

    backToMenu() {
        this.gameOverModal.style.display = 'none';

        this.gameSection.classList.add('fade-out');
        setTimeout(() => {
            this.gameSection.classList.add('hidden');
            this.gameInfoSection.classList.remove('hidden');
            this.gameInfoSection.classList.add('fade-in');
        }, 500);

        this.resetGame();
        this.gameStarted = false;
    }

    showMessage(message, type = 'info') {
        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}`;
        messageEl.textContent = message;
        document.body.appendChild(messageEl);

        setTimeout(() => {
            messageEl.classList.add('show');
        }, 100);

        setTimeout(() => {
            messageEl.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(messageEl)) {
                    document.body.removeChild(messageEl);
                }
            }, 300);
        }, 3000);
    }

    getPositionFullName(position) {
        const positions = {
            'GK': 'Goalkeeper',
            'LB': 'Left Back',
            'CB': 'Center Back',
            'RB': 'Right Back',
            'LWB': 'Left Wing Back',
            'RWB': 'Right Wing Back',
            'CDM': 'Defensive Midfielder',
            'CM': 'Central Midfielder',
            'CAM': 'Attacking Midfielder',
            'LW': 'Left Winger',
            'ST': 'Striker',
            'RW': 'Right Winger'
        };
        return positions[position] || position;
    }

    // Surrender functionality
    showSurrenderModal() {
        if (this.gameOver) return;
        this.surrenderModal.style.display = 'flex';
    }

    hideSurrenderModal() {
        this.surrenderModal.style.display = 'none';
    }

    confirmSurrender() {
        console.log('🏳️ Player surrendered');
        this.hideSurrenderModal();
        this.surrendered = true; // Marcar como rendido
        this.endGameWithDefeat();
    }

    endGameWithDefeat() {
        this.gameOver = true;
        this.surrendered = true;

        // Disable input and surrender button
        this.playerInput.disabled = true;
        if (this.surrenderBtn) {
            this.surrenderBtn.disabled = true;
        }

        // Register defeat with daily game manager
        if (window.dailyGameManager) {
            window.dailyGameManager.registerResult(false);
        }

        // Save game state as completed with defeat
        this.saveCompleteGameState(false);

        // Update weekly stats (llamar aunque sea derrota)
        this.updateWeeklyStats(false);

        // Show stats modal after a short delay
        setTimeout(() => {
            this.showStatsModal();
        }, 1000);
    }

    endGameWithVictory() {
        this.gameOver = true;

        // Disable input and surrender button
        this.playerInput.disabled = true;
        if (this.surrenderBtn) {
            this.surrenderBtn.disabled = true;
        }

        // Register victory with daily game manager
        if (window.dailyGameManager) {
            window.dailyGameManager.registerResult(true);
        }

        // Save game state as completed with victory
        this.saveCompleteGameState(true);

        // Update weekly stats
        this.updateWeeklyStats(true);

        // Hide country selector
        const countrySection = document.querySelector('.current-country-section');
        if (countrySection) {
            countrySection.style.display = 'none';
        }

        // Show congratulations modal
        setTimeout(() => {
            this.showStatsModal();
        }, 1500);
    }

    registerGameResult(won) {
        // Register with daily game manager
        if (window.dailyGameManager) {
            window.dailyGameManager.registerResult(won);
        }

        // Save complete game state with extended stats
        this.saveCompleteGameState(won);

        // Update weekly stats
        this.updateWeeklyStats(won);
    }

    loadCompleteGameState() {
        const key = `touch11_legends_${this.colombianDate()}`;
        const saved = localStorage.getItem(key);

        if (saved) {
            const gameState = JSON.parse(saved);
            if (gameState.completed) {
                return gameState;
            }
        }
        return null;
    }

    updateWeeklyStats(won) {
        // Track both wins and participation for weekly distribution
        const now = new Date();
        const colombianNow = new Date(now.getTime() + (-5) * 3.6e6);
        let dayOfWeek = colombianNow.getDay(); // 0 = Sunday, 1 = Monday, etc.

        // Convert to our format: Monday = 1, Sunday = 7
        if (dayOfWeek === 0) dayOfWeek = 7;

        const weekKey = `touch11_legends_week_${dayOfWeek}`;

        if (won) {
            // Only increment wins for weekly stats
            const currentCount = parseInt(localStorage.getItem(weekKey) || '0');
            localStorage.setItem(weekKey, String(currentCount + 1));
        }

        console.log('📊 Updated weekly stats for day', dayOfWeek, 'won:', won);
    }

    getWeeklyStats() {
        const weekStats = [];
        for (let i = 1; i <= 7; i++) {
            const weekKey = `touch11_legends_week_${i}`;
            const count = parseInt(localStorage.getItem(weekKey) || '0');
            weekStats.push(count);
        }
        return weekStats;
    }
    
    getTotalStats() {
        // Get all historical data for legends game
        const allKeys = Object.keys(localStorage).filter(key => 
            key.startsWith('touch11_legends_2') && !key.includes('week')
        );

        let played = 0;
        let wins = 0;
        let currentStreak = 0;
        let maxStreak = 0;
        let lastDate = null;

        // Sort keys by date
        const sortedKeys = allKeys.sort();

        for (const key of sortedKeys) {
            try {
                const gameState = JSON.parse(localStorage.getItem(key));
                if (gameState && gameState.completed) {
                    played++;

                    const gameDate = gameState.date;

                    if (gameState.won) {
                        wins++;
                        // Check if this continues the streak
                        if (lastDate && this.isConsecutiveDay(lastDate, gameDate)) {
                            currentStreak++;
                        } else {
                            currentStreak = 1;
                        }
                        maxStreak = Math.max(maxStreak, currentStreak);
                    } else {
                        // Loss breaks the streak
                        currentStreak = 0;
                    }

                    lastDate = gameDate;
                }
            } catch (error) {
                console.warn('Error parsing game state:', error);
            }
        }

        // If the last game wasn't today and we have a current streak, reset it
        const today = this.colombianDate();
        if (lastDate && lastDate !== today && currentStreak > 0) {
            const daysSince = this.daysDifference(lastDate, today);
            if (daysSince > 1) {
                currentStreak = 0;
            }
        }

        return {
            played,
            wins,
            percentage: played > 0 ? Math.round((wins / played) * 100) : 0,
            currentStreak,
            maxStreak
        };
    }

    isConsecutiveDay(date1, date2) {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        const diffTime = Math.abs(d2 - d1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays === 1;
    }

    daysDifference(date1, date2) {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        const diffTime = Math.abs(d2 - d1);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    showStatsModal() {
        // Get current statistics
        const stats = this.getTotalStats();
        const weekStats = this.getWeeklyStats();

        // Update main stats display
        document.getElementById('statPlayed').textContent = stats.played;
        document.getElementById('statWins').textContent = stats.wins;
        document.getElementById('statPercentage').textContent = stats.percentage + '%';
        document.getElementById('statStreak').textContent = stats.currentStreak;
        document.getElementById('statMaxStreak').textContent = stats.maxStreak;

        // Update weekly distribution bars
        const maxWeekValue = Math.max(...weekStats, 1); // Avoid division by zero
        const today = new Date();
        const colombianToday = new Date(today.getTime() + (-5) * 3.6e6);
        const todayWeekDay = colombianToday.getDay() === 0 ? 7 : colombianToday.getDay();

        for (let i = 1; i <= 7; i++) {
            const bar = document.getElementById(`weekBar${i}`);
            const value = weekStats[i - 1];

            if (bar) {
                // Calculate width as percentage of max value
                const widthPercent = maxWeekValue > 0 ? (value / maxWeekValue) * 100 : 0;
                bar.style.width = Math.max(widthPercent, value > 0 ? 8 : 0) + '%'; // Minimum 8% if has value

                const valueSpan = bar.querySelector('.stats-bar-value');
                if (valueSpan) {
                    valueSpan.textContent = value;
                    valueSpan.style.display = value > 0 ? 'block' : 'none';
                }

                // Highlight today's bar
                if (i === todayWeekDay) {
                    bar.classList.add('highlight-bar');
                } else {
                    bar.classList.remove('highlight-bar');
                }
            }
        }

        // Show modal with animation
        this.statsModal.style.display = 'flex';
        setTimeout(() => {
            this.statsModal.classList.add('show');
        }, 10);
    }

    saveGameProgress() {
        if (this.gameOver) return; // No guardar si el juego ya terminó

        const key = `touch11_legends_progress_${this.colombianDate()}`;
        const progressState = {
            filledPositions: { ...this.filledPositions },
            currentCountryIndex: this.currentCountryIndex,
            currentCountry: this.currentCountry,
            completedPositions: this.completedPositions,
            gameStarted: this.gameStarted,
            formation: this.currentFormation ? this.currentFormation.key : null,
            timestamp: Date.now()
        };

        localStorage.setItem(key, JSON.stringify(progressState));
        console.log('💾 Game progress saved');
    }
    
    loadGameProgress() {
        const key = `touch11_legends_progress_${this.colombianDate()}`;
        const saved = localStorage.getItem(key);

        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (error) {
                console.error('Error loading game progress:', error);
            }
        }
        return null;
    }
    
    clearGameProgress() {
        const key = `touch11_legends_progress_${this.colombianDate()}`;
        localStorage.removeItem(key);
        console.log('🧹 Game progress cleared');
    }
    
    saveCompleteGameState(won) {
        const key = `touch11_legends_${this.colombianDate()}`;
        const gameState = {
            completed: true,
            won: won,
            surrendered: this.surrendered, // Flag de rendición
            date: this.colombianDate(),
            formation: this.currentFormation ? this.currentFormation.key : 'unknown',
            filledPositions: { ...this.filledPositions },
            completedPositions: this.completedPositions,
            timestamp: Date.now()
        };

        localStorage.setItem(key, JSON.stringify(gameState));
        this.clearGameProgress(); // Limpiar progreso cuando se completa
        console.log('💾 Complete game state saved, won:', won, 'surrendered:', this.surrendered);
    }

    checkIfAlreadyPlayed() {
        const key = `touch11_legends_${this.colombianDate()}`;
        const saved = localStorage.getItem(key);

        if (saved) {
            const gameState = JSON.parse(saved);
            if (gameState.completed) {
                return gameState;
            }
        }
        return null;
    }

    hideStatsModal() {
        this.statsModal.classList.remove('show');
        setTimeout(() => {
            this.statsModal.style.display = 'none';
        }, 300);
    }

    colombianDate() {
        const now = new Date();
        const local = new Date(now.getTime() + (-5) * 3.6e6); // Colombia UTC-5
        return local.toISOString().split('T')[0];
    }

}

window.touch11LegendsGame = new Touch11LegendsGame();