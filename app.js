import { pokemons as nationalPokemons } from "./data/national.js";

import { pokemons as letsGoPokemons } from "./data/switch/lets-go-pikachu-eevee.js";
import { pokemons as swordShieldPokemons } from "./data/switch/sword-shield.js";
import { pokemons as isleOfArmorPokemons } from "./data/switch/isle-of-armor.js";
import { pokemons as crownTundraPokemons } from "./data/switch/crown-tundra.js";
import { pokemons as bdspPokemons } from "./data/switch/brilliant-diamond-shining-pearl.js";
import { pokemons as legendsArceusPokemons } from "./data/switch/legends-arceus.js";
import { pokemons as scarletVioletPokemons } from "./data/switch/scarlet-violet.js";
import { pokemons as tealMaskPokemons } from "./data/switch/teal-mask.js";
import { pokemons as indigoDiskPokemons } from "./data/switch/indigo-disk.js";
import { pokemons as legendsZAPokemons } from "./data/switch/legends-z-a.js";
import { pokemons as megaDimensionPokemons } from "./data/switch/mega-dimension.js";

import { pokemons as XYPokemons } from "./data/3ds/x-y.js";
import { pokemons as RoSaPokemons } from "./data/3ds/omega-ruby-alpha-sapphire.js";
import { pokemons as SLPokemons } from "./data/3ds/sun-moon.js";
import { pokemons as UsUlPokemons } from "./data/3ds/ultra-sun-ultra-moon.js";

import { pokemons as DiamondPearlPokemons } from "./data/ds/diamond-pearl.js";
import { pokemons as PlatinumPokemons } from "./data/ds/platinum.js";
import { pokemons as HgssPokemons } from "./data/ds/heartgold-soulsilver.js";
import { pokemons as BlackWhitePokemons } from "./data/ds/black-white.js";
import { pokemons as Black2White2Pokemons } from "./data/ds/black-white-2.js";

import { games } from "./games.js";

const DEBUG_MODE = localStorage.getItem("dex-debug-enabled-v1") === "1";
const SHORTCUTS_MODE = true;

const STORAGE_KEYS = {
  profiles: "switch-dex-profiles-v2",
  activeProfile: "switch-dex-active-profile-v2",
  dark: "swsh-dex-dark-v1",
  lang: "swsh-dex-lang-v1",
  missingOnly: "swsh-dex-missing-only-v1",
  favoritesOnly: "dex-favorites-only-v1",
  hideCompletedDex: "switch-dex-hide-completed-v1",
  shortcutsVisible: "dex-switch-shortcuts-visible-v1",
  sound: "dex-sound-enabled-v1",
  sortMode: "dex-sort-mode-v1",
  generationFilter: "dex-generation-filter-v1",
  debugEnabled: "dex-debug-enabled-v1",
  pokemonCardV2: "dex-pokemon-card-v2-v1"
};

const dexDataMap = {
  national: nationalPokemons,
  //switch
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
  "mega-dimension": megaDimensionPokemons,
  //3ds
  "x-y": XYPokemons,
  "omega-ruby-alpha-sapphire": RoSaPokemons,
  "sun-moon": SLPokemons,
  "ultra-sun-ultra-moon": UsUlPokemons,
  //ds
  "diamond-pearl": DiamondPearlPokemons,
  "platinum": PlatinumPokemons,
  "heartgold-soulsilver": HgssPokemons,
  "black-white": BlackWhitePokemons,
  "black-white-2": Black2White2Pokemons
};

const TYPE_LABELS_FR = {
  normal: "Normal",
  fire: "Feu",
  water: "Eau",
  electric: "Électrik",
  grass: "Plante",
  ice: "Glace",
  fighting: "Combat",
  poison: "Poison",
  ground: "Sol",
  flying: "Vol",
  psychic: "Psy",
  bug: "Insecte",
  rock: "Roche",
  ghost: "Spectre",
  dragon: "Dragon",
  dark: "Ténèbres",
  steel: "Acier",
  fairy: "Fée"
};

const TYPE_ORDER = [
  "normal", "fire", "water", "electric", "grass", "ice",
  "fighting", "poison", "ground", "flying", "psychic", "bug",
  "rock", "ghost", "dragon", "dark", "steel", "fairy"
];

const TYPE_ICON_SVGS = {
  all: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5l1.9 4.6 4.6 1.9-4.6 1.9-1.9 4.6-1.9-4.6-4.6-1.9 4.6-1.9L12 3.5zm6.4 11.8.8 2 .8-2 2-.8-2-.8-.8-2-.8 2-2 .8 2 .8z" fill="currentColor"/></svg>`,
  normal: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.5" fill="currentColor"/></svg>`,
  fire: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.6 2.8c.2 1.9-.2 3.2-1 4.2-.9 1.1-1.3 1.9-1.1 3 .9-.4 1.7-1.2 2.3-2.3 2 1.4 3.4 3.5 3.4 6 0 3.9-3.1 7-7 7s-7-3.1-7-7c0-3 1.6-4.8 3.6-6.9C8.5 5.5 9.5 4.1 10 2.8c1.5.8 2.7 2.2 3 4 .4-.8.6-2 .6-4z" fill="currentColor"/></svg>`,
  water: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2c3 4 5.4 6.9 5.4 10a5.4 5.4 0 11-10.8 0c0-3.1 2.4-6 5.4-10z" fill="currentColor"/></svg>`,
  electric: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.7 2.5L6.8 13h4.5L9.8 21.5 17.2 10H13l.7-7.5z" fill="currentColor"/></svg>`,
  grass: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.8 5.2c-5 .1-8.7 1.6-11.1 4.4-1.8 2.2-2.4 4.9-2.4 7.2 2.7 0 5.1-.8 7.1-2.5 3-2.4 4.8-6.1 5.2-10.9l1.2 1.8z" fill="currentColor"/><path d="M6.8 18.4c2.7-3 6.1-5.3 10.3-6.9" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  ice: `<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 4v16M5 8l14 8M5 16l14-8"/><path d="M12 4l-1.8 1.8M12 4l1.8 1.8M12 20l-1.8-1.8M12 20l1.8-1.8M5 8l2.4.5M5 8l.6-2.4M19 16l-2.4-.5M19 16l-.6 2.4M5 16l2.4-.5M5 16l.6 2.4M19 8l-2.4.5M19 8l-.6-2.4"/></g></svg>`,
  fighting: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 9V6.8c0-1.1.9-2 2-2h1.2V8h1.6V5.4H14c1.1 0 2 .9 2 2V9h1c1.1 0 2 .9 2 2v4.2c0 1.6-1.2 2.8-2.8 2.8H8.4c-1.5 0-2.7-1.2-2.7-2.7V11c0-1.1.9-2 2-2H8z" fill="currentColor"/></svg>`,
  poison: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4h6v2l-1.6 1.7a5.8 5.8 0 013.9 5.5A5.8 5.8 0 0111.5 19 5.8 5.8 0 016 13.2c0-2.3 1.3-4.4 3.4-5.4L9 6V4zm1.5 7.1a1.1 1.1 0 100 2.2 1.1 1.1 0 000-2.2zm3 0a1.1 1.1 0 100 2.2 1.1 1.1 0 000-2.2zm-3.6 4c.6.7 1.3 1 2.1 1 .8 0 1.5-.3 2.1-1" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  ground: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 14.8l4.2-5.1h10.8l-4.2 5.1H4.5z" fill="currentColor"/></svg>`,
  flying: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 14.2c4.5-4 9.2-5.8 16-6.2-3 2-5.2 4.6-6.8 7.8-1.5-1.4-3.4-2.4-5.7-3-1 .5-2 1-3.5 1.4z" fill="currentColor"/></svg>`,
  psychic: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 6c4.7 0 8.2 2.8 10 6-1.8 3.2-5.3 6-10 6S3.8 15.2 2 12c1.8-3.2 5.3-6 10-6zm0 3.2a2.8 2.8 0 100 5.6 2.8 2.8 0 000-5.6z" fill="currentColor"/></svg>`,
  bug: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7.5c2.4 0 4.3 1.9 4.3 4.3v4c0 2.2-1.8 4-4 4h-.6c-2.2 0-4-1.8-4-4v-4c0-2.4 1.9-4.3 4.3-4.3zm0-3.3c1.2 0 2.2 1 2.2 2.2v.2H9.8v-.2c0-1.2 1-2.2 2.2-2.2z" fill="currentColor"/><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M8.5 9.2L5.5 7.5M15.5 9.2l3-1.7M7.8 13H4.8M19.2 13h-3M8.4 16.5l-2.7 2M15.6 16.5l2.7 2"/></g></svg>`,
  rock: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4.2l6.4 4.6-2.4 8H8L5.6 8.8 12 4.2z" fill="currentColor"/></svg>`,
  ghost: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4.8c-3.9 0-6.8 2.9-6.8 6.8v6.6l2-1.4 1.8 1.4 2-1.4 2 1.4 1.8-1.4 2 1.4v-6.6c0-3.9-2.9-6.8-6.8-6.8zm-2.2 6.1a1.1 1.1 0 110 2.2 1.1 1.1 0 010-2.2zm4.4 0a1.1 1.1 0 110 2.2 1.1 1.1 0 010-2.2z" fill="currentColor"/></svg>`,
  dragon: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.8l6.2 6.2L12 20.2 5.8 10 12 3.8z" fill="currentColor"/></svg>`,
  dark: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.9 4.6a7.8 7.8 0 100 14.8A8.8 8.8 0 0110 4.6a7.7 7.7 0 015.9 0z" fill="currentColor"/></svg>`,
  steel: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4l6.9 4v8L12 20l-6.9-4V8L12 4zm0 4.2L8.7 10v4L12 15.8 15.3 14v-4L12 8.2z" fill="currentColor"/></svg>`,
  fairy: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5l1.8 4.4 4.7 1.8-4.7 1.9-1.8 4.4-1.8-4.4-4.7-1.9 4.7-1.8L12 3.5zm0 8.8l1 2.4 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1 1-2.4z" fill="currentColor"/></svg>`
};

const GENERATION_LABELS = {
  1: "Gen 1",
  2: "Gen 2",
  3: "Gen 3",
  4: "Gen 4",
  5: "Gen 5",
  6: "Gen 6",
  7: "Gen 7",
  8: "Gen 8",
  9: "Gen 9"
};

function getTypeLabel(type) {
  return TYPE_LABELS_FR[type] || type;
}

function normalizeTypeKey(value) {
  const clean = String(value || "").trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

  return TYPE_ORDER.find(type => {
    const label = getTypeLabel(type).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    return type === clean || label === clean;
  }) || null;
}

function getTypeIconMarkup(type, extraClass = "") {
  const key = type === "all" ? "all" : normalizeTypeKey(type);
  const svg = TYPE_ICON_SVGS[key] || TYPE_ICON_SVGS.all;
  const typeClass = key ? ` type-${key}` : "";
  return `<span class="type-icon-badge${typeClass}${extraClass ? ` ${extraClass}` : ""}" aria-hidden="true">${svg}</span>`;
}

let typeFilterPickerReady = false;

function closeTypeFilterPicker() {
  const label = ui.typeFilterLabel;
  if (!label) return;
  label.classList.remove("type-picker-open");
}

function ensureTypeFilterPicker() {
  const label = ui.typeFilterLabel;
  const select = ui.typeFilterSelect;
  if (!label || !select || typeFilterPickerReady) return;

  label.classList.add("type-picker");
  select.classList.add("type-picker-native");

  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.id = "typeFilterTrigger";
  trigger.className = "btn type-picker-trigger";
  trigger.setAttribute("aria-haspopup", "dialog");
  trigger.setAttribute("aria-expanded", "false");

  const menu = document.createElement("div");
  menu.id = "typeFilterMenu";
  menu.className = "type-picker-menu";

  label.appendChild(trigger);
  label.appendChild(menu);

  trigger.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();
    const willOpen = !label.classList.contains("type-picker-open");
    document.querySelectorAll(".type-picker.type-picker-open").forEach(node => {
      if (node !== label) node.classList.remove("type-picker-open");
    });
    label.classList.toggle("type-picker-open", willOpen);
    trigger.setAttribute("aria-expanded", willOpen ? "true" : "false");
  });

  document.addEventListener("click", event => {
    if (!label.contains(event.target)) {
      closeTypeFilterPicker();
      trigger.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeTypeFilterPicker();
      trigger.setAttribute("aria-expanded", "false");
    }
  });

  typeFilterPickerReady = true;
}

function syncTypeFilterPicker(orderedTypes) {
  ensureTypeFilterPicker();

  const label = ui.typeFilterLabel;
  const select = ui.typeFilterSelect;
  const trigger = document.querySelector("#typeFilterTrigger");
  const menu = document.querySelector("#typeFilterMenu");

  if (!label || !select || !trigger || !menu) return;

  const currentType = select.value || "all";
  const currentLabel = currentType === "all" ? "Tous" : getTypeLabel(currentType);

  trigger.innerHTML = `
    <span class="type-picker-current">${getTypeIconMarkup(currentType, "type-picker-current-icon")}<span class="type-picker-current-text">${escapeHtml(currentLabel)}</span></span>
    <span class="type-picker-caret" aria-hidden="true">▾</span>
  `;
  trigger.setAttribute("aria-expanded", label.classList.contains("type-picker-open") ? "true" : "false");

  const items = ["all", ...orderedTypes];

  menu.innerHTML = `
    <div class="type-picker-popover">
      <div class="type-picker-top-row">
        ${renderTypePickerItem("all", currentType === "all")}
      </div>
      <div class="type-picker-grid">
        ${orderedTypes.map(type => renderTypePickerItem(type, currentType === type)).join("")}
      </div>
    </div>
  `;

  menu.querySelectorAll("[data-type-value]").forEach(button => {
    button.addEventListener("click", event => {
      event.preventDefault();
      const nextValue = button.dataset.typeValue || "all";
      select.value = nextValue;
      activeTypeFilter = nextValue;
      closeTypeFilterPicker();
      trigger.setAttribute("aria-expanded", "false");
      renderDex();
    });
  });
}

function renderTypePickerItem(type, isActive) {
  const label = type === "all" ? "Tous" : getTypeLabel(type);
  return `
    <button type="button" class="type-picker-item${isActive ? " active" : ""}" data-type-value="${escapeHtml(type)}">
      ${getTypeIconMarkup(type, "type-picker-item-icon")}
      <span class="type-picker-item-text">${escapeHtml(label)}</span>
    </button>
  `;
}


const $ = selector => document.querySelector(selector);

const ui = {
  appTitle: $("#appTitle"),
  appSubtitle: $("#appSubtitle"),
  topbarMiniStats: $("#topbarMiniStats"),
  topbarBadgesLeft: $("#topbarBadgesLeft"),
  topbarBadgesRight: $("#topbarBadgesRight"),
  menuToggleBtn: $("#menuToggleBtn"),
  topbarControls: $("#topbarControls"),

  setupView: $("#setupView"),
  homeView: $("#homeView"),
  dexView: $("#dexView"),

  setupProfileName: $("#setupProfileName"),
  setupDexChoices: $("#setupDexChoices"),
  setupNationalLinked: $("#setupNationalLinked"),
  selectAllDexBtn: $("#selectAllDexBtn"),
  unselectAllDexBtn: $("#unselectAllDexBtn"),
  createFirstProfileBtn: $("#createFirstProfileBtn"),

  homeBtn: $("#homeBtn"),
  profileSelect: $("#profileSelect"),
  profileSelectLabel: $("#profileSelectLabel"),
  newProfileBtn: $("#newProfileBtn"),
  editProfileBtn: $("#editProfileBtn"),
  exportSaveBtn: $("#exportSaveBtn"),
  importSaveBtn: $("#importSaveBtn"),
  deleteProfileBtn: $("#deleteProfileBtn"),
  statsPageBtn: $("#statsPageBtn"),
  achievementsPageBtn: $("#achievementsPageBtn"),
  aboutPageBtn: $("#aboutPageBtn"),
  shareProfileBtn: $("#shareProfileBtn"),
  profileActionsBtn: $("#profileActionsBtn"),
  profileActionsMenu: $("#profileActionsMenu"),
  moreActionsBtn: $("#moreActionsBtn"),
  moreActionsMenu: $("#moreActionsMenu"),

  homeProfileName: $("#homeProfileName"),
  profileSummaryPanel: $("#profileSummaryPanel"),
  summaryProfileName: $("#summaryProfileName"),
  summaryRankText: $("#summaryRankText"),
  summaryRankDetail: $("#summaryRankDetail"),
  summaryLastDex: $("#summaryLastDex"),
  summaryStatsGrid: $("#summaryStatsGrid"),
  summaryLevelProgressFill: $("#summaryLevelProgressFill"),
  continueDexBtn: $("#continueDexBtn"),
  globalLevelTitle: $("#globalLevelTitle"),
  globalXpText: $("#globalXpText"),
  globalXpFill: $("#globalXpFill"),
  achievementsList: $("#achievementsList"),
  gameGrid: $("#gameGrid"),
  dexPlatformFilters: $("#dexPlatformFilters"),
  objectivesList: $("#objectivesList"),
  randomObjectiveBtn: $("#randomObjectiveBtn"),
  toggleObjectivesBtn: $("#toggleObjectivesBtn"),

  objectiveHistoryPanel: $("#objectiveHistoryPanel"),
  objectiveHistoryList: $("#objectiveHistoryList"),
  historyAllBtn: $("#historyAllBtn"),
  historyCompletedBtn: $("#historyCompletedBtn"),
  historyAbandonedBtn: $("#historyAbandonedBtn"),
  historyDexFilter: $("#historyDexFilter"),

  dexObjectivesPanel: $("#dexObjectivesPanel"),
  dexObjectivesList: $("#dexObjectivesList"),
  dex: $("#dex"),
  count: $("#count"),
  percent: $("#percent"),
  progressFill: $("#progressFill"),
  searchInput: $("#searchInput"),

  langSelect: $("#langSelect"),
  shinyMode: $("#shinyMode"),
  darkMode: $("#darkMode"),
  soundMode: $("#soundMode"),
  missingOnlyMode: $("#missingOnlyMode"),
  favoritesOnlyMode: $("#favoritesOnlyMode"),
  typeFilterLabel: $("#typeFilterLabel"),
  typeFilterSelect: $("#typeFilterSelect"),
  generationFilterLabel: $("#generationFilterLabel"),
  generationFilterSelect: $("#generationFilterSelect"),
  sortFilterLabel: $("#sortFilterLabel"),
  sortFilterSelect: $("#sortFilterSelect"),
  undoBtn: $("#undoBtn"),
  redoBtn: $("#redoBtn"),
  searchHelpBtn: $("#searchHelpBtn"),
  hideCompletedDexLabel: $("#hideCompletedDexLabel"),
  hideCompletedDexMode: $("#hideCompletedDexMode"),
  checkVisibleBtn: $("#checkVisibleBtn"),
  uncheckVisibleBtn: $("#uncheckVisibleBtn"),

  backupModal: $("#backupModal"),
  backupTitle: $("#backupTitle"),
  backupText: $("#backupText"),
  backupArea: $("#backupArea"),
  copyBackupBtn: $("#copyBackupBtn"),
  downloadBackupBtn: $("#downloadBackupBtn"),
  importBackupFileLabel: $("#importBackupFileLabel"),
  importBackupFileInput: $("#importBackupFileInput"),
  applyBackupBtn: $("#applyBackupBtn"),
  repairBackupBtn: $("#repairBackupBtn"),
  closeBackupBtn: $("#closeBackupBtn"),
  achievementUnlockOverlay: $("#achievementUnlockOverlay"),
  achievementUnlockImage: $("#achievementUnlockImage"),
  achievementUnlockName: $("#achievementUnlockName"),
  achievementUnlockDesc: $("#achievementUnlockDesc"),

  genericModal: $("#genericModal"),
  genericModalTitle: $("#genericModalTitle"),
  genericModalBody: $("#genericModalBody"),
  genericModalCloseBtn: $("#genericModalCloseBtn"),

  toastContainer: $("#toastContainer")
};

let profiles = loadProfiles();
let activeProfileId = localStorage.getItem(STORAGE_KEYS.activeProfile);
let currentGameId = null;
let setupMode = "create";
let isMenuOpen = false;
let areObjectivesCollapsed = true;
let isObjectiveHistoryCollapsed = true;
let objectiveHistoryStatusFilter = "all";
let objectiveHistoryDexFilter = "all";
let objectiveHistoryNeutralFilter = true;
let activeObjectiveFilterId = null;
let recentlyUnlockedAchievementIds = new Set();
let achievementUnlockQueue = [];
let isShowingAchievementUnlock = false;
let achievementAudioContext = null;
let achievementSoundEnabled = true;
let activeTypeFilter = "all";
let activeGenerationFilter = "all";
let activeSortMode = localStorage.getItem(STORAGE_KEYS.sortMode) || "dex";
let undoStack = [];
let redoStack = [];
let shortcutObjectiveViewIndex = 0;
let isDebugPanelVisible = true;
let activeDexPlatformFilter = "all";
let isPokemonCardV2Enabled = localStorage.getItem(STORAGE_KEYS.pokemonCardV2) === "1";
let lastUpdatedPokemonKey = null;

function loadProfiles() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.profiles) || "{}");
  } catch {
    return {};
  }
}

function saveProfiles() {
  localStorage.setItem(STORAGE_KEYS.profiles, JSON.stringify(profiles));
}

function saveActiveProfile() {
  if (activeProfileId) {
    localStorage.setItem(STORAGE_KEYS.activeProfile, activeProfileId);
  } else {
    localStorage.removeItem(STORAGE_KEYS.activeProfile);
  }
}

