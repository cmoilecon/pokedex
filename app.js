import { pokemons as nationalPokemons } from "./data/national.js";
import { pokemons as letsGoPokemons } from "./data/lets-go-pikachu-eevee.js";
import { pokemons as swordShieldPokemons } from "./data/sword-shield.js";
import { pokemons as isleOfArmorPokemons } from "./data/isle-of-armor.js";
import { pokemons as crownTundraPokemons } from "./data/crown-tundra.js";
import { pokemons as bdspPokemons } from "./data/brilliant-diamond-shining-pearl.js";
import { pokemons as legendsArceusPokemons } from "./data/legends-arceus.js";
import { pokemons as scarletVioletPokemons } from "./data/scarlet-violet.js";
import { pokemons as tealMaskPokemons } from "./data/teal-mask.js";
import { pokemons as indigoDiskPokemons } from "./data/indigo-disk.js";
import { pokemons as legendsZAPokemons } from "./data/legends-z-a.js";
import { pokemons as megaDimensionPokemons } from "./data/mega-dimension.js";
import { games } from "./games.js";

const appTitle = document.querySelector("#appTitle");
const appSubtitle = document.querySelector("#appSubtitle");

const setupView = document.querySelector("#setupView");
const homeView = document.querySelector("#homeView");
const dexView = document.querySelector("#dexView");

const setupProfileName = document.querySelector("#setupProfileName");
const setupDexChoices = document.querySelector("#setupDexChoices");
const setupNationalLinked = document.querySelector("#setupNationalLinked");
const selectAllDexBtn = document.querySelector("#selectAllDexBtn");
const unselectAllDexBtn = document.querySelector("#unselectAllDexBtn");
const createFirstProfileBtn = document.querySelector("#createFirstProfileBtn");

const homeBtn = document.querySelector("#homeBtn");
const profileSelect = document.querySelector("#profileSelect");
const profileSelectLabel = document.querySelector("#profileSelectLabel");
const newProfileBtn = document.querySelector("#newProfileBtn");
const editProfileBtn = document.querySelector("#editProfileBtn");
const exportSaveBtn = document.querySelector("#exportSaveBtn");
const importSaveBtn = document.querySelector("#importSaveBtn");
const deleteProfileBtn = document.querySelector("#deleteProfileBtn");

const homeProfileName = document.querySelector("#homeProfileName");
const gameGrid = document.querySelector("#gameGrid");

const dex = document.querySelector("#dex");
const count = document.querySelector("#count");
const percent = document.querySelector("#percent");
const progressFill = document.querySelector("#progressFill");
const searchInput = document.querySelector("#searchInput");

const langSelect = document.querySelector("#langSelect");
const shinyMode = document.querySelector("#shinyMode");
const darkMode = document.querySelector("#darkMode");
const missingOnlyMode = document.querySelector("#missingOnlyMode");
const hideCompletedDexLabel = document.querySelector("#hideCompletedDexLabel");
const hideCompletedDexMode = document.querySelector("#hideCompletedDexMode");

const checkVisibleBtn = document.querySelector("#checkVisibleBtn");
const uncheckVisibleBtn = document.querySelector("#uncheckVisibleBtn");

const backupModal = document.querySelector("#backupModal");
const backupTitle = document.querySelector("#backupTitle");
const backupText = document.querySelector("#backupText");
const backupArea = document.querySelector("#backupArea");
const copyBackupBtn = document.querySelector("#copyBackupBtn");
const applyBackupBtn = document.querySelector("#applyBackupBtn");
const closeBackupBtn = document.querySelector("#closeBackupBtn");

const PROFILES_KEY = "switch-dex-profiles-v2";
const ACTIVE_PROFILE_KEY = "switch-dex-active-profile-v2";
const HIDE_COMPLETED_DEX_KEY = "switch-dex-hide-completed-v1";

