# profile.github.io

Personal portfolio site for GitHub Pages (`https://<username>.github.io/`). Static **HTML**, **CSS**, and **vanilla JavaScript**—no build step.

## Tech stack

- HTML5, CSS3 (Grid, Flexbox, custom properties, dark/light theme)
- ES6+ modules in one file: `js/script.js` (theme, nav, smooth scroll, scroll reveal, contact demo)

## Repository layout

```text
/
├── index.html          # Site entry (GitHub Pages serves this from the repo root)
├── css/
│   └── styles.css
├── js/
│   └── script.js
├── Assets/             # Your media library + site icons/images (merged)
│   ├── icons/          # favicon, social SVGs
│   ├── images/         # Hero photo, profile.svg fallback, other images
│   └── …               # Additional files you keep at repo root of Assets
└── README.md
```



## Run locally

Open `index.html` in a browser, or from the repo root:

```bash
npx --yes serve .
```

## Customize

- **Hero photo:** `index.html` → `Assets/images/ProfilePIc.jpg` (or point to `PFP.jpg` / another file under `Assets/`).
- **Copy & links:** Edit the hero, projects, timeline, `mailto:`, GitHub, and LinkedIn URLs in `index.html`.
- **Theme colors / fonts:** `css/styles.css` (`:root` and `[data-theme="light"]`).
- **Contact form:** Wire `initContactForm` in `js/script.js` or set `action` on the form to a provider (e.g. Formspree).

## GitHub Pages

In the repository **Settings → Pages**, set **Source** to deploy from the **`main`** branch and **root** (`/`). The live site URL will be `https://<your-username>.github.io/`.

