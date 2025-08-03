/* dailyGameManager.js - FIXED VERSION */
class DailyGameManager {
  constructor() {
    this.TZ_OFFSET = -5;                     // Colombia (UTC-5)
    this.PREFIX    = 'touch11_';             // Clave común en localStorage
    this.players   = [];                     // Se carga desde wordle.json
  }

  /* ========== FECHA & HORA COLOMBIANA ========== */
  colombianDate() {
    const now   = new Date();
    const local = new Date(now.getTime() + this.TZ_OFFSET * 3.6e6);
    return local.toISOString().split('T')[0];            // "YYYY-MM-DD"
  }

  colombianNow() {
    const now = new Date();
    return new Date(now.getTime() + this.TZ_OFFSET * 3.6e6);
  }

  /* ========== CARGA DE LISTA DE JUGADORES ========== */
  async loadPlayers() {
    if (this.players.length) return;
    try {
      const resp = await fetch('wordle.json');
      const text = await resp.text();                 
      this.players = text.trim().split(/\r?\n/).map(x => x.trim().toUpperCase()).filter(x => x.length > 0);
      console.log('Players loaded:', this.players.length, 'players');
    } catch (err) {
      console.error('No se pudo leer wordle.json', err);
      this.players = ['MESSI', 'RONALDO', 'NEYMAR', 'MBAPPE', 'HAALAND'];   // Fallback
    }
  }

  /* ========== PALABRA DEL DÍA - FIXED ========== */
  async todaysWord() {
    await this.loadPlayers();
    const dateStr = this.colombianDate(); // "YYYY-MM-DD"

    // Create a more reliable seed from date
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
        const char = dateStr.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }

    // Use absolute value and modulo to get index
    const index = Math.abs(hash) % this.players.length;

    console.log(`Daily word selection - Date: ${dateStr}, Hash: ${hash}, Index: ${index}, Players: ${this.players.length}`);
    console.log(`Selected word: ${this.players[index]}`);

    return this.players[index];
  }

  /* ========== IDENTIFICACIÓN DE USUARIO ========== */
  playerId() {
    let id = localStorage.getItem(this.PREFIX + 'pid');
    if (!id) {
      id = 'p_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
      localStorage.setItem(this.PREFIX + 'pid', id);
    }
    return id;
  }

  /* ========== ESTADO DE PARTIDA (autoguardado) ========== */
  keyGame() {
    return `${this.PREFIX}game_${this.playerId()}_${this.colombianDate()}`;
  }

  loadGameState(defaultWord) {
    const raw = localStorage.getItem(this.keyGame());
    return raw ? JSON.parse(raw) : { attempts: [], word: defaultWord, over: false, won: false };
  }

  saveGameState(state) {
    localStorage.setItem(this.keyGame(), JSON.stringify(state));
  }

  /* ========== MARCADOR DIARIO (wins-losses) ========== */
  keyScore(date = this.colombianDate()) { return this.PREFIX + 'score_' + date; }

  loadDailyScore() {
    const raw = localStorage.getItem(this.keyScore());
    return raw ? JSON.parse(raw) : { wins: 0, losses: 0 };
  }

  saveDailyScore(score) {
    localStorage.setItem(this.keyScore(), JSON.stringify(score));
    this.paintScore(score);
  }

  paintScore({wins, losses}) {
    const w = document.querySelector('.daily-score-wins');
    const l = document.querySelector('.daily-score-losses');
    if (w) w.textContent = wins;
    if (l) l.textContent = losses;
  }

  /* ========== ACTUALIZAR RESULTADO DEL JUEGO ========== */
  registerResult(won) {
    const score = this.loadDailyScore();
    won ? score.wins++ : score.losses++;
    this.saveDailyScore(score);
  }

  /* ========== RESETEAR A LAS 00:01 ========== */
  scheduleMidnightReset() {
    const now     = this.colombianNow();
    const nextDay = new Date(now);
    nextDay.setDate(now.getDate() + 1);
    nextDay.setHours(0, 1, 0, 0);
    const ms = nextDay - now;
    setTimeout(() => {
      localStorage.removeItem(this.keyScore(this.colombianDate()));
      location.reload();
    }, ms);
  }

  /* ========== INICIALIZACIÓN ========== */
  async init() {
    await this.loadPlayers();
    this.paintScore(this.loadDailyScore());
    this.scheduleMidnightReset();
  }
}

window.dailyGameManager = new DailyGameManager();