const dexDataMap = {
  national: nationalPokemons,
  "lets-go-pikachu-eevee": letsGoPokemons,
  "sword-shield": swordShieldPokemons,
  "isle-of-armor": isleOfArmorPokemons,
  "crown-tundra": crownTundraPokemons,
  "brilliant-diamond-shining-pearl": bdspPokemons,
  "legends-arceus": legendsArceusPokemons,
  "scarlet-violet": scarletVioletPokemons,
  "teal-mask": tealMaskPokemons,
  "indigo-disk": indigoDiskPokemons,
  "legends-z-a": legendsZAPokemons,
  "mega-dimension": megaDimensionPokemons
};

let profiles = loadProfiles();
let activeProfileId = localStorage.getItem(ACTIVE_PROFILE_KEY);
let currentGameId = null;
let setupMode = "create";

function loadProfiles() {
  return JSON.parse(localStorage.getItem(PROFILES_KEY) || "{}");
}

function saveProfiles() {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}

function saveActiveProfile() {
  if (activeProfileId) {
    localStorage.setItem(ACTIVE_PROFILE_KEY, activeProfileId);
  } else {
    localStorage.removeItem(ACTIVE_PROFILE_KEY);
  }
}

function createIdFromName(name) {
  const base = name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `${base || "profil"}-${Date.now()}`;
}

function getActiveProfile() {
  return profiles[activeProfileId] || null;
}

function getPokemonsForGame(gameId) {
  return dexDataMap[gameId] || [];
}

function getProfileDexState(profile, gameId) {
  if (!profile.dexData) {
    profile.dexData = {};
  }

  if (!profile.dexData[gameId]) {
    profile.dexData[gameId] = {
      obtained: {},
      shinyMode: false,
      shinyLocked: {}
    };
  }

  if (!profile.dexData[gameId].obtained) {
    profile.dexData[gameId].obtained = {};
  }

  if (typeof profile.dexData[gameId].shinyMode !== "boolean") {
    profile.dexData[gameId].shinyMode = false;
  }

  if (!profile.dexData[gameId].shinyLocked) {
    profile.dexData[gameId].shinyLocked = {};
  }

  return profile.dexData[gameId];
}

function getCurrentDexState() {
  const profile = getActiveProfile();

  if (!profile || !currentGameId) {
    return null;
  }

  return getProfileDexState(profile, currentGameId);
}

function getObtained() {
  const state = getCurrentDexState();
  return state?.obtained || {};
}

function saveObtained(obtained) {
  const state = getCurrentDexState();

  if (!state) {
    return;
  }

  state.obtained = obtained;
  saveProfiles();
}

function getShinyLocked() {
  const state = getCurrentDexState();
  return state?.shinyLocked || {};
}

function saveShinyLocked(shinyLocked) {
  const state = getCurrentDexState();

  if (!state) {
    return;
  }

  state.shinyLocked = shinyLocked;
  saveProfiles();
}

function isPokemonShinyLocked(pokemon) {
  const shinyLocked = getShinyLocked();
  return Boolean(shinyLocked[pokemon.id]);
}

function toggleShinyLock(id) {
  const obtained = { ...getObtained() };
  const shinyLocked = { ...getShinyLocked() };

  obtained[id] = true;
  shinyLocked[id] = !shinyLocked[id];

  if (!shinyLocked[id]) {
    delete shinyLocked[id];
  }

  saveObtained(obtained);
  saveShinyLocked(shinyLocked);
  renderDex();
}

function saveCurrentDexShinyMode() {
  const state = getCurrentDexState();

  if (!state) {
    return;
  }

  state.shinyMode = shinyMode.checked;
  saveProfiles();
}

function loadCurrentDexShinyMode() {
  const state = getCurrentDexState();
  shinyMode.checked = Boolean(state?.shinyMode);
}

function getPokemonName(pokemon) {
  const lang = langSelect.value;
  return pokemon.names[lang] || pokemon.names.en;
}

function getImageUrl(pokemon) {
  const obtained = getObtained();
  const isObtained = Boolean(obtained[pokemon.id]);
  const isLocked = isPokemonShinyLocked(pokemon);
  const useShiny = shinyMode.checked && isObtained && !isLocked;
  const form = useShiny ? "shiny" : "normal";
  const imageSlug = pokemon.imageSlug || pokemon.slug;

  return `https://img.pokemondb.net/sprites/home/${form}/${imageSlug}.png`;
}