function getActiveProfile() {
  return profiles[activeProfileId] || null;
}

function getPokemonsForGame(gameId) {
  return dexDataMap[gameId] || [];
}

function getGame(gameId) {
  return games.find(game => game.id === gameId) || null;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
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

function createObjectiveId() {
  return `objective-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function shuffleArray(items) {
  const copy = [...items];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

function showToast(message, type = "success") {
  if (!ui.toastContainer) {
    console.log(message);
    return;
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  ui.toastContainer.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add("show"));

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 250);
  }, 2800);
}

function openGenericModal(title, html) {
  if (!ui.genericModal || !ui.genericModalTitle || !ui.genericModalBody) {
    showToast(title, "success");
    console.log(title, html);
    return;
  }

  ui.genericModalTitle.textContent = title;
  ui.genericModalBody.innerHTML = html;
  ui.genericModal.classList.remove("hidden");
}

function closeGenericModal() {
  ui.genericModal?.classList.add("hidden");
  if (ui.genericModalBody) ui.genericModalBody.innerHTML = "";
}

function isTypingInForm(event = null) {
  const target = event?.target || document.activeElement;
  if (!target) return false;

  return Boolean(target.closest("input, textarea, select, [contenteditable='true']"));
}

function updateUndoRedoButtons() {
  if (ui.undoBtn) ui.undoBtn.disabled = undoStack.length === 0;
  if (ui.redoBtn) ui.redoBtn.disabled = redoStack.length === 0;
}

function createHistorySnapshot(label = "Action") {
  return {
    label,
    profiles: JSON.stringify(profiles),
    activeProfileId,
    currentGameId
  };
}

function rememberHistory(label = "Action") {
  undoStack.push(createHistorySnapshot(label));
  if (undoStack.length > 40) undoStack.shift();
  redoStack = [];
  updateUndoRedoButtons();
}

function restoreHistorySnapshot(snapshot) {
  if (!snapshot) return;

  profiles = JSON.parse(snapshot.profiles);
  activeProfileId = snapshot.activeProfileId;
  currentGameId = snapshot.currentGameId;

  saveProfiles();
  saveActiveProfile();
  syncProfilesWithGames();

  if (currentGameId && getActiveProfile()?.enabledDexes?.includes(currentGameId)) {
    openDex(currentGameId, false);
  } else {
    renderHome();
  }
}

function undoLastAction() {
  const snapshot = undoStack.pop();
  if (!snapshot) {
    showToast("Rien à annuler.", "warn");
    return;
  }

  redoStack.push(createHistorySnapshot("Refaire"));
  restoreHistorySnapshot(snapshot);
  updateUndoRedoButtons();
  showToast(`↶ Annulé : ${snapshot.label}`, "success");
}

function redoLastAction() {
  const snapshot = redoStack.pop();
  if (!snapshot) {
    showToast("Rien à refaire.", "warn");
    return;
  }

  undoStack.push(createHistorySnapshot("Annuler"));
  restoreHistorySnapshot(snapshot);
  updateUndoRedoButtons();
  showToast("↷ Action refaite.", "success");
}

function getPokemonGeneration(pokemon) {
  const fromData = Number(pokemon?.generation);
  if (Number.isInteger(fromData) && fromData >= 1 && fromData <= 9) return fromData;

  // Anciennes données : uniquement le National peut être deviné par numéro National.
  if (currentGameId !== "national") return null;

  const id = Number(pokemon?.id);
  if (!Number.isFinite(id)) return null;
  if (id <= 151) return 1;
  if (id <= 251) return 2;
  if (id <= 386) return 3;
  if (id <= 493) return 4;
  if (id <= 649) return 5;
  if (id <= 721) return 6;
  if (id <= 809) return 7;
  if (id <= 905) return 8;
  return 9;
}

function getPokemonTypesForPokemon(pokemon) {
  const direct = Array.isArray(pokemon?.types) ? pokemon.types.filter(Boolean) : [];
  if (direct.length) return direct;

  const nationalMatch = nationalPokemons.find(item =>
    (pokemon?.imageSlug && item.imageSlug === pokemon.imageSlug) ||
    (pokemon?.slug && item.slug === pokemon.slug) ||
    (pokemon?.speciesSlug && item.slug === pokemon.speciesSlug)
  );

  return Array.isArray(nationalMatch?.types) ? nationalMatch.types.filter(Boolean) : [];
}

function renderPokemonTypeIcons(pokemon) {
  const types = getPokemonTypesForPokemon(pokemon);
  if (types.length === 0) return "";

  return `
    <div class="pokemon-type-icons">
      ${types.map(type => `
        <span class="pokemon-type-icon type-${type}" title="${escapeHtml(getTypeLabel(type))}" aria-label="${escapeHtml(getTypeLabel(type))}">
          ${TYPE_ICON_SVGS[type] || TYPE_ICON_SVGS.all}
        </span>
      `).join("")}
    </div>
  `;
}

function getProfileDexState(profile, gameId) {
  profile.dexData ||= {};

  profile.dexData[gameId] ||= {
    obtained: {},
    shinyMode: false,
    shinyLocked: {},
    favorites: {}
  };

  const state = profile.dexData[gameId];

  state.obtained ||= {};
  state.shinyLocked ||= {};
  state.favorites ||= {};

  if (typeof state.shinyMode !== "boolean") {
    state.shinyMode = false;
  }

  return state;
}

function getProfileProgress(profile) {
  profile.progress ||= {};
  profile.progress.globalXp ||= 0;
  profile.progress.dexXp ||= {};
  profile.progress.earnedPokemon ||= {};
  profile.progress.objectiveRewarded ||= {};
  profile.progress.completedDexBonuses ||= {};

  return profile.progress;
}

function getCurrentDexState() {
  const profile = getActiveProfile();
  return profile && currentGameId ? getProfileDexState(profile, currentGameId) : null;
}

function getObtained() {
  return getCurrentDexState()?.obtained || {};
}

function getPokemonStorageKey(pokemonOrId) {
  if (typeof pokemonOrId === "object" && pokemonOrId) {
    return pokemonOrId.sectionId ? `${pokemonOrId.sectionId}:${pokemonOrId.id}` : String(pokemonOrId.id);
  }

  return String(pokemonOrId);
}

function getObtainedKeysForSlug(profile, gameId, slug) {
  return getPokemonsForGame(gameId)
    .filter(pokemon => pokemon.slug === slug)
    .map(pokemon => getPokemonStorageKey(pokemon));
}

function isPokemonObtainedLocal(profile, gameId, pokemon) {
  const state = getProfileDexState(profile, gameId);
  const obtained = state.obtained || {};
  const keys = getObtainedKeysForSlug(profile, gameId, pokemon.slug);

  return keys.some(key => obtained[key]);
}

function setPokemonObtainedEverywhere(profile, gameId, pokemon, value) {
  const state = getProfileDexState(profile, gameId);
  const obtained = { ...(state.obtained || {}) };
  const shinyLocked = { ...(state.shinyLocked || {}) };
  const keys = getObtainedKeysForSlug(profile, gameId, pokemon.slug);

  for (const key of keys) {
    if (value) {
      obtained[key] = true;
    } else {
      delete obtained[key];
      delete shinyLocked[key];
    }
  }

  state.obtained = obtained;
  state.shinyLocked = shinyLocked;
  saveProfiles();

  return keys;
}

function saveObtained(obtained) {
  const state = getCurrentDexState();
  if (!state) return;

  state.obtained = obtained;
  saveProfiles();
}

function getFavorites() {
  return getCurrentDexState()?.favorites || {};
}

function saveFavorites(favorites) {
  const state = getCurrentDexState();
  if (!state) return;

  state.favorites = favorites;
  saveProfiles();
}

function isPokemonFavorite(pokemon) {
  const favorites = getFavorites();
  return Boolean(favorites[getPokemonStorageKey(pokemon)] || favorites[pokemon.id]);
}

function toggleFavorite(pokemon) {
  rememberHistory("favori");
  const favorites = { ...getFavorites() };

  const key = getPokemonStorageKey(pokemon);

  if (favorites[key]) {
    delete favorites[key];
    playUiSound("remove");
  } else {
    favorites[key] = true;
    playUiSound("favorite");
  }

  saveFavorites(favorites);
  renderDex();
}

function getShinyLocked() {
  return getCurrentDexState()?.shinyLocked || {};
}

function saveShinyLocked(shinyLocked) {
  const state = getCurrentDexState();
  if (!state) return;

  state.shinyLocked = shinyLocked;
  saveProfiles();
}

function getPokemonName(pokemon) {
  const lang = ui.langSelect.value;
  return pokemon.names?.[lang] || pokemon.names?.fr || pokemon.names?.en || pokemon.slug || `#${pokemon.id}`;
}

function getPokemonNameFromGame(gameId, pokemonId) {
  const pokemon = getPokemonsForGame(gameId).find(item => String(item.id) === String(pokemonId));
  return pokemon ? getPokemonName(pokemon) : `#${pokemonId}`;
}

function getImageUrl(pokemon) {
  const obtained = getObtained();
  const isObtained = Boolean(obtained[pokemon.id]);
  const isLocked = isPokemonShinyLocked(pokemon);
  const useShiny = ui.shinyMode.checked && isObtained && !isLocked;
  const form = useShiny ? "shiny" : "normal";
  const imageSlug = pokemon.imageSlug || pokemon.slug;

  return `https://img.pokemondb.net/sprites/home/${form}/${imageSlug}.png`;
}

function getPokeBipSlug(pokemon) {
  const name = pokemon.names?.fr || pokemon.names?.en || pokemon.slug || "";

  return name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/♀/g, "-f")
    .replace(/♂/g, "-m")
    .replace(/['’]/g, "")
    .replace(/\./g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getPokemonInfoUrl(pokemon) {
  if (ui.langSelect.value === "fr") {
    return `https://www.pokebip.com/pokedex/pokemon/${getPokeBipSlug(pokemon)}`;
  }

  return `https://pokemondb.net/pokedex/${pokemon.slug}`;
}

function isNationalLinked(profile = getActiveProfile()) {
  return Boolean(profile?.settings?.nationalLinked);
}

function isPokemonObtainedInGame(profile, gameId, pokemon) {
  const state = getProfileDexState(profile, gameId);
  const obtained = state.obtained || {};

  if (gameId !== "national" || !isNationalLinked(profile)) {
    return Boolean(obtained[pokemon.id]);
  }

  for (const linkedGameId of profile.enabledDexes || []) {
    if (linkedGameId === "national") continue;

    const linkedPokemon = getPokemonsForGame(linkedGameId).find(item => item.slug === pokemon.slug);
    const linkedState = getProfileDexState(profile, linkedGameId);

    if (linkedPokemon && linkedState.obtained?.[linkedPokemon.id]) {
      return true;
    }
  }

  return Boolean(obtained[pokemon.id]);
}

function isPokemonObtained(pokemon) {
  const profile = getActiveProfile();
  return Boolean(profile && currentGameId && isPokemonObtainedInGame(profile, currentGameId, pokemon));
}

function isPokemonShinyLocked(pokemon) {
  return Boolean(getShinyLocked()[pokemon.id]);
}

function calculateGameProgress(profile, gameId) {
  const pokemons = getPokemonsForGame(gameId);
  const total = pokemons.length;
  let done = 0;

  for (const pokemon of pokemons) {
    if (isPokemonObtainedInGame(profile, gameId, pokemon)) {
      done++;
    }
  }

  return {
    total,
    done,
    completion: total === 0 ? 0 : Math.round((done / total) * 100)
  };
}

function getDexLevelFromCompletion(completion) {
  if (completion >= 100) return { level: 5, name: "Collectionneur" };
  if (completion >= 75) return { level: 4, name: "Dresseur accompli" };
  if (completion >= 50) return { level: 3, name: "Chercheur" };
  if (completion >= 25) return { level: 2, name: "Chasseur" };
  return { level: 1, name: "Débutant" };
}

function isDexShinyComplete(profile, gameId, includeShinyLocks = false) {
  const state = getProfileDexState(profile, gameId);
  const pokemons = getPokemonsForGame(gameId);
  const obtained = state.obtained || {};
  const shinyLocked = state.shinyLocked || {};

  if (!state.shinyMode || pokemons.length === 0) return false;

  const targets = includeShinyLocks
    ? pokemons
    : pokemons.filter(pokemon => !shinyLocked[pokemon.id]);

  return targets.length > 0 && targets.every(pokemon => obtained[pokemon.id]);
}

function getDexDisplayRank(profile, gameId) {
  const progress = calculateGameProgress(profile, gameId);
  const levelData = getDexLevelFromCompletion(progress.completion);

  if (levelData.level === 5 && isDexShinyComplete(profile, gameId, false)) {
    return {
      text: "Niveau 5 — Collectionneur ✦",
      isRare: true
    };
  }

  return {
    text: `Niveau ${levelData.level} — ${levelData.name}`,
    isRare: false
  };
}

function getGlobalRank(profile) {
  let completedDexCount = 0;
  let dexAt75 = 0;
  let dexAt50 = 0;
  let dexAt25 = 0;

  for (const gameId of profile.enabledDexes || []) {
    const progress = calculateGameProgress(profile, gameId);

    if (progress.completion === 100) completedDexCount++;
    if (progress.completion >= 75) dexAt75++;
    if (progress.completion >= 50) dexAt50++;
    if (progress.completion >= 25) dexAt25++;
  }

  if (completedDexCount >= 10) return { name: "Collectionneur légendaire", completedDexCount };
  if (completedDexCount >= 5) return { name: "Grand Collectionneur", completedDexCount };
  if (completedDexCount >= 2) return { name: "Collectionneur confirmé", completedDexCount };
  if (completedDexCount >= 1) return { name: "Collectionneur", completedDexCount };
  if (dexAt75 >= 2) return { name: "Dresseur accompli", completedDexCount };
  if (dexAt50 >= 4) return { name: "Chercheur", completedDexCount };
  if (dexAt25 >= 8) return { name: "Chasseur", completedDexCount };

  return { name: "Débutant", completedDexCount };
}

function hasAnyShinyLockSelected(profile, includeNational = true) {
  let dexes = profile.enabledDexes || [];

  if (!includeNational) {
    dexes = dexes.filter(gameId => gameId !== "national");
  }

  return dexes.some(gameId => {
    const shinyLocked = getProfileDexState(profile, gameId).shinyLocked || {};
    return Object.values(shinyLocked).some(Boolean);
  });
}

function isNationalDirectFullShinyComplete(profile) {
  if (!profile.enabledDexes?.includes("national")) return false;

  const state = getProfileDexState(profile, "national");
  const pokemons = getPokemonsForGame("national");
  const obtained = state.obtained || {};
  const shinyLocked = state.shinyLocked || {};

  return (
    state.shinyMode &&
    pokemons.length > 0 &&
    !Object.values(shinyLocked).some(Boolean) &&
    pokemons.every(pokemon => obtained[pokemon.id])
  );
}

function getRareGlobalRank(profile) {
  if (isNationalDirectFullShinyComplete(profile)) {
    return "Niveau max — Collectionneur de Pokémon rares ✦✦✦";
  }

  const enabledDexes = profile.enabledDexes || [];
  const gameDexes = enabledDexes.filter(gameId => gameId !== "national");
  const hasNational = enabledDexes.includes("national");
  const allGameDexesShinyComplete = gameDexes.length > 0 && gameDexes.every(gameId => isDexShinyComplete(profile, gameId, false));

  if (!allGameDexesShinyComplete) return "";

  const nationalShinyComplete = hasNational && isDexShinyComplete(profile, "national", false);

  if (!nationalShinyComplete) {
    return "Niveau max — Collectionneur de Pokémon rares ✦";
  }

  if (hasAnyShinyLockSelected(profile, true)) {
    return "Niveau max — Collectionneur de Pokémon rares ✦✦";
  }

  return "Niveau max — Collectionneur de Pokémon rares ✦✦✦";
}

function getGlobalCompletionPercent(profile) {
  let total = 0;
  let done = 0;

  for (const gameId of profile.enabledDexes || []) {
    const progress = calculateGameProgress(profile, gameId);
    total += progress.total;
    done += progress.done;
  }

  return total === 0 ? 0 : Math.round((done / total) * 100);
}

function awardPokemonXp(profile, gameId, pokemonId) {
  const progress = getProfileProgress(profile);
  const key = `${gameId}:${pokemonId}`;

  if (progress.earnedPokemon[key]) return false;

  progress.earnedPokemon[key] = true;
  progress.globalXp += 1;
  progress.dexXp[gameId] = (progress.dexXp[gameId] || 0) + 1;
  return true;
}

function awardObjectiveXp(profile, objective) {
  const progress = getProfileProgress(profile);

  if (progress.objectiveRewarded[objective.id]) return false;

  progress.objectiveRewarded[objective.id] = true;
  progress.globalXp += 5;
  progress.dexXp[objective.gameId] = (progress.dexXp[objective.gameId] || 0) + 10;
  return true;
}

function showDexCompletePopup(gameId) {
  const game = getGame(gameId);
  showToast(`🎉 Dex complété : ${game?.shortName || game?.name || gameId} !`, "success");

  const popup = document.createElement("div");
  popup.className = "dex-complete-popup";
  popup.innerHTML = `
    <div class="dex-complete-card">
      <div class="dex-complete-spark">✨</div>
      <h2>Dex complété !</h2>
      <p>${escapeHtml(game?.name || gameId)}</p>
    </div>
  `;
  document.body.appendChild(popup);

  setTimeout(() => popup.classList.add("show"), 20);
  setTimeout(() => {
    popup.classList.remove("show");
    setTimeout(() => popup.remove(), 300);
  }, 2200);
}

function awardCompletedDexBonus(profile, gameId) {
  const progress = getProfileProgress(profile);

  if (progress.completedDexBonuses[gameId]) return false;

  const gameProgress = calculateGameProgress(profile, gameId);

  if (gameProgress.total > 0 && gameProgress.completion === 100) {
    progress.completedDexBonuses[gameId] = true;
    progress.globalXp += 25;
    progress.dexXp[gameId] = (progress.dexXp[gameId] || 0) + 50;
    return true;
  }

  return false;
}

function awardAllCompletedDexBonuses(profile) {
  if (!profile) return false;

  let awarded = false;

  for (const gameId of profile.enabledDexes || []) {
    if (awardCompletedDexBonus(profile, gameId)) {
      awarded = true;
    }
  }

  if (awarded) saveProfiles();
  return awarded;
}

function migrateExistingProgress(profile) {
  const progress = getProfileProgress(profile);

  for (const gameId of profile.enabledDexes || []) {
    const state = getProfileDexState(profile, gameId);
    progress.dexXp[gameId] ||= 0;

    for (const [pokemonId, isObtained] of Object.entries(state.obtained || {})) {
      if (!isObtained) continue;

      const key = `${gameId}:${pokemonId}`;

      if (!progress.earnedPokemon[key]) {
        progress.earnedPokemon[key] = true;
        progress.globalXp += 1;
        progress.dexXp[gameId] += 1;
      }
    }

    awardCompletedDexBonus(profile, gameId);
  }
}

function getActiveObjectives(profile = getActiveProfile()) {
  if (!profile) return [];

  profile.objectives ||= [];
  return profile.objectives.filter(objective => objective.status === "active");
}

function calculateObjectiveProgress(objective) {
  const profile = getActiveProfile();

  if (!profile || !objective?.gameId) {
    return { current: 0, target: objective?.target || 1, percent: 0 };
  }

  const obtained = getProfileDexState(profile, objective.gameId).obtained || {};
  const ids = objective.pokemonIds || [];
  const current = ids.filter(pokemonId => obtained[pokemonId]).length;
  const target = Math.max(1, objective.target || ids.length || 1);

  return {
    current,
    target,
    percent: Math.min(100, Math.round((current / target) * 100))
  };
}

function completeFinishedObjectives(showNotification = false) {
  const profile = getActiveProfile();
  if (!profile?.objectives) return false;

  let completedCount = 0;

  for (const objective of profile.objectives) {
    if (objective.status !== "active") continue;

    const progress = calculateObjectiveProgress(objective);

    if (progress.current >= progress.target) {
      objective.status = "completed";
      objective.completedAt = new Date().toISOString();
      awardObjectiveXp(profile, objective);
      completedCount++;
    }
  }

  if (completedCount > 0) {
    saveProfiles();
    playUiSound("quest");

    if (showNotification) {
      showToast(
        completedCount === 1
          ? "✅ Objectif terminé ! +5 XP global / +10 XP Dex"
          : `✅ ${completedCount} objectifs terminés !`,
        "success"
      );
    }

    return true;
  }

  return false;
}

function getAlreadyTargetedPokemonIds(profile, gameId) {
  const alreadyTargeted = new Set();

  for (const objective of getActiveObjectives(profile)) {
    if (objective.gameId !== gameId) continue;

    for (const pokemonId of objective.pokemonIds || []) {
      alreadyTargeted.add(String(pokemonId));
    }
  }

  return alreadyTargeted;
}

function getMissingPokemonIdsForObjective(profile, gameId) {
  const state = getProfileDexState(profile, gameId);
  const obtained = state.obtained || {};
  const alreadyTargeted = getAlreadyTargetedPokemonIds(profile, gameId);

  return getPokemonsForGame(gameId)
    .filter(pokemon => !obtained[pokemon.id])
    .filter(pokemon => !alreadyTargeted.has(String(pokemon.id)))
    .map(pokemon => pokemon.id);
}

function getRandomObjectiveTarget(missingCount) {
  const possibleTargets = [3, 5, 7, 10].filter(value => value <= missingCount);
  return possibleTargets.length ? possibleTargets[Math.floor(Math.random() * possibleTargets.length)] : missingCount;
}

function getPossibleObjectiveGames(profile) {
  const enabledDexes = profile.enabledDexes || [];
  const normalDexes = enabledDexes.filter(gameId => gameId !== "national");
  const nationalDexes = enabledDexes.filter(gameId => gameId === "national");

  const normalPossible = normalDexes
    .map(gameId => ({ gameId, missingIds: getMissingPokemonIdsForObjective(profile, gameId) }))
    .filter(item => item.missingIds.length > 0);

  if (normalPossible.length > 0) return normalPossible;

  return nationalDexes
    .map(gameId => ({ gameId, missingIds: getMissingPokemonIdsForObjective(profile, gameId) }))
    .filter(item => item.missingIds.length > 0);
}

function getNextMissingObjectiveCandidate(profile, gameId) {
  const state = getProfileDexState(profile, gameId);
  const obtained = state.obtained || {};
  const alreadyTargeted = getAlreadyTargetedPokemonIds(profile, gameId);

  const nextMissing = getPokemonsForGame(gameId)
    .filter(pokemon => !obtained[pokemon.id])
    .filter(pokemon => !alreadyTargeted.has(String(pokemon.id)))
    .slice(0, 3);

  if (nextMissing.length < 2) {
    return null;
  }

  return {
    gameId,
    type: "catch_next_missing",
    title: `Capturer les ${nextMissing.length} prochains manquants`,
    target: nextMissing.length,
    pokemonIds: nextMissing.map(pokemon => pokemon.id)
  };
}

function getNearbyMissingObjectiveCandidates(profile, gameId) {
  const state = getProfileDexState(profile, gameId);
  const obtained = state.obtained || {};
  const alreadyTargeted = getAlreadyTargetedPokemonIds(profile, gameId);
  const pokemons = getPokemonsForGame(gameId);

  const candidates = [];

  for (let i = 0; i < pokemons.length; i++) {
    const slice = pokemons.slice(i, i + 4);

    const missing = slice
      .filter(pokemon => !obtained[pokemon.id])
      .filter(pokemon => !alreadyTargeted.has(String(pokemon.id)));

    if (missing.length < 3) continue;

    candidates.push({
      gameId,
      type: "catch_nearby",
      title: "Compléter une série proche",
      target: missing.length,
      pokemonIds: missing.map(pokemon => pokemon.id)
    });
  }

  return candidates;
}

function getFamilyObjectiveCandidates(profile, gameId) {
  const pokemons = getPokemonsForGame(gameId);
  const state = getProfileDexState(profile, gameId);
  const obtained = state.obtained || {};
  const alreadyTargeted = getAlreadyTargetedPokemonIds(profile, gameId);
  const families = new Map();

  for (const pokemon of pokemons) {
    const familyKey = pokemon.family || pokemon.id;

    if (!families.has(familyKey)) {
      families.set(familyKey, []);
    }

    families.get(familyKey).push(pokemon);
  }

  const candidates = [];

  for (const familyPokemons of families.values()) {
    const missing = familyPokemons
      .filter(pokemon => !obtained[pokemon.id])
      .filter(pokemon => !alreadyTargeted.has(String(pokemon.id)));

    if (missing.length < 2 || missing.length > 5) {
      continue;
    }

    candidates.push({
      gameId,
      type: "catch_family",
      title: `Compléter la famille ${getPokemonName(familyPokemons[0])}`,
      target: missing.length,
      pokemonIds: missing.map(pokemon => pokemon.id)
    });
  }

  return candidates;
}

function getTypeObjectiveCandidates(profile, gameId) {
  const pokemons = getPokemonsForGame(gameId);
  const state = getProfileDexState(profile, gameId);
  const obtained = state.obtained || {};
  const alreadyTargeted = getAlreadyTargetedPokemonIds(profile, gameId);
  const byType = new Map();

  for (const pokemon of pokemons) {
    if (obtained[pokemon.id] || alreadyTargeted.has(String(pokemon.id))) continue;

    for (const type of getPokemonTypesForPokemon(pokemon)) {
      if (!byType.has(type)) byType.set(type, []);
      byType.get(type).push(pokemon);
    }
  }

  const candidates = [];

  for (const [type, typePokemons] of byType.entries()) {
    const shuffled = shuffleArray(typePokemons);
    const target = Math.min(5, shuffled.length);
    if (target < 3) continue;

    candidates.push({
      gameId,
      type: "catch_type",
      title: `Capturer ${target} Pokémon ${getTypeLabel(type)}`,
      target,
      pokemonIds: shuffled.slice(0, target).map(pokemon => pokemon.id)
    });
  }

  return candidates;
}

function getFavoriteObjectiveCandidates(profile, gameId) {
  const state = getProfileDexState(profile, gameId);
  const obtained = state.obtained || {};
  const favorites = state.favorites || {};
  const alreadyTargeted = getAlreadyTargetedPokemonIds(profile, gameId);
  const missingFavorites = getPokemonsForGame(gameId)
    .filter(pokemon => favorites[getPokemonStorageKey(pokemon)] || favorites[pokemon.id])
    .filter(pokemon => !obtained[pokemon.id])
    .filter(pokemon => !alreadyTargeted.has(String(pokemon.id)));

  if (missingFavorites.length < 2) return [];

  const selected = shuffleArray(missingFavorites).slice(0, Math.min(5, missingFavorites.length));

  return [{
    gameId,
    type: "catch_favorites",
    title: `Capturer ${selected.length} favoris manquants`,
    target: selected.length,
    pokemonIds: selected.map(pokemon => pokemon.id)
  }];
}

function getGenerationObjectiveCandidates(profile, gameId) {
  const state = getProfileDexState(profile, gameId);
  const obtained = state.obtained || {};
  const alreadyTargeted = getAlreadyTargetedPokemonIds(profile, gameId);
  const byGeneration = new Map();

  for (const pokemon of getPokemonsForGame(gameId)) {
    if (obtained[pokemon.id] || alreadyTargeted.has(String(pokemon.id))) continue;
    const generation = getPokemonGeneration(pokemon);
    if (!generation) continue;
    if (!byGeneration.has(generation)) byGeneration.set(generation, []);
    byGeneration.get(generation).push(pokemon);
  }

  const candidates = [];

  for (const [generation, generationPokemons] of byGeneration.entries()) {
    const selected = shuffleArray(generationPokemons).slice(0, Math.min(5, generationPokemons.length));
    if (selected.length < 3) continue;

    candidates.push({
      gameId,
      type: "catch_generation",
      title: `Capturer ${selected.length} Pokémon de Gen ${generation}`,
      target: selected.length,
      pokemonIds: selected.map(pokemon => pokemon.id)
    });
  }

  return candidates;
}

function canCreateObjectiveType(profile, type, maxSameType = 2) {
  const sameTypeCount = getActiveObjectives(profile)
    .filter(objective => objective.type === type)
    .length;

  return sameTypeCount < maxSameType;
}

function createRandomObjective(forcedGameId = null) {
  const profile = getActiveProfile();

  if (!profile) {
    showToast("⚠️ Aucun profil actif.", "warn");
    return;
  }

  profile.objectives ||= [];
  completeFinishedObjectives(false);

  if (getActiveObjectives(profile).length >= 5) {
    showToast("⚠️ Tu as déjà 5 objectifs actifs.", "warn");
    return;
  }

  let possibleGames;

  if (forcedGameId) {
    const missingIds = getMissingPokemonIdsForObjective(profile, forcedGameId);

    possibleGames = missingIds.length > 0
      ? [{ gameId: forcedGameId, missingIds }]
      : [];
  } else {
    possibleGames = getPossibleObjectiveGames(profile);
  }

  if (possibleGames.length === 0) {
    showToast(
      forcedGameId
        ? "✅ Ce Dex n’a plus assez de Pokémon disponibles pour une quête."
        : "✅ Tous tes Dex sélectionnés sont déjà complets.",
      "success"
    );
    return;
  }

  const familyCandidates = possibleGames.flatMap(item => getFamilyObjectiveCandidates(profile, item.gameId));
  const nearbyCandidates = possibleGames.flatMap(item => getNearbyMissingObjectiveCandidates(profile, item.gameId));
  const typeCandidates = possibleGames.flatMap(item => getTypeObjectiveCandidates(profile, item.gameId));
  const favoriteCandidates = possibleGames.flatMap(item => getFavoriteObjectiveCandidates(profile, item.gameId));
  const generationCandidates = possibleGames.flatMap(item => getGenerationObjectiveCandidates(profile, item.gameId));
  const nextMissingCandidates = possibleGames
    .map(item => getNextMissingObjectiveCandidate(profile, item.gameId))
    .filter(Boolean);

  const questGroups = [];

  if (familyCandidates.length > 0 && canCreateObjectiveType(profile, "catch_family")) {
    questGroups.push({
      type: "catch_family",
      candidates: familyCandidates
    });
  }

  if (favoriteCandidates.length > 0 && canCreateObjectiveType(profile, "catch_favorites", 1)) {
    questGroups.push({
      type: "catch_favorites",
      candidates: favoriteCandidates
    });
  }

  if (typeCandidates.length > 0 && canCreateObjectiveType(profile, "catch_type")) {
    questGroups.push({
      type: "catch_type",
      candidates: typeCandidates
    });
  }

  if (generationCandidates.length > 0 && canCreateObjectiveType(profile, "catch_generation")) {
    questGroups.push({
      type: "catch_generation",
      candidates: generationCandidates
    });
  }

  if (nextMissingCandidates.length > 0 && canCreateObjectiveType(profile, "catch_next_missing")) {
    questGroups.push({
      type: "catch_next_missing",
      candidates: nextMissingCandidates
    });
  }

  if (nearbyCandidates.length > 0 && canCreateObjectiveType(profile, "catch_nearby")) {
    questGroups.push({
      type: "catch_nearby",
      candidates: nearbyCandidates
    });
  }

  if (canCreateObjectiveType(profile, "catch_missing")) {
    const randomMissingCandidates = possibleGames.map(selectedGameData => {
      const target = getRandomObjectiveTarget(selectedGameData.missingIds.length);

      return {
        gameId: selectedGameData.gameId,
        type: "catch_missing",
        title: `Capturer ${target} manquants`,
        target,
        pokemonIds: shuffleArray(selectedGameData.missingIds).slice(0, target)
      };
    });

    if (randomMissingCandidates.length > 0) {
      questGroups.push({
        type: "catch_missing",
        candidates: randomMissingCandidates
      });
    }
  }

  if (questGroups.length === 0) {
    showToast("⚠️ Trop d’objectifs du même type. Termine ou remplace une quête.", "warn");
    return;
  }

  const selectedGroup = questGroups[Math.floor(Math.random() * questGroups.length)];
  const objectiveData = selectedGroup.candidates[Math.floor(Math.random() * selectedGroup.candidates.length)];

  const objective = {
    id: createObjectiveId(),
    type: objectiveData.type,
    title: objectiveData.title,
    gameId: objectiveData.gameId,
    target: objectiveData.target,
    pokemonIds: objectiveData.pokemonIds,
    status: "active",
    createdAt: new Date().toISOString()
  };

  profile.objectives.push(objective);
  saveProfiles();
  refreshObjectivesUI();

  const game = getGame(objective.gameId);
  showToast(`🎯 Objectif : ${game?.shortName || game?.name || "Dex"} — ${objective.target} Pokémon`, "success");
}

function abandonObjective(objectiveId, replace = false) {
  const profile = getActiveProfile();
  if (!profile?.objectives) return;

  const objective = profile.objectives.find(item => item.id === objectiveId);

  if (!objective || objective.status !== "active") return;

  objective.status = "abandoned";
  objective.abandonedAt = new Date().toISOString();
  saveProfiles();

  if (replace) {
    showToast("🔁 Objectif remplacé.", "success");
    createRandomObjective();
    return;
  }

  refreshObjectivesUI();
  showToast("🗑️ Objectif abandonné.", "warn");
}

function setObjectiveFilter(objectiveId) {
  const profile = getActiveProfile();
  const objective = getActiveObjectives(profile).find(item => item.id === objectiveId);

  if (!objective) {
    showToast("⚠️ Objectif introuvable.", "warn");
    return;
  }

  activeObjectiveFilterId = objective.id;

  if (currentGameId !== objective.gameId) {
    openDex(objective.gameId);
  } else {
    renderDex();
  }

  showToast("🎯 Filtre de quête activé.", "success");
}

function setAllDexObjectivesFilter() {
  const profile = getActiveProfile();

  if (!profile || !currentGameId) {
    showToast("⚠️ Aucun Dex ouvert.", "warn");
    return;
  }

  const objectives = getActiveObjectives(profile)
    .filter(objective => objective.gameId === currentGameId);

  if (objectives.length === 0) {
    showToast("⚠️ Aucune quête active pour ce Dex.", "warn");
    return;
  }

  activeObjectiveFilterId = "__all_dex_objectives__";
  renderDex();
  showToast("🎯 Pokémon des quêtes affichés.", "success");
}

function clearObjectiveFilter() {
  activeObjectiveFilterId = null;
  renderDex();
  showToast("🔎 Tous les Pokémon du Dex affichés.", "success");
}

function getObjectiveAdvanceMessages(profile, gameId, pokemonIds) {
  if (!profile || !Array.isArray(pokemonIds)) return [];

  const messages = [];

  for (const pokemonId of pokemonIds) {
    for (const objective of getActiveObjectives(profile)) {
      if (objective.gameId !== gameId) continue;
      if (!(objective.pokemonIds || []).map(String).includes(String(pokemonId))) continue;

      const progress = calculateObjectiveProgress(objective);
      messages.push({
        pokemonName: getPokemonNameFromGame(gameId, pokemonId),
        current: progress.current,
        target: progress.target
      });
    }
  }

  return messages;
}

function showObjectiveAdvanceNotifications(messages) {
  if (messages.length === 0) return;

  if (messages.length === 1) {
    const message = messages[0];
    showToast(`🎯 ${message.pokemonName} validé pour la quête ! ${message.current}/${message.target}`, "success");
    return;
  }

  showToast(`🎯 ${messages.length} Pokémon validés dans tes objectifs !`, "success");
}

function getFilteredPokemons() {
  const rawSearch = ui.searchInput.value.trim();
  const search = rawSearch.toLowerCase();
  const pokemons = getPokemonsForGame(currentGameId);
  const profile = getActiveProfile();
  let objectiveFilterIds = null;

  if (profile && activeObjectiveFilterId) {
    if (activeObjectiveFilterId === "__all_dex_objectives__") {
      const ids = [];

      for (const objective of getActiveObjectives(profile)) {
        if (objective.gameId !== currentGameId) continue;
        ids.push(...(objective.pokemonIds || []));
      }

      objectiveFilterIds = new Set(ids.map(String));

      if (objectiveFilterIds.size === 0) {
        activeObjectiveFilterId = null;
        objectiveFilterIds = null;
      }
    } else {
      const objective = getActiveObjectives(profile).find(item => item.id === activeObjectiveFilterId);

      if (objective && objective.gameId === currentGameId) {
        objectiveFilterIds = new Set((objective.pokemonIds || []).map(String));
      } else {
        activeObjectiveFilterId = null;
      }
    }
  }

  const commandTokens = search.split(/\s+/).filter(Boolean);
  const simpleTerms = [];
  const commandFilters = {
    types: [],
    generations: [],
    fav: false,
    missing: false,
    obtained: false,
    ids: []
  };

  for (const token of commandTokens) {
    if (token.startsWith("type:")) {
      const value = token.slice(5).trim();
      const typeKey = normalizeTypeKey(value);
      if (typeKey) commandFilters.types.push(typeKey);
      continue;
    }

    if (token.startsWith("gen:")) {
      const value = Number(token.slice(4).replace(/[^0-9]/g, ""));
      if (value) commandFilters.generations.push(value);
      continue;
    }

    if (token.startsWith("id:")) {
      const value = token.slice(3).replace(/[^0-9]/g, "");
      if (value) commandFilters.ids.push(value);
      continue;
    }

    if (token === "favori" || token === "favoris") {
      commandFilters.fav = true;
      continue;
    }

    if (token === "manquant" || token === "manquants" || token === "missing") {
      commandFilters.missing = true;
      continue;
    }

    if (token === "obtenu" || token === "obtenus" || token === "obtained") {
      commandFilters.obtained = true;
      continue;
    }

    simpleTerms.push(token);
  }

  const filtered = pokemons.filter(pokemon => {
    const generation = getPokemonGeneration(pokemon);
    const isObtained = isPokemonObtained(pokemon);

    if (objectiveFilterIds && !objectiveFilterIds.has(String(pokemon.id))) return false;
    if (ui.missingOnlyMode.checked && isObtained) return false;
    if (ui.favoritesOnlyMode?.checked && !isPokemonFavorite(pokemon)) return false;
    const pokemonTypes = getPokemonTypesForPokemon(pokemon);
    if (activeTypeFilter !== "all" && !pokemonTypes.includes(activeTypeFilter)) return false;
    if (activeGenerationFilter !== "all" && generation !== Number(activeGenerationFilter)) return false;

    if (commandFilters.types.length && !commandFilters.types.some(type => pokemonTypes.includes(type))) return false;
    if (commandFilters.generations.length && !commandFilters.generations.includes(generation)) return false;
    if (commandFilters.fav && !isPokemonFavorite(pokemon)) return false;
    if (commandFilters.missing && isObtained) return false;
    if (commandFilters.obtained && !isObtained) return false;

    const id = String(pokemon.id).padStart(3, "0");
    if (commandFilters.ids.length && !commandFilters.ids.some(value => id.includes(value.padStart(3, "0")) || String(pokemon.id).includes(value))) return false;

    const frName = (pokemon.names?.fr || "").toLowerCase();
    const enName = (pokemon.names?.en || "").toLowerCase();
    const currentName = getPokemonName(pokemon).toLowerCase();

    return simpleTerms.every(term => id.includes(term) || frName.includes(term) || enName.includes(term) || currentName.includes(term));
  });

  return applyPokemonSort(filtered);
}

function renderObjectives(profile, container, gameFilter = null, emptyText = "Aucun objectif actif.") {
  if (!container || !profile) return;

  completeFinishedObjectives(false);

  let objectives = getActiveObjectives(profile);

  if (gameFilter) {
    objectives = objectives.filter(objective => objective.gameId === gameFilter);
  }

  container.innerHTML = "";

  if (objectives.length === 0) {
    container.innerHTML = `<div class="objective-empty">${emptyText}</div>`;
    return;
  }

  for (const objective of objectives) {
    const game = getGame(objective.gameId);
    const progress = calculateObjectiveProgress(objective);
    const obtained = getProfileDexState(profile, objective.gameId).obtained || {};
    const pokemonNames = (objective.pokemonIds || [])
      .map(pokemonId => {
        const name = escapeHtml(getPokemonNameFromGame(objective.gameId, pokemonId));
        const done = Boolean(obtained[pokemonId]);
        return `<span class="objective-pokemon-name ${done ? "done" : ""}">${name}</span>`;
      })
      .join(" ; ");

    const card = document.createElement("article");
    card.className = "objective-card";
    card.innerHTML = `
      <div class="objective-top">
        <div>
          <div class="objective-title">🎯 ${game?.shortName || game?.name || objective.gameId} — ${escapeHtml(objective.title || "Objectif")}</div>
          <div class="objective-dex">${progress.current} / ${progress.target} • ${progress.percent}%</div>
          <div class="objective-pokemon-list">[${progress.target} Pokémon] ${pokemonNames}</div>
        </div>

        <div class="objective-progress-text">${progress.current}/${progress.target}</div>
      </div>

      <div class="objective-progress-bar">
        <div class="objective-progress-fill" style="width: ${progress.percent}%"></div>
      </div>

      <div class="objective-buttons">
        <button class="btn tiny quest view-objective-btn" type="button">Voir quête</button>
        <button class="btn tiny danger abandon-objective-btn" type="button">Abandonner</button>
        <button class="btn tiny warn replace-objective-btn" type="button">Remplacer</button>
      </div>
    `;

    card.querySelector(".view-objective-btn").addEventListener("click", event => {
      event.stopPropagation();
      setObjectiveFilter(objective.id);
    });

    card.querySelector(".abandon-objective-btn").addEventListener("click", event => {
      event.stopPropagation();
      abandonObjective(objective.id, false);
    });

    card.querySelector(".replace-objective-btn").addEventListener("click", event => {
      event.stopPropagation();
      abandonObjective(objective.id, true);
    });

    container.appendChild(card);
  }
}

function getObjectiveHistory(profile, status, limit = 5) {
  if (!profile?.objectives) return [];

  return profile.objectives
    .filter(objective => objective.status === status)
    .sort((a, b) => {
      const dateA = new Date(a.completedAt || a.abandonedAt || a.createdAt || 0).getTime();
      const dateB = new Date(b.completedAt || b.abandonedAt || b.createdAt || 0).getTime();
      return dateB - dateA;
    })
    .slice(0, limit);
}

function setObjectiveHistoryCollapsed(collapsed) {
  isObjectiveHistoryCollapsed = collapsed;

  if (ui.objectiveHistoryPanel) {
    ui.objectiveHistoryPanel.classList.toggle("objective-history-collapsed", isObjectiveHistoryCollapsed);
  }
}

function setHistoryFilter(status) {
  if (
    objectiveHistoryStatusFilter === status &&
    !objectiveHistoryNeutralFilter &&
    !isObjectiveHistoryCollapsed
  ) {
    objectiveHistoryStatusFilter = "all";
    objectiveHistoryNeutralFilter = true;
    setObjectiveHistoryCollapsed(true);
    renderObjectiveHistory();
    return;
  }

  objectiveHistoryStatusFilter = status;
  objectiveHistoryNeutralFilter = false;
  setObjectiveHistoryCollapsed(false);
  renderObjectiveHistory();
}

function renderObjectiveHistory() {
  const profile = getActiveProfile();

  if (!ui.objectiveHistoryPanel || !ui.objectiveHistoryList || !profile) {
    return;
  }

  if (ui.historyDexFilter) {
    const currentValue = objectiveHistoryDexFilter || ui.historyDexFilter.value || "all";

    ui.historyDexFilter.innerHTML = `<option value="all">Tous les Dex</option>`;

    for (const gameId of profile.enabledDexes || []) {
      const game = getGame(gameId);
      const option = document.createElement("option");

      option.value = gameId;
      option.textContent = game?.shortName || game?.name || gameId;

      ui.historyDexFilter.appendChild(option);
    }

    const valueStillExists = [...ui.historyDexFilter.options].some(option => option.value === currentValue);
    ui.historyDexFilter.value = valueStillExists ? currentValue : "all";
    objectiveHistoryDexFilter = ui.historyDexFilter.value;
  }

  const history = (profile.objectives || [])
    .filter(objective => objective.status === "completed" || objective.status === "abandoned")
    .filter(objective => {
      if (objectiveHistoryStatusFilter === "completed") return objective.status === "completed";
      if (objectiveHistoryStatusFilter === "abandoned") return objective.status === "abandoned";
      return true;
    })
    .filter(objective => {
      if (objectiveHistoryDexFilter === "all") return true;
      return objective.gameId === objectiveHistoryDexFilter;
    })
    .sort((a, b) => {
      const dateA = new Date(a.completedAt || a.abandonedAt || a.createdAt || 0).getTime();
      const dateB = new Date(b.completedAt || b.abandonedAt || b.createdAt || 0).getTime();
      return dateB - dateA;
    })
    .slice(0, 20);

  const showActiveHistoryFilter = !objectiveHistoryNeutralFilter;

  ui.historyAllBtn?.classList.toggle(
    "active-filter",
    showActiveHistoryFilter && objectiveHistoryStatusFilter === "all"
  );

  ui.historyCompletedBtn?.classList.toggle(
    "active-filter",
    showActiveHistoryFilter && objectiveHistoryStatusFilter === "completed"
  );

  ui.historyAbandonedBtn?.classList.toggle(
    "active-filter",
    showActiveHistoryFilter && objectiveHistoryStatusFilter === "abandoned"
  );

  ui.objectiveHistoryList.innerHTML = "";

  if (history.length === 0) {
    ui.objectiveHistoryList.innerHTML = `
      <div class="objective-history-empty">
        Aucun objectif trouvé avec ces filtres.
      </div>
    `;
    return;
  }

  for (const objective of history) {
    const game = getGame(objective.gameId);
    const isCompleted = objective.status === "completed";
    const icon = isCompleted ? "✅" : "🗑️";
    const label = isCompleted ? "Réussi" : "Abandonné";
    const date = objective.completedAt || objective.abandonedAt || objective.createdAt;
    const progress = calculateObjectiveProgress(objective);

    const card = document.createElement("article");
    card.className = `objective-history-card ${objective.status}`;

    card.innerHTML = `
      <div class="objective-history-title">
        ${icon} ${game?.shortName || game?.name || objective.gameId} — ${escapeHtml(objective.title || "Objectif")}
      </div>

      <div class="objective-history-meta">
        ${label} • ${progress.current}/${progress.target}
        ${date ? `• ${new Date(date).toLocaleDateString("fr-FR")}` : ""}
      </div>
    `;

    ui.objectiveHistoryList.appendChild(card);
  }
}

function renderDexObjectives() {
  const profile = getActiveProfile();

  if (!ui.dexObjectivesPanel || !ui.dexObjectivesList || !profile || !currentGameId) return;

  completeFinishedObjectives(false);

  ui.dexObjectivesPanel.classList.remove("hidden");

  const title = ui.dexObjectivesPanel.querySelector(".dex-objectives-title");

  if (title) {
    title.innerHTML = `
      <span>
  Objectifs de ce Dex
  ${activeObjectiveFilterId ? `<span class="objective-filter-badge">Filtre quête actif</span>` : ""}
</span>

<span class="objective-filter-actions">
  <button id="showDexQuestPokemonsBtn" class="btn tiny quest" type="button">🎯 Voir Pokémon des quêtes</button>
  <button id="createDexObjectiveBtn" class="btn tiny good" type="button">🎲 Objectif ce Dex</button>
  ${activeObjectiveFilterId ? `<button id="clearObjectiveFilterBtn" class="btn tiny" type="button">Voir tout le Dex</button>` : ""}
</span>
    `;

    title.querySelector("#showDexQuestPokemonsBtn")?.addEventListener("click", setAllDexObjectivesFilter);

    title.querySelector("#createDexObjectiveBtn")?.addEventListener("click", () => {
      createRandomObjective(currentGameId);
    });

    title.querySelector("#clearObjectiveFilterBtn")?.addEventListener("click", clearObjectiveFilter);
  }

  renderObjectives(profile, ui.dexObjectivesList, currentGameId, "Aucun objectif pour ce Dex.");
}

function refreshObjectivesUI() {
  const profile = getActiveProfile();
  if (!profile) return;

  renderObjectives(profile, ui.objectivesList, null, "Aucun objectif actif. Clique sur 🎲 Objectif pour générer une petite mission.");
  setObjectivesCollapsed(areObjectivesCollapsed);

  renderObjectiveHistory();
  setObjectiveHistoryCollapsed(isObjectiveHistoryCollapsed);

  renderAchievements();
  renderTopbarAchievements();
  renderDexObjectives();
}

function updateGlobalLevelUI(profile) {
  if (!profile) return;

  const globalRank = getGlobalRank(profile);
  const rareRank = getRareGlobalRank(profile);
  const globalCompletion = getGlobalCompletionPercent(profile);
  const detailHtml = `
    ${globalRank.completedDexCount} Dex complétés
    ${rareRank ? `<div class="rare-rank-text">${rareRank}</div>` : ""}
  `;

  if (ui.globalLevelTitle) ui.globalLevelTitle.textContent = `${profile.name} — ${globalRank.name}`;
  if (ui.globalXpText) ui.globalXpText.innerHTML = detailHtml;
  if (ui.globalXpFill) ui.globalXpFill.style.width = `${globalCompletion}%`;

  if (ui.summaryRankText) ui.summaryRankText.textContent = `${globalRank.name}`;
  if (ui.summaryRankDetail) ui.summaryRankDetail.innerHTML = detailHtml;
  if (ui.summaryLevelProgressFill) ui.summaryLevelProgressFill.style.width = `${globalCompletion}%`;
}

function getBadgeImageUrl(fileName) {
  return `./assets/badges/${fileName}`;
}

function getCompletedObjectiveCount(profile) {
  return (profile.objectives || [])
    .filter(objective => objective.status === "completed")
    .length;
}

function getCompletedDexCount(profile) {
  return (profile.enabledDexes || [])
    .filter(gameId => calculateGameProgress(profile, gameId).completion === 100)
    .length;
}

function getShinyCompletedDexCount(profile) {
  return (profile.enabledDexes || [])
    .filter(gameId => isDexShinyComplete(profile, gameId, false))
    .length;
}

function getRareStarLevel(profile) {
  const rareRank = getRareGlobalRank(profile);

  if (rareRank.includes("✦✦✦")) return 3;
  if (rareRank.includes("✦✦")) return 2;
  if (rareRank.includes("✦")) return 1;

  return 0;
}

function getAchievementList(profile) {
  const completedObjectives = getCompletedObjectiveCount(profile);
  const completedDexes = getCompletedDexCount(profile);
  const shinyCompletedDexes = getShinyCompletedDexCount(profile);
  const rareStarLevel = getRareStarLevel(profile);

  return [
    {
      id: "premier-objectif",
      name: "Premier objectif",
      desc: "Terminer 1 objectif",
      image: getBadgeImageUrl("Boulder-Badge.png"),
      unlocked: completedObjectives >= 1
    },
    {
      id: "chasseur-motive",
      name: "Chasseur motivé",
      desc: "Terminer 5 objectifs",
      image: getBadgeImageUrl("Thunder-Badge.png"),
      unlocked: completedObjectives >= 5
    },
    {
      id: "enchainement-propre",
      name: "Enchaînement propre",
      desc: "Terminer 10 objectifs",
      image: getBadgeImageUrl("Soul-Badge.png"),
      unlocked: completedObjectives >= 10
    },
    {
      id: "routine-capture",
      name: "Routine de capture",
      desc: "Terminer 25 objectifs",
      image: getBadgeImageUrl("Cascade-Badge.png"),
      unlocked: completedObjectives >= 25
    },

    {
      id: "premier-dex-complete",
      name: "Premier Dex complété",
      desc: "Compléter 1 Dex à 100%",
      image: getBadgeImageUrl("Rainbow-Badge.png"),
      unlocked: completedDexes >= 1
    },
    {
      id: "collectionneur-confirme",
      name: "Collectionneur confirmé",
      desc: "Compléter 2 Dex à 100%",
      image: getBadgeImageUrl("Marsh-Badge.png"),
      unlocked: completedDexes >= 2
    },
    {
      id: "grand-collectionneur",
      name: "Grand Collectionneur",
      desc: "Compléter 5 Dex à 100%",
      image: getBadgeImageUrl("Volcano-Badge.png"),
      unlocked: completedDexes >= 5
    },
    {
      id: "collectionneur-legendaire",
      name: "Collectionneur légendaire",
      desc: "Compléter 10 Dex à 100%",
      image: getBadgeImageUrl("Earth-Badge.png"),
      unlocked: completedDexes >= 10
    },

    {
      id: "premier-shiny-dex",
      name: "Premier Shiny Dex",
      desc: "Compléter 1 Dex en Shiny Dex",
      image: getBadgeImageUrl("Icicle-Badge.png"),
      unlocked: shinyCompletedDexes >= 1
    },
    {
      id: "collection-rare-1",
      name: "Collection rare ✦",
      desc: "Tous les Dex hors National en shiny",
      image: getBadgeImageUrl("Rising-Badge.png"),
      unlocked: rareStarLevel >= 1
    },
    {
      id: "collection-rare-2",
      name: "Collection rare ✦✦",
      desc: "Tous les Dex + National en shiny",
      image: getBadgeImageUrl("Legend-Badge.png"),
      unlocked: rareStarLevel >= 2
    },
    {
      id: "collection-rare-3",
      name: "Collection rare ✦✦✦",
      desc: "Tout shiny complet, shiny locks compris",
      image: getBadgeImageUrl("Beacon-Badge.png"),
      unlocked: rareStarLevel >= 3
    }
  ];
}

function renderTopbarAchievements() {
  const profile = getActiveProfile();

  if (!ui.topbarBadgesLeft || !ui.topbarBadgesRight || !profile) {
    return;
  }

  const achievements = getAchievementList(profile)
    .filter(achievement => achievement.unlocked || !achievement.id.startsWith("collection-rare"));

  const unlockedRareCount = achievements.filter(achievement =>
    achievement.id.startsWith("collection-rare") && achievement.unlocked
  ).length;

  const leftCount = unlockedRareCount >= 2 ? 6 : 5;

  const leftAchievements = achievements.slice(0, leftCount);
  const rightAchievements = achievements.slice(leftCount);

  const createMiniBadge = achievement => {
    const badge = document.createElement("div");
    badge.className = `topbar-badge ${achievement.unlocked ? "unlocked" : "locked"}`;
    badge.setAttribute("tabindex", "0");

    badge.innerHTML = `
      <img
        src="${achievement.image}"
        alt="${escapeHtml(achievement.name)}"
        loading="lazy"
      >

      <div class="topbar-badge-tooltip">
        <div class="topbar-badge-tooltip-name">${escapeHtml(achievement.name)}</div>
        <div class="topbar-badge-tooltip-desc">${escapeHtml(achievement.desc)}</div>
        <div class="topbar-badge-tooltip-state ${achievement.unlocked ? "unlocked" : "locked"}">
          ${achievement.unlocked ? "Débloqué" : "Verrouillé"}
        </div>
      </div>
    `;

    badge.addEventListener("click", event => {
      event.stopPropagation();

      const wasOpen = badge.classList.contains("tooltip-open");

      document.querySelectorAll(".topbar-badge.tooltip-open").forEach(element => {
        element.classList.remove("tooltip-open");
      });

      if (!wasOpen) {
        badge.classList.add("tooltip-open");
      }
    });

    return badge;
  };

  ui.topbarBadgesLeft.innerHTML = "";
  ui.topbarBadgesRight.innerHTML = "";

  for (const achievement of leftAchievements) {
    ui.topbarBadgesLeft.appendChild(createMiniBadge(achievement));
  }

  for (const achievement of rightAchievements) {
    ui.topbarBadgesRight.appendChild(createMiniBadge(achievement));
  }
}

function getAchievementState(profile) {
  profile.achievementState ||= {};
  profile.achievementState.notified ||= {};
  return profile.achievementState;
}

function markCurrentAchievementsAsSeen(profile) {
  const achievementState = getAchievementState(profile);

  for (const achievement of getAchievementList(profile)) {
    if (achievement.unlocked) {
      achievementState.notified[achievement.id] = true;
    }
  }
}

function checkNewAchievements(showNotification = true) {
  const profile = getActiveProfile();
  if (!profile) return [];

  const achievementState = getAchievementState(profile);
  const achievements = getAchievementList(profile);
  const newlyUnlocked = achievements.filter(achievement => {
    return achievement.unlocked && !achievementState.notified[achievement.id];
  });

  if (newlyUnlocked.length === 0) {
    return [];
  }

  for (const achievement of newlyUnlocked) {
    achievementState.notified[achievement.id] = true;
  }

  recentlyUnlockedAchievementIds = new Set(newlyUnlocked.map(achievement => achievement.id));
  saveProfiles();

  if (showNotification) {
    queueAchievementUnlocks(newlyUnlocked);
  }

  return newlyUnlocked;
}

function playUiSound(kind = "check") {
  if (!achievementSoundEnabled) return;

  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    achievementAudioContext ||= new AudioContextClass();
    const ctx = achievementAudioContext;

    if (ctx.state === "suspended") ctx.resume();

    const now = ctx.currentTime;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    const presets = {
      check: [660, 0.08, 0.10],
      remove: [260, 0.10, 0.08],
      favorite: [880, 0.12, 0.12],
      quest: [740, 0.14, 0.16]
    };

    const [freq, duration, volume] = presets[kind] || presets.check;
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.03);
  } catch (error) {
    console.warn("Son indisponible :", error);
  }
}

function playAchievementUnlockSound() {
  if (!achievementSoundEnabled) return;

  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    achievementAudioContext ||= new AudioContextClass();

    const ctx = achievementAudioContext;

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const now = ctx.currentTime;

    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(0.65, now + 0.025);
    master.gain.exponentialRampToValueAtTime(0.001, now + 1.85);
    master.connect(ctx.destination);

    const tone = ({
      freq,
      start,
      duration,
      type = "sine",
      volume = 0.25,
      endFreq = null,
      pan = 0
    }) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(freq, now + start);

      if (endFreq) {
        oscillator.frequency.exponentialRampToValueAtTime(endFreq, now + start + duration);
      }

      gain.gain.setValueAtTime(0.0001, now + start);
      gain.gain.exponentialRampToValueAtTime(volume, now + start + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + start + duration);

      oscillator.connect(gain);

      if (panner) {
        panner.pan.setValueAtTime(pan, now + start);
        gain.connect(panner);
        panner.connect(master);
      } else {
        gain.connect(master);
      }

      oscillator.start(now + start);
      oscillator.stop(now + start + duration + 0.05);
    };

    const noise = ({ start, duration, volume = 0.08, highpass = 1600 }) => {
      const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * duration), ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < data.length; i++) {
        const fade = 1 - i / data.length;
        data[i] = (Math.random() * 2 - 1) * fade;
      }

      const source = ctx.createBufferSource();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      source.buffer = buffer;
      filter.type = "highpass";
      filter.frequency.setValueAtTime(highpass, now + start);

      gain.gain.setValueAtTime(0.0001, now + start);
      gain.gain.exponentialRampToValueAtTime(volume, now + start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + start + duration);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(master);

      source.start(now + start);
      source.stop(now + start + duration + 0.03);
    };

    // 1) Petit éclat d'ouverture
    noise({ start: 0.00, duration: 0.20, volume: 0.11, highpass: 2200 });

    tone({ freq: 1567.98, start: 0.00, duration: 0.10, type: "triangle", volume: 0.16, pan: -0.25 });
    tone({ freq: 2093.00, start: 0.045, duration: 0.12, type: "triangle", volume: 0.18, pan: 0.25 });

    // 2) Montée “shiny”
    tone({ freq: 783.99, start: 0.10, duration: 0.18, type: "triangle", volume: 0.22, pan: -0.15 });
    tone({ freq: 987.77, start: 0.18, duration: 0.18, type: "triangle", volume: 0.25, pan: 0.10 });
    tone({ freq: 1318.51, start: 0.27, duration: 0.22, type: "triangle", volume: 0.28, pan: -0.05 });
    tone({ freq: 1760.00, start: 0.39, duration: 0.30, type: "sine", volume: 0.26, pan: 0.15 });

    // 3) Accord final “récompense”
    tone({ freq: 659.25, start: 0.50, duration: 0.78, type: "sine", volume: 0.17, pan: -0.12 });
    tone({ freq: 830.61, start: 0.50, duration: 0.78, type: "sine", volume: 0.15, pan: 0.00 });
    tone({ freq: 1046.50, start: 0.50, duration: 0.90, type: "sine", volume: 0.19, pan: 0.12 });
    tone({ freq: 1318.51, start: 0.56, duration: 0.70, type: "sine", volume: 0.11, pan: 0.20 });

    // 4) Scintillements autour de l'accord
    const sparkles = [
      [2349.32, 0.34, -0.45],
      [2637.02, 0.42, 0.40],
      [3135.96, 0.54, -0.25],
      [2793.83, 0.68, 0.30],
      [3520.00, 0.82, -0.15],
      [4186.01, 0.98, 0.18]
    ];

    for (const [freq, start, pan] of sparkles) {
      tone({
        freq,
        start,
        duration: 0.11,
        type: "triangle",
        volume: 0.07,
        endFreq: freq * 1.18,
        pan
      });
    }

    // 5) Petit “ding” final
    tone({ freq: 2093.00, start: 1.05, duration: 0.32, type: "sine", volume: 0.13, pan: 0 });
    tone({ freq: 3135.96, start: 1.09, duration: 0.26, type: "triangle", volume: 0.065, pan: 0.18 });
  } catch (error) {
    console.warn("Son badge indisponible :", error);
  }
}

