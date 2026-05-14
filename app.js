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

const DEBUG_MODE = true;

const STORAGE_KEYS = {
  profiles: "switch-dex-profiles-v2",
  activeProfile: "switch-dex-active-profile-v2",
  dark: "swsh-dex-dark-v1",
  lang: "swsh-dex-lang-v1",
  missingOnly: "swsh-dex-missing-only-v1",
  hideCompletedDex: "switch-dex-hide-completed-v1"
};

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

const $ = selector => document.querySelector(selector);

const ui = {
  appTitle: $("#appTitle"),
  appSubtitle: $("#appSubtitle"),
  topbarMiniStats: $("#topbarMiniStats"),
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

  homeProfileName: $("#homeProfileName"),
  globalLevelTitle: $("#globalLevelTitle"),
  globalXpText: $("#globalXpText"),
  globalXpFill: $("#globalXpFill"),
  achievementsList: $("#achievementsList"),
  gameGrid: $("#gameGrid"),
  objectivesList: $("#objectivesList"),
  randomObjectiveBtn: $("#randomObjectiveBtn"),
  toggleObjectivesBtn: $("#toggleObjectivesBtn"),

  objectiveHistoryPanel: $("#objectiveHistoryPanel"),
  objectiveHistoryList: $("#objectiveHistoryList"),
  toggleObjectiveHistoryBtn: $("#toggleObjectiveHistoryBtn"),

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
  missingOnlyMode: $("#missingOnlyMode"),
  hideCompletedDexLabel: $("#hideCompletedDexLabel"),
  hideCompletedDexMode: $("#hideCompletedDexMode"),
  checkVisibleBtn: $("#checkVisibleBtn"),
  uncheckVisibleBtn: $("#uncheckVisibleBtn"),

  backupModal: $("#backupModal"),
  backupTitle: $("#backupTitle"),
  backupText: $("#backupText"),
  backupArea: $("#backupArea"),
  copyBackupBtn: $("#copyBackupBtn"),
  applyBackupBtn: $("#applyBackupBtn"),
  closeBackupBtn: $("#closeBackupBtn"),
  toastContainer: $("#toastContainer")
};

let profiles = loadProfiles();
let activeProfileId = localStorage.getItem(STORAGE_KEYS.activeProfile);
let currentGameId = null;
let setupMode = "create";
let isMenuOpen = false;
let areObjectivesCollapsed = false;
let isObjectiveHistoryCollapsed = true;
let activeObjectiveFilterId = null;

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

function getProfileDexState(profile, gameId) {
  profile.dexData ||= {};

  profile.dexData[gameId] ||= {
    obtained: {},
    shinyMode: false,
    shinyLocked: {}
  };

  const state = profile.dexData[gameId];

  state.obtained ||= {};
  state.shinyLocked ||= {};

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

function saveObtained(obtained) {
  const state = getCurrentDexState();
  if (!state) return;

  state.obtained = obtained;
  saveProfiles();
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

function getPokemonInfoUrl(pokemon) {
  if (ui.langSelect.value === "fr") {
    const pokemonCible = pokemon.names?.fr || pokemon.names?.en || pokemon.slug;
    return `https://www.pokepedia.fr/${encodeURIComponent(pokemonCible)}`;
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

function canCreateObjectiveType(profile, type, maxSameType = 2) {
  const sameTypeCount = getActiveObjectives(profile)
    .filter(objective => objective.type === type)
    .length;

  return sameTypeCount < maxSameType;
}

function createRandomObjective() {
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

  const possibleGames = getPossibleObjectiveGames(profile);

  if (possibleGames.length === 0) {
    showToast("✅ Tous tes Dex sélectionnés sont déjà complets.", "success");
    return;
  }

  const familyCandidates = possibleGames.flatMap(item => getFamilyObjectiveCandidates(profile, item.gameId));
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

  if (nextMissingCandidates.length > 0 && canCreateObjectiveType(profile, "catch_next_missing")) {
    questGroups.push({
      type: "catch_next_missing",
      candidates: nextMissingCandidates
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

function clearObjectiveFilter() {
  activeObjectiveFilterId = null;
  renderDex();
  showToast("🔎 Filtre de quête retiré.", "success");
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
  const search = ui.searchInput.value.trim().toLowerCase();
  const pokemons = getPokemonsForGame(currentGameId);
  const profile = getActiveProfile();
  let objectiveFilterIds = null;

  if (profile && activeObjectiveFilterId) {
    const objective = getActiveObjectives(profile).find(item => item.id === activeObjectiveFilterId);

    if (objective && objective.gameId === currentGameId) {
      objectiveFilterIds = new Set((objective.pokemonIds || []).map(String));
    } else {
      activeObjectiveFilterId = null;
    }
  }

  return pokemons.filter(pokemon => {
    if (objectiveFilterIds && !objectiveFilterIds.has(String(pokemon.id))) return false;
    if (ui.missingOnlyMode.checked && isPokemonObtained(pokemon)) return false;

    const id = String(pokemon.id).padStart(3, "0");
    const frName = (pokemon.names?.fr || "").toLowerCase();
    const enName = (pokemon.names?.en || "").toLowerCase();
    const currentName = getPokemonName(pokemon).toLowerCase();

    return id.includes(search) || frName.includes(search) || enName.includes(search) || currentName.includes(search);
  });
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

function renderObjectiveHistory() {
  const profile = getActiveProfile();

  if (!ui.objectiveHistoryPanel || !ui.objectiveHistoryList || !profile) {
    return;
  }

  const completed = getObjectiveHistory(profile, "completed", 5);
  const abandoned = getObjectiveHistory(profile, "abandoned", 5);

  ui.objectiveHistoryList.innerHTML = "";

  if (completed.length === 0 && abandoned.length === 0) {
    ui.objectiveHistoryList.innerHTML = `
      <div class="objective-history-empty">
        Aucun historique pour l’instant.
      </div>
    `;
    return;
  }

  const createHistoryCard = (objective, status) => {
    const game = getGame(objective.gameId);
    const icon = status === "completed" ? "✅" : "🗑️";
    const label = status === "completed" ? "Terminé" : "Abandonné";
    const date = objective.completedAt || objective.abandonedAt || objective.createdAt;
    const progress = calculateObjectiveProgress(objective);

    const card = document.createElement("article");
    card.className = `objective-history-card ${status}`;

    card.innerHTML = `
      <div class="objective-history-title">
        ${icon} ${game?.shortName || game?.name || objective.gameId} — ${escapeHtml(objective.title || "Objectif")}
      </div>

      <div class="objective-history-meta">
        ${label} • ${progress.current}/${progress.target}
        ${date ? `• ${new Date(date).toLocaleDateString("fr-FR")}` : ""}
      </div>
    `;

    return card;
  };

  if (completed.length > 0) {
    for (const objective of completed) {
      ui.objectiveHistoryList.appendChild(createHistoryCard(objective, "completed"));
    }
  }

  if (abandoned.length > 0) {
    for (const objective of abandoned) {
      ui.objectiveHistoryList.appendChild(createHistoryCard(objective, "abandoned"));
    }
  }
}

function setObjectiveHistoryCollapsed(collapsed) {
  isObjectiveHistoryCollapsed = collapsed;

  if (ui.objectiveHistoryPanel) {
    ui.objectiveHistoryPanel.classList.toggle("objective-history-collapsed", isObjectiveHistoryCollapsed);
  }

  if (ui.toggleObjectiveHistoryBtn) {
    ui.toggleObjectiveHistoryBtn.textContent = isObjectiveHistoryCollapsed ? "Afficher" : "Réduire";
  }
}

function renderDexObjectives() {
  const profile = getActiveProfile();

  if (!ui.dexObjectivesPanel || !ui.dexObjectivesList || !profile || !currentGameId) return;

  completeFinishedObjectives(false);

  const objectivesForDex = getActiveObjectives(profile).filter(objective => objective.gameId === currentGameId);

  if (objectivesForDex.length === 0) {
    ui.dexObjectivesPanel.classList.add("hidden");
    ui.dexObjectivesList.innerHTML = "";
    return;
  }

  ui.dexObjectivesPanel.classList.remove("hidden");

  const title = ui.dexObjectivesPanel.querySelector(".dex-objectives-title");

  if (title) {
    title.innerHTML = `
      <span>
        Objectifs de ce Dex
        ${activeObjectiveFilterId ? `<span class="objective-filter-badge">Filtre quête actif</span>` : ""}
      </span>

      <span class="objective-filter-actions">
        ${activeObjectiveFilterId ? `<button id="clearObjectiveFilterBtn" class="btn tiny" type="button">Voir tout le Dex</button>` : ""}
      </span>
    `;

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
  renderDexObjectives();
}

function updateGlobalLevelUI(profile) {
  if (!ui.globalLevelTitle || !ui.globalXpText || !ui.globalXpFill || !profile) return;

  const globalRank = getGlobalRank(profile);
  const rareRank = getRareGlobalRank(profile);
  const globalCompletion = getGlobalCompletionPercent(profile);

  ui.globalLevelTitle.textContent = `Rang global — ${globalRank.name}`;
  ui.globalXpText.innerHTML = `
    Dex complétés : ${globalRank.completedDexCount}
    ${rareRank ? `<div class="rare-rank-text">${rareRank}</div>` : ""}
  `;
  ui.globalXpFill.style.width = `${globalCompletion}%`;
}

function getBadgeImageUrl(fileName) {
  return `https://archives.bulbagarden.net/wiki/Special:Redirect/file/${encodeURIComponent(fileName)}`;
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
      image: getBadgeImageUrl("Boulder Badge.png"),
      unlocked: completedObjectives >= 1
    },
    {
      id: "chasseur-motive",
      name: "Chasseur motivé",
      desc: "Terminer 5 objectifs",
      image: getBadgeImageUrl("Thunder Badge.png"),
      unlocked: completedObjectives >= 5
    },
    {
      id: "enchainement-propre",
      name: "Enchaînement propre",
      desc: "Terminer 10 objectifs",
      image: getBadgeImageUrl("Soul Badge.png"),
      unlocked: completedObjectives >= 10
    },
    {
      id: "routine-capture",
      name: "Routine de capture",
      desc: "Terminer 25 objectifs",
      image: getBadgeImageUrl("Cascade Badge.png"),
      unlocked: completedObjectives >= 25
    },

    {
      id: "premier-dex-complete",
      name: "Premier Dex complété",
      desc: "Compléter 1 Dex à 100%",
      image: getBadgeImageUrl("Rainbow Badge.png"),
      unlocked: completedDexes >= 1
    },
    {
      id: "collectionneur-confirme",
      name: "Collectionneur confirmé",
      desc: "Compléter 2 Dex à 100%",
      image: getBadgeImageUrl("Marsh Badge.png"),
      unlocked: completedDexes >= 2
    },
    {
      id: "grand-collectionneur",
      name: "Grand Collectionneur",
      desc: "Compléter 5 Dex à 100%",
      image: getBadgeImageUrl("Volcano Badge.png"),
      unlocked: completedDexes >= 5
    },
    {
      id: "collectionneur-legendaire",
      name: "Collectionneur légendaire",
      desc: "Compléter 10 Dex à 100%",
      image: getBadgeImageUrl("Earth Badge.png"),
      unlocked: completedDexes >= 10
    },

    {
      id: "premier-shiny-dex",
      name: "Premier Shiny Dex",
      desc: "Compléter 1 Dex en Shiny Dex",
      image: getBadgeImageUrl("Icicle Badge.png"),
      unlocked: shinyCompletedDexes >= 1
    },
    {
      id: "collection-rare-1",
      name: "Collection rare ✦",
      desc: "Tous les Dex hors National en shiny",
      image: getBadgeImageUrl("Rising Badge.png"),
      unlocked: rareStarLevel >= 1
    },
    {
      id: "collection-rare-2",
      name: "Collection rare ✦✦",
      desc: "Tous les Dex + National en shiny",
      image: getBadgeImageUrl("Legend Badge.png"),
      unlocked: rareStarLevel >= 2
    },
    {
      id: "collection-rare-3",
      name: "Collection rare ✦✦✦",
      desc: "Tout shiny complet, shiny locks compris",
      image: getBadgeImageUrl("Beacon Badge.png"),
      unlocked: rareStarLevel >= 3
    }
  ];
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
    badge.className = `achievement-badge ${achievement.unlocked ? "unlocked" : "locked"}`;

    badge.innerHTML = `
      <div class="achievement-image-wrap">
        <img
          class="achievement-image"
          src="${achievement.image}"
          alt="${escapeHtml(achievement.name)}"
          loading="lazy"
        >
      </div>

      <div>
        <div class="achievement-name">${escapeHtml(achievement.name)}</div>
        <div class="achievement-desc">${escapeHtml(achievement.desc)}</div>
        <div class="achievement-state">
          ${achievement.unlocked ? "Débloqué" : "Verrouillé"}
        </div>
      </div>
    `;

    ui.achievementsList.appendChild(badge);
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
  const profile = getActiveProfile();
  const obtained = { ...getObtained() };
  const shinyLocked = { ...getShinyLocked() };
  const wasObtained = Boolean(obtained[id]);

  obtained[id] = !obtained[id];

  if (!obtained[id]) {
    delete obtained[id];
    delete shinyLocked[id];
  }

  saveObtained(obtained);
  saveShinyLocked(shinyLocked);

  if (profile && !wasObtained && obtained[id]) {
    awardPokemonXp(profile, currentGameId, id);
    awardCompletedDexBonus(profile, currentGameId);
    saveProfiles();
    showObjectiveAdvanceNotifications(getObjectiveAdvanceMessages(profile, currentGameId, [id]));
  }

  completeFinishedObjectives(true);
  if (profile) awardAllCompletedDexBonuses(profile);
  renderDex();
}

function toggleFamily(family) {
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
  const dexOnlyControls = [
    ui.shinyMode.closest("label"),
    ui.missingOnlyMode.closest("label"),
    ui.checkVisibleBtn,
    ui.uncheckVisibleBtn
  ];

  for (const element of dexOnlyControls) {
    if (element) element.style.display = mode === "dex" ? "" : "none";
  }

  ui.hideCompletedDexLabel.style.display = mode === "home" ? "" : "none";

  const setupHiddenControls = [
    ui.profileSelectLabel,
    ui.newProfileBtn,
    ui.editProfileBtn,
    ui.exportSaveBtn,
    ui.importSaveBtn,
    ui.deleteProfileBtn
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

function renderHome() {
  const profile = getActiveProfile();
  if (!profile) return;

  currentGameId = null;
  profile.lastView = "home";
  saveProfiles();

  completeFinishedObjectives(false);
  awardAllCompletedDexBonuses(profile);
  updateGlobalLevelUI(profile);
  renderAchievements();

  ui.appTitle.textContent = "Dex Switch";
  ui.appSubtitle.textContent = "Menu des Pokédex";
  ui.homeProfileName.textContent = `Profil : ${profile.name}`;

  renderProfileSelect();
  refreshObjectivesUI();

  ui.gameGrid.innerHTML = "";

  for (const game of games) {
    if (!profile.enabledDexes.includes(game.id)) continue;

    const progress = calculateGameProgress(profile, game.id);
    if (ui.hideCompletedDexMode.checked && progress.completion === 100) continue;

    const dexRank = getDexDisplayRank(profile, game.id);
    const card = document.createElement("article");
    card.className = "game-card";
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

function openDex(gameId) {
  const profile = getActiveProfile();
  const game = getGame(gameId);

  if (!profile || !game) return;

  currentGameId = gameId;
  profile.lastView = "dex";
  profile.lastDex = gameId;
  saveProfiles();

  loadCurrentDexShinyMode();
  ui.searchInput.value = "";
  ui.appTitle.textContent = `Dex — ${game.shortName}`;
  ui.appSubtitle.textContent = game.subtitle;

  updateTopbarVisibility("dex");
  showView(ui.dexView);
  renderDex();
}

function renderDex() {
  completeFinishedObjectives(false);
  ui.dex.innerHTML = "";

  for (const pokemon of getFilteredPokemons()) {
    const isObtained = isPokemonObtained(pokemon);
    const isLocked = isPokemonShinyLocked(pokemon);
    const name = getPokemonName(pokemon);
    const card = document.createElement("article");

    card.className = `card ${isObtained ? "obtained" : ""} ${isLocked && ui.shinyMode.checked ? "shiny-locked" : ""}`;
    card.innerHTML = `
      <div class="image-zone">
        <img src="${getImageUrl(pokemon)}" alt="${escapeHtml(name)}" loading="lazy">
      </div>

      <div class="info-zone">
        <div class="number">${String(pokemon.id).padStart(3, "0")}</div>
        <div class="name">${escapeHtml(name)}</div>
        <div class="check">${isObtained ? (isLocked && ui.shinyMode.checked ? "🔒" : "✅") : "☐"}</div>
      </div>

      <div class="card-actions">
        <a class="info-link" href="${getPokemonInfoUrl(pokemon)}" target="_blank" rel="noopener noreferrer">Infos ↗</a>
        ${ui.shinyMode.checked && isObtained
        ? `<button class="lock-btn ${isLocked ? "active" : ""}" type="button">${isLocked ? "🔒 Shiny Lock" : "🔓 Shiny Lock"}</button>`
        : ""}
      </div>
    `;

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
}

function createProfile(name, enabledDexes, nationalLinked = false) {
  const id = createIdFromName(name);
  const dexData = {};

  for (const gameId of enabledDexes) {
    dexData[gameId] = { obtained: {}, shinyMode: false, shinyLocked: {} };
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

function syncProfilesWithGames() {
  const gameIds = games.map(game => game.id);

  for (const profile of Object.values(profiles)) {
    if (!Array.isArray(profile.enabledDexes)) profile.enabledDexes = [];

    profile.settings ||= { nationalLinked: false };
    profile.dexData ||= {};
    profile.objectives ||= [];

    for (const objective of profile.objectives) {
      objective.status ||= "active";
    }

    getProfileProgress(profile);

    for (const gameId of profile.enabledDexes) {
      getProfileDexState(profile, gameId);
    }

    migrateExistingProgress(profile);

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

  saveProfiles();
}

function loadGlobalSettings() {
  ui.darkMode.checked = localStorage.getItem(STORAGE_KEYS.dark) === "1";
  document.body.classList.toggle("dark", ui.darkMode.checked);

  ui.missingOnlyMode.checked = localStorage.getItem(STORAGE_KEYS.missingOnly) === "1";
  ui.hideCompletedDexMode.checked = localStorage.getItem(STORAGE_KEYS.hideCompletedDex) === "1";

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
      hideCompletedDex: localStorage.getItem(STORAGE_KEYS.hideCompletedDex) || "0"
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
  ui.applyBackupBtn.style.display = "none";
  ui.backupModal.classList.remove("hidden");
  ui.backupArea.focus();
  ui.backupArea.select();
}

function openBackupImport() {
  ui.backupTitle.textContent = "Importer une sauvegarde";
  ui.backupText.textContent = "Colle ici le JSON exporté depuis ton Dex, puis clique sur Importer.";
  ui.backupArea.value = "";
  ui.copyBackupBtn.style.display = "none";
  ui.applyBackupBtn.style.display = "";
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

function applyBackupImport() {
  try {
    const data = JSON.parse(ui.backupArea.value);

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
      if (["0", "1"].includes(data.globalSettings.hideCompletedDex)) localStorage.setItem(STORAGE_KEYS.hideCompletedDex, data.globalSettings.hideCompletedDex);
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

  setObjectiveFilter(objective.id);
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

function makeDebugPanelDraggable(panel, handle) {
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

    const rect = panel.getBoundingClientRect();
    startLeft = rect.left;
    startTop = rect.top;

    panel.style.left = `${startLeft}px`;
    panel.style.top = `${startTop}px`;
    panel.style.bottom = "auto";
    document.body.style.userSelect = "none";
  });

  window.addEventListener("mousemove", event => {
    if (!isDragging) return;

    const nextLeft = Math.max(0, startLeft + event.clientX - startX);
    const nextTop = Math.max(0, startTop + event.clientY - startY);

    panel.style.left = `${nextLeft}px`;
    panel.style.top = `${nextTop}px`;
  });

  window.addEventListener("mouseup", () => {
    if (!isDragging) return;

    isDragging = false;
    document.body.style.userSelect = "";
  });
}

function createDebugMenu() {
  if (!DEBUG_MODE || document.querySelector("#debugPanel")) return;

  const debugPanel = document.createElement("section");
  debugPanel.id = "debugPanel";
  debugPanel.className = "debug-panel closed";
  debugPanel.innerHTML = `
    <div id="debugHeader" class="debug-header">
      <div class="debug-title">🧪 Debug</div>
      <button id="debugToggleBtn" class="btn tiny debug-toggle" type="button">+</button>
    </div>

    <div class="debug-body">
      <div class="debug-section">
        <div class="debug-section-title">Quêtes</div>
        <div class="debug-grid">
          <button id="debugAdvanceObjectiveBtn" class="btn tiny quest" type="button">+1</button>
          <button id="debugRetreatObjectiveBtn" class="btn tiny warn" type="button">-1</button>
          <button id="debugCreateObjectiveBtn" class="btn tiny good" type="button">Créer</button>
          <button id="debugRemoveObjectiveBtn" class="btn tiny danger" type="button">Abandonner</button>
          <button id="debugCompleteObjectiveBtn" class="btn tiny warn" type="button">Finir</button>
          <button id="debugResetObjectivesBtn" class="btn tiny danger" type="button">Reset</button>
          <button id="debugReplaceObjectiveBtn" class="btn tiny warn" type="button">Remplacer</button>
          <button id="debugViewObjectiveBtn" class="btn tiny quest" type="button">Voir quête</button>
          <button id="debugClearQuestFilterBtn" class="btn tiny" type="button">Voir Dex</button>
          <button id="debugRanksBtn" class="btn tiny" type="button">Rangs</button>
        </div>
      </div>

      <div class="debug-section">
        <div class="debug-section-title">Dex</div>
        <div class="debug-grid">
          <button id="debugCheckOneBtn" class="btn tiny good" type="button">+1</button>
          <button id="debugUncheckOneBtn" class="btn tiny warn" type="button">-1</button>
          <button id="debugCompleteDexBtn" class="btn tiny good" type="button">Full Dex</button>
          <button id="debugEmptyDexBtn" class="btn tiny danger" type="button">Vider Dex</button>
        </div>
      </div>

      <div class="debug-section">
        <div class="debug-section-title">Shiny</div>
        <div class="debug-grid">
          <button id="debugToggleShinyBtn" class="btn tiny quest" type="button">Mode</button>
          <button id="debugOneLockBtn" class="btn tiny warn" type="button">Lock +1</button>
          <button id="debugClearLocksBtn" class="btn tiny danger" type="button">Locks 0</button>
          <button id="debugShinyNoLocksBtn" class="btn tiny good" type="button">Shiny full</button>
        </div>
      </div>

      <div class="debug-section">
        <div class="debug-section-title">UI</div>
        <div class="debug-grid">
          <button id="debugHomeBtn" class="btn tiny" type="button">Home</button>
          <button id="debugDexBtn" class="btn tiny" type="button">Dex</button>
          <button id="debugMenuBtn" class="btn tiny" type="button">Menu</button>
          <button id="debugDarkBtn" class="btn tiny" type="button">Dark</button>
          <button id="debugLangBtn" class="btn tiny" type="button">Lang</button>
          <button id="debugMissingBtn" class="btn tiny" type="button">Manquants</button>
        </div>
      </div>

      <div class="debug-section">
        <div class="debug-section-title">Profil</div>
        <div class="debug-grid">
          <button id="debugRefreshRanksBtn" class="btn tiny good" type="button">Refresh</button>
          <button id="debugCopySummaryBtn" class="btn tiny quest" type="button">Copier</button>
          <button id="debugCleanObjectivesBtn" class="btn tiny danger" type="button">Nettoyer</button>
          <button id="debugCloseBtn" class="btn tiny" type="button">Fermer</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(debugPanel);

  const debugToggleBtn = debugPanel.querySelector("#debugToggleBtn");
  debugToggleBtn.addEventListener("click", event => {
    event.stopPropagation();
    const isClosed = debugPanel.classList.toggle("closed");
    debugToggleBtn.textContent = isClosed ? "+" : "−";
  });

  debugPanel.querySelector("#debugCloseBtn").addEventListener("click", () => {
    debugPanel.classList.add("closed");
    debugToggleBtn.textContent = "+";
  });

  const bind = (selector, handler) => {
    debugPanel.querySelector(selector).addEventListener("click", handler);
  };

  bind("#debugAdvanceObjectiveBtn", debugAdvanceFirstObjective);
  bind("#debugRetreatObjectiveBtn", debugRetreatFirstObjective);
  bind("#debugCreateObjectiveBtn", createRandomObjective);
  bind("#debugRemoveObjectiveBtn", debugRemoveFirstObjective);
  bind("#debugCompleteObjectiveBtn", debugCompleteFirstObjective);
  bind("#debugResetObjectivesBtn", debugResetActiveObjectives);
  bind("#debugReplaceObjectiveBtn", debugReplaceFirstObjective);
  bind("#debugViewObjectiveBtn", debugShowCurrentObjective);
  bind("#debugClearQuestFilterBtn", debugClearQuestFilter);
  bind("#debugRanksBtn", debugShowRanks);

  bind("#debugCheckOneBtn", debugCheckOneVisible);
  bind("#debugUncheckOneBtn", debugUncheckOneVisible);
  bind("#debugCompleteDexBtn", debugCompleteCurrentDex);
  bind("#debugEmptyDexBtn", debugEmptyCurrentDex);

  bind("#debugToggleShinyBtn", debugToggleShinyMode);
  bind("#debugOneLockBtn", debugToggleOneShinyLock);
  bind("#debugClearLocksBtn", debugClearShinyLocksCurrentDex);
  bind("#debugShinyNoLocksBtn", debugCompleteShinyNoLocksCurrentDex);

  bind("#debugHomeBtn", debugOpenHome);
  bind("#debugDexBtn", debugOpenLastDex);
  bind("#debugMenuBtn", debugToggleMenu);
  bind("#debugDarkBtn", debugToggleDark);
  bind("#debugLangBtn", debugToggleLang);
  bind("#debugMissingBtn", debugToggleMissingOnly);

  bind("#debugRefreshRanksBtn", debugRefreshRanks);
  bind("#debugCopySummaryBtn", debugCopySummary);
  bind("#debugCleanObjectivesBtn", debugCleanHiddenObjectives);

  makeDebugPanelDraggable(debugPanel, debugPanel.querySelector("#debugHeader"));
}

function bindEvents() {
  ui.menuToggleBtn.addEventListener("click", () => setMenuOpen(!isMenuOpen));
  ui.randomObjectiveBtn.addEventListener("click", createRandomObjective);
  ui.toggleObjectivesBtn.addEventListener("click", () => setObjectivesCollapsed(!areObjectivesCollapsed));
  ui.toggleObjectiveHistoryBtn.addEventListener("click", () => {
    setObjectiveHistoryCollapsed(!isObjectiveHistoryCollapsed);
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

  ui.copyBackupBtn.addEventListener("click", copyBackupText);
  ui.applyBackupBtn.addEventListener("click", applyBackupImport);
  ui.closeBackupBtn.addEventListener("click", closeBackupModal);

  ui.backupModal.addEventListener("click", event => {
    if (event.target === ui.backupModal) {
      closeBackupModal();
    }
  });

  ui.searchInput.addEventListener("input", renderDex);

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

  ui.missingOnlyMode.addEventListener("change", () => {
    saveGlobalSetting(STORAGE_KEYS.missingOnly, ui.missingOnlyMode.checked ? "1" : "0");

    if (currentGameId) {
      renderDex();
    }
  });

  ui.hideCompletedDexMode.addEventListener("change", () => {
    saveGlobalSetting(STORAGE_KEYS.hideCompletedDex, ui.hideCompletedDexMode.checked ? "1" : "0");
    renderHome();
  });

  ui.checkVisibleBtn.addEventListener("click", () => {
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
      awardCompletedDexBonus(profile, currentGameId);
      saveProfiles();
      showObjectiveAdvanceNotifications(getObjectiveAdvanceMessages(profile, currentGameId, newlyObtainedIds));
      completeFinishedObjectives(true);
      awardAllCompletedDexBonuses(profile);
    }

    renderDex();
  });

  ui.uncheckVisibleBtn.addEventListener("click", () => {
    const obtained = { ...getObtained() };

    for (const pokemon of getFilteredPokemons()) {
      delete obtained[pokemon.id];
    }

    saveObtained(obtained);
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
    createDebugMenu();
    return;
  }

  if (!activeProfileId || !profiles[activeProfileId]) {
    activeProfileId = Object.values(profiles)[0].id;
    saveActiveProfile();
  }

  goToLastPlaceForActiveProfile();
  createDebugMenu();
}

init();