function getPokemonDbUrl(pokemon) {
  return `https://pokemondb.net/pokedex/${pokemon.slug}`;
}

function isNationalLinked() {
  const profile = getActiveProfile();
  return Boolean(profile?.settings?.nationalLinked);
}

function isPokemonObtained(pokemon) {
  const obtained = getObtained();

  if (currentGameId !== "national" || !isNationalLinked()) {
    return Boolean(obtained[pokemon.id]);
  }

  const profile = getActiveProfile();

  if (!profile) {
    return false;
  }

  for (const gameId of profile.enabledDexes) {
    if (gameId === "national") continue;

    const pokemons = getPokemonsForGame(gameId);
    const state = getProfileDexState(profile, gameId);
    const gameObtained = state.obtained || {};
    const samePokemon = pokemons.find(p => p.slug === pokemon.slug);

    if (samePokemon && gameObtained[samePokemon.id]) {
      return true;
    }
  }

  return Boolean(obtained[pokemon.id]);
}

function getFilteredPokemons() {
  const search = searchInput.value.trim().toLowerCase();
  const pokemons = getPokemonsForGame(currentGameId);

  return pokemons.filter(pokemon => {
    const isObtained = isPokemonObtained(pokemon);

    if (missingOnlyMode.checked && isObtained) {
      return false;
    }

    const id = String(pokemon.id).padStart(3, "0");
    const frName = pokemon.names.fr.toLowerCase();
    const enName = pokemon.names.en.toLowerCase();
    const currentName = getPokemonName(pokemon).toLowerCase();

    return (
      id.includes(search) ||
      frName.includes(search) ||
      enName.includes(search) ||
      currentName.includes(search)
    );
  });
}

function calculateGameProgress(profile, gameId) {
  const pokemons = getPokemonsForGame(gameId);
  const state = getProfileDexState(profile, gameId);
  const obtained = state.obtained || {};
  const total = pokemons.length;

  let done = 0;

  for (const pokemon of pokemons) {
    if (gameId === "national" && profile.settings?.nationalLinked) {
      const previousGameId = currentGameId;
      currentGameId = "national";

      if (isPokemonObtained(pokemon)) {
        done++;
      }

      currentGameId = previousGameId;
    } else if (obtained[pokemon.id]) {
      done++;
    }
  }

  const completion = total === 0 ? 0 : Math.round((done / total) * 100);

  return {
    total,
    done,
    completion
  };
}

function updateStats() {
  const profile = getActiveProfile();

  if (!profile || !currentGameId) {
    return;
  }

  const progress = calculateGameProgress(profile, currentGameId);

  count.textContent = `${progress.done} / ${progress.total}`;
  percent.textContent = `${progress.completion}%`;
  progressFill.style.width = `${progress.completion}%`;
}

function togglePokemon(id) {
  const obtained = { ...getObtained() };
  const shinyLocked = { ...getShinyLocked() };

  obtained[id] = !obtained[id];

  if (!obtained[id]) {
    delete obtained[id];
    delete shinyLocked[id];
  }

  saveObtained(obtained);
  saveShinyLocked(shinyLocked);
  renderDex();
}

function toggleFamily(family) {
  const pokemons = getPokemonsForGame(currentGameId);
  const obtained = { ...getObtained() };
  const familyPokemons = pokemons.filter(pokemon => pokemon.family === family);
  const allObtained = familyPokemons.every(pokemon => obtained[pokemon.id]);

  for (const pokemon of familyPokemons) {
    if (allObtained) {
      delete obtained[pokemon.id];
    } else {
      obtained[pokemon.id] = true;
    }
  }

  saveObtained(obtained);
  renderDex();
}

function showView(view) {
  setupView.classList.add("hidden");
  homeView.classList.add("hidden");
  dexView.classList.add("hidden");

  view.classList.remove("hidden");
}