function showAchievementUnlockPopup(achievement) {
  if (
    !ui.achievementUnlockOverlay ||
    !ui.achievementUnlockImage ||
    !ui.achievementUnlockName ||
    !ui.achievementUnlockDesc
  ) {
    showToast(`🏅 Nouveau badge débloqué : ${achievement.name} !`, "success");
    return;
  }

  ui.achievementUnlockImage.src = achievement.image;
  ui.achievementUnlockImage.alt = achievement.name;
  ui.achievementUnlockName.textContent = achievement.name;
  ui.achievementUnlockDesc.textContent = achievement.desc;

  playAchievementUnlockSound();

  ui.achievementUnlockOverlay.classList.remove("hidden");
  ui.achievementUnlockOverlay.classList.remove("show");

  requestAnimationFrame(() => {
    ui.achievementUnlockOverlay.classList.add("show");
  });

  setTimeout(() => {
    ui.achievementUnlockOverlay.classList.remove("show");

    setTimeout(() => {
      ui.achievementUnlockOverlay.classList.add("hidden");
      showNextAchievementUnlock();
    }, 280);
  }, 2600);
}

function queueAchievementUnlocks(achievements) {
  if (!achievements.length) return;

  achievementUnlockQueue.push(...achievements);

  if (!isShowingAchievementUnlock) {
    showNextAchievementUnlock();
  }
}

