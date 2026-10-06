<div align="center">

# 🪄 Conjure — AI Image Studio

Describe your vision. Watch it develop.

A sleek, browser-based AI image creation studio powered by Hugging Face's Inference Providers — pick a model, write a prompt, and generate stunning AI art in seconds. No backend, no build tools, just pure HTML, CSS, and JavaScript.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-vercel-black?style=for-the-badge&logo=vercel)](https://ai-images-generators.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repo-181717?style=for-the-badge&logo=github)](https://github.com/Satyam6201/Ai-Image-Generator-)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

**🔗 Live App:** [ai-images-generators.vercel.app](https://ai-images-generators.vercel.app/)  
**📦 Source Code:** [github.com/Satyam6201/Ai-Image-Generator-](https://github.com/Satyam6201/Ai-Image-Generator-)

</div>

---

## 📸 Preview

<img width="1201" height="883" alt="image" src="https://github.com/user-attachments/assets/175e5490-f7ac-421e-abee-6218aaeea249" />

---

## ✨ Features

- 🎨 **Top-Tier AI Models** — FLUX.1-dev, FLUX.1-schnell, Stable Diffusion XL, Stable Diffusion v1.5, and Stable Diffusion 3 Medium
- 🪄 **Magic Prompt Enhancer** — Instantly enrich your prompt with cinematic lighting, depth, and aesthetic details with one click
- 📊 **Live Prompt Strength Meter** — Real-time character/word counter and visual richness feedback as you type
- 🎭 **12 Handcrafted Style Presets** — Original, Cinematic, Anime, Photoreal, Watercolor, Cyberpunk, 3D Pixar, Dark Fantasy, Pixel Art, Oil Painting, Synthwave, and Minimal Vector
- 📐 **Extended Aspect Ratio Control** — Square (1:1), Landscape (16:9), Portrait (9:16), Classic Photo (4:3), Tall Portrait (3:4), and Cinematic Ultrawide (21:9)
- 🖼️ **Multi-Image Batch Generation** — Generate 1 to 4 artworks simultaneously with live animated progress tracking
- 💖 **Saved Favorites Collection** — Star your favorite creations to store them in your browser gallery forever
- 🔍 **Interactive Lightbox & Metadata Inspector** — Fullscreen viewing with carousel navigation, resolution details, model info, seed, and one-click remixing
- 📋 **Quick Copy & Direct Download** — Copy prompts, copy raw image data to clipboard, and batch download all creations at once
- 🎛️ **Advanced Fine-Tuning** — Negative prompts and seed randomizer/locking for reproducible outputs
- 🔊 **Subtle Audio FX & Particle Sparklers** — Built-in synthetic chime audio feedback and celebratory particle bursts
- 🌟 **Dynamic 3D Card Hover Tilt** — Interactive perspective tilt effects tracking cursor movement
- 🌓 **Light & Dark Themes** — Automatic system preference detection with smooth color transitions
- 🔑 **Private API Key Storage** — Token stored strictly in your browser's `localStorage`

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Structure | Semantic HTML5 |
| Styling | Modern CSS3 (CSS Variables, Flexbox, Grid, Glassmorphism, 3D Transforms) |
| Logic | Vanilla JavaScript (ES6+ async/await, Web Audio API, Canvas 2D) |
| Icons | [Font Awesome 6](https://fontawesome.com/) |
| Fonts | [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk), [Inter](https://fonts.google.com/specimen/Inter), [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) |
| AI Provider | [Hugging Face Inference Providers](https://huggingface.co/docs/inference-providers/index) |
| Hosting | [Vercel](https://vercel.com/) |

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Satyam6201/Ai-Image-Generator-.git
cd Ai-Image-Generator-
```

### 2. Get a free Hugging Face API key

1. Create a free account at [huggingface.co](https://huggingface.co/join).
2. Go to [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens).
3. Click **New token**, grant inference permissions, and copy your token (`hf_...`).

### 3. Run locally

```bash
npx serve .
# or
python3 -m http.server 8000
```

Open `http://localhost:8000` or double-click `index.html`.

### 4. Save your API key

Click the 🔑 **key icon** in the top right, paste your token, and click **Save Key**.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| <kbd>Ctrl</kbd> + <kbd>Enter</kbd> / <kbd>Cmd</kbd> + <kbd>Enter</kbd> | Submit and trigger image generation |
| <kbd>Escape</kbd> | Close fullscreen Lightbox preview |
| <kbd>←</kbd> / <kbd>→</kbd> | Navigate between images in Lightbox |

---

## 📁 Project Structure

```text
Ai-Image-Generator-/
├── index.html      # App structure, tabs, modals, and templates
├── style.css       # Design system, themes, 3D card tilt, and animations
├── app.js          # Core logic, Web Audio, particles, API calls, and favorites storage
└── README.md       # Project documentation
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

<div align="center">

Made with 🪄 by [Satyam6201](https://github.com/Satyam6201)

</div>