function updateTopbarVisibility(mode) {
  const dexOnlyControls = [
    langSelect.closest("label"),
    shinyMode.closest("label"),
    missingOnlyMode.closest("label"),
    checkVisibleBtn,
    uncheckVisibleBtn
  ];

  for (const element of dexOnlyControls) {
    element.style.display = mode === "dex" ? "" : "none";
  }

  hideCompletedDexLabel.style.display = mode === "home" ? "" : "none";

  homeBtn.style.display = mode === "setup" ? "none" : "";
  profileSelectLabel.style.display = mode === "setup" ? "none" : "";
  newProfileBtn.style.display = mode === "setup" ? "none" : "";
  editProfileBtn.style.display = mode === "setup" ? "none" : "";
  exportSaveBtn.style.display = mode === "setup" ? "none" : "";
  importSaveBtn.style.display = mode === "setup" ? "none" : "";
  deleteProfileBtn.style.display = mode === "setup" ? "none" : "";
}

function renderProfileSelect() {
  profileSelect.innerHTML = "";

  for (const profile of Object.values(profiles)) {
    const option = document.createElement("option");
    option.value = profile.id;
    option.textContent = profile.name;
    option.selected = profile.id === activeProfileId;
    profileSelect.appendChild(option);
  }
}

function renderSetupDexChoices(selectedDexes = []) {
  setupDexChoices.innerHTML = "";

  const selected = new Set(selectedDexes);

  for (const game of games) {
    const label = document.createElement("label");
    label.className = "dex-choice";

    label.innerHTML = `
      <input type="checkbox" value="${game.id}" ${selected.has(game.id) ? "checked" : ""}>
      ${game.name}
    `;

    setupDexChoices.appendChild(label);
  }
}

function getSelectedSetupDexes() {
  return [...setupDexChoices.querySelectorAll("input:checked")]
    .map(input => input.value);
}

function getGameSpritePreview(gameId) {
  const game = games.find(game => game.id === gameId);
  const pokemons = getPokemonsForGame(gameId);

  let previewPokemons = [];

  if (game?.coverPokemonIds?.length) {
    previewPokemons = game.coverPokemonIds
      .map(id => pokemons.find(pokemon => pokemon.id === id))
      .filter(Boolean);
  }

  if (previewPokemons.length < 3) {
    previewPokemons = [
      pokemons.find(pokemon => pokemon.id === 1),
      pokemons.find(pokemon => pokemon.id === 4),
      pokemons.find(pokemon => pokemon.id === 7)
    ].filter(Boolean);
  }

  if (previewPokemons.length < 3) {
    previewPokemons = pokemons.slice(0, 3);
  }

  return previewPokemons.map(pokemon => {
    const imageSlug = pokemon.imageSlug || pokemon.slug;

    return `
      <img
        src="https://img.pokemondb.net/sprites/home/normal/${imageSlug}.png"
        alt="${pokemon.names.fr}"
        loading="lazy"
      >
    `;
  }).join("");
}

function renderHome() {
  const profile = getActiveProfile();

  if (!profile) {
    return;
  }

  currentGameId = null;
  profile.lastView = "home";
  saveProfiles();

  appTitle.textContent = "Dex Switch";
  appSubtitle.textContent = "Menu des Pokédex";
  homeProfileName.textContent = `Profil : ${profile.name}`;

  renderProfileSelect();

  gameGrid.innerHTML = "";

  for (const game of games) {
    if (!profile.enabledDexes.includes(game.id)) continue;

    const progress = calculateGameProgress(profile, game.id);

    if (hideCompletedDexMode.checked && progress.completion === 100) {
      continue;
    }

    const card = document.createElement("article");
    card.className = "game-card";

    card.innerHTML = `
      <div class="game-sprites">
        ${getGameSpritePreview(game.id)}
      </div>

      <div class="game-content">
        <h3>${game.name}</h3>
        <p>${game.subtitle}</p>

        <div class="game-progress-info">
          <span>${progress.done} / ${progress.total}</span>
          <strong>${progress.completion}%</strong>
        </div>

        <div class="game-progress">
          <div class="game-progress-fill" style="width: ${progress.completion}%"></div>
        </div>
      </div>
    `;

    card.addEventListener("click", () => {
      openDex(game.id);
    });

    gameGrid.appendChild(card);
  }

  updateTopbarVisibility("home");
  showView(homeView);
}

