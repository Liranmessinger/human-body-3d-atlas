# 🧬 Anatoma 3D — Interactive Human Body Atlas & Simulation Game

An interactive 3D Human Body Encyclopedia, Physiology Simulator, Pathology Lab, and Educational Game built with **Three.js**, **Web Audio API**, and vanilla **HTML / CSS / JavaScript** — zero build step required!

---

## ✨ Features

### 🧍 Complete 11-System 3D Human Body (48 Clickable Structures)
- **Male & Female (`♂ | ♀`) Body Switcher** — Dynamically adapts body silhouette, pelvis width, and reproductive organs.
- **All 11 Human Body Systems** with expandable/collapsible sidebar accordions:
  1. **Nervous System** — Brain, Eyes, Ears, Spinal Cord, Peripheral Nerves
  2. **Circulatory System** — Heart (beating 3D pump), Major Arteries & Veins, Spleen
  3. **Respiratory System** — Nose & Nasal Cavity, Trachea & Bronchi, Lungs (breathing), Diaphragm
  4. **Digestive System** — Mouth/Tongue/Teeth, Esophagus, Stomach, Liver, Gallbladder, Pancreas, Small Intestine, Large Intestine
  5. **Urinary System** — Kidneys, Urinary Bladder
  6. **Skeletal System** — Skull, Clavicle & Scapula, Ribcage & Sternum, Spine, Pelvis, Arm Bones, Femur, Lower Leg Bones
  7. **Muscular System** — Pectorals, Deltoids, Biceps & Triceps, Abdominals, Latissimus & Trapezius, Glutes, Quadriceps & Hamstrings, Calves
  8. **Endocrine System** — Pituitary Gland, Thyroid Gland, Adrenal Glands, Pancreas
  9. **Lymphatic & Immune System** — Thymus, Lymph Nodes & Vessels, Spleen
  10. **Reproductive System** — Uterus & Fallopian Tubes, Ovaries (♀) / Prostate & Vas Deferens, Testes (♂)
  11. **Integumentary System** — Skin, Hair & Nails

### ✂️ 3D Dissection & Visualization Tools
- **Exploded View Slider (0–100%)** — Smoothly separates overlapping organs in 3D space.
- **MRI Cross-Section Slicer** — Real-time WebGL clipping plane with glowing scanner ring.
- **Body Shell Opacity Slider**, **X-Ray Wireframe Mode**, **Auto-Spin**, and **Animated Blood & Nerve Flow Particles**.
- **Smart Outer-Margin Callout Labels** — Non-overlapping SVG leader lines pointing to organs outside the body silhouette (off by default, toggleable).

### ❤️ Live Physiology & ECG Monitor
- 5 interactive physiological states: **Deep Rest**, **Normal Awake**, **Running / Exercise**, **Fight or Flight**, and **After a Meal**.
- Real-time animated **ECG (Electrocardiogram) Canvas** synced with the 3D beating heart, lungs, diaphragm, and blood flow speed.
- **Web Audio API Heartbeat ("Lub-Dub")** synced to live BPM + **Built-in Voice Narration (`SpeechSynthesis`)** in English & Hebrew.

### 🧭 7 Guided 3D Body Tours (40 Narrated Steps)
- ❤️ Journey of Blood · 🫁 Journey of a Breath · 🍽️ Journey of Food · ⚡ Command & Movement · 🛡️ Immune Defense Mission · 🧪 Hormone & Adrenaline Rush · 💧 Journey of a Glass of Water.
- Automatic camera fly-to, Auto-Play mode, and step-by-step voice narration.

### 🦠 Pathology & Health Lab (11 Medical Scenarios)
- Interactive 3D simulations with live vital sign changes and voice narration:
  - Healthy Baseline, **Cardiac Arrest** (0 BPM flatline simulation), **Stroke**, **Influenza (Flu)**, **Asthma Attack**, **Acid Reflux**, **Kidney Stones**, **Smoking Impact**, **Dehydration**, **High Blood Sugar (Diabetes)**, and **Viral Defense**.

### 🎮 3 Playable Game Modes & Persistent Mastery
- **🎯 Locate Organ** — Read clinical clues and click the exact 3D organ on the body.
- **🩺 Body Doctor** — Diagnose live patient emergencies and answer follow-up questions to stabilize vitals.
- **🧠 Mastery Quiz** — Multi-system encyclopedia quiz with explanations.
- **🏆 Persistent Progress & 11 System Medals** saved automatically in `localStorage`.

### 🌍 Bilingual & Customizable Studio UI
- **English & Hebrew (`EN | עב`)** with automatic **LTR / RTL** layout flipping.
- **4 Synchronized Themes** (UI + 3D lighting, fog, pedestal & ECG): **Midnight Studio**, **Clinical Light**, **Bio Emerald**, and **Warm Atlas**.
- **Dynamic Bottom Topic Dock** with collapsible sidebar drawer and centered **A–Z Atlas Search**.

---

## 🚀 Quick Start

### Option 1: Open Directly in Browser (No Dependencies)
Simply double-click **`index.html`** to open it in Chrome, Edge, or Firefox.

### Option 2: Run with Local Node Server (Optional)
```bash
node server.js
```
Then open **http://localhost:3000**.

---

## 🌐 Deploying Online

Because this is a pure static web app (no backend or build step required), you can host it anywhere:

- **GitHub Pages:** Push this repository to GitHub → **Settings → Pages** → Deploy from `main` branch (`/root`).
- **Netlify / Vercel / Cloudflare Pages:** Drag-and-drop the folder or connect your GitHub repo.
- **Standard Web Hosting:** Upload `index.html`, `css/`, and `js/` to your public web directory (`public_html` / `www`). *(You do not need to upload `server.js`.)*

---

## 📁 Project Structure

```text
├── index.html                    # Main application layout & 3D stage
├── server.js                     # Optional zero-dependency Node static server
├── css/
│   └── styles.css                # Spatial medical UI, 4 themes, LTR/RTL styles
└── js/
    ├── app.js                    # Main controller (3D scene, UI, tours, lab, dock)
    ├── audio.js                  # Procedural Web Audio heartbeat & TTS narrator
    ├── features.js               # Guided 3D tours, pathology lab & mastery ranks
    ├── game.js                   # Game modes, XP, streaks & localStorage save
    ├── simulation.js             # Real-time physiology & ECG waveform engine
    ├── data/
    │   ├── encyclopedia.js       # Core body systems, organs, presets & quizzes
    │   ├── i18n_he.js            # English/Hebrew localization & RTL engine
    │   ├── encyclopedia_extra.js # Full muscular, skeletal & facial organs (EN/HE)
    │   └── encyclopedia_systems.js # Endocrine, lymphatic, reproductive & skin (EN/HE)
    └── three/
        └── anatomyBuilder.js     # Procedural Three.js 3D human body (Male/Female)
```

---

## 🛠️ Tech Stack
- **Three.js** (r147 + OrbitControls) for procedural 3D anatomy & WebGL clipping
- **HTML5 Canvas** for real-time ECG waveform rendering
- **SVG** for non-overlapping dynamic callout leader lines
- **Web Audio API & Web Speech API** for biological heartbeat synth & bilingual narration
- **Vanilla ES6 JavaScript & Modern CSS3** (CSS Grid, Logical Properties for RTL, Custom Properties for theming)