function showNextAchievementUnlock() {
  const nextAchievement = achievementUnlockQueue.shift();

  if (!nextAchievement) {
    isShowingAchievementUnlock = false;
    return;
  }

  isShowingAchievementUnlock = true;
  showAchievementUnlockPopup(nextAchievement);
}

function renderAchievements() {
  const profile = getActiveProfile();

  if (!ui.achievementsList || !profile) {
    return;
  }

  const achievements = getAchievementList(profile);
  ui.achievementsList.innerHTML = "";

  for (const achievement of achievements) {
    const isRareAchievement = achievement.id.startsWith("collection-rare");

    // Les 3 badges rares restent secrets tant qu'ils ne sont pas débloqués
    if (isRareAchievement && !achievement.unlocked) {
      continue;
    }

    const badge = document.createElement("article");
    const isNew = recentlyUnlockedAchievementIds.has(achievement.id);

    badge.className = `achievement-badge ${achievement.unlocked ? "unlocked" : "locked"} ${isNew ? "achievement-new" : ""}`;
    badge.setAttribute("tabindex", "0");

    badge.innerHTML = `
      <div class="achievement-image-wrap">
        <img
          class="achievement-image"
          src="${achievement.image}"
          alt="${escapeHtml(achievement.name)}"
          loading="lazy"
        >
      </div>

      <div class="achievement-tooltip">
        <div class="achievement-tooltip-name">${escapeHtml(achievement.name)}</div>
        <div class="achievement-tooltip-desc">${escapeHtml(achievement.desc)}</div>
        <div class="achievement-tooltip-state ${achievement.unlocked ? "unlocked" : "locked"}">
          ${achievement.unlocked ? "Débloqué" : "Verrouillé"}
        </div>
      </div>
    `;

    badge.addEventListener("click", event => {
      event.stopPropagation();

      const wasOpen = badge.classList.contains("tooltip-open");

      document.querySelectorAll(".achievement-badge.tooltip-open").forEach(el => {
        el.classList.remove("tooltip-open");
      });

      if (!wasOpen) {
        badge.classList.add("tooltip-open");
      }
    });

    ui.achievementsList.appendChild(badge);
  }

  if (recentlyUnlockedAchievementIds.size > 0) {
    setTimeout(() => {
      recentlyUnlockedAchievementIds.clear();

      document.querySelectorAll(".achievement-new").forEach(element => {
        element.classList.remove("achievement-new");
      });
    }, 1600);
  }
}