function openDex(gameId) {
  const profile = getActiveProfile();
  const game = games.find(game => game.id === gameId);

  if (!profile || !game) {
    return;
  }

  currentGameId = gameId;
  profile.lastView = "dex";
  profile.lastDex = gameId;
  saveProfiles();

  loadCurrentDexShinyMode();

  searchInput.value = "";

  appTitle.textContent = `Dex — ${game.shortName}`;
  appSubtitle.textContent = game.subtitle;

  updateTopbarVisibility("dex");
  showView(dexView);
  renderDex();
}

function renderDex() {
  dex.innerHTML = "";

  const filteredPokemons = getFilteredPokemons();

  for (const pokemon of filteredPokemons) {
    const isObtained = isPokemonObtained(pokemon);
    const isLocked = isPokemonShinyLocked(pokemon);
    const name = getPokemonName(pokemon);

    const card = document.createElement("article");
    card.className = `card ${isObtained ? "obtained" : ""} ${isLocked && shinyMode.checked ? "shiny-locked" : ""}`;

    card.innerHTML = `
      <div class="image-zone">
        <img src="${getImageUrl(pokemon)}" alt="${name}" loading="lazy">
      </div>

      <div class="info-zone">
        <div class="number">${String(pokemon.id).padStart(3, "0")}</div>
        <div class="name">${name}</div>
        <div class="check">${isObtained ? (isLocked && shinyMode.checked ? "🔒" : "✅") : "☐"}</div>
      </div>

      <div class="card-actions">
        <a class="info-link" href="${getPokemonDbUrl(pokemon)}" target="_blank" rel="noopener noreferrer">
          Infos ↗
        </a>

        ${
          shinyMode.checked && isObtained
            ? `<button class="lock-btn ${isLocked ? "active" : ""}" type="button">
                ${isLocked ? "🔒 Shiny Lock" : "🔓 Shiny Lock"}
              </button>`
            : ""
        }
      </div>
    `;

    const lockBtn = card.querySelector(".lock-btn");

    if (lockBtn) {
      lockBtn.addEventListener("click", event => {
        event.stopPropagation();
        toggleShinyLock(pokemon.id);
      });
    }

    let clickTimer;

    card.addEventListener("click", event => {
      if (event.target.closest("a") || event.target.closest("button")) return;

      clearTimeout(clickTimer);

      clickTimer = setTimeout(() => {
        togglePokemon(pokemon.id);
      }, 220);
    });

    card.addEventListener("dblclick", event => {
      if (event.target.closest("a") || event.target.closest("button")) return;

      clearTimeout(clickTimer);
      toggleFamily(pokemon.family);
    });

    dex.appendChild(card);
  }

  updateStats();
}

function createProfile(name, enabledDexes, nationalLinked = false) {
  const id = createIdFromName(name);
  const dexData = {};

  for (const gameId of enabledDexes) {
    dexData[gameId] = {
      obtained: {},
      shinyMode: false,
      shinyLocked: {}
    };
  }

  profiles[id] = {
    id,
    name,
    enabledDexes,
    lastView: "dex",
    lastDex: enabledDexes[0],
    settings: {
      nationalLinked
    },
    dexData
  };

  activeProfileId = id;
  saveProfiles();
  saveActiveProfile();

  return profiles[id];
}

