const STORAGE_KEYS = {
  theme: "conjure_theme",
  apiKey: "hf_api_key",
  history: "prompt_history",
  favorites: "conjure_favorites",
  sound: "conjure_sound"
};

const promptForm = document.getElementById("prompt-form");
const promptInput = document.getElementById("prompt-input");
const promptCharCount = document.getElementById("prompt-char-count");
const promptQualityLabel = document.getElementById("prompt-quality-label");
const strengthFill = document.getElementById("strength-fill");
const enhancePromptBtn = document.getElementById("enhance-prompt-btn");
const randomPromptBtn = document.getElementById("random-prompt-btn");
const clearPromptBtn = document.getElementById("clear-prompt-btn");

const themeToggle = document.querySelector(".theme-toggle");
const soundToggle = document.getElementById("sound-toggle");
const settingsBtn = document.getElementById("settings-btn");
const settingsPanel = document.getElementById("settings-panel");
const settingsClose = document.getElementById("settings-close");
const apiKeyInput = document.getElementById("api-key-input");
const toggleKeyVisibility = document.getElementById("toggle-key-visibility");
const saveKeyBtn = document.getElementById("save-key-btn");
const clearKeyBtn = document.getElementById("clear-key-btn");
const keyStatus = document.getElementById("key-status");

const tabGeneratorBtn = document.getElementById("tab-generator-btn");
const tabFavoritesBtn = document.getElementById("tab-favorites-btn");
const viewGenerator = document.getElementById("view-generator");
const viewFavorites = document.getElementById("view-favorites");
const favoritesBadge = document.getElementById("favorites-badge");

const modelSelect = document.getElementById("model-select");
const countSelect = document.getElementById("count-select");
const ratioSelect = document.getElementById("ratio-select");
const negativePromptInput = document.getElementById("negative-prompt");
const seedInput = document.getElementById("seed-input");
const randomSeedBtn = document.getElementById("random-seed-btn");
const clearSeedBtn = document.getElementById("clear-seed-btn");
const presetChips = document.getElementById("preset-chips");

const generateBtn = document.getElementById("generate-btn");
const progressBarContainer = document.getElementById("progress-bar-container");
const progressFill = document.getElementById("progress-fill");
const progressText = document.getElementById("progress-text");
const progressPercent = document.getElementById("progress-percent");

const historyRow = document.getElementById("history-row");
const historyChips = document.getElementById("history-chips");
const clearHistoryBtn = document.getElementById("clear-history-btn");

const galleryHeader = document.getElementById("gallery-header");
const galleryCount = document.getElementById("gallery-count");
const galleryTools = document.getElementById("gallery-tools");
const downloadAllBtn = document.getElementById("download-all-btn");
const clearGalleryBtn = document.getElementById("clear-gallery-btn");
const galleryGrid = document.getElementById("gallery-grid");

const favoritesGrid = document.getElementById("favorites-grid");
const favoritesTools = document.getElementById("favorites-tools");
const downloadAllFavsBtn = document.getElementById("download-all-favs-btn");
const clearAllFavsBtn = document.getElementById("clear-all-favs-btn");

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxClose = document.getElementById("lightbox-close");
const lightboxPrev = document.getElementById("lightbox-prev");
const lightboxNext = document.getElementById("lightbox-next");
const lightboxPrompt = document.getElementById("lightbox-prompt");
const lightboxModel = document.getElementById("lightbox-model");
const lightboxDimensions = document.getElementById("lightbox-dimensions");
const lightboxSeed = document.getElementById("lightbox-seed");
const lightboxTime = document.getElementById("lightbox-time");
const lightboxFavBtn = document.getElementById("lightbox-fav-btn");
const lightboxRemixBtn = document.getElementById("lightbox-remix-btn");
const lightboxCopyImgBtn = document.getElementById("lightbox-copy-img-btn");
const lightboxDownloadLink = document.getElementById("lightbox-download-link");
const lightboxDrawer = document.getElementById("lightbox-drawer");
const lightboxDrawerToggle = document.getElementById("lightbox-drawer-toggle");
const toastStack = document.getElementById("toast-stack");
const particleCanvas = document.getElementById("particle-canvas");

let activeStylePreset = "";
let currentCreations = [];
let currentLightboxIndex = -1;
let lightboxSourceList = [];
let soundEnabled = localStorage.getItem(STORAGE_KEYS.sound) !== "false";

