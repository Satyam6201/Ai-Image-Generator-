<div align="center">

# 🪄 Conjure — AI Image Generator

Describe it. Watch it develop.

A sleek, browser-based AI image generator powered by Hugging Face's Inference Providers — pick a model, write a prompt, and generate stunning AI art in seconds. No backend, no build tools, just HTML, CSS, and JavaScript.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-vercel-black?style=for-the-badge&logo=vercel)](https://ai-images-generators.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repo-181717?style=for-the-badge&logo=github)](https://github.com/Satyam6201/Ai-Image-Generator-)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

**🔗 Live App:** [ai-images-generators.vercel.app](https://ai-images-generators.vercel.app/)
**📦 Source Code:** [github.com/Satyam6201/Ai-Image-Generator-](https://github.com/Satyam6201/Ai-Image-Generator-)

</div>

---

## 📸 Preview

> Add a screenshot or GIF of the app here once deployed — drag an image into this README on GitHub and it'll generate the markdown for you, or replace the line below.


<img width="1201" height="883" alt="image" src="https://github.com/user-attachments/assets/175e5490-f7ac-421e-abee-6218aaeea249" />

```

---

## ✨ Features

- 🎨 **Multiple AI models** — FLUX.1-dev, FLUX.1-schnell, Stable Diffusion XL, Stable Diffusion v1.5, Stable Diffusion 3
- 🖼️ **Batch generation** — generate 1–4 images at once
- 📐 **Aspect ratio control** — Square (1:1), Landscape (16:9), Portrait (9:16)
- 🎭 **Style presets** — Cinematic, Anime, Photoreal, Watercolor, Cyberpunk (one-click prompt styling)
- ⚙️ **Advanced controls** — negative prompts and seed values for reproducible results
- 🕓 **Prompt history** — your last 8 prompts are saved locally and reusable with one click
- 🌗 **Light & dark themes** — auto-detects your system preference, toggle anytime
- 🔍 **Lightbox preview** — click any generated image to view it full-screen
- 📋 **Copy prompt / Download image** — quick actions on every generated image
- 🔁 **Per-image retry** — if one generation fails, retry just that image without redoing the whole batch
- 🔑 **Secure, local API key storage** — your Hugging Face key lives only in your browser's `localStorage`, never in the source code or committed to git
- 📱 **Fully responsive** — works on desktop, tablet, and mobile
- ♿ **Accessible** — keyboard shortcuts (`Ctrl/Cmd + Enter` to generate), visible focus states, reduced-motion support

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Structure | HTML5 |
| Styling | CSS3 (custom properties, no framework) |
| Logic | Vanilla JavaScript (ES6+, no build step) |
| Icons | [Font Awesome 6](https://fontawesome.com/) |
| Fonts | [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) + [Inter](https://fonts.google.com/specimen/Inter) (Google Fonts) |
| AI Provider | [Hugging Face Inference Providers](https://huggingface.co/docs/inference-providers/index) |
| Hosting | [Vercel](https://vercel.com/) |

No frameworks, no bundlers, no `npm install` — just open `index.html` and go.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Satyam6201/Ai-Image-Generator-.git
cd Ai-Image-Generator-
```

### 2. Get a free Hugging Face API key

1. Create a free account at [huggingface.co](https://huggingface.co/join) (if you don't have one).
2. Go to **[huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)**.
3. Click **New token**, give it a name, select the **Make calls to Inference Providers** permission, and create it.
4. Copy the token — it starts with `hf_...`.

> ⚠️ **Never hardcode this key in your source files.** This app is built so you paste your key into the in-app Settings panel, where it's saved only in your browser's `localStorage`. It is never written to any file, never committed to git, and never sent anywhere except directly to Hugging Face.

### 3. Run it locally

No build step needed — just open the file:

```bash
# Option A: just double-click index.html to open it in your browser

# Option B: serve it locally (recommended, avoids some browser file:// restrictions)
npx serve .
# or
python3 -m http.server 8000
```

Then visit `http://localhost:8000` (or whatever port your tool prints).

### 4. Add your API key in the app

1. Open the app.
2. Click the 🔑 **key icon** in the top-right corner.
3. Paste your Hugging Face token.
4. Click **Save key**.

You're ready to generate images!

---

## 📖 How to Use

1. **Write a prompt** — describe what you want to see in the text box. Feeling stuck? Click the 🎲 dice button for a random example prompt.
2. **Pick a style** *(optional)* — click a style chip (Cinematic, Anime, Photoreal, etc.) to automatically enhance your prompt.
3. **Open Advanced options** *(optional)* — add a **negative prompt** (things to avoid, e.g. "blurry, watermark, extra fingers") and/or a **seed** (for reproducible results — use the shuffle button for a random one).
4. **Choose your settings**:
   - **Model** — pick which AI model generates your image
   - **Image count** — generate 1 to 4 images at once
   - **Aspect ratio** — Square, Landscape, or Portrait
5. **Click Generate** (or press `Ctrl/Cmd + Enter`).
6. **Interact with results**:
   - Click an image to view it full-screen
   - Hover to reveal **copy prompt** and **download** buttons
   - If a generation fails, click **Retry** on that card — no need to regenerate the whole batch
7. **Reuse past prompts** — click any chip under "Recent" to load a previous prompt back into the input.
8. **Switch themes** — click the 🌙/☀️ icon to toggle light/dark mode.

---

## 📁 Project Structure

```
Ai-Image-Generator-/
├── index.html      # App structure and markup
├── style.css       # All styling, themes, and animations
├── app.js          # App logic: API calls, UI state, storage
└── README.md       # You are here
```

---

## 🔐 Security Notes

- The app **never** hardcodes an API key in any file.
- Your Hugging Face token is stored only in your browser's `localStorage` under the key `hf_api_key`, scoped to the domain you're visiting it from.
- If you fork this project, **do not** hardcode your own key into `app.js` before committing — it will be scanned and blocked by [GitHub Push Protection](https://docs.github.com/code-security/secret-scanning/working-with-secret-scanning-and-push-protection/working-with-push-protection-from-the-command-line), and even if it weren't, committed secrets can be scraped by anyone who clones the repo.
- If you ever accidentally expose a token, revoke it immediately at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens) and generate a new one.

---

## 🧩 Troubleshooting

| Problem | Likely Cause | Fix |
|---|---|---|
| `Failed to fetch` / `ERR_NAME_NOT_RESOLVED` | Hugging Face retired `api-inference.huggingface.co` | This project already uses the current endpoint, `router.huggingface.co/hf-inference/models/...`. If you forked an older version, update the `MODEL_URL` in `app.js`. |
| "No API key set" toast | No key saved yet | Open Settings (🔑 icon) and save your Hugging Face token. |
| A specific model fails but others work | That model may not be available through the free `hf-inference` provider | Try a different model from the dropdown, or check the model's page on [huggingface.co](https://huggingface.co/models?pipeline_tag=text-to-image) for supported providers. |
| Buttons/UI not responding, console shows "element not found" warnings | `index.html`, `style.css`, and `app.js` are out of sync (e.g. only one file was updated) | Make sure all three files are the matching, current versions from this repo. |

---

## 🗺️ Roadmap / Ideas

- [ ] "Download all" as a zip
- [ ] Image-to-image (upload a reference image)
- [ ] Favorites / saved gallery across sessions
- [ ] Provider selection (fal-ai, Replicate, Together, etc.)

Contributions and suggestions are welcome — feel free to open an issue or PR.

---

## 🤝 Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — free to use, modify, and distribute.

---

## 🙏 Acknowledgements

- [Hugging Face](https://huggingface.co/) for Inference Providers and open-source models
- [Font Awesome](https://fontawesome.com/) for icons
- [Google Fonts](https://fonts.google.com/) for Space Grotesk & Inter

<div align="center">

Made with 🪄 by [Satyam6201](https://github.com/Satyam6201)

</div>