function updateProfileDexes(enabledDexes, nationalLinked) {
  const profile = getActiveProfile();

  if (!profile) {
    return;
  }

  profile.enabledDexes = enabledDexes;

  if (!profile.settings) {
    profile.settings = {};
  }

  profile.settings.nationalLinked = nationalLinked;

  if (!profile.dexData) {
    profile.dexData = {};
  }

  for (const gameId of enabledDexes) {
    getProfileDexState(profile, gameId);
  }

  if (!profile.enabledDexes.includes(profile.lastDex)) {
    profile.lastDex = profile.enabledDexes[0];
  }

  if (!profile.enabledDexes.includes(currentGameId)) {
    currentGameId = profile.lastDex;
  }

  saveProfiles();
}

function showSetupCreate() {
  setupMode = "create";

  appTitle.textContent = "Dex Switch";
  appSubtitle.textContent = "Création d'un profil";

  setupProfileName.value = "";
  setupProfileName.disabled = false;
  setupNationalLinked.checked = false;
  createFirstProfileBtn.textContent = "Créer le profil";

  renderSetupDexChoices([]);

  updateTopbarVisibility("setup");
  showView(setupView);
}

function showSetupEdit() {
  const profile = getActiveProfile();

  if (!profile) {
    return;
  }

  setupMode = "edit";

  appTitle.textContent = "Dex Switch";
  appSubtitle.textContent = `Modification du profil ${profile.name}`;

  setupProfileName.value = profile.name;
  setupProfileName.disabled = true;
  setupNationalLinked.checked = Boolean(profile.settings?.nationalLinked);
  createFirstProfileBtn.textContent = "Enregistrer les modifications";

  renderSetupDexChoices(profile.enabledDexes);

  updateTopbarVisibility("setup");
  showView(setupView);
}

function deleteActiveProfile() {
  const profile = getActiveProfile();

  if (!profile) {
    return;
  }

  const ok = confirm(`Supprimer le profil "${profile.name}" ?`);

  if (!ok) {
    return;
  }

  delete profiles[profile.id];

  const remaining = Object.values(profiles);

  if (remaining.length === 0) {
    activeProfileId = null;
    currentGameId = null;
    saveActiveProfile();
    saveProfiles();
    showSetupCreate();
    return;
  }

  activeProfileId = remaining[0].id;
  saveActiveProfile();
  saveProfiles();
  goToLastPlaceForActiveProfile();
}

function syncProfilesWithGames() {
  const gameIds = games.map(game => game.id);

  for (const profile of Object.values(profiles)) {
    if (!Array.isArray(profile.enabledDexes)) {
      profile.enabledDexes = [];
    }

    if (!profile.settings) {
      profile.settings = {
        nationalLinked: false
      };
    }

    if (!profile.dexData) {
      profile.dexData = {};
    }

    for (const gameId of profile.enabledDexes) {
      getProfileDexState(profile, gameId);
    }

    if (!profile.lastView) {
      profile.lastView = "dex";
    }

    if (!profile.lastDex || !gameIds.includes(profile.lastDex)) {
      profile.lastDex = profile.enabledDexes[0] || gameIds[0];
    }

    if (profile.lastView === "dex" && !profile.enabledDexes.includes(profile.lastDex)) {
      profile.lastDex = profile.enabledDexes[0];
    }

    if (!profile.lastDex) {
      profile.lastView = "home";
    }
  }

  saveProfiles();
}

function loadGlobalSettings() {
  const savedDark = localStorage.getItem("swsh-dex-dark-v1");
  const savedLang = localStorage.getItem("swsh-dex-lang-v1");
  const savedMissingOnly = localStorage.getItem("swsh-dex-missing-only-v1");
  const savedHideCompleted = localStorage.getItem(HIDE_COMPLETED_DEX_KEY);

  darkMode.checked = savedDark === "1";
  document.body.classList.toggle("dark", darkMode.checked);

  missingOnlyMode.checked = savedMissingOnly === "1";
  hideCompletedDexMode.checked = savedHideCompleted === "1";

  if (savedLang === "fr" || savedLang === "en") {
    langSelect.value = savedLang;
  }
}

function saveGlobalSetting(key, value) {
  localStorage.setItem(key, value);
}