function updateMiniStats(progress = null) {
  if (!ui.topbarMiniStats) return;

  if (!currentGameId || !progress) {
    ui.topbarMiniStats.classList.add("hidden");
    ui.topbarMiniStats.textContent = "";
    return;
  }

  ui.topbarMiniStats.textContent = `${progress.done} / ${progress.total} • ${progress.completion}%`;
  ui.topbarMiniStats.classList.remove("hidden");
}

function updateStats() {
  const profile = getActiveProfile();

  if (!profile || !currentGameId) {
    updateMiniStats(null);
    return;
  }

  const progress = calculateGameProgress(profile, currentGameId);
  ui.count.textContent = `${progress.done} / ${progress.total}`;
  ui.percent.textContent = `${progress.completion}%`;
  ui.progressFill.style.width = `${progress.completion}%`;
  updateMiniStats(progress);
}

function toggleShinyLock(id) {
  rememberHistory("shiny lock");
  const obtained = { ...getObtained() };
  const shinyLocked = { ...getShinyLocked() };

  obtained[id] = true;
  shinyLocked[id] = !shinyLocked[id];

  if (!shinyLocked[id]) delete shinyLocked[id];

  saveObtained(obtained);
  saveShinyLocked(shinyLocked);
  renderDex();
}

function saveCurrentDexShinyMode() {
  const state = getCurrentDexState();
  if (!state) return;

  state.shinyMode = ui.shinyMode.checked;
  saveProfiles();
}

function loadCurrentDexShinyMode() {
  const state = getCurrentDexState();
  ui.shinyMode.checked = Boolean(state?.shinyMode);
}

function togglePokemon(id) {
  rememberHistory("cocher Pokémon");
  lastUpdatedPokemonKey = String(id);
  const profile = getActiveProfile();
  const obtained = { ...getObtained() };
  const shinyLocked = { ...getShinyLocked() };
  const wasObtained = Boolean(obtained[id]);

  obtained[id] = !obtained[id];

  if (!obtained[id]) {
    delete obtained[id];
    delete shinyLocked[id];
    playUiSound("remove");
  } else {
    playUiSound("check");
  }

  saveObtained(obtained);
  saveShinyLocked(shinyLocked);

  if (profile && !wasObtained && obtained[id]) {
    awardPokemonXp(profile, currentGameId, id);
    if (awardCompletedDexBonus(profile, currentGameId)) showDexCompletePopup(currentGameId);
    saveProfiles();
    showObjectiveAdvanceNotifications(getObjectiveAdvanceMessages(profile, currentGameId, [id]));
  }

  completeFinishedObjectives(true);

  if (profile) {
    awardAllCompletedDexBonuses(profile);
    checkNewAchievements(true);
  }

  renderDex();
}

function toggleFamily(family) {
  rememberHistory("cocher famille");
  const profile = getActiveProfile();
  const pokemons = getPokemonsForGame(currentGameId);
  const obtained = { ...getObtained() };
  const familyPokemons = pokemons.filter(pokemon => pokemon.family === family);
  const allObtained = familyPokemons.every(pokemon => obtained[pokemon.id]);
  const newlyObtainedIds = [];

  for (const pokemon of familyPokemons) {
    if (allObtained) {
      delete obtained[pokemon.id];
    } else {
      const wasObtained = Boolean(obtained[pokemon.id]);
      obtained[pokemon.id] = true;

      if (profile && !wasObtained) {
        awardPokemonXp(profile, currentGameId, pokemon.id);
        newlyObtainedIds.push(pokemon.id);
      }
    }
  }

  saveObtained(obtained);

  if (profile) {
    awardCompletedDexBonus(profile, currentGameId);
    saveProfiles();
    showObjectiveAdvanceNotifications(getObjectiveAdvanceMessages(profile, currentGameId, newlyObtainedIds));
  }

  completeFinishedObjectives(true);
  if (profile) awardAllCompletedDexBonuses(profile);
  renderDex();
}

function showView(view) {
  ui.setupView.classList.add("hidden");
  ui.homeView.classList.add("hidden");
  ui.dexView.classList.add("hidden");
  view.classList.remove("hidden");
}

function setMenuOpen(open) {
  isMenuOpen = open;
  ui.topbarControls?.classList.toggle("collapsed", !isMenuOpen);
  document.body.classList.toggle("topbar-menu-open", isMenuOpen);

  if (ui.menuToggleBtn) {
    ui.menuToggleBtn.textContent = isMenuOpen ? "Fermer" : "Menu";
  }
}

function setObjectivesCollapsed(collapsed) {
  areObjectivesCollapsed = collapsed;

  document.querySelector(".objectives-panel")?.classList.toggle("objectives-collapsed", areObjectivesCollapsed);

  if (ui.toggleObjectivesBtn) {
    ui.toggleObjectivesBtn.textContent = areObjectivesCollapsed ? "Afficher" : "Réduire";
  }
}

function updateTopbarVisibility(mode) {
  document.body.classList.toggle("view-dex", mode === "dex");
  document.body.classList.toggle("view-home", mode === "home");
  document.body.classList.toggle("view-setup", mode === "setup");

  const dexOnlyControls = [
    ui.shinyMode.closest("label"),
    ui.missingOnlyMode.closest("label"),
    ui.favoritesOnlyMode?.closest("label"),
    ui.typeFilterLabel,
    ui.generationFilterLabel,
    ui.sortFilterLabel,
    ui.undoBtn,
    ui.redoBtn,
    ui.searchHelpBtn,
    ui.checkVisibleBtn,
    ui.uncheckVisibleBtn
  ];

  for (const element of dexOnlyControls) {
    if (element) element.style.display = mode === "dex" ? "" : "none";
  }

  // Sécurité : le filtre Type est uniquement pour un Dex ouvert, jamais sur l'accueil.
  if (ui.typeFilterLabel) {
    ui.typeFilterLabel.style.display = mode === "dex" ? "inline-flex" : "none";
    ui.typeFilterLabel.classList.toggle("hidden", mode !== "dex");
  }

  ui.hideCompletedDexLabel.style.display = mode === "home" ? "" : "none";

  const setupHiddenControls = [
    ui.profileSelectLabel,
    ui.newProfileBtn,
    ui.editProfileBtn,
    ui.exportSaveBtn,
    ui.importSaveBtn,
    ui.deleteProfileBtn,
    ui.statsPageBtn,
    ui.achievementsPageBtn,
    ui.aboutPageBtn,
    ui.shareProfileBtn
  ];

  for (const element of setupHiddenControls) {
    element.style.display = mode === "setup" ? "none" : "";
  }

  if (mode === "setup") {
    ui.homeBtn.style.display = "none";
    ui.menuToggleBtn.style.display = "none";
    ui.topbarControls.classList.add("collapsed");
    updateMiniStats(null);
    return;
  }

  ui.homeBtn.style.display = "";
  ui.menuToggleBtn.style.display = "";
  ui.topbarControls.classList.toggle("collapsed", !isMenuOpen);

  if (mode !== "dex") updateMiniStats(null);
}

function renderProfileSelect() {
  ui.profileSelect.innerHTML = "";

  for (const profile of Object.values(profiles)) {
    const option = document.createElement("option");
    option.value = profile.id;
    option.textContent = profile.name;
    option.selected = profile.id === activeProfileId;
    ui.profileSelect.appendChild(option);
  }
}

function renderSetupDexChoices(selectedDexes = []) {
  const selected = new Set(selectedDexes);
  ui.setupDexChoices.innerHTML = "";

  for (const game of games) {
    const label = document.createElement("label");
    label.className = "dex-choice";
    label.innerHTML = `
      <input type="checkbox" value="${game.id}" ${selected.has(game.id) ? "checked" : ""}>
      ${game.name}
    `;
    ui.setupDexChoices.appendChild(label);
  }
}

function getSelectedSetupDexes() {
  return [...ui.setupDexChoices.querySelectorAll("input:checked")].map(input => input.value);
}

function getGameSpritePreview(gameId) {
  const game = getGame(gameId);
  const pokemons = getPokemonsForGame(gameId);

  if (game?.coverSprites?.length) {
    return game.coverSprites.map(sprite => `
      <img
        src="https://img.pokemondb.net/sprites/home/normal/${sprite.slug}.png"
        alt="${escapeHtml(sprite.name || sprite.slug)}"
        loading="lazy"
      >
    `).join("");
  }

  let previewPokemons = [];

  if (game?.coverPokemonIds?.length) {
    previewPokemons = game.coverPokemonIds.map(id => pokemons.find(pokemon => pokemon.id === id)).filter(Boolean);
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
        alt="${escapeHtml(pokemon.names?.fr || pokemon.names?.en || pokemon.slug)}"
        loading="lazy"
      >
    `;
  }).join("");
}

function getFilteredHomeGames(profile) {
  const enabled = new Set(profile.enabledDexes || []);

  return games
    .filter(game => enabled.has(game.id))
    .filter(game => {
      if (game.id === "national") return true;
      if (activeDexPlatformFilter === "all") return true;
      return game.platform === activeDexPlatformFilter;
    })
    .sort((a, b) => {
      if (a.id === "national") return -1;
      if (b.id === "national") return 1;
      return 0;
    });
}

function updateDexPlatformFilterButtons() {
  if (!ui.dexPlatformFilters) return;

  ui.dexPlatformFilters.querySelectorAll("[data-platform-filter]").forEach(button => {
    button.classList.toggle("active", button.dataset.platformFilter === activeDexPlatformFilter);
  });
}

function getProfileSummary(profile) {
  let totalPokemon = 0;
  let obtainedPokemon = 0;
  let completedDexes = 0;
  let favoriteCount = 0;

  for (const gameId of profile.enabledDexes || []) {
    const progress = calculateGameProgress(profile, gameId);
    totalPokemon += progress.total;
    obtainedPokemon += progress.done;
    if (progress.completion === 100) completedDexes++;

    const state = getProfileDexState(profile, gameId);
    favoriteCount += Object.values(state.favorites || {}).filter(Boolean).length;
  }

  const objectives = profile.objectives || [];

  return {
    totalPokemon,
    obtainedPokemon,
    completedDexes,
    activeObjectives: objectives.filter(objective => objective.status === "active").length,
    completedObjectives: objectives.filter(objective => objective.status === "completed").length,
    favoriteCount
  };
}

function renderProfileSummary(profile) {
  if (!ui.summaryProfileName || !ui.summaryStatsGrid || !ui.continueDexBtn || !profile) return;

  const summary = getProfileSummary(profile);
  const lastGame = getGame(profile.lastDex);
  const globalRank = getGlobalRank(profile);

  ui.summaryProfileName.textContent = `${profile.name} - ${globalRank.name}`;
  updateGlobalLevelUI(profile);
  ui.summaryLastDex.textContent = lastGame
    ? `Dernier Dex : ${lastGame.shortName || lastGame.name}`
    : "Dernier Dex : aucun";

  ui.summaryStatsGrid.innerHTML = `
    <div class="summary-stat"><span>Pokémon</span><strong>${summary.obtainedPokemon} / ${summary.totalPokemon}</strong></div>
    <div class="summary-stat"><span>Dex terminés</span><strong>${summary.completedDexes}</strong></div>
    <div class="summary-stat"><span>Objectifs actifs</span><strong>${summary.activeObjectives}</strong></div>
    <div class="summary-stat"><span>Objectifs réussis</span><strong>${summary.completedObjectives}</strong></div>
    <div class="summary-stat"><span>Favoris</span><strong>${summary.favoriteCount}</strong></div>
  `;

  ui.continueDexBtn.disabled = !lastGame;
  ui.continueDexBtn.textContent = lastGame ? `▶ Continuer : ${lastGame.shortName || lastGame.name}` : "▶ Continuer";
}

function getAdvancedStatsHtml(profile) {
  const summary = getProfileSummary(profile);
  const rows = [];
  let best = null;
  let worst = null;

  for (const gameId of profile.enabledDexes || []) {
    const game = getGame(gameId);
    const progress = calculateGameProgress(profile, gameId);
    const state = getProfileDexState(profile, gameId);
    const row = {
      game: game?.shortName || game?.name || gameId,
      platform: game?.platform || "?",
      ...progress,
      favorites: Object.values(state.favorites || {}).filter(Boolean).length,
      shinyLocks: Object.values(state.shinyLocked || {}).filter(Boolean).length
    };

    rows.push(row);
    if (!best || row.completion > best.completion) best = row;
    if (!worst || row.completion < worst.completion) worst = row;
  }

  const objectives = profile.objectives || [];
  const completed = objectives.filter(o => o.status === "completed").length;
  const abandoned = objectives.filter(o => o.status === "abandoned").length;
  const successRate = completed + abandoned === 0 ? 0 : Math.round((completed / (completed + abandoned)) * 100);

  return `
    <div class="modal-grid-stats">
      <div><span>Pokémon</span><strong>${summary.obtainedPokemon} / ${summary.totalPokemon}</strong></div>
      <div><span>Dex terminés</span><strong>${summary.completedDexes}</strong></div>
      <div><span>Objectifs réussis</span><strong>${completed}</strong></div>
      <div><span>Taux réussite objectifs</span><strong>${successRate}%</strong></div>
      <div><span>Favoris</span><strong>${summary.favoriteCount}</strong></div>
      <div><span>Meilleur Dex</span><strong>${escapeHtml(best?.game || "-")} (${best?.completion ?? 0}%)</strong></div>
      <div><span>Dex à reprendre</span><strong>${escapeHtml(worst?.game || "-")} (${worst?.completion ?? 0}%)</strong></div>
      <div><span>Rang</span><strong>${escapeHtml(getGlobalRank(profile).name)}</strong></div>
    </div>

    <h3>Détail par Dex</h3>
    <div class="modal-table">
      ${rows.map(row => `
        <div class="modal-table-row">
          <strong>${escapeHtml(row.game)}</strong>
          <span>${row.done}/${row.total}</span>
          <span>${row.completion}%</span>
          <span>⭐ ${row.favorites}</span>
          <span>🔒 ${row.shinyLocks}</span>
        </div>
      `).join("")}
    </div>
  `;
}

function openStatsPage() {
  const profile = getActiveProfile();
  if (!profile) return;
  openGenericModal("Statistiques avancées", getAdvancedStatsHtml(profile));
}

function openAchievementsPage() {
  const profile = getActiveProfile();
  if (!profile) return;

  const achievements = getAchievementList(profile)
    .filter(achievement => !(achievement.id.startsWith("collection-rare") && !achievement.unlocked));

  openGenericModal("Succès / Badges", `
    <div class="modal-badge-grid">
      ${achievements.map(achievement => `
        <article class="modal-badge-card ${achievement.unlocked ? "unlocked" : "locked"}">
          <img src="${achievement.image}" alt="${escapeHtml(achievement.name)}" loading="lazy">
          <strong>${escapeHtml(achievement.name)}</strong>
          <span>${escapeHtml(achievement.desc)}</span>
          <em>${achievement.unlocked ? "Débloqué" : "Verrouillé"}</em>
        </article>
      `).join("")}
    </div>
  `);
}

function openAboutPage() {
  openGenericModal("À propos", `
    <div class="about-content">
      <p><strong>Dex</strong> est un outil personnel de suivi de Pokédex.</p>
      <p>Données Pokédex et sprites : PokémonDB. Noms, types, générations et familles d'évolution : PokéAPI.</p>
      <p>Ce projet est non officiel. Pokémon appartient à Nintendo, Game Freak et Creatures.</p>
      <p>Site : <code>https://cmoilecon.github.io/pokedex/</code></p>
    </div>
  `);
}

function openSearchHelp() {
  openGenericModal("Aide recherche", `
    <div class="search-help-list">
      <p><code>type:eau</code> filtre les Pokémon Eau.</p>
      <p><code>gen:5</code> filtre la génération 5.</p>
      <p><code>fav</code> ou <code>favoris</code> affiche les favoris.</p>
      <p><code>manquant</code> affiche les non obtenus.</p>
      <p><code>obtenu</code> affiche les obtenus.</p>
      <p><code>id:25</code> cherche un numéro.</p>
      <p>Tu peux combiner : <code>type:dragon gen:5 manquant</code></p>
    </div>
  `);
}

function openShareProfilePage() {
  const profile = getActiveProfile();
  if (!profile) return;

  const summary = getProfileSummary(profile);
  const rank = getGlobalRank(profile).name;
  const unlockedAchievements = getAchievementList(profile).filter(achievement => achievement.unlocked);
  const badgesHtml = unlockedAchievements.length > 0
    ? `<div class="share-badges">${unlockedAchievements.map(achievement => `
        <span class="share-badge" title="${escapeHtml(achievement.name)}">
          <img src="${achievement.image}" alt="${escapeHtml(achievement.name)}" loading="lazy">
        </span>
      `).join("")}</div>`
    : `<div class="share-badges-empty">Aucun badge débloqué pour l’instant.</div>`;

  const text = `${profile.name} — ${rank}
${summary.obtainedPokemon}/${summary.totalPokemon} Pokémon
${summary.completedDexes} Dex terminés
https://cmoilecon.github.io/pokedex/`;

  openGenericModal("Partager le profil", `
    <div class="share-card-preview">
      <p class="summary-kicker">Dex</p>
      <h2>${escapeHtml(profile.name)}</h2>
      <p>${escapeHtml(rank)}</p>
      <strong>${summary.obtainedPokemon} / ${summary.totalPokemon} Pokémon</strong>
      <span>${summary.completedDexes} Dex terminés • ${summary.completedObjectives} objectifs réussis</span>
      ${badgesHtml}
      <code>cmoilecon.github.io/pokedex</code>
    </div>
    <textarea class="share-textarea" readonly>${escapeHtml(text)}</textarea>
  `);
}

function renderTypeFilter() {
  if (!ui.typeFilterSelect || !currentGameId) return;

  const currentValue = activeTypeFilter;
  const types = new Set();

  for (const pokemon of getPokemonsForGame(currentGameId)) {
    for (const type of getPokemonTypesForPokemon(pokemon)) types.add(type);
  }

  const orderedTypes = TYPE_ORDER.filter(type => types.has(type));
  activeTypeFilter = currentValue === "all" || types.has(currentValue) ? currentValue : "all";

  ui.typeFilterSelect.innerHTML = `<option value="all">Tous</option>`;

  for (const type of orderedTypes) {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = getTypeLabel(type);
    ui.typeFilterSelect.appendChild(option);
  }

  ui.typeFilterSelect.value = activeTypeFilter;
  ui.typeFilterLabel?.classList.toggle("hidden", orderedTypes.length === 0);
  syncTypeFilterPicker(orderedTypes);
}

function renderGenerationFilter() {
  if (!ui.generationFilterSelect || !currentGameId) return;

  const availableGenerations = new Set();

  for (const pokemon of getPokemonsForGame(currentGameId)) {
    const generation = getPokemonGeneration(pokemon);
    if (generation) availableGenerations.add(generation);
  }

  const orderedGenerations = [...availableGenerations].sort((a, b) => a - b);
  const currentValue = activeGenerationFilter;

  activeGenerationFilter = currentValue === "all" || availableGenerations.has(Number(currentValue)) ? currentValue : "all";

  ui.generationFilterSelect.innerHTML = `<option value="all">Toutes</option>`;

  for (const generation of orderedGenerations) {
    const option = document.createElement("option");
    option.value = String(generation);
    option.textContent = GENERATION_LABELS[generation] || `Gen ${generation}`;
    ui.generationFilterSelect.appendChild(option);
  }

  ui.generationFilterSelect.value = activeGenerationFilter;
  ui.generationFilterLabel?.classList.toggle("hidden", orderedGenerations.length <= 1);
}

function applyPokemonSort(pokemons) {
  const profile = getActiveProfile();
  const sorted = [...pokemons];

  const byDexOrder = (a, b) => getPokemonsForGame(currentGameId).indexOf(a) - getPokemonsForGame(currentGameId).indexOf(b);
  const byName = (a, b) => getPokemonName(a).localeCompare(getPokemonName(b), "fr", { sensitivity: "base" });
  const byObtained = (a, b) => Number(isPokemonObtained(b)) - Number(isPokemonObtained(a)) || byDexOrder(a, b);
  const byMissing = (a, b) => Number(isPokemonObtained(a)) - Number(isPokemonObtained(b)) || byDexOrder(a, b);
  const byFavorite = (a, b) => Number(isPokemonFavorite(b)) - Number(isPokemonFavorite(a)) || byDexOrder(a, b);

  if (activeSortMode === "name-az") sorted.sort(byName);
  else if (activeSortMode === "name-za") sorted.sort((a, b) => -byName(a, b));
  else if (activeSortMode === "obtained-first") sorted.sort(byObtained);
  else if (activeSortMode === "missing-first") sorted.sort(byMissing);
  else if (activeSortMode === "favorites-first") sorted.sort(byFavorite);

  return sorted;
}

function renderHome() {
  const profile = getActiveProfile();
  if (!profile) return;

  currentGameId = null;
  profile.lastView = "home";
  saveProfiles();

  completeFinishedObjectives(false);
  awardAllCompletedDexBonuses(profile);
  checkNewAchievements(false);
  updateGlobalLevelUI(profile);
  renderAchievements();
  renderTopbarAchievements();

  ui.appTitle.textContent = "Dex";
  ui.appSubtitle.textContent = "Menu des Pokédex";
  ui.homeProfileName.textContent = `Profil : ${profile.name}`;
  renderProfileSummary(profile);

  renderProfileSelect();
  refreshObjectivesUI();

  ui.gameGrid.innerHTML = "";

  updateDexPlatformFilterButtons();

  for (const game of getFilteredHomeGames(profile)) {

    const progress = calculateGameProgress(profile, game.id);
    if (ui.hideCompletedDexMode.checked && progress.completion === 100) continue;

    const dexRank = getDexDisplayRank(profile, game.id);
    const card = document.createElement("article");
    card.className = "game-card";
    card.dataset.gameId = game.id;
    card.dataset.platform = game.platform;
    card.innerHTML = `
      <div class="game-sprites">${getGameSpritePreview(game.id)}</div>

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

        <div class="game-level-info ${dexRank.isRare ? "rare" : ""}">${dexRank.text}</div>
      </div>
    `;

    card.addEventListener("click", () => openDex(game.id));
    ui.gameGrid.appendChild(card);
  }

  updateTopbarVisibility("home");
  showView(ui.homeView);
}

function shortcutOpenLastDexOnly() {
  const profile = getActiveProfile();

  if (!profile) {
    showToast("Aucun profil actif.", "warn");
    return;
  }

  const gameId = profile.lastDex || profile.enabledDexes?.[0];

  if (!gameId) {
    showToast("Aucun Dex disponible.", "warn");
    return;
  }

  openDex(gameId);
}

function openDex(gameId, rememberLastDex = true) {
  const profile = getActiveProfile();
  const game = getGame(gameId);

  if (!profile || !game) return;

  currentGameId = gameId;

  if (rememberLastDex) {
    profile.lastView = "dex";
    profile.lastDex = gameId;
    saveProfiles();
  }

  loadCurrentDexShinyMode();
  activeTypeFilter = "all";
  activeGenerationFilter = localStorage.getItem(STORAGE_KEYS.generationFilter) || "all";
  ui.searchInput.value = "";
  if (ui.sortFilterSelect) ui.sortFilterSelect.value = activeSortMode;
  ui.appTitle.textContent = `Dex — ${game.shortName}`;
  ui.appSubtitle.textContent = game.subtitle;

  updateTopbarVisibility("dex");
  showView(ui.dexView);
  renderDex();
}

function renderDex() {
  completeFinishedObjectives(false);
  renderTypeFilter();
  renderGenerationFilter();
  updateUndoRedoButtons();
  ui.dex.innerHTML = "";

  let lastSectionId = null;

  for (const pokemon of getFilteredPokemons()) {
    if (pokemon.sectionId && pokemon.sectionId !== lastSectionId) {
      lastSectionId = pokemon.sectionId;

      const section = document.createElement("div");
      section.className = "dex-section-separator";
      section.innerHTML = `
        <span>${escapeHtml(pokemon.sectionName || "Section du Dex")}</span>
      `;

      ui.dex.appendChild(section);
    }
    const isObtained = isPokemonObtained(pokemon);
    const isLocked = isPokemonShinyLocked(pokemon);
    const isFavorite = isPokemonFavorite(pokemon);
    const name = getPokemonName(pokemon);
    const card = document.createElement("article");

    const pokemonKey = getPokemonStorageKey(pokemon);
    card.className = `card ${isObtained ? "obtained" : ""} ${isLocked && ui.shinyMode.checked ? "shiny-locked" : ""} ${isPokemonCardV2Enabled ? "card-v2" : ""} ${(lastUpdatedPokemonKey === pokemonKey || lastUpdatedPokemonKey === String(pokemon.id)) ? "pokemon-just-updated" : ""}`;
    card.innerHTML = `
      <div class="image-zone">
        <img src="${getImageUrl(pokemon)}" alt="${escapeHtml(name)}" loading="lazy">
      </div>

      <div class="info-zone">
        <div class="number">${String(pokemon.id).padStart(3, "0")}</div>
        <div class="name">${escapeHtml(name)}</div>
        <div class="check">${isObtained ? (isLocked && ui.shinyMode.checked ? "🔒" : "✅") : "☐"}</div>
      </div>

      ${renderPokemonTypeIcons(pokemon)}

      <div class="card-actions">
        <button class="favorite-btn ${isFavorite ? "active" : ""}" type="button" title="Favori">${isFavorite ? "⭐" : "☆"}</button>
        <a class="info-link" href="${getPokemonInfoUrl(pokemon)}" target="_blank" rel="noopener noreferrer">Infos ↗</a>
        ${ui.shinyMode.checked && isObtained
        ? `<button class="lock-btn ${isLocked ? "active" : ""}" type="button">${isLocked ? "🔒 Shiny Lock" : "🔓 Shiny Lock"}</button>`
        : ""}
      </div>
    `;

    card.querySelector(".favorite-btn")?.addEventListener("click", event => {
      event.stopPropagation();
      toggleFavorite(pokemon);
    });

    card.querySelector(".lock-btn")?.addEventListener("click", event => {
      event.stopPropagation();
      toggleShinyLock(pokemon.id);
    });

    let clickTimer;

    card.addEventListener("click", event => {
      if (event.target.closest("a") || event.target.closest("button")) return;

      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => togglePokemon(pokemon.id), 220);
    });

    card.addEventListener("dblclick", event => {
      if (event.target.closest("a") || event.target.closest("button")) return;

      clearTimeout(clickTimer);
      toggleFamily(pokemon.family);
    });

    ui.dex.appendChild(card);
  }

  updateStats();
  renderDexObjectives();
  renderTopbarAchievements();

  if (lastUpdatedPokemonKey) {
    setTimeout(() => {
      document.querySelectorAll(".pokemon-just-updated").forEach(element => element.classList.remove("pokemon-just-updated"));
      lastUpdatedPokemonKey = null;
    }, 520);
  }
}

function createProfile(name, enabledDexes, nationalLinked = false) {
  const id = createIdFromName(name);
  const dexData = {};

  for (const gameId of enabledDexes) {
    dexData[gameId] = { obtained: {}, shinyMode: false, shinyLocked: {}, favorites: {} };
  }

  profiles[id] = {
    id,
    name,
    enabledDexes,
    lastView: "dex",
    lastDex: enabledDexes[0],
    settings: { nationalLinked },
    dexData,
    objectives: [],
    progress: {
      globalXp: 0,
      dexXp: {},
      earnedPokemon: {},
      objectiveRewarded: {},
      completedDexBonuses: {}
    }
  };

  activeProfileId = id;
  saveProfiles();
  saveActiveProfile();

  return profiles[id];
}

function updateProfileDexes(enabledDexes, nationalLinked) {
  const profile = getActiveProfile();
  if (!profile) return;

  profile.enabledDexes = enabledDexes;
  profile.settings ||= {};
  profile.settings.nationalLinked = nationalLinked;
  profile.dexData ||= {};
  profile.objectives ||= [];

  getProfileProgress(profile);

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
  ui.appTitle.textContent = "Dex Switch";
  ui.appSubtitle.textContent = "Création d'un profil";
  ui.setupProfileName.value = "";
  ui.setupProfileName.disabled = false;
  ui.setupNationalLinked.checked = false;
  ui.createFirstProfileBtn.textContent = "Créer le profil";

  renderSetupDexChoices([]);
  updateTopbarVisibility("setup");
  showView(ui.setupView);
}

function showSetupEdit() {
  const profile = getActiveProfile();
  if (!profile) return;

  setupMode = "edit";
  ui.appTitle.textContent = "Dex Switch";
  ui.appSubtitle.textContent = `Modification du profil ${profile.name}`;
  ui.setupProfileName.value = profile.name;
  ui.setupProfileName.disabled = true;
  ui.setupNationalLinked.checked = Boolean(profile.settings?.nationalLinked);
  ui.createFirstProfileBtn.textContent = "Enregistrer les modifications";

  renderSetupDexChoices(profile.enabledDexes);
  updateTopbarVisibility("setup");
  showView(ui.setupView);
}

