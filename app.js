const promptForm = document.getElementById("prompt-form");
const themeToggle = document.querySelector(".theme-toggle");
const promptBtn = document.querySelector(".prompt-btn");
const promptInput = document.querySelector(".prompt-input");
const generateBtn = document.getElementById("generate-btn");
const galleryGrid = document.getElementById("gallery-grid");
const emptyState = document.getElementById("empty-state");
const modelSelect = document.getElementById("model-select");
const countSelect = document.getElementById("count-select");
const ratioSelect = document.getElementById("ratio-select");
const negativePromptInput = document.getElementById("negative-prompt");
const seedInput = document.getElementById("seed-input");
const randomSeedBtn = document.getElementById("random-seed-btn");
const presetChips = document.getElementById("preset-chips");
const historyRow = document.getElementById("history-row");
const historyChips = document.getElementById("history-chips");
const settingsBtn = document.getElementById("settings-btn");
const settingsPanel = document.getElementById("settings-panel");
const settingsClose = document.getElementById("settings-close");
const apiKeyInput = document.getElementById("api-key-input");
const toggleKeyVisibility = document.getElementById("toggle-key-visibility");
const saveKeyBtn = document.getElementById("save-key-btn");
const clearKeyBtn = document.getElementById("clear-key-btn");
const keyStatus = document.getElementById("key-status");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxClose = document.getElementById("lightbox-close");
const toastStack = document.getElementById("toast-stack");

// ===== Storage keys =====
const STORAGE_KEYS = {
  theme: "theme",
  apiKey: "hf_api_key",
  history: "prompt_history",
};

let activeStylePreset = "";
let lastGenerationParams = null; // used for per-card retry

// Guards against crashes if index.html and app.js get out of sync
// (e.g. only one file was updated). Logs a clear warning instead of throwing.
const on = (el, event, handler, label) => {
  if (!el) {
    console.warn(`[app.js] Skipped wiring "${label || event}" — element not found. Make sure index.html matches this app.js.`);
    return;
  }
  el.addEventListener(event, handler);
};

// ===== Theme =====
(() => {
  const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDarkTheme = savedTheme === "dark" || (!savedTheme && systemPrefersDark);
  document.body.classList.toggle("dark-theme", isDarkTheme);
  if (themeToggle) themeToggle.querySelector("i").className = isDarkTheme ? "fa-solid fa-sun" : "fa-solid fa-moon";
})();

const toggleTheme = () => {
  const isDarkTheme = document.body.classList.toggle("dark-theme");
  localStorage.setItem(STORAGE_KEYS.theme, isDarkTheme ? "dark" : "light");
  if (themeToggle) themeToggle.querySelector("i").className = isDarkTheme ? "fa-solid fa-sun" : "fa-solid fa-moon";
};

// ===== Toasts =====
const showToast = (message, type = "default") => {
  if (!toastStack) {
    console.log(`[toast:${type}] ${message}`);
    return;
  }
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  const icon = type === "error" ? "fa-circle-exclamation" : type === "success" ? "fa-circle-check" : "fa-circle-info";
  toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${message}</span>`;
  toastStack.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3200);
};

// ===== API key handling (never hardcoded, never committed) =====
const getApiKey = () => localStorage.getItem(STORAGE_KEYS.apiKey) || "";

const refreshKeyStatus = () => {
  if (!keyStatus || !apiKeyInput) return;
  const key = getApiKey();
  if (key) {
    keyStatus.textContent = "Key saved in this browser.";
    keyStatus.classList.remove("error");
    apiKeyInput.value = key;
  } else {
    keyStatus.textContent = "No key saved yet — generation will fail until you add one.";
    keyStatus.classList.add("error");
  }
};

const openSettings = () => {
  if (!settingsPanel) return;
  settingsPanel.classList.add("open");
  refreshKeyStatus();
};
const closeSettings = () => settingsPanel?.classList.remove("open");

on(settingsBtn, "click", () => {
  settingsPanel.classList.contains("open") ? closeSettings() : openSettings();
}, "settings-btn");

on(settingsClose, "click", closeSettings, "settings-close");

document.addEventListener("click", (e) => {
  if (!settingsPanel || !settingsBtn) return;
  if (!settingsPanel.contains(e.target) && !settingsBtn.contains(e.target)) closeSettings();
});

on(toggleKeyVisibility, "click", () => {
  const isPassword = apiKeyInput.type === "password";
  apiKeyInput.type = isPassword ? "text" : "password";
  toggleKeyVisibility.querySelector("i").className = isPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye";
}, "toggle-key-visibility");

on(saveKeyBtn, "click", () => {
  const value = apiKeyInput.value.trim();
  if (!value) {
    showToast("Enter a key before saving.", "error");
    return;
  }
  localStorage.setItem(STORAGE_KEYS.apiKey, value);
  refreshKeyStatus();
  showToast("API key saved to this browser.", "success");
}, "save-key-btn");

on(clearKeyBtn, "click", () => {
  localStorage.removeItem(STORAGE_KEYS.apiKey);
  apiKeyInput.value = "";
  refreshKeyStatus();
  showToast("API key cleared.");
}, "clear-key-btn");

// Prompt for a key the first time someone tries to generate with none saved
if (!getApiKey()) {
  setTimeout(() => showToast("Add your Hugging Face API key in Settings to start generating.", "default"), 600);
}

// ===== Example prompts =====
const examplePrompts = [
  "A magic forest with glowing plants and fairy homes among giant mushrooms",
  "An old steampunk airship floating through golden clouds at sunset",
  "A future Mars colony with glass domes and gardens against red mountains",
  "A dragon sleeping on gold coins in a crystal cave",
  "An underwater kingdom with merpeople and glowing coral buildings",
  "A floating island with waterfalls pouring into clouds below",
  "A witch's cottage in fall with magic herbs in the garden",
  "A robot painting in a sunny studio with art supplies around it",
  "A magical library with floating glowing books and spiral staircases",
  "A Japanese shrine during cherry blossom season with lanterns and misty mountains",
  "A cosmic beach with glowing sand and an aurora in the night sky",
  "A medieval marketplace with colorful tents and street performers",
  "A cyberpunk city with neon signs and flying cars at night",
  "A peaceful bamboo forest with a hidden ancient temple",
  "A giant turtle carrying a village on its back in the ocean",
];

on(promptBtn, "click", () => {
  const prompt = examplePrompts[Math.floor(Math.random() * examplePrompts.length)];
  let i = 0;
  promptInput.focus();
  promptInput.value = "";
  promptBtn.disabled = true;
  promptBtn.style.opacity = "0.5";
  const typeInterval = setInterval(() => {
    if (i < prompt.length) {
      promptInput.value += prompt.charAt(i);
      i++;
    } else {
      clearInterval(typeInterval);
      promptBtn.disabled = false;
      promptBtn.style.opacity = "0.85";
    }
  }, 12);
}, "prompt-btn");

// ===== Style presets =====
on(presetChips, "click", (e) => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  presetChips.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
  chip.classList.add("active");
  activeStylePreset = chip.dataset.style || "";
}, "preset-chips");

// ===== Seed =====
on(randomSeedBtn, "click", () => {
  seedInput.value = Math.floor(Math.random() * 1_000_000_000);
}, "random-seed-btn");

// ===== Prompt history =====
const getHistory = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.history)) || [];
  } catch {
    return [];
  }
};

const saveToHistory = (prompt) => {
  let history = getHistory().filter((p) => p !== prompt);
  history.unshift(prompt);
  history = history.slice(0, 8);
  localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history));
  renderHistory();
};

const renderHistory = () => {
  if (!historyRow || !historyChips) return;
  const history = getHistory();
  if (!history.length) {
    historyRow.hidden = true;
    return;
  }
  historyRow.hidden = false;
  historyChips.innerHTML = "";
  history.forEach((prompt) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "history-chip";
    chip.title = prompt;
    chip.textContent = prompt;
    chip.addEventListener("click", () => {
      promptInput.value = prompt;
      promptInput.focus();
    });
    historyChips.appendChild(chip);
  });
};
renderHistory();

// ===== Dimensions helper =====
const getImageDimensions = (aspectRatio, baseSize = 512) => {
  const [width, height] = aspectRatio.split("/").map(Number);
  const scaleFactor = baseSize / Math.sqrt(width * height);
  let calculatedWidth = Math.round(width * scaleFactor);
  let calculatedHeight = Math.round(height * scaleFactor);
  calculatedWidth = Math.floor(calculatedWidth / 16) * 16;
  calculatedHeight = Math.floor(calculatedHeight / 16) * 16;
  return { width: calculatedWidth, height: calculatedHeight };
};

// ===== Card rendering =====
const buildLoadingCardHTML = (index, aspectRatio) => `
  <div class="img-card loading" id="img-card-${index}" style="aspect-ratio: ${aspectRatio}">
    <div class="status-container">
      <div class="spinner"></div>
      <i class="fa-solid fa-triangle-exclamation"></i>
      <p class="status-text">Generating...</p>
      <button class="retry-btn" style="display:none;">Retry</button>
    </div>
  </div>`;

const updateImageCard = (index, imageUrl, promptText) => {
  const imgCard = document.getElementById(`img-card-${index}`);
  if (!imgCard) return;
  imgCard.classList.remove("loading");
  imgCard.innerHTML = `
    <img class="result-img" src="${imageUrl}" alt="${promptText.replace(/"/g, "&quot;")}" />
    <div class="img-overlay">
      <button class="overlay-btn copy-prompt-btn" title="Copy prompt used"><i class="fa-solid fa-copy"></i></button>
      <a href="${imageUrl}" class="overlay-btn" title="Download" download="conjure-${index}.png">
        <i class="fa-solid fa-download"></i>
      </a>
    </div>`;
  imgCard.querySelector(".result-img").addEventListener("click", () => openLightbox(imageUrl));
  imgCard.querySelector(".copy-prompt-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(promptText).then(() => showToast("Prompt copied to clipboard.", "success"));
  });
};

const setCardError = (index, message, retryFn) => {
  const imgCard = document.getElementById(`img-card-${index}`);
  if (!imgCard) return;
  imgCard.classList.remove("loading");
  imgCard.classList.add("error");
  const statusText = imgCard.querySelector(".status-text");
  const retryBtn = imgCard.querySelector(".retry-btn");
  statusText.textContent = message;
  retryBtn.style.display = "inline-block";
  retryBtn.addEventListener("click", () => {
    imgCard.classList.remove("error");
    imgCard.classList.add("loading");
    statusText.textContent = "Generating...";
    retryBtn.style.display = "none";
    retryFn();
  });
};

// ===== Lightbox =====
const openLightbox = (url) => {
  if (!lightboxImg || !lightbox) return;
  lightboxImg.src = url;
  lightbox.classList.add("open");
};
const closeLightbox = () => {
  if (!lightboxImg || !lightbox) return;
  lightbox.classList.remove("open");
  lightboxImg.src = "";
};
on(lightboxClose, "click", closeLightbox, "lightbox-close");
on(lightbox, "click", (e) => { if (e.target === lightbox) closeLightbox(); }, "lightbox");
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });

// ===== Generation =====
const generateOneImage = async (index, { selectedModel, width, height, promptText, negativePrompt, seed }) => {
  const params = { selectedModel, width, height, promptText, negativePrompt, seed };
  const apiKey = getApiKey();
  if (!apiKey) {
    setCardError(index, "No API key set. Add one in Settings.", () => generateOneImage(index, params));
    return;
  }

  const MODEL_URL = `https://router.huggingface.co/hf-inference/models/${selectedModel}`;
  const parameters = { width, height };
  if (negativePrompt) parameters.negative_prompt = negativePrompt;
  if (seed !== "" && seed !== null && !Number.isNaN(Number(seed))) parameters.seed = Number(seed);

  try {
    const response = await fetch(MODEL_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "x-use-cache": "false",
      },
      body: JSON.stringify({ inputs: promptText, parameters }),
    });

    if (!response.ok) {
      let errMsg = "Generation failed.";
      try {
        const errJson = await response.json();
        errMsg = errJson?.error || errMsg;
      } catch { /* ignore parse errors */ }
      throw new Error(errMsg);
    }

    const blob = await response.blob();
    updateImageCard(index, URL.createObjectURL(blob), promptText);
  } catch (error) {
    console.error(error);
    const message = /error/i.test(error.message) ? error.message : "Generation failed! Check console for details.";
    setCardError(index, message, () =>
      generateOneImage(index, { selectedModel, width, height, promptText, negativePrompt, seed })
    );
  }
};

const generateImages = async (params) => {
  const { imageCount } = params;
  generateBtn.setAttribute("disabled", "true");
  generateBtn.querySelector("i").className = "fa-solid fa-circle-notch fa-spin";

  const jobs = Array.from({ length: imageCount }, (_, i) => generateOneImage(i, params));
  await Promise.allSettled(jobs);

  generateBtn.removeAttribute("disabled");
  generateBtn.querySelector("i").className = "fa-solid fa-wand-sparkles";
};

const createImageCards = (params) => {
  const { imageCount, aspectRatio } = params;
  emptyState.remove();
  galleryGrid.innerHTML = "";
  for (let i = 0; i < imageCount; i++) {
    galleryGrid.innerHTML += buildLoadingCardHTML(i, aspectRatio);
  }
  document.querySelectorAll(".img-card").forEach((card, i) => {
    setTimeout(() => card.classList.add("animate-in"), 90 * i);
  });
  generateImages(params);
};

// ===== Form submit =====
const handleFormSubmit = (e) => {
  e.preventDefault();

  const promptText = promptInput.value.trim();
  if (!promptText) return;

  if (!getApiKey()) {
    showToast("Add your Hugging Face API key in Settings first.", "error");
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

  lastGenerationParams = { selectedModel, imageCount, aspectRatio, width, height, promptText: fullPrompt, negativePrompt, seed };
  createImageCards(lastGenerationParams);
};

on(promptForm, "submit", handleFormSubmit, "prompt-form");
on(themeToggle, "click", toggleTheme, "theme-toggle");

// Keyboard shortcut: Cmd/Ctrl+Enter submits from the textarea
on(promptInput, "keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
    promptForm.requestSubmit();
  }
}, "prompt-input");