function goToLastPlaceForActiveProfile() {
  const profile = getActiveProfile();

  if (!profile) {
    showSetupCreate();
    return;
  }

  renderProfileSelect();

  if (profile.lastView === "home") {
    renderHome();
    return;
  }

  if (profile.lastDex && profile.enabledDexes.includes(profile.lastDex)) {
    openDex(profile.lastDex);
    return;
  }

  renderHome();
}

/* BACKUP */

function getBackupData() {
  return {
    app: "dex-switch",
    version: 1,
    exportedAt: new Date().toISOString(),
    activeProfileId,
    profiles,
    globalSettings: {
      dark: localStorage.getItem("swsh-dex-dark-v1") || "0",
      lang: localStorage.getItem("swsh-dex-lang-v1") || "fr",
      missingOnly: localStorage.getItem("swsh-dex-missing-only-v1") || "0",
      hideCompletedDex: localStorage.getItem(HIDE_COMPLETED_DEX_KEY) || "0"
    }
  };
}

function validateBackupData(data) {
  return (
    data &&
    typeof data === "object" &&
    data.app === "dex-switch" &&
    data.profiles &&
    typeof data.profiles === "object"
  );
}

function openBackupExport() {
  const backup = getBackupData();

  backupTitle.textContent = "Exporter la sauvegarde";
  backupText.textContent = "Copie ce JSON et garde-le quelque part. Tu peux aussi te l'envoyer sur téléphone.";
  backupArea.value = JSON.stringify(backup, null, 2);

  copyBackupBtn.style.display = "";
  applyBackupBtn.style.display = "none";

  backupModal.classList.remove("hidden");
  backupArea.focus();
  backupArea.select();
}

function openBackupImport() {
  backupTitle.textContent = "Importer une sauvegarde";
  backupText.textContent = "Colle ici le JSON exporté depuis ton Dex, puis clique sur Importer.";
  backupArea.value = "";

  copyBackupBtn.style.display = "none";
  applyBackupBtn.style.display = "";

  backupModal.classList.remove("hidden");
  backupArea.focus();
}

function closeBackupModal() {
  backupModal.classList.add("hidden");
  backupArea.value = "";
}

async function copyBackupText() {
  try {
    await navigator.clipboard.writeText(backupArea.value);
    alert("Sauvegarde copiée !");
  } catch {
    backupArea.focus();
    backupArea.select();
    alert("Copie manuelle : Ctrl + C.");
  }
}

function applyBackupImport() {
  try {
    const data = JSON.parse(backupArea.value);

    if (!validateBackupData(data)) {
      alert("JSON invalide : ce n'est pas une sauvegarde Dex Switch.");
      return;
    }

    const ok = confirm(
      "Importer cette sauvegarde ?\n\n" +
      "Attention : ça va remplacer les profils actuels."
    );

    if (!ok) {
      return;
    }

    profiles = data.profiles;

    if (data.activeProfileId && profiles[data.activeProfileId]) {
      activeProfileId = data.activeProfileId;
    } else {
      activeProfileId = Object.values(profiles)[0]?.id || null;
    }

    if (data.globalSettings) {
      if (data.globalSettings.dark === "0" || data.globalSettings.dark === "1") {
        localStorage.setItem("swsh-dex-dark-v1", data.globalSettings.dark);
      }

      if (data.globalSettings.lang === "fr" || data.globalSettings.lang === "en") {
        localStorage.setItem("swsh-dex-lang-v1", data.globalSettings.lang);
      }

      if (data.globalSettings.missingOnly === "0" || data.globalSettings.missingOnly === "1") {
        localStorage.setItem("swsh-dex-missing-only-v1", data.globalSettings.missingOnly);
      }

      if (data.globalSettings.hideCompletedDex === "0" || data.globalSettings.hideCompletedDex === "1") {
        localStorage.setItem(HIDE_COMPLETED_DEX_KEY, data.globalSettings.hideCompletedDex);
      }
    }

    saveProfiles();
    saveActiveProfile();

    loadGlobalSettings();
    syncProfilesWithGames();

    closeBackupModal();

    alert("Sauvegarde importée !");
    goToLastPlaceForActiveProfile();
  } catch {
    alert("Impossible de lire ce JSON.");
  }
}

/* LISTENERS */

createFirstProfileBtn.addEventListener("click", () => {
  const enabledDexes = getSelectedSetupDexes();

  if (enabledDexes.length === 0) {
    alert("Choisis au moins un Dex.");
    return;
  }

  if (setupMode === "create") {
    const name = setupProfileName.value.trim();

    if (!name) {
      alert("Entre un nom de profil.");
      return;
    }

    const profile = createProfile(name, enabledDexes, setupNationalLinked.checked);
    openDex(profile.lastDex);
    return;
  }

  if (setupMode === "edit") {
    updateProfileDexes(enabledDexes, setupNationalLinked.checked);
    renderHome();
  }
});

selectAllDexBtn.addEventListener("click", () => {
  for (const input of setupDexChoices.querySelectorAll("input[type='checkbox']")) {
    input.checked = true;
  }
});

unselectAllDexBtn.addEventListener("click", () => {
  for (const input of setupDexChoices.querySelectorAll("input[type='checkbox']")) {
    input.checked = false;
  }
});

homeBtn.addEventListener("click", renderHome);

profileSelect.addEventListener("change", () => {
  activeProfileId = profileSelect.value;
  saveActiveProfile();
  goToLastPlaceForActiveProfile();
});

newProfileBtn.addEventListener("click", showSetupCreate);
editProfileBtn.addEventListener("click", showSetupEdit);
exportSaveBtn.addEventListener("click", openBackupExport);
importSaveBtn.addEventListener("click", openBackupImport);
deleteProfileBtn.addEventListener("click", deleteActiveProfile);

copyBackupBtn.addEventListener("click", copyBackupText);
applyBackupBtn.addEventListener("click", applyBackupImport);
closeBackupBtn.addEventListener("click", closeBackupModal);

backupModal.addEventListener("click", event => {
  if (event.target === backupModal) {
    closeBackupModal();
  }
});

searchInput.addEventListener("input", renderDex);

langSelect.addEventListener("change", () => {
  saveGlobalSetting("swsh-dex-lang-v1", langSelect.value);

  if (currentGameId) {
    renderDex();
  } else {
    renderHome();
  }
});

shinyMode.addEventListener("change", () => {
  saveCurrentDexShinyMode();
  renderDex();
});

darkMode.addEventListener("change", () => {
  document.body.classList.toggle("dark", darkMode.checked);
  saveGlobalSetting("swsh-dex-dark-v1", darkMode.checked ? "1" : "0");
});

missingOnlyMode.addEventListener("change", () => {
  saveGlobalSetting("swsh-dex-missing-only-v1", missingOnlyMode.checked ? "1" : "0");

  if (currentGameId) {
    renderDex();
  }
});

hideCompletedDexMode.addEventListener("change", () => {
  localStorage.setItem(HIDE_COMPLETED_DEX_KEY, hideCompletedDexMode.checked ? "1" : "0");
  renderHome();
});

checkVisibleBtn.addEventListener("click", () => {
  const visible = getFilteredPokemons();
  const obtained = { ...getObtained() };

  for (const pokemon of visible) {
    obtained[pokemon.id] = true;
  }

  saveObtained(obtained);
  renderDex();
});

uncheckVisibleBtn.addEventListener("click", () => {
  const visible = getFilteredPokemons();
  const obtained = { ...getObtained() };

  for (const pokemon of visible) {
    delete obtained[pokemon.id];
  }

  saveObtained(obtained);
  renderDex();
});

function init() {
  loadGlobalSettings();

  profiles = loadProfiles();
  syncProfilesWithGames();

  const hasProfiles = Object.keys(profiles).length > 0;

  if (!hasProfiles) {
    showSetupCreate();
    return;
  }

  if (!activeProfileId || !profiles[activeProfileId]) {
    activeProfileId = Object.values(profiles)[0].id;
    saveActiveProfile();
  }

  goToLastPlaceForActiveProfile();
}

init();