function deleteActiveProfile() {
  const profile = getActiveProfile();
  if (!profile) return;

  if (!confirm(`Supprimer le profil "${profile.name}" ?`)) return;

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

function syncProfilesWithGames(saveAfterSync = true) {
  const gameIds = games.map(game => game.id);

  for (const profile of Object.values(profiles)) {
    if (!Array.isArray(profile.enabledDexes)) profile.enabledDexes = [];

    profile.settings ||= { nationalLinked: false };
    profile.dexData ||= {};

    // Migration depuis une ancienne v2 ratée : black-2-white-2 -> black-white-2
    if (profile.dexData["black-2-white-2"] && !profile.dexData["black-white-2"]) {
      profile.dexData["black-white-2"] = profile.dexData["black-2-white-2"];
    }
    delete profile.dexData["black-2-white-2"];

    if (Array.isArray(profile.enabledDexes)) {
      profile.enabledDexes = profile.enabledDexes.map(gameId => gameId === "black-2-white-2" ? "black-white-2" : gameId);
    }

    if (profile.lastDex === "black-2-white-2") profile.lastDex = "black-white-2";

    profile.objectives ||= [];

    for (const objective of profile.objectives) {
      if (objective.gameId === "black-2-white-2") objective.gameId = "black-white-2";
      objective.status ||= "active";
    }

    getProfileProgress(profile);

    for (const gameId of profile.enabledDexes) {
      getProfileDexState(profile, gameId);
    }

    migrateExistingProgress(profile);
    markCurrentAchievementsAsSeen(profile);

    profile.lastView ||= "dex";

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

  if (saveAfterSync) saveProfiles();
}

function loadGlobalSettings() {
  ui.darkMode.checked = localStorage.getItem(STORAGE_KEYS.dark) === "1";
  document.body.classList.toggle("dark", ui.darkMode.checked);

  achievementSoundEnabled = localStorage.getItem(STORAGE_KEYS.sound) !== "0";
  if (ui.soundMode) ui.soundMode.checked = achievementSoundEnabled;

  ui.missingOnlyMode.checked = localStorage.getItem(STORAGE_KEYS.missingOnly) === "1";
  if (ui.favoritesOnlyMode) ui.favoritesOnlyMode.checked = localStorage.getItem(STORAGE_KEYS.favoritesOnly) === "1";
  ui.hideCompletedDexMode.checked = localStorage.getItem(STORAGE_KEYS.hideCompletedDex) === "1";

  activeSortMode = localStorage.getItem(STORAGE_KEYS.sortMode) || "dex";
  activeGenerationFilter = localStorage.getItem(STORAGE_KEYS.generationFilter) || "all";
  if (ui.sortFilterSelect) ui.sortFilterSelect.value = activeSortMode;

  const savedLang = localStorage.getItem(STORAGE_KEYS.lang);

  if (savedLang === "fr" || savedLang === "en") {
    ui.langSelect.value = savedLang;
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

function getBackupData() {
  return {
    app: "dex-switch",
    version: 1,
    exportedAt: new Date().toISOString(),
    activeProfileId,
    profiles,
    globalSettings: {
      dark: localStorage.getItem(STORAGE_KEYS.dark) || "0",
      lang: localStorage.getItem(STORAGE_KEYS.lang) || "fr",
      missingOnly: localStorage.getItem(STORAGE_KEYS.missingOnly) || "0",
      favoritesOnly: localStorage.getItem(STORAGE_KEYS.favoritesOnly) || "0",
      hideCompletedDex: localStorage.getItem(STORAGE_KEYS.hideCompletedDex) || "0",
      sound: localStorage.getItem(STORAGE_KEYS.sound) || "1"
    }
  };
}

function validateBackupData(data) {
  return data && typeof data === "object" && data.app === "dex-switch" && data.profiles && typeof data.profiles === "object";
}

function openBackupExport() {
  const backup = getBackupData();

  ui.backupTitle.textContent = "Exporter la sauvegarde";
  ui.backupText.textContent = "Copie ce JSON compact et garde-le quelque part. Tu peux aussi te l'envoyer sur téléphone.";
  ui.backupArea.value = JSON.stringify(backup);
  ui.copyBackupBtn.style.display = "";
  if (ui.downloadBackupBtn) ui.downloadBackupBtn.style.display = "";
  if (ui.importBackupFileLabel) ui.importBackupFileLabel.style.display = "none";
  ui.applyBackupBtn.style.display = "none";
  if (ui.repairBackupBtn) ui.repairBackupBtn.style.display = "none";
  ui.backupModal.classList.remove("hidden");
  ui.backupArea.focus();
  ui.backupArea.select();
}

function openBackupImport() {
  ui.backupTitle.textContent = "Importer une sauvegarde";
  ui.backupText.textContent = "Colle ici le JSON exporté depuis ton Dex, puis clique sur Importer.";
  ui.backupArea.value = "";
  ui.copyBackupBtn.style.display = "none";
  if (ui.downloadBackupBtn) ui.downloadBackupBtn.style.display = "none";
  if (ui.importBackupFileLabel) ui.importBackupFileLabel.style.display = "";
  ui.applyBackupBtn.style.display = "";
  if (ui.repairBackupBtn) ui.repairBackupBtn.style.display = "";
  ui.backupModal.classList.remove("hidden");
  ui.backupArea.focus();
}

function closeBackupModal() {
  ui.backupModal.classList.add("hidden");
  ui.backupArea.value = "";
}

async function copyBackupText() {
  try {
    await navigator.clipboard.writeText(ui.backupArea.value);
    showToast("✅ Sauvegarde copiée !", "success");
  } catch {
    ui.backupArea.focus();
    ui.backupArea.select();
    showToast("⚠️ Copie manuelle : Ctrl + C.", "warn");
  }
}

function downloadBackupFile() {
  const content = ui.backupArea.value || JSON.stringify(getBackupData(), null, 2);
  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const date = new Date().toISOString().slice(0, 10);
  const a = document.createElement("a");

  a.href = url;
  a.download = `dex-backup-${date}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showToast("✅ Fichier de sauvegarde créé.", "success");
}

async function readBackupFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    ui.backupArea.value = await file.text();
    showToast("✅ Fichier chargé. Tu peux importer.", "success");
  } catch {
    showToast("❌ Impossible de lire ce fichier.", "danger");
  } finally {
    event.target.value = "";
  }
}

function normalizeBackupData(data) {
  if (!validateBackupData(data)) return data;

  data.profiles ||= {};

  for (const profile of Object.values(data.profiles)) {
    profile.dexData ||= {};

    if (profile.dexData["black-2-white-2"] && !profile.dexData["black-white-2"]) {
      profile.dexData["black-white-2"] = profile.dexData["black-2-white-2"];
    }
    delete profile.dexData["black-2-white-2"];

    if (Array.isArray(profile.enabledDexes)) {
      profile.enabledDexes = profile.enabledDexes.map(gameId => gameId === "black-2-white-2" ? "black-white-2" : gameId);
    } else {
      profile.enabledDexes = [];
    }

    if (profile.lastDex === "black-2-white-2") profile.lastDex = "black-white-2";

    profile.settings ||= { nationalLinked: false };
    profile.objectives ||= [];

    for (const objective of profile.objectives) {
      if (objective.gameId === "black-2-white-2") objective.gameId = "black-white-2";
      objective.status ||= "active";
    }

    for (const gameId of profile.enabledDexes) {
      profile.dexData[gameId] ||= { obtained: {}, shinyMode: false, shinyLocked: {}, favorites: {} };
      profile.dexData[gameId].obtained ||= {};
      profile.dexData[gameId].shinyLocked ||= {};
      profile.dexData[gameId].favorites ||= {};
      if (typeof profile.dexData[gameId].shinyMode !== "boolean") profile.dexData[gameId].shinyMode = false;
    }
  }

  return data;
}

function applyBackupImport() {
  try {
    const data = normalizeBackupData(JSON.parse(ui.backupArea.value));

    if (!validateBackupData(data)) {
      showToast("⚠️ JSON invalide : ce n'est pas une sauvegarde Dex Switch.", "warn");
      return;
    }

    const ok = confirm("Importer cette sauvegarde ?\n\nAttention : ça va remplacer les profils actuels.");
    if (!ok) return;

    profiles = data.profiles;
    activeProfileId = data.activeProfileId && profiles[data.activeProfileId]
      ? data.activeProfileId
      : Object.values(profiles)[0]?.id || null;

    if (data.globalSettings) {
      if (["0", "1"].includes(data.globalSettings.dark)) localStorage.setItem(STORAGE_KEYS.dark, data.globalSettings.dark);
      if (["fr", "en"].includes(data.globalSettings.lang)) localStorage.setItem(STORAGE_KEYS.lang, data.globalSettings.lang);
      if (["0", "1"].includes(data.globalSettings.missingOnly)) localStorage.setItem(STORAGE_KEYS.missingOnly, data.globalSettings.missingOnly);
      if (["0", "1"].includes(data.globalSettings.favoritesOnly)) localStorage.setItem(STORAGE_KEYS.favoritesOnly, data.globalSettings.favoritesOnly);
      if (["0", "1"].includes(data.globalSettings.hideCompletedDex)) localStorage.setItem(STORAGE_KEYS.hideCompletedDex, data.globalSettings.hideCompletedDex);
      if (["0", "1"].includes(data.globalSettings.sound)) localStorage.setItem(STORAGE_KEYS.sound, data.globalSettings.sound);
    }

    saveProfiles();
    saveActiveProfile();
    loadGlobalSettings();
    syncProfilesWithGames();
    closeBackupModal();
    showToast("✅ Sauvegarde importée !", "success");
    goToLastPlaceForActiveProfile();
  } catch {
    showToast("❌ Impossible de lire ce JSON.", "danger");
  }
}

function repairAndApplyBackupImport() {
  applyBackupImport();
}

function getFirstActiveObjective() {
  return getActiveObjectives(getActiveProfile())[0] || null;
}

function getMissingObjectivePokemonIds(objective) {
  const profile = getActiveProfile();
  if (!profile || !objective) return [];

  const obtained = getProfileDexState(profile, objective.gameId).obtained || {};
  return (objective.pokemonIds || []).filter(pokemonId => !obtained[pokemonId]);
}

function debugAdvanceFirstObjective() {
  const objective = getFirstActiveObjective();

  if (!objective) {
    showToast("🧪 Aucun objectif actif à avancer.", "warn");
    return;
  }

  const missingIds = getMissingObjectivePokemonIds(objective);

  if (missingIds.length === 0) {
    completeFinishedObjectives(true);
    refreshObjectivesUI();

    if (currentGameId) {
      renderDex();
    }

    return;
  }

  if (currentGameId !== objective.gameId) openDex(objective.gameId);
  togglePokemon(missingIds[0]);
}

function debugRetreatFirstObjective() {
  const objective = getFirstActiveObjective();
  const profile = getActiveProfile();

  if (!objective || !profile) {
    showToast("🧪 Aucun objectif actif.", "warn");
    return;
  }

  const obtained = getProfileDexState(profile, objective.gameId).obtained || {};
  const obtainedTargetId = (objective.pokemonIds || []).find(pokemonId => obtained[pokemonId]);

  if (!obtainedTargetId) {
    showToast("🧪 Aucun Pokémon de cette quête à décocher.", "warn");
    return;
  }

  if (currentGameId !== objective.gameId) openDex(objective.gameId);

  togglePokemon(obtainedTargetId);
  showToast("🧪 Quête reculée de 1.", "warn");
}

function debugCompleteFirstObjective() {
  const objective = getFirstActiveObjective();

  if (!objective) {
    showToast("🧪 Aucun objectif actif à terminer.", "warn");
    return;
  }

  const missingIds = getMissingObjectivePokemonIds(objective);

  if (missingIds.length === 0) {
    completeFinishedObjectives(true);
    refreshObjectivesUI();

    if (currentGameId) {
      renderDex();
    }

    return;
  }

  if (currentGameId !== objective.gameId) openDex(objective.gameId);

  for (const pokemonId of missingIds) {
    if (!getCurrentDexState()?.obtained?.[pokemonId]) {
      togglePokemon(pokemonId);
    }
  }
}

function debugRemoveFirstObjective() {
  const objective = getFirstActiveObjective();

  if (!objective) {
    showToast("🧪 Aucun objectif actif à abandonner.", "warn");
    return;
  }

  abandonObjective(objective.id, false);
}

function debugReplaceFirstObjective() {
  const objective = getFirstActiveObjective();

  if (!objective) {
    showToast("🧪 Aucun objectif actif à remplacer.", "warn");
    return;
  }

  abandonObjective(objective.id, true);
}

function debugResetActiveObjectives() {
  const profile = getActiveProfile();
  if (!profile?.objectives) return;

  for (const objective of profile.objectives) {
    if (objective.status === "active") {
      objective.status = "abandoned";
      objective.abandonedAt = new Date().toISOString();
    }
  }

  activeObjectiveFilterId = null;
  saveProfiles();
  refreshObjectivesUI();

  if (currentGameId) {
    renderDex();
  } else {
    renderHome();
  }

  showToast("🧪 Objectifs actifs reset.", "warn");
}

function debugShowCurrentObjective() {
  const objective = getFirstActiveObjective();

  if (!objective) {
    showToast("🧪 Aucun objectif actif.", "warn");
    return;
  }

  setObjectiveFilter(objective.id, false);
}

function debugClearQuestFilter() {
  if (!currentGameId) {
    showToast("🧪 Ouvre un Dex d'abord.", "warn");
    return;
  }

  if (!activeObjectiveFilterId) {
    showToast("🧪 Aucun filtre quête actif.", "warn");
    return;
  }

  clearObjectiveFilter();
}

function debugShowRanks() {
  const profile = getActiveProfile();

  if (!profile) {
    showToast("🧪 Aucun profil actif.", "warn");
    return;
  }

  const globalRank = getGlobalRank(profile);
  const rareRank = getRareGlobalRank(profile);

  showToast(rareRank ? `🧪 ${globalRank.name} — ${rareRank}` : `🧪 Rang global : ${globalRank.name}`, "success");
}

function debugSimulateAchievementUnlock() {
  const profile = getActiveProfile();

  if (!profile) {
    showToast("🧪 Aucun profil actif.", "warn");
    return;
  }

  const achievements = getAchievementList(profile);
  const unlockedAchievement = achievements.find(achievement => achievement.unlocked) || achievements[0];

  recentlyUnlockedAchievementIds = new Set([unlockedAchievement.id]);
  queueAchievementUnlocks([unlockedAchievement]);
  renderAchievements();

  showToast("🧪 Simulation badge lancée.", "success");
}

function debugOpenHome() {
  renderHome();
  showToast("🧪 Home ouverte.", "success");
}

function debugOpenLastDex() {
  const profile = getActiveProfile();
  const gameId = profile?.lastDex || profile?.enabledDexes?.[0];

  if (!gameId) {
    showToast("🧪 Aucun Dex disponible.", "warn");
    return;
  }

  openDex(gameId);
  showToast("🧪 Dex ouvert.", "success");
}

function debugToggleMenu() {
  setMenuOpen(!isMenuOpen);
  showToast(isMenuOpen ? "🧪 Menu ouvert." : "🧪 Menu fermé.", "success");
}

function debugToggleDark() {
  ui.darkMode.checked = !ui.darkMode.checked;
  ui.darkMode.dispatchEvent(new Event("change"));
  showToast("🧪 Dark mode basculé.", "success");
}

function debugToggleLang() {
  ui.langSelect.value = ui.langSelect.value === "fr" ? "en" : "fr";
  ui.langSelect.dispatchEvent(new Event("change"));
  showToast(`🧪 Langue : ${ui.langSelect.value.toUpperCase()}`, "success");
}

function debugToggleMissingOnly() {
  if (!currentGameId) {
    showToast("🧪 Ouvre un Dex d'abord.", "warn");
    return;
  }

  ui.missingOnlyMode.checked = !ui.missingOnlyMode.checked;
  ui.missingOnlyMode.dispatchEvent(new Event("change"));
  showToast("🧪 Filtre manquants basculé.", "success");
}

function debugToggleShinyMode() {
  if (!currentGameId) {
    showToast("🧪 Ouvre un Dex d'abord.", "warn");
    return;
  }

  ui.shinyMode.checked = !ui.shinyMode.checked;
  ui.shinyMode.dispatchEvent(new Event("change"));
  showToast("🧪 Shiny Dex basculé.", "success");
}

function debugCheckOneVisible() {
  if (!currentGameId) {
    showToast("🧪 Ouvre un Dex d'abord.", "warn");
    return;
  }

  const firstMissing = getFilteredPokemons().find(pokemon => !isPokemonObtained(pokemon));

  if (!firstMissing) {
    showToast("🧪 Aucun Pokémon visible à cocher.", "warn");
    return;
  }

  togglePokemon(firstMissing.id);
}

function debugUncheckOneVisible() {
  if (!currentGameId) {
    showToast("🧪 Ouvre un Dex d'abord.", "warn");
    return;
  }

  const firstObtained = getFilteredPokemons().find(pokemon => isPokemonObtained(pokemon));

  if (!firstObtained) {
    showToast("🧪 Aucun Pokémon visible à décocher.", "warn");
    return;
  }

  togglePokemon(firstObtained.id);
}

function debugCompleteCurrentDex() {
  const profile = getActiveProfile();

  if (!profile || !currentGameId) {
    showToast("🧪 Ouvre un Dex d'abord.", "warn");
    return;
  }

  const obtained = { ...getObtained() };
  const newlyObtainedIds = [];

  for (const pokemon of getPokemonsForGame(currentGameId)) {
    const wasObtained = Boolean(obtained[pokemon.id]);
    obtained[pokemon.id] = true;

    if (!wasObtained) {
      newlyObtainedIds.push(pokemon.id);
      awardPokemonXp(profile, currentGameId, pokemon.id);
    }
  }

  saveObtained(obtained);
  awardCompletedDexBonus(profile, currentGameId);
  saveProfiles();
  showObjectiveAdvanceNotifications(getObjectiveAdvanceMessages(profile, currentGameId, newlyObtainedIds));
  completeFinishedObjectives(true);
  renderDex();
  showToast("🧪 Dex complété.", "success");
}

function debugEmptyCurrentDex() {
  if (!currentGameId) {
    showToast("🧪 Ouvre un Dex d'abord.", "warn");
    return;
  }

  saveObtained({});
  saveShinyLocked({});
  renderDex();
  showToast("🧪 Dex vidé.", "warn");
}

function debugCompleteShinyNoLocksCurrentDex() {
  const profile = getActiveProfile();

  if (!profile || !currentGameId) {
    showToast("🧪 Ouvre un Dex d'abord.", "warn");
    return;
  }

  const state = getProfileDexState(profile, currentGameId);
  const obtained = { ...state.obtained };
  const shinyLocked = state.shinyLocked || {};

  state.shinyMode = true;
  ui.shinyMode.checked = true;

  for (const pokemon of getPokemonsForGame(currentGameId)) {
    if (shinyLocked[pokemon.id]) continue;

    if (!obtained[pokemon.id]) {
      awardPokemonXp(profile, currentGameId, pokemon.id);
    }

    obtained[pokemon.id] = true;
  }

  state.obtained = obtained;
  awardCompletedDexBonus(profile, currentGameId);
  saveProfiles();
  renderDex();
  showToast("🧪 Shiny sans locks complété.", "success");
}

function debugToggleOneShinyLock() {
  const profile = getActiveProfile();

  if (!profile || !currentGameId) {
    showToast("🧪 Ouvre un Dex d'abord.", "warn");
    return;
  }

  const pokemons = getPokemonsForGame(currentGameId);
  const state = getProfileDexState(profile, currentGameId);
  const shinyLocked = { ...state.shinyLocked };
  const target = pokemons.find(pokemon => !shinyLocked[pokemon.id]) || pokemons[0];

  if (!target) {
    showToast("🧪 Aucun Pokémon.", "warn");
    return;
  }

  shinyLocked[target.id] = !shinyLocked[target.id];

  if (!shinyLocked[target.id]) delete shinyLocked[target.id];

  state.shinyLocked = shinyLocked;
  state.obtained[target.id] = true;
  saveProfiles();
  renderDex();
  showToast(`🧪 Shiny Lock : ${getPokemonName(target)}`, "success");
}

function debugClearShinyLocksCurrentDex() {
  const profile = getActiveProfile();

  if (!profile || !currentGameId) {
    showToast("🧪 Ouvre un Dex d'abord.", "warn");
    return;
  }

  getProfileDexState(profile, currentGameId).shinyLocked = {};
  saveProfiles();
  renderDex();
  showToast("🧪 Shiny Locks retirés.", "success");
}

function debugRefreshRanks() {
  const profile = getActiveProfile();

  if (!profile) {
    showToast("🧪 Aucun profil actif.", "warn");
    return;
  }

  awardAllCompletedDexBonuses(profile);
  completeFinishedObjectives(false);
  saveProfiles();

  if (currentGameId) {
    renderDex();
  } else {
    renderHome();
  }

  debugShowRanks();
}

function debugCopySummary() {
  const profile = getActiveProfile();

  if (!profile) {
    showToast("🧪 Aucun profil actif.", "warn");
    return;
  }

  const globalRank = getGlobalRank(profile);
  const rareRank = getRareGlobalRank(profile);
  const objectives = profile.objectives || [];
  const text = [
    `Profil : ${profile.name}`,
    `Dex actifs : ${profile.enabledDexes?.length || 0}`,
    `Rang global : ${globalRank.name}`,
    `Dex complétés : ${globalRank.completedDexCount}`,
    `Rang rare : ${rareRank || "Aucun"}`,
    `Objectifs actifs : ${objectives.filter(o => o.status === "active").length}`,
    `Objectifs terminés : ${objectives.filter(o => o.status === "completed").length}`,
    `Objectifs abandonnés : ${objectives.filter(o => o.status === "abandoned").length}`,
    `Dex courant : ${currentGameId || "home"}`
  ].join("\n");

  navigator.clipboard?.writeText(text)
    .then(() => showToast("🧪 Résumé debug copié.", "success"))
    .catch(() => {
      console.log(text);
      showToast("🧪 Résumé debug dans la console.", "warn");
    });
}

function debugCleanHiddenObjectives() {
  const profile = getActiveProfile();
  if (!profile?.objectives) return;

  profile.objectives = profile.objectives.filter(objective => objective.status === "active");
  saveProfiles();
  refreshObjectivesUI();
  showToast("🧪 Objectifs terminés/abandonnés nettoyés.", "warn");
}

function getPanelStorageKey(id) {
  return `dex-switch-panel-position-${id}`;
}

function savePanelPosition(panel) {
  const header = panel.querySelector(".floating-panel-header");
  const rect = header.getBoundingClientRect();

  localStorage.setItem(
    getPanelStorageKey(panel.id),
    JSON.stringify({
      left: rect.left,
      top: rect.top
    })
  );
}

function restorePanelPosition(panel) {
  try {
    const saved = JSON.parse(localStorage.getItem(getPanelStorageKey(panel.id)) || "null");
    if (!saved) return;

    const left = Math.max(0, Math.min(saved.left, window.innerWidth - 80));
    const top = Math.max(0, Math.min(saved.top, window.innerHeight - 60));

    panel.style.left = `${left}px`;
    panel.style.top = `${top}px`;
    panel.style.right = "auto";
    panel.style.bottom = "auto";
  } catch {
    // position ignorée
  }
}

function updatePanelOpeningDirection(panel) {
  const header = panel.querySelector(".floating-panel-header");
  const body = panel.querySelector(".floating-panel-body");
  if (!header || !body) return;

  const rect = header.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceAbove = rect.top;

  panel.classList.toggle("open-up", spaceBelow < 330 && spaceAbove > spaceBelow);
}

function makeFloatingPanelDraggable(panel, handle) {
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let startLeft = 0;
  let startTop = 0;

  handle.addEventListener("mousedown", event => {
    if (event.target.closest("button")) return;

    isDragging = true;
    startX = event.clientX;
    startY = event.clientY;

    const rect = handle.getBoundingClientRect();

    startLeft = rect.left;
    startTop = rect.top;

    panel.style.left = `${startLeft}px`;
    panel.style.top = `${startTop}px`;
    panel.style.right = "auto";
    panel.style.bottom = "auto";

    document.body.style.userSelect = "none";
  });

  window.addEventListener("mousemove", event => {
    if (!isDragging) return;

    const headerRect = handle.getBoundingClientRect();
    const maxLeft = window.innerWidth - headerRect.width;
    const maxTop = window.innerHeight - headerRect.height;

    const nextLeft = Math.max(0, Math.min(maxLeft, startLeft + event.clientX - startX));
    const nextTop = Math.max(0, Math.min(maxTop, startTop + event.clientY - startY));

    panel.style.left = `${nextLeft}px`;
    panel.style.top = `${nextTop}px`;
    panel.style.right = "auto";
    panel.style.bottom = "auto";

    updatePanelOpeningDirection(panel);
  });

  window.addEventListener("mouseup", () => {
    if (!isDragging) return;

    isDragging = false;
    document.body.style.userSelect = "";
    updatePanelOpeningDirection(panel);
    savePanelPosition(panel);
  });
}

function getBestDebugDexId() {
  const profile = getActiveProfile();
  if (!profile) return null;

  return currentGameId || profile.lastDex || profile.enabledDexes?.[0] || null;
}

function ensureDebugDexOpen() {
  const gameId = getBestDebugDexId();

  if (!gameId) {
    showToast("⚠️ Aucun Dex disponible.", "warn");
    return false;
  }

  if (currentGameId !== gameId) {
    openDex(gameId);
  }

  return true;
}

function runDexShortcut(handler) {
  if (!ensureDebugDexOpen()) return;
  handler();
}

function createFloatingPanel({ id, title, enabled, className = "", sections }) {
  if (!enabled || document.querySelector(`#${id}`)) return;

  const panel = document.createElement("section");
  panel.id = id;
  panel.className = `floating-dev-panel ${className} closed`;

  panel.innerHTML = `
    <div class="floating-panel-header">
      <div class="floating-panel-title">${title}</div>
      <button class="btn tiny floating-panel-toggle" type="button">+</button>
    </div>

    <div class="floating-panel-body">
      ${sections.map(section => `
        <div class="floating-panel-section">
          <div class="floating-panel-section-title">${section.title}</div>
          <div class="floating-panel-grid">
            ${section.buttons.map(button => `
              <button id="${button.id}" class="btn tiny ${button.className || ""}" type="button" title="${button.title || button.label}">
                ${button.label}
              </button>
            `).join("")}
          </div>
        </div>
      `).join("")}
    </div>
  `;

  document.body.appendChild(panel);

  restorePanelPosition(panel);
  updatePanelOpeningDirection(panel);

  const toggleBtn = panel.querySelector(".floating-panel-toggle");

  toggleBtn.addEventListener("click", event => {
    event.stopPropagation();

    const isOpening = panel.classList.contains("closed");

    if (isOpening) {
      updatePanelOpeningDirection(panel);
      panel.classList.remove("closed");
      toggleBtn.textContent = "−";
    } else {
      panel.classList.add("closed");
      toggleBtn.textContent = "+";
    }

    savePanelPosition(panel);
  });

  for (const section of sections) {
    for (const button of section.buttons) {
      panel.querySelector(`#${button.id}`)?.addEventListener("click", event => {
        event.stopPropagation();

        try {
          button.handler();
        } catch (error) {
          console.error(error);
          showToast(`❌ Erreur : ${button.label}`, "danger");
        }
      });
    }
  }

  makeFloatingPanelDraggable(panel, panel.querySelector(".floating-panel-header"));
}

function getDebugStateReport() {
  const profile = getActiveProfile();
  const report = [];

  const add = (ok, name, detail = "") => {
    report.push(`${ok ? "✅" : "❌"} ${name}${detail ? ` — ${detail}` : ""}`);
  };

  add(Boolean(profile), "Profil actif", profile ? profile.name : "aucun");
  add(Boolean(currentGameId), "Dex courant", currentGameId || "home");
  add(Boolean(ui.dex), "Grille Dex trouvée");
  add(Boolean(ui.objectivesList), "Liste objectifs accueil trouvée");
  add(Boolean(ui.dexObjectivesList), "Liste objectifs Dex trouvée");
  add(Boolean(ui.toastContainer), "Toasts trouvés");
  add(Boolean(ui.backupModal), "Modal sauvegarde trouvée");
  add(Boolean(ui.achievementUnlockOverlay), "Popup badge trouvée");
  add(Boolean(ui.toggleObjectivesBtn), "Bouton réduire/afficher objectifs trouvé");

  if (profile) {
    const activeObjectives = getActiveObjectives(profile);
    const completed = (profile.objectives || []).filter(o => o.status === "completed").length;
    const abandoned = (profile.objectives || []).filter(o => o.status === "abandoned").length;
    const globalRank = getGlobalRank(profile);

    add(true, "Rang calculé", globalRank.name);
    add(true, "Dex actifs", String(profile.enabledDexes?.length || 0));
    const totalObjectives = profile.objectives?.length || 0;

    add(true, "Objectifs total", String(totalObjectives));
    add(true, "Objectifs actifs", String(activeObjectives.length));
    add(true, "Objectifs terminés", String(completed));
    add(true, "Objectifs abandonnés", String(abandoned));

    if (totalObjectives === 0) {
      add(true, "Historique objectifs", "vide");
    }
  }

  return report;
}

function debugShowReport() {
  const report = getDebugStateReport();
  const text = `===== RAPPORT DEBUG DEX SWITCH =====\n${report.join("\n")}`;

  console.log(text);

  navigator.clipboard?.writeText(text)
    .then(() => showToast("✅ Rapport debug copié + console.", "success"))
    .catch(() => showToast("✅ Rapport debug dans la console.", "success"));
}

function debugTestButton(name, action, report) {
  try {
    action();
    report.push(`✅ ${name}`);
  } catch (error) {
    console.error(error);
    report.push(`❌ ${name} — ${error.message || error}`);
  }
}

function toggleDebugPanelVisibility() {
  let panel = document.querySelector("#debugPanel");
  let btn = document.querySelector("#toggleDebugMenuBtn");

  if (!panel) {
    localStorage.setItem(STORAGE_KEYS.debugEnabled, "1");
    createDebugMenu();
    createDebugToggleButton();
    panel = document.querySelector("#debugPanel");
    btn = document.querySelector("#toggleDebugMenuBtn");
  }

  if (!panel) return;

  isDebugPanelVisible = !isDebugPanelVisible;
  localStorage.setItem(STORAGE_KEYS.debugEnabled, isDebugPanelVisible ? "1" : "0");

  panel.classList.toggle("hidden", !isDebugPanelVisible);
  btn?.classList.toggle("debug-toggle-off", !isDebugPanelVisible);
}

function debugRunFullTest() {
  const report = [];

  debugTestButton("État général", () => getDebugStateReport(), report);
  debugTestButton("Accueil", () => renderHome(), report);
  debugTestButton("Ouvrir Dex", () => debugOpenLastDex(), report);
  debugTestButton("Menu haut", () => debugToggleMenu(), report);
  debugTestButton("Mode sombre", () => debugToggleDark(), report);
  debugTestButton("Langue", () => debugToggleLang(), report);

  debugTestButton("Créer objectif", () => createRandomObjective(), report);
  debugTestButton("Voir première quête", () => debugShowCurrentObjective(), report);
  debugTestButton("Voir Pokémon des quêtes", () => setAllDexObjectivesFilter(), report);
  debugTestButton("Retirer filtre quête", () => clearObjectiveFilter(), report);

  debugTestButton("Cocher 1 Pokémon", () => runDexShortcut(debugCheckOneVisible), report);
  debugTestButton("Décocher 1 Pokémon", () => runDexShortcut(debugUncheckOneVisible), report);
  debugTestButton("Filtre manquants", () => runDexShortcut(debugToggleMissingOnly), report);
  debugTestButton("Mode shiny", () => runDexShortcut(debugToggleShinyMode), report);
  debugTestButton("Shiny lock", () => runDexShortcut(debugToggleOneShinyLock), report);
  debugTestButton("Clear shiny locks", () => runDexShortcut(debugClearShinyLocksCurrentDex), report);

  debugTestButton("Refresh rangs", () => debugRefreshRanks(), report);
  debugTestButton("Badge popup", () => debugSimulateAchievementUnlock(), report);

  const fullReport = [
    "===== TEST COMPLET DEX SWITCH =====",
    ...report,
    "",
    "===== ÉTAT FINAL =====",
    ...getDebugStateReport()
  ].join("\n");

  console.log(fullReport);

  navigator.clipboard?.writeText(fullReport).catch(() => { });

  const okCount = report.filter(line => line.startsWith("✅")).length;
  showToast(`🧪 Test fini : ${okCount}/${report.length} OK. Rapport copié/console.`, okCount === report.length ? "success" : "warn");
}

function shortcutAbandonFirstObjective() {
  const objective = getFirstActiveObjective();

  if (!objective) {
    showToast("⚠️ Aucune quête active à abandonner.", "warn");
    return;
  }

  abandonObjective(objective.id, false);
}

function shortcutViewNextObjective() {
  const profile = getActiveProfile();
  const objectives = getActiveObjectives(profile);

  if (objectives.length === 0) {
    showToast("⚠️ Aucune quête active.", "warn");
    return;
  }

  if (shortcutObjectiveViewIndex >= objectives.length) {
    shortcutObjectiveViewIndex = 0;
  }

  const objective = objectives[shortcutObjectiveViewIndex];
  shortcutObjectiveViewIndex++;

  setObjectiveFilter(objective.id);
}

function createShortcutMenu() {
  createFloatingPanel({
    id: "shortcutPanel",
    title: "Raccourcis",
    enabled: SHORTCUTS_MODE,
    className: "shortcut-panel",
    sections: [
      {
        title: "Dex",
        buttons: [
          {
            id: "shortcutAddBtn",
            label: "Tout +",
            title: "Tout cocher les Pokémon visibles",
            className: "good",
            handler: () => runDexShortcut(() => ui.checkVisibleBtn.click())
          },
          {
            id: "shortcutRemoveBtn",
            label: "Tout -",
            title: "Tout décocher les Pokémon visibles",
            className: "warn",
            handler: () => runDexShortcut(() => ui.uncheckVisibleBtn.click())
          },
          {
            id: "shortcutMissingBtn",
            label: "Manq.",
            title: "Activer/désactiver les Pokémon manquants",
            className: "quest",
            handler: () => runDexShortcut(debugToggleMissingOnly)
          },
          {
            id: "shortcutShinyBtn",
            label: "Shiny",
            title: "Activer/désactiver le mode shiny",
            className: "quest",
            handler: () => runDexShortcut(debugToggleShinyMode)
          }
        ]
      },
      {
        title: "Quêtes",
        buttons: [
          {
            id: "shortcutNewDexQuestBtn",
            label: "Obj. ce dex",
            title: "Créer un objectif pour le Dex ouvert",
            className: "good",
            handler: () => {
              if (!currentGameId) {
                showToast("⚠️ Ouvre un Dex pour créer une quête sur ce Dex.", "warn");
                return;
              }

              createRandomObjective(currentGameId);
            }
          },
          {
            id: "shortcutNewRandomQuestBtn",
            label: "Obj. aléatoire",
            title: "Créer un objectif sur un Dex aléatoire",
            className: "good",
            handler: () => createRandomObjective()
          },
          {
            id: "shortcutQuestViewBtn",
            label: "Voir",
            title: "Voir la quête suivante",
            className: "quest",
            handler: shortcutViewNextObjective
          },
          {
            id: "shortcutQuestAllBtn",
            label: "Quêtes Dex",
            title: "Afficher tous les Pokémon demandés par les quêtes du Dex ouvert",
            className: "quest",
            handler: () => runDexShortcut(setAllDexObjectivesFilter)
          },
          {
            id: "shortcutQuestClearBtn",
            label: "Sans filtre",
            title: "Retirer le filtre quête et réafficher tout le Dex",
            handler: () => runDexShortcut(clearObjectiveFilter)
          }
        ]
      },
      {
        title: "Nav",
        buttons: [
          {
            id: "shortcutHomeBtn",
            label: "Home",
            title: "Retour accueil",
            handler: debugOpenHome
          },
          {
            id: "shortcutDexBtn",
            label: "Dex",
            title: "Ouvrir le dernier Dex",
            handler: shortcutOpenLastDexOnly
          },
          {
            id: "shortcutMenuBtn",
            label: "Menu",
            title: "Ouvrir/fermer le menu du haut",
            handler: debugToggleMenu
          },
          {
            id: "shortcutDarkBtn",
            label: "Dark",
            title: "Activer/désactiver le thème sombre",
            handler: debugToggleDark
          }
        ]
      }
    ]
  });
}

function createDebugMenu() {
  createFloatingPanel({
    id: "debugPanel",
    title: "Debug",
    enabled: localStorage.getItem(STORAGE_KEYS.debugEnabled) === "1",
    className: "debug-panel-full",
    sections: [
      {
        title: "Rapport",
        buttons: [
          {
            id: "debugAllBtn",
            label: "Test all",
            title: "Tester toutes les actions principales",
            className: "good",
            handler: debugRunFullTest
          },
          {
            id: "debugReportBtn",
            label: "Rapport",
            title: "Copier un rapport d'état complet",
            className: "quest",
            handler: debugShowReport
          }
        ]
      },
      {
        title: "Quêtes",
        buttons: [
          {
            id: "debugQuestNewBtn",
            label: "New",
            className: "good",
            handler: () => createRandomObjective()
          },
          {
            id: "debugQuestPlusBtn",
            label: "+1",
            className: "quest",
            handler: debugAdvanceFirstObjective
          },
          {
            id: "debugQuestMinusBtn",
            label: "-1",
            className: "warn",
            handler: debugRetreatFirstObjective
          },
          {
            id: "debugQuestDoneBtn",
            label: "Done",
            className: "good",
            handler: debugCompleteFirstObjective
          },
          {
            id: "debugQuestViewBtn",
            label: "Voir",
            className: "quest",
            handler: debugShowCurrentObjective
          },
          {
            id: "debugQuestAllBtn",
            label: "Toutes",
            className: "quest",
            handler: () => runDexShortcut(setAllDexObjectivesFilter)
          },
          {
            id: "debugQuestReplaceBtn",
            label: "Rpl.",
            className: "warn",
            handler: debugReplaceFirstObjective
          },
          {
            id: "debugQuestAbandonBtn",
            label: "Aban.",
            className: "danger",
            handler: debugRemoveFirstObjective
          },
          {
            id: "debugQuestResetBtn",
            label: "Reset",
            className: "danger",
            handler: debugResetActiveObjectives
          }
        ]
      },
      {
        title: "Dex",
        buttons: [
          {
            id: "debugDexOpenBtn",
            label: "Open",
            handler: debugOpenLastDex
          },
          {
            id: "debugDexAddBtn",
            label: "+1",
            className: "good",
            handler: () => runDexShortcut(debugCheckOneVisible)
          },
          {
            id: "debugDexRemoveBtn",
            label: "-1",
            className: "warn",
            handler: () => runDexShortcut(debugUncheckOneVisible)
          },
          {
            id: "debugDexFullBtn",
            label: "Full",
            className: "good",
            handler: () => runDexShortcut(debugCompleteCurrentDex)
          },
          {
            id: "debugDexEmptyBtn",
            label: "Vider",
            className: "danger",
            handler: () => runDexShortcut(debugEmptyCurrentDex)
          },
          {
            id: "debugDexMissingBtn",
            label: "Manq.",
            className: "quest",
            handler: () => runDexShortcut(debugToggleMissingOnly)
          }
        ]
      },
      {
        title: "Shiny",
        buttons: [
          {
            id: "debugShinyModeBtn",
            label: "Mode",
            className: "quest",
            handler: () => runDexShortcut(debugToggleShinyMode)
          },
          {
            id: "debugShinyLockBtn",
            label: "Lock",
            className: "warn",
            handler: () => runDexShortcut(debugToggleOneShinyLock)
          },
          {
            id: "debugShinyClearBtn",
            label: "Clear",
            className: "danger",
            handler: () => runDexShortcut(debugClearShinyLocksCurrentDex)
          },
          {
            id: "debugShinyFullBtn",
            label: "Full",
            className: "good",
            handler: () => runDexShortcut(debugCompleteShinyNoLocksCurrentDex)
          }
        ]
      },
      {
        title: "UI",
        buttons: [
          {
            id: "debugHomeBtn",
            label: "Home",
            handler: debugOpenHome
          },
          {
            id: "debugMenuBtn",
            label: "Menu",
            handler: debugToggleMenu
          },
          {
            id: "debugDarkBtn",
            label: "Dark",
            handler: debugToggleDark
          },
          {
            id: "debugCardV2Btn",
            label: "Cartes V2",
            className: "quest",
            handler: togglePokemonCardV2
          },
          {
            id: "debugLangBtn",
            label: "Lang",
            handler: debugToggleLang
          }
        ]
      },
      {
        title: "Data",
        buttons: [
          {
            id: "debugRankBtn",
            label: "Rangs",
            className: "good",
            handler: debugRefreshRanks
          },
          {
            id: "debugBadgeBtn",
            label: "Badge",
            className: "good",
            handler: debugSimulateAchievementUnlock
          },
          {
            id: "debugCleanBtn",
            label: "Clean",
            className: "danger",
            handler: debugCleanHiddenObjectives
          },
          {
            id: "debugExportBtn",
            label: "Export",
            className: "quest",
            handler: openBackupExport
          }
        ]
      }
    ]
  });
  const panel = document.querySelector("#debugPanel");
  if (panel) {
    panel.classList.toggle("hidden", !isDebugPanelVisible);
  }
}

function areShortcutsVisible() {
  return localStorage.getItem(STORAGE_KEYS.shortcutsVisible) !== "0";
}

function setShortcutsVisible(visible) {
  localStorage.setItem(STORAGE_KEYS.shortcutsVisible, visible ? "1" : "0");

  const panel = document.querySelector("#shortcutPanel");
  if (panel) {
    panel.classList.toggle("hidden", !visible);
  }

  const btn = document.querySelector("#toggleShortcutsMenuBtn");
  if (btn) {
    btn.textContent = "R";
    btn.title = "Raccourcis (touche R)";
    btn.classList.toggle("shortcut-toggle-off", !visible);
  }
}

function createShortcutsToggleButton() {
  if (!ui.topbarControls || document.querySelector("#toggleShortcutsMenuBtn")) return;

  const button = document.createElement("button");
  button.id = "toggleShortcutsMenuBtn";
  button.className = "btn";
  button.type = "button";
  button.textContent = "R";
  button.title = "Raccourcis (touche R)";

  button.addEventListener("click", () => {
    setShortcutsVisible(!areShortcutsVisible());
  });

  const firstLine = ui.topbarControls.querySelector(".controls-main-line") || ui.topbarControls;
  firstLine.appendChild(button);

  setShortcutsVisible(areShortcutsVisible());
}

function togglePokemonCardV2() {
  isPokemonCardV2Enabled = !isPokemonCardV2Enabled;
  localStorage.setItem(STORAGE_KEYS.pokemonCardV2, isPokemonCardV2Enabled ? "1" : "0");
  if (currentGameId) renderDex();
  showToast(isPokemonCardV2Enabled ? "🧪 Cartes Pokémon V2 activées." : "🧪 Cartes Pokémon V2 désactivées.", "success");
}

function createDebugToggleButton() {
  document.querySelector("#toggleDebugMenuBtn")?.remove();
}

function bindEvents() {

  function closeTopbarDropdowns(except = null) {
    [ui.profileActionsMenu, ui.moreActionsMenu].forEach(menu => {
      if (menu && menu !== except) menu.classList.add("hidden");
    });
  }

  ui.profileActionsBtn?.addEventListener("click", event => {
    event.stopPropagation();
    const menu = ui.profileActionsMenu;
    if (!menu) return;
    const willOpen = menu.classList.contains("hidden");
    closeTopbarDropdowns(menu);
    menu.classList.toggle("hidden", !willOpen);
  });

  ui.moreActionsBtn?.addEventListener("click", event => {
    event.stopPropagation();
    const menu = ui.moreActionsMenu;
    if (!menu) return;
    const willOpen = menu.classList.contains("hidden");
    closeTopbarDropdowns(menu);
    menu.classList.toggle("hidden", !willOpen);
  });

  document.addEventListener("click", event => {
    if (!event.target.closest(".topbar-dropdown-wrap")) closeTopbarDropdowns();
  });




  ui.dexPlatformFilters?.addEventListener("click", event => {
    const button = event.target.closest("[data-platform-filter]");
    if (!button) return;

    activeDexPlatformFilter = button.dataset.platformFilter || "all";
    renderHome();
  });

  if (localStorage.getItem(STORAGE_KEYS.debugEnabled) === "1") {
    createDebugToggleButton();
  }

  document.addEventListener("click", event => {
    if (!event.target.closest(".achievement-badge")) {
      document.querySelectorAll(".achievement-badge.tooltip-open").forEach(el => {
        el.classList.remove("tooltip-open");
      });
    }
  });

  ui.menuToggleBtn.addEventListener("click", () => setMenuOpen(!isMenuOpen));
  ui.randomObjectiveBtn.addEventListener("click", () => {
    createRandomObjective();
  });

  ui.toggleObjectivesBtn?.addEventListener("click", () => {
    setObjectivesCollapsed(!areObjectivesCollapsed);
  });

  ui.historyAllBtn?.addEventListener("click", () => setHistoryFilter("all"));
  ui.historyCompletedBtn?.addEventListener("click", () => setHistoryFilter("completed"));
  ui.historyAbandonedBtn?.addEventListener("click", () => setHistoryFilter("abandoned"));

  ui.historyDexFilter?.addEventListener("change", () => {
    objectiveHistoryDexFilter = ui.historyDexFilter.value;
    objectiveHistoryNeutralFilter = false;
    setObjectiveHistoryCollapsed(false);
    renderObjectiveHistory();
  });

  ui.createFirstProfileBtn.addEventListener("click", () => {
    const enabledDexes = getSelectedSetupDexes();

    if (enabledDexes.length === 0) {
      showToast("⚠️ Choisis au moins un Dex.", "warn");
      return;
    }

    if (setupMode === "create") {
      const name = ui.setupProfileName.value.trim();

      if (!name) {
        showToast("⚠️ Entre un nom de profil.", "warn");
        return;
      }

      const profile = createProfile(name, enabledDexes, ui.setupNationalLinked.checked);
      showToast("✅ Profil créé !", "success");
      openDex(profile.lastDex);
      return;
    }

    updateProfileDexes(enabledDexes, ui.setupNationalLinked.checked);
    showToast("✅ Profil modifié !", "success");
    renderHome();
  });

  ui.selectAllDexBtn.addEventListener("click", () => {
    for (const input of ui.setupDexChoices.querySelectorAll("input[type='checkbox']")) {
      input.checked = true;
    }
  });

  ui.unselectAllDexBtn.addEventListener("click", () => {
    for (const input of ui.setupDexChoices.querySelectorAll("input[type='checkbox']")) {
      input.checked = false;
    }
  });

  ui.homeBtn.addEventListener("click", renderHome);

  ui.continueDexBtn?.addEventListener("click", () => {
    const profile = getActiveProfile();
    const gameId = profile?.lastDex || profile?.enabledDexes?.[0];

    if (!gameId) {
      showToast("⚠️ Aucun Dex à continuer.", "warn");
      return;
    }

    openDex(gameId);
  });

  ui.profileSelect.addEventListener("change", () => {
    activeProfileId = ui.profileSelect.value;
    saveActiveProfile();
    goToLastPlaceForActiveProfile();
  });

  ui.newProfileBtn.addEventListener("click", showSetupCreate);
  ui.editProfileBtn.addEventListener("click", showSetupEdit);
  ui.exportSaveBtn.addEventListener("click", openBackupExport);
  ui.importSaveBtn.addEventListener("click", openBackupImport);
  ui.deleteProfileBtn.addEventListener("click", deleteActiveProfile);
  ui.statsPageBtn?.addEventListener("click", openStatsPage);
  ui.achievementsPageBtn?.addEventListener("click", openAchievementsPage);
  ui.aboutPageBtn?.addEventListener("click", openAboutPage);
  ui.shareProfileBtn?.addEventListener("click", openShareProfilePage);
  ui.genericModalCloseBtn?.addEventListener("click", closeGenericModal);
  ui.genericModal?.addEventListener("click", event => {
    if (event.target === ui.genericModal) closeGenericModal();
  });

  ui.copyBackupBtn.addEventListener("click", copyBackupText);
  ui.downloadBackupBtn?.addEventListener("click", downloadBackupFile);
  ui.importBackupFileInput?.addEventListener("change", readBackupFile);
  ui.applyBackupBtn.addEventListener("click", applyBackupImport);
  ui.repairBackupBtn?.addEventListener("click", repairAndApplyBackupImport);
  ui.closeBackupBtn.addEventListener("click", closeBackupModal);

  ui.backupModal.addEventListener("click", event => {
    if (event.target === ui.backupModal) {
      closeBackupModal();
    }
  });

  ui.searchInput.addEventListener("input", renderDex);

  ui.generationFilterSelect?.addEventListener("change", () => {
    activeGenerationFilter = ui.generationFilterSelect.value || "all";
    saveGlobalSetting(STORAGE_KEYS.generationFilter, activeGenerationFilter);
    if (currentGameId) renderDex();
  });

  ui.sortFilterSelect?.addEventListener("change", () => {
    activeSortMode = ui.sortFilterSelect.value || "dex";
    saveGlobalSetting(STORAGE_KEYS.sortMode, activeSortMode);
    if (currentGameId) renderDex();
  });

  ui.undoBtn?.addEventListener("click", undoLastAction);
  ui.redoBtn?.addEventListener("click", redoLastAction);

  ui.searchHelpBtn?.addEventListener("click", openSearchHelp);

  document.addEventListener("keydown", event => {
    if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "d") {
      event.preventDefault();
      const enabled = localStorage.getItem(STORAGE_KEYS.debugEnabled) === "1";
      localStorage.setItem(STORAGE_KEYS.debugEnabled, enabled ? "0" : "1");
      createDebugMenu();
      createDebugToggleButton();
      const panel = document.querySelector("#debugPanel");
      isDebugPanelVisible = !enabled;
      panel?.classList.toggle("hidden", enabled);
      showToast(enabled ? "Debug désactivé." : "Debug activé.", "success");
      return;
    }

    if (isTypingInForm(event)) return;

    if (event.ctrlKey && !event.shiftKey && event.key.toLowerCase() === "z") {
      event.preventDefault();
      undoLastAction();
      return;
    }

    if (event.ctrlKey && !event.shiftKey && event.key.toLowerCase() === "y") {
      event.preventDefault();
      redoLastAction();
      return;
    }

    if (event.key === "/") {
      event.preventDefault();
      ui.searchInput?.focus();
      return;
    }

    if (currentGameId && event.key.toLowerCase() === "m") {
      ui.missingOnlyMode.checked = !ui.missingOnlyMode.checked;
      saveGlobalSetting(STORAGE_KEYS.missingOnly, ui.missingOnlyMode.checked ? "1" : "0");
      renderDex();
      return;
    }

    if (currentGameId && event.key.toLowerCase() === "f") {
      ui.favoritesOnlyMode.checked = !ui.favoritesOnlyMode.checked;
      saveGlobalSetting(STORAGE_KEYS.favoritesOnly, ui.favoritesOnlyMode.checked ? "1" : "0");
      renderDex();
      return;
    }

    if (currentGameId && event.key.toLowerCase() === "s") {
      ui.shinyMode.checked = !ui.shinyMode.checked;
      saveCurrentDexShinyMode();
      renderDex();
      return;
    }

    if (event.key === "Escape") {
      if (ui.genericModal && !ui.genericModal.classList.contains("hidden")) {
        closeGenericModal();
      } else if (currentGameId) {
        renderHome();
      } else if (isMenuOpen) {
        setMenuOpen(false);
      }
      return;
    }
  });

  ui.langSelect.addEventListener("change", () => {
    saveGlobalSetting(STORAGE_KEYS.lang, ui.langSelect.value);
    currentGameId ? renderDex() : renderHome();
  });

  ui.shinyMode.addEventListener("change", () => {
    saveCurrentDexShinyMode();
    renderDex();
  });

  ui.darkMode.addEventListener("change", () => {
    document.body.classList.toggle("dark", ui.darkMode.checked);
    saveGlobalSetting(STORAGE_KEYS.dark, ui.darkMode.checked ? "1" : "0");
  });

  ui.soundMode?.addEventListener("change", () => {
    achievementSoundEnabled = ui.soundMode.checked;
    saveGlobalSetting(STORAGE_KEYS.sound, achievementSoundEnabled ? "1" : "0");
    if (achievementSoundEnabled) playUiSound("check");
  });

  ui.typeFilterSelect?.addEventListener("change", () => {
    activeTypeFilter = ui.typeFilterSelect.value || "all";
    if (currentGameId) renderDex();
  });

  ui.missingOnlyMode.addEventListener("change", () => {
    saveGlobalSetting(STORAGE_KEYS.missingOnly, ui.missingOnlyMode.checked ? "1" : "0");

    if (currentGameId) {
      renderDex();
    }
  });

  ui.favoritesOnlyMode?.addEventListener("change", () => {
    saveGlobalSetting(STORAGE_KEYS.favoritesOnly, ui.favoritesOnlyMode.checked ? "1" : "0");

    if (currentGameId) {
      renderDex();
    }
  });

  ui.hideCompletedDexMode.addEventListener("change", () => {
    saveGlobalSetting(STORAGE_KEYS.hideCompletedDex, ui.hideCompletedDexMode.checked ? "1" : "0");
    renderHome();
  });

  ui.checkVisibleBtn.addEventListener("click", () => {
    rememberHistory("tout cocher");
    const profile = getActiveProfile();
    const obtained = { ...getObtained() };
    const newlyObtainedIds = [];

    for (const pokemon of getFilteredPokemons()) {
      const wasObtained = Boolean(obtained[pokemon.id]);
      obtained[pokemon.id] = true;

      if (profile && !wasObtained) {
        awardPokemonXp(profile, currentGameId, pokemon.id);
        newlyObtainedIds.push(pokemon.id);
      }
    }

    saveObtained(obtained);

    if (profile) {
      if (awardCompletedDexBonus(profile, currentGameId)) showDexCompletePopup(currentGameId);
      saveProfiles();
      showObjectiveAdvanceNotifications(getObjectiveAdvanceMessages(profile, currentGameId, newlyObtainedIds));
      completeFinishedObjectives(true);
      awardAllCompletedDexBonuses(profile);
      checkNewAchievements(true);
    }

    if (newlyObtainedIds.length > 0) playUiSound("check");
    renderDex();
  });

  ui.uncheckVisibleBtn.addEventListener("click", () => {
    rememberHistory("tout décocher");
    const obtained = { ...getObtained() };

    for (const pokemon of getFilteredPokemons()) {
      delete obtained[pokemon.id];
    }

    saveObtained(obtained);
    playUiSound("remove");
    renderDex();
  });
}

function init() {
  bindEvents();
  loadGlobalSettings();

  profiles = loadProfiles();
  syncProfilesWithGames();

  if (Object.keys(profiles).length === 0) {
    showSetupCreate();
    createShortcutMenu();
    createDebugMenu();
    createShortcutsToggleButton();
    setShortcutsVisible(areShortcutsVisible());
    return;
  }

  if (!activeProfileId || !profiles[activeProfileId]) {
    activeProfileId = Object.values(profiles)[0].id;
    saveActiveProfile();
  }

  goToLastPlaceForActiveProfile();
  createShortcutMenu();
  createDebugMenu();
  createShortcutsToggleButton();
  setShortcutsVisible(areShortcutsVisible());
}

init();