let audioCtx = null;
const playChime = (type = "complete") => {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === "complete") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.25);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.start(now);
      osc.stop(now + 0.45);
    } else if (type === "pop") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.08);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    }
  } catch (e) {}
};

let particles = [];
let particleCtx = null;
let animFrame = null;

if (particleCanvas) {
  particleCtx = particleCanvas.getContext("2d");
  const resizeCanvas = () => {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
  };
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
}

const triggerSparkles = (x, y, count = 28) => {
  if (!particleCtx) return;
  const colors = ["#6C4CF1", "#FF5CA8", "#17C7D8", "#F59E0B", "#FFFFFF"];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 6 + 2;
    particles.push({
      x: x || window.innerWidth / 2,
      y: y || window.innerHeight / 2,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1,
      size: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      decay: Math.random() * 0.03 + 0.015
    });
  }
  if (!animFrame) updateParticles();
};

const updateParticles = () => {
  if (!particleCtx) return;
  particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
  particles.forEach((p, idx) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.15;
    p.alpha -= p.decay;
    if (p.alpha <= 0) {
      particles.splice(idx, 1);
    } else {
      particleCtx.save();
      particleCtx.globalAlpha = p.alpha;
      particleCtx.fillStyle = p.color;
      particleCtx.beginPath();
      particleCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      particleCtx.fill();
      particleCtx.restore();
    }
  });

  if (particles.length > 0) {
    animFrame = requestAnimationFrame(updateParticles);
  } else {
    animFrame = null;
  }
};

const on = (el, event, handler) => {
  if (!el) return;
  el.addEventListener(event, handler);
};

(() => {
  const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = savedTheme === "dark" || (!savedTheme && systemPrefersDark);
  document.body.classList.toggle("dark-theme", isDark);
  if (themeToggle) {
    themeToggle.querySelector("i").className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }
  if (soundToggle) {
    soundToggle.querySelector("i").className = soundEnabled ? "fa-solid fa-volume-high" : "fa-solid fa-volume-xmark";
    soundToggle.title = soundEnabled ? "Sound Effects: On" : "Sound Effects: Off";
  }
})();

const toggleTheme = () => {
  const isDark = document.body.classList.toggle("dark-theme");
  localStorage.setItem(STORAGE_KEYS.theme, isDark ? "dark" : "light");
  if (themeToggle) {
    themeToggle.querySelector("i").className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }
  playChime("pop");
};

const toggleSound = () => {
  soundEnabled = !soundEnabled;
  localStorage.setItem(STORAGE_KEYS.sound, soundEnabled);
  if (soundToggle) {
    soundToggle.querySelector("i").className = soundEnabled ? "fa-solid fa-volume-high" : "fa-solid fa-volume-xmark";
    soundToggle.title = soundEnabled ? "Sound Effects: On" : "Sound Effects: Off";
  }
  if (soundEnabled) playChime("pop");
};

const showToast = (message, type = "default") => {
  if (!toastStack) return;
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  const icon = type === "error" ? "fa-triangle-exclamation" : type === "success" ? "fa-circle-check" : "fa-wand-magic-sparkles";
  toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${message}</span>`;
  toastStack.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px) scale(0.95)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3400);
};

const getApiKey = () => localStorage.getItem(STORAGE_KEYS.apiKey) || "";

const refreshKeyStatus = () => {
  if (!keyStatus || !apiKeyInput) return;
  const key = getApiKey();
  if (key) {
    keyStatus.textContent = "Your API key is active and ready to create artwork.";
    keyStatus.classList.remove("error");
    apiKeyInput.value = key;
  } else {
    keyStatus.textContent = "No API key found. Add your free Hugging Face token to generate.";
    keyStatus.classList.add("error");
  }
};

const openSettings = () => {
  if (!settingsPanel) return;
  settingsPanel.classList.add("open");
  refreshKeyStatus();
  playChime("pop");
};

const closeSettings = () => settingsPanel?.classList.remove("open");

on(settingsBtn, "click", () => {
  settingsPanel.classList.contains("open") ? closeSettings() : openSettings();
});

on(settingsClose, "click", closeSettings);

document.addEventListener("click", (e) => {
  if (!settingsPanel || !settingsBtn) return;
  if (!settingsPanel.contains(e.target) && !settingsBtn.contains(e.target)) closeSettings();
});

on(toggleKeyVisibility, "click", () => {
  const isPassword = apiKeyInput.type === "password";
  apiKeyInput.type = isPassword ? "text" : "password";
  toggleKeyVisibility.querySelector("i").className = isPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye";
});

on(saveKeyBtn, "click", () => {
  const val = apiKeyInput.value.trim();
  if (!val) {
    showToast("Please enter an API key before saving.", "error");
    return;
  }
  localStorage.setItem(STORAGE_KEYS.apiKey, val);
  refreshKeyStatus();
  showToast("Your API key has been saved securely.", "success");
  closeSettings();
  playChime("complete");
});

on(clearKeyBtn, "click", () => {
  localStorage.removeItem(STORAGE_KEYS.apiKey);
  apiKeyInput.value = "";
  refreshKeyStatus();
  showToast("API key removed from browser.");
});

const examplePrompts = [
  "A majestic celestial dragon coiled around an ancient observatory under an aurora sky",
  "A cozy glass tea house nestled in a glowing bioluminescent mushroom forest",
  "An antique steampunk submarine drifting through giant glowing jellyfish ruins",
  "A futuristic garden city with organic crystal skyscrapers and floating greenery",
  "A magical library with spiraling bookshelves floating into infinity and soft golden dust",
  "A neon-lit ramen stall in Tokyo on a rainy cyberpunk midnight with holographic koi fish",
  "A tiny wizard mouse reading a glowing spellbook inside a hollow tree trunk study",
  "A serene Japanese pagoda surrounded by pink cherry blossoms and misty waterfalls",
  "An astronaut relaxing in a floating hammock on a glowing cosmic nebula beach",
  "A mystical white stag with flowering antlers standing in a sunlit mossy grove",
  "A Victorian alchemist laboratory filled with bubbling glowing potions and brass gadgets",
  "An epic floating castle high above sunset clouds with cascading waterfalls",
  "A cute porcelain robot watering colorful flowers in a sunlit greenhouse studio",
  "A retro 80s synthesizer setup on a neon grid looking over a purple mountain sunset",
  "An enchanted treehouse village connected by glowing rope bridges under star clusters"
];

const updatePromptStrength = () => {
  if (!promptInput || !strengthFill || !promptCharCount || !promptQualityLabel) return;
  const text = promptInput.value.trim();
  const len = text.length;
  const words = text ? text.split(/\s+/).length : 0;
  promptCharCount.textContent = `${len} characters • ${words} words`;

  let score = 0;
  if (len > 0) score += 15;
  if (len > 30) score += 25;
  if (words >= 8) score += 20;
  if (words >= 15) score += 20;
  if (/cinematic|lighting|detailed|masterpiece|8k|volumetric|vivid|photoreal|hdr|texture/i.test(text)) score += 20;

  score = Math.min(100, Math.max(5, score));
  strengthFill.style.width = `${score}%`;

  if (len === 0) {
    strengthFill.style.background = "var(--danger)";
    promptQualityLabel.textContent = "Write your vision in the box";
  } else if (score < 40) {
    strengthFill.style.background = "#EF4444";
    promptQualityLabel.textContent = "Short prompt — add descriptive details for better art";
  } else if (score < 70) {
    strengthFill.style.background = "#F59E0B";
    promptQualityLabel.textContent = "Good prompt — add lighting or textures for extra polish";
  } else if (score < 90) {
    strengthFill.style.background = "#6C4CF1";
    promptQualityLabel.textContent = "Strong prompt — ready for high quality generation";
  } else {
    strengthFill.style.background = "linear-gradient(90deg, #FF5CA8, #17C7D8)";
    promptQualityLabel.textContent = "Masterpiece prompt — rich in vivid detail";
  }
};

on(promptInput, "input", updatePromptStrength);

on(randomPromptBtn, "click", (e) => {
  const prompt = examplePrompts[Math.floor(Math.random() * examplePrompts.length)];
  let i = 0;
  promptInput.focus();
  promptInput.value = "";
  randomPromptBtn.disabled = true;
  const typeTimer = setInterval(() => {
    if (i < prompt.length) {
      promptInput.value += prompt.charAt(i);
      i++;
      updatePromptStrength();
    } else {
      clearInterval(typeTimer);
      randomPromptBtn.disabled = false;
      const rect = randomPromptBtn.getBoundingClientRect();
      triggerSparkles(rect.left + rect.width / 2, rect.top + rect.height / 2, 16);
      playChime("pop");
    }
  }, 10);
});

on(clearPromptBtn, "click", () => {
  promptInput.value = "";
  updatePromptStrength();
  promptInput.focus();
  playChime("pop");
});

const enhanceModifiers = [
  "cinematic atmospheric lighting",
  "intricate ultra fine details",
  "soft volumetric rays",
  "octane 3D render depth",
  "masterpiece composition",
  "hyperrealistic textures",
  "dynamic ambient shadows",
  "vibrant complementary colors",
  "8k resolution sharp focus"
];

on(enhancePromptBtn, "click", (e) => {
  const current = promptInput.value.trim();
  if (!current) {
    showToast("Write a short prompt first to enhance it!", "error");
    return;
  }
  const picked = [];
  while (picked.length < 3) {
    const item = enhanceModifiers[Math.floor(Math.random() * enhanceModifiers.length)];
    if (!picked.includes(item) && !current.toLowerCase().includes(item)) {
      picked.push(item);
    }
  }
  promptInput.value = `${current}, ${picked.join(", ")}`;
  updatePromptStrength();
  const rect = enhancePromptBtn.getBoundingClientRect();
  triggerSparkles(rect.left + rect.width / 2, rect.top + rect.height / 2, 24);
  playChime("complete");
  showToast("Added magical details to your prompt!", "success");
});

document.querySelectorAll(".quick-prompt-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    promptInput.value = btn.textContent.trim();
    updatePromptStrength();
    promptInput.focus();
    playChime("pop");
  });
});

on(presetChips, "click", (e) => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  presetChips.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
  chip.classList.add("active");
  activeStylePreset = chip.dataset.style || "";
  playChime("pop");
});

on(randomSeedBtn, "click", () => {
  seedInput.value = Math.floor(Math.random() * 1000000000);
  playChime("pop");
});

on(clearSeedBtn, "click", () => {
  seedInput.value = "";
  playChime("pop");
});

const getHistory = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.history)) || [];
  } catch {
    return [];
  }
};

const saveToHistory = (prompt) => {
  let list = getHistory().filter((p) => p !== prompt);
  list.unshift(prompt);
  list = list.slice(0, 10);
  localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(list));
  renderHistory();
};

const renderHistory = () => {
  if (!historyRow || !historyChips) return;
  const list = getHistory();
  if (!list.length) {
    historyRow.hidden = true;
    return;
  }
  historyRow.hidden = false;
  historyChips.innerHTML = "";
  list.forEach((prompt) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "history-chip";
    chip.title = prompt;
    chip.textContent = prompt;
    chip.addEventListener("click", () => {
      promptInput.value = prompt;
      updatePromptStrength();
      promptInput.focus();
      playChime("pop");
    });
    historyChips.appendChild(chip);
  });
};

on(clearHistoryBtn, "click", () => {
  localStorage.removeItem(STORAGE_KEYS.history);
  renderHistory();
  showToast("Cleared recent prompt history.");
});

const getFavorites = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.favorites)) || [];
  } catch {
    return [];
  }
};

const updateFavoritesBadge = () => {
  const favs = getFavorites();
  if (favoritesBadge) favoritesBadge.textContent = favs.length;
};

const toggleFavoriteItem = (item) => {
  let favs = getFavorites();
  const existsIndex = favs.findIndex((f) => f.id === item.id || f.url === item.url);
  let isNowFav = false;
  if (existsIndex >= 0) {
    favs.splice(existsIndex, 1);
    showToast("Removed from your favorites.");
  } else {
    favs.unshift({ ...item, isFavorite: true, savedAt: new Date().toISOString() });
    isNowFav = true;
    showToast("Added to your saved favorites!", "success");
    playChime("complete");
    triggerSparkles(window.innerWidth / 2, window.innerHeight / 2, 22);
  }
  localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favs));
  updateFavoritesBadge();
  renderFavoritesGrid();
  updateCardHeartStates();
  return isNowFav;
};

const updateCardHeartStates = () => {
  const favs = getFavorites();
  document.querySelectorAll(".img-card").forEach((card) => {
    const cardId = card.dataset.id;
    const cardUrl = card.dataset.url;
    const favBtn = card.querySelector(".fav-btn");
    if (!favBtn) return;
    const isFav = favs.some((f) => f.id === cardId || f.url === cardUrl);
    favBtn.classList.toggle("is-fav", isFav);
    favBtn.querySelector("i").className = isFav ? "fa-solid fa-heart" : "fa-regular fa-heart";
  });
};

const renderFavoritesGrid = () => {
  if (!favoritesGrid) return;
  const favs = getFavorites();
  if (favoritesTools) favoritesTools.hidden = favs.length === 0;

  if (!favs.length) {
    favoritesGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon"><i class="fa-solid fa-heart-crack"></i></div>
        <h4>No saved favorites yet</h4>
        <p>Click the heart icon on any artwork in your studio gallery to save it here permanently.</p>
      </div>`;
    return;
  }

  favoritesGrid.innerHTML = "";
  favs.forEach((item, idx) => {
    const card = document.createElement("div");
    card.className = "img-card animate-in";
    card.dataset.id = item.id;
    card.dataset.url = item.url;
    card.style.aspectRatio = item.aspectRatio || "1/1";
    card.innerHTML = `
      <img class="result-img" src="${item.url}" alt="${item.promptText.replace(/"/g, "&quot;")}" />
      <div class="img-overlay">
        <div class="overlay-top">
          <button class="overlay-btn fav-btn is-fav" title="Remove from favorites"><i class="fa-solid fa-heart"></i></button>
          <button class="overlay-btn zoom-btn" title="View details"><i class="fa-solid fa-expand"></i></button>
        </div>
        <div class="overlay-bottom">
          <button class="overlay-btn copy-prompt-btn" title="Copy prompt used"><i class="fa-solid fa-copy"></i></button>
          <button class="overlay-btn remix-btn" title="Remix this prompt"><i class="fa-solid fa-arrows-rotate"></i></button>
          <a href="${item.url}" class="overlay-btn" title="Download image" download="conjure-favorite-${idx + 1}.png">
            <i class="fa-solid fa-download"></i>
          </a>
        </div>
      </div>`;

    card.querySelector(".result-img").addEventListener("click", () => openLightboxWithItem(item, favs, idx));
    card.querySelector(".zoom-btn").addEventListener("click", () => openLightboxWithItem(item, favs, idx));
    card.querySelector(".fav-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      toggleFavoriteItem(item);
    });
    card.querySelector(".copy-prompt-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      navigator.clipboard.writeText(item.promptText).then(() => showToast("Prompt copied to clipboard!", "success"));
    });
    card.querySelector(".remix-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      remixCreation(item);
    });
    attachCardTilt(card);
    favoritesGrid.appendChild(card);
  });
};

on(tabGeneratorBtn, "click", () => {
  tabGeneratorBtn.classList.add("active");
  tabFavoritesBtn.classList.remove("active");
  viewGenerator.classList.add("active");
  viewFavorites.classList.remove("active");
  viewGenerator.hidden = false;
  viewFavorites.hidden = true;
  playChime("pop");
});

on(tabFavoritesBtn, "click", () => {
  tabFavoritesBtn.classList.add("active");
  tabGeneratorBtn.classList.remove("active");
  viewFavorites.classList.add("active");
  viewGenerator.classList.remove("active");
  viewFavorites.hidden = false;
  viewGenerator.hidden = true;
  renderFavoritesGrid();
  playChime("pop");
});

on(downloadAllFavsBtn, "click", () => {
  const favs = getFavorites();
  if (!favs.length) return;
  favs.forEach((item, i) => {
    setTimeout(() => {
      const a = document.createElement("a");
      a.href = item.url;
      a.download = `conjure-fav-${i + 1}.png`;
      a.click();
    }, i * 250);
  });
  showToast(`Downloading ${favs.length} favorite artworks...`, "success");
});

on(clearAllFavsBtn, "click", () => {
  if (confirm("Are you sure you want to remove all saved favorites?")) {
    localStorage.removeItem(STORAGE_KEYS.favorites);
    updateFavoritesBadge();
    renderFavoritesGrid();
    updateCardHeartStates();
    showToast("All favorites cleared.");
  }
});

const getImageDimensions = (aspectRatio, baseSize = 512) => {
  const [wRatio, hRatio] = aspectRatio.split("/").map(Number);
  const scale = baseSize / Math.sqrt(wRatio * hRatio);
  let w = Math.round(wRatio * scale);
  let h = Math.round(hRatio * scale);
  w = Math.floor(w / 16) * 16;
  h = Math.floor(h / 16) * 16;
  return { width: Math.max(256, w), height: Math.max(256, h) };
};

const attachCardTilt = (card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;
    card.style.transform = `perspective(700px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(1.02)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(700px) rotateX(0deg) rotateY(0deg) scale(1)";
  });
};

const buildLoadingCardHTML = (index, aspectRatio) => `
  <div class="img-card loading" id="img-card-${index}" style="aspect-ratio: ${aspectRatio}">
    <div class="status-container">
      <div class="spinner"></div>
      <i class="fa-solid fa-triangle-exclamation"></i>
      <p class="status-text">Developing artwork...</p>
      <button class="retry-btn" style="display:none;">Try Again</button>
    </div>
  </div>`;

const updateImageCard = (index, item) => {
  const card = document.getElementById(`img-card-${index}`);
  if (!card) return;
  card.classList.remove("loading");
  card.dataset.id = item.id;
  card.dataset.url = item.url;
  const favs = getFavorites();
  const isFav = favs.some((f) => f.id === item.id || f.url === item.url);

  card.innerHTML = `
    <img class="result-img" src="${item.url}" alt="${item.promptText.replace(/"/g, "&quot;")}" />
    <div class="img-overlay">
      <div class="overlay-top">
        <button class="overlay-btn fav-btn ${isFav ? "is-fav" : ""}" title="${isFav ? "Remove favorite" : "Add to favorites"}">
          <i class="${isFav ? "fa-solid fa-heart" : "fa-regular fa-heart"}"></i>
        </button>
        <button class="overlay-btn zoom-btn" title="View details"><i class="fa-solid fa-expand"></i></button>
      </div>
      <div class="overlay-bottom">
        <button class="overlay-btn copy-prompt-btn" title="Copy prompt"><i class="fa-solid fa-copy"></i></button>
        <button class="overlay-btn remix-btn" title="Remix this prompt"><i class="fa-solid fa-arrows-rotate"></i></button>
        <a href="${item.url}" class="overlay-btn" title="Download image" download="conjure-${index + 1}.png">
          <i class="fa-solid fa-download"></i>
        </a>
      </div>
    </div>`;

  card.querySelector(".result-img").addEventListener("click", () => openLightboxWithItem(item, currentCreations, index));
  card.querySelector(".zoom-btn").addEventListener("click", () => openLightboxWithItem(item, currentCreations, index));
  card.querySelector(".fav-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    toggleFavoriteItem(item);
  });
  card.querySelector(".copy-prompt-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.promptText).then(() => showToast("Prompt copied to clipboard!", "success"));
  });
  card.querySelector(".remix-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    remixCreation(item);
  });

  attachCardTilt(card);
  const rect = card.getBoundingClientRect();
  triggerSparkles(rect.left + rect.width / 2, rect.top + rect.height / 2, 14);
};

const setCardError = (index, message, retryFn) => {
  const card = document.getElementById(`img-card-${index}`);
  if (!card) return;
  card.classList.remove("loading");
  card.classList.add("error");
  const statusText = card.querySelector(".status-text");
  const retryBtn = card.querySelector(".retry-btn");
  statusText.textContent = message;
  retryBtn.style.display = "inline-block";
  retryBtn.onclick = () => {
    card.classList.remove("error");
    card.classList.add("loading");
    statusText.textContent = "Developing artwork...";
    retryBtn.style.display = "none";
    retryFn();
  };
};

const remixCreation = (item) => {
  if (!item) return;
  promptInput.value = item.promptText || "";
  updatePromptStrength();
  if (item.selectedModel) modelSelect.value = item.selectedModel;
  if (item.aspectRatio) ratioSelect.value = item.aspectRatio;
  if (item.seed !== undefined && item.seed !== null) seedInput.value = item.seed;
  if (item.negativePrompt) negativePromptInput.value = item.negativePrompt;

  tabGeneratorBtn.click();
  window.scrollTo({ top: 0, behavior: "smooth" });
  promptInput.focus();
  showToast("Loaded artwork settings into generator!", "success");
  playChime("pop");
};

const copyImageBlobToClipboard = async (blobUrl) => {
  try {
    const res = await fetch(blobUrl);
    const blob = await res.blob();
    await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
    showToast("Image copied directly to your clipboard!", "success");
    playChime("pop");
  } catch (err) {
    showToast("Unable to copy image data directly. Use Download instead.", "error");
  }
};

const openLightboxWithItem = (item, sourceList, index) => {
  if (!item || !lightbox) return;
  lightboxSourceList = sourceList || [item];
  currentLightboxIndex = index >= 0 ? index : 0;
  renderLightboxDetails(item);
  lightbox.classList.add("open");
  playChime("pop");
};

const renderLightboxDetails = (item) => {
  if (!item) return;
  lightboxImg.src = item.url;
  lightboxPrompt.textContent = item.promptText || "Untitled artwork";
  lightboxModel.textContent = item.selectedModel ? item.selectedModel.split("/").pop() : "FLUX";
  lightboxDimensions.textContent = `${item.width || 512} × ${item.height || 512} px`;
  lightboxSeed.textContent = item.seed !== "" && item.seed !== null && item.seed !== undefined ? item.seed : "Random";
  lightboxTime.textContent = item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Just now";
  lightboxDownloadLink.href = item.url;
  lightboxDownloadLink.download = `conjure-${Date.now()}.png`;

  const favs = getFavorites();
  const isFav = favs.some((f) => f.id === item.id || f.url === item.url);
  lightboxFavBtn.innerHTML = `<i class="${isFav ? "fa-solid" : "fa-regular"} fa-heart"></i> ${isFav ? "Favorited" : "Favorite"}`;

  lightboxFavBtn.onclick = () => {
    const updatedFav = toggleFavoriteItem(item);
    lightboxFavBtn.innerHTML = `<i class="${updatedFav ? "fa-solid" : "fa-regular"} fa-heart"></i> ${updatedFav ? "Favorited" : "Favorite"}`;
  };

  lightboxRemixBtn.onclick = () => {
    closeLightbox();
    remixCreation(item);
  };

  lightboxCopyImgBtn.onclick = () => copyImageBlobToClipboard(item.url);
};

const closeLightbox = () => {
  if (!lightbox) return;
  lightbox.classList.remove("open");
  if (lightboxImg) lightboxImg.src = "";
};

on(lightboxClose, "click", closeLightbox);
on(lightbox, "click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

on(lightboxPrev, "click", () => {
  if (lightboxSourceList.length <= 1) return;
  currentLightboxIndex = (currentLightboxIndex - 1 + lightboxSourceList.length) % lightboxSourceList.length;
  renderLightboxDetails(lightboxSourceList[currentLightboxIndex]);
  playChime("pop");
});

on(lightboxNext, "click", () => {
  if (lightboxSourceList.length <= 1) return;
  currentLightboxIndex = (currentLightboxIndex + 1) % lightboxSourceList.length;
  renderLightboxDetails(lightboxSourceList[currentLightboxIndex]);
  playChime("pop");
});

on(lightboxDrawerToggle, "click", () => {
  lightboxDrawer.classList.toggle("collapsed");
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "ArrowLeft") lightboxPrev.click();
  if (e.key === "ArrowRight") lightboxNext.click();
});

const generateOneImage = async (index, params) => {
  const { selectedModel, width, height, promptText, negativePrompt, seed, aspectRatio } = params;
  const apiKey = getApiKey();
  if (!apiKey) {
    setCardError(index, "No API key found. Add one in Settings.", () => generateOneImage(index, params));
    return;
  }

  const MODEL_URL = `https://router.huggingface.co/hf-inference/models/${selectedModel}`;
  const parameters = { width, height };
  if (negativePrompt) parameters.negative_prompt = negativePrompt;
  if (seed !== "" && seed !== null && !Number.isNaN(Number(seed))) {
    parameters.seed = Number(seed);
  }

  try {
    const response = await fetch(MODEL_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "x-use-cache": "false"
      },
      body: JSON.stringify({ inputs: promptText, parameters })
    });

    if (!response.ok) {
      let errMsg = "Creation failed. Please try again.";
      try {
        const errJson = await response.json();
        errMsg = errJson?.error || errMsg;
      } catch {}
      throw new Error(errMsg);
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const creationItem = {
      id: `art-${Date.now()}-${index}`,
      url: objectUrl,
      promptText,
      selectedModel,
      width,
      height,
      aspectRatio,
      negativePrompt,
      seed,
      createdAt: new Date().toISOString()
    };

    currentCreations[index] = creationItem;
    updateImageCard(index, creationItem);
  } catch (error) {
    console.error(error);
    const msg = error.message || "Failed to generate image. Try another model or prompt.";
    setCardError(index, msg, () => generateOneImage(index, params));
  }
};

const updateProgressUI = (completed, total) => {
  const percent = Math.round((completed / total) * 100);
  if (progressFill) progressFill.style.width = `${percent}%`;
  if (progressPercent) progressPercent.textContent = `${percent}%`;
  if (progressText) progressText.textContent = `Developing artwork (${completed}/${total} ready)...`;
};

const generateImages = async (params) => {
  const { imageCount } = params;
  generateBtn.setAttribute("disabled", "true");
  generateBtn.querySelector("i").className = "fa-solid fa-wand-magic-sparkles fa-spin";
  progressBarContainer.hidden = false;
  updateProgressUI(0, imageCount);

  let completedCount = 0;
  const jobs = Array.from({ length: imageCount }, async (_, i) => {
    await generateOneImage(i, params);
    completedCount++;
    updateProgressUI(completedCount, imageCount);
  });

  await Promise.allSettled(jobs);

  generateBtn.removeAttribute("disabled");
  generateBtn.querySelector("i").className = "fa-solid fa-wand-magic-sparkles";
  setTimeout(() => {
    progressBarContainer.hidden = true;
  }, 900);

  galleryTools.hidden = false;
  galleryCount.textContent = `${currentCreations.filter(Boolean).length} creations`;
  playChime("complete");
  showToast("Your artwork collection is ready!", "success");
};

const createImageCards = (params) => {
  const { imageCount, aspectRatio } = params;
  currentCreations = new Array(imageCount).fill(null);
  galleryGrid.innerHTML = "";
  for (let i = 0; i < imageCount; i++) {
    galleryGrid.innerHTML += buildLoadingCardHTML(i, aspectRatio);
  }
  document.querySelectorAll(".img-card").forEach((card, i) => {
    setTimeout(() => card.classList.add("animate-in"), 90 * i);
  });
  generateImages(params);
};

const handleFormSubmit = (e) => {
  e.preventDefault();
  const promptText = promptInput.value.trim();
  if (!promptText) {
    showToast("Please describe what you want to create!", "error");
    promptInput.focus();
    return;
  }

  if (!getApiKey()) {
    showToast("Please save your free Hugging Face API key in Settings first.", "error");
    openSettings();
    return;
  }

  const selectedModel = modelSelect.value;
  const imageCount = parseInt(countSelect.value, 10) || 1;
  const aspectRatio = ratioSelect.value || "1/1";
  const { width, height } = getImageDimensions(aspectRatio);
  const negativePrompt = negativePromptInput.value.trim();
  const seed = seedInput.value.trim();
  const fullPrompt = activeStylePreset ? `${promptText}, ${activeStylePreset}` : promptText;

  saveToHistory(promptText);

  const params = {
    selectedModel,
    imageCount,
    aspectRatio,
    width,
    height,
    promptText: fullPrompt,
    negativePrompt,
    seed
  };

  createImageCards(params);
  triggerSparkles(window.innerWidth / 2, window.innerHeight / 3, 20);
};

on(promptForm, "submit", handleFormSubmit);
on(themeToggle, "click", toggleTheme);
on(soundToggle, "click", toggleSound);

on(downloadAllBtn, "click", () => {
  const validCreations = currentCreations.filter(Boolean);
  if (!validCreations.length) return;
  validCreations.forEach((item, i) => {
    setTimeout(() => {
      const a = document.createElement("a");
      a.href = item.url;
      a.download = `conjure-creation-${i + 1}.png`;
      a.click();
    }, i * 200);
  });
  showToast(`Downloading all ${validCreations.length} images...`, "success");
});

on(clearGalleryBtn, "click", () => {
  galleryGrid.innerHTML = `
    <div class="empty-state" id="empty-state">
      <div class="empty-icon"><i class="fa-solid fa-wand-magic-sparkles"></i></div>
      <h4>Your imagination belongs here</h4>
      <p>Write a prompt, select a style, and watch your artwork develop into reality.</p>
    </div>`;
  currentCreations = [];
  galleryTools.hidden = true;
  galleryCount.textContent = "0 items";
  showToast("Gallery cleared.");
});

on(promptInput, "keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
    promptForm.requestSubmit();
  }
});

updateFavoritesBadge();
renderHistory();
updatePromptStrength();