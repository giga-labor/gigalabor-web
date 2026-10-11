# GiGa Labor

> Laboratorio digitale personale · Ingegneria digitale. Ricerca. Innovazione.
> Personal digital laboratory · Digital engineering. Research. Innovation.

---

## 🇮🇹 Italiano

**GiGa Labor** è un sito personale che documenta progetti, ricerche e riflessioni su software, sistemi intelligenti e ingegneria applicata. È costruito come laboratorio aperto: 95% ideazione umana, 95% codice AI.

### Stack tecnico

- HTML5 semantico · CSS3 con variabili custom · JavaScript vanilla (IIFE, nessun framework)
- Zero dipendenze runtime · funziona su `file://` e qualsiasi HTTP server statico
- Multilingua IT/EN integrato · tre temi (Dark Tech, Light, High Contrast)
- Canvas animato (word cloud neurale) · Typewriter hero · Panel system
- Font: BioRhyme (display), Inter (testo), JetBrains Mono (codice/UI)

### Struttura del progetto

```
gigalabor-site/
├── index.html              # Home (con intro a tutto schermo solo alla prima visita)
├── home.html               # Redirect a index.html (vecchi link)
├── assets/
│   ├── logo/               # Logo e favicon
│   ├── flags/              # Bandiere lingua (it.webp, en.webp)
│   └── fonts/              # Font woff2 serviti dal sito (licenza OFL, nessuna chiamata a Google)
├── css/
│   ├── main.css            # Entry CSS: solo @import + regole che devono vincere su tutto
│   ├── base.css            # Reset, tipografia, layout, utility (prima di responsive.css)
│   ├── themes.css          # Variabili dei tre temi
│   ├── shell.css           # Chrome V3 (topbar, sidenav, panel, hero)
│   └── components/         # Navbar, hero, cards, buttons, footer, responsive
├── js/
│   ├── app.js              # Logica completa (tutti i moduli in IIFE)
│   └── data/
│       ├── gl-data.js      # Config e progetti
│       ├── gl-news.js      # Metadati delle notizie
│       └── i18n/
│           ├── it.js / en.js           # Stringhe dell'interfaccia
│           └── news-it.js / news-en.js # Testi delle notizie
├── tools/
│   └── prerender-i18n.js   # Scrive nell'HTML i testi italiani di default (SEO)
└── pages/
    ├── projects.html
    ├── about.html
    ├── news.html
    ├── contact.html
    ├── scritti.html
    ├── privacy.html
    ├── terms.html
    └── projects/           # Pagine dettaglio singolo progetto
```

### Avvio locale

**Opzione 1 — Apertura diretta** (funziona su browser moderni):
```
Apri gigalabor-site/index.html nel browser
```

**Opzione 2 — Server locale** (consigliato per testare i18n e routing):
```bash
cd gigalabor-site
npx serve .
# oppure
python3 -m http.server 8080
```
Poi vai su `http://localhost:8080`

### Aggiungere un progetto

1. Aggiungi l'oggetto progetto nell'array `GL.projects` in `js/data/gl-data.js`
2. Aggiungi le traduzioni in `js/data/i18n/it.js` e `en.js` sotto la chiave `projects`
3. Crea la pagina `pages/projects/nome-progetto.html` (parti da una esistente)
4. Esegui `node tools/prerender-i18n.js` per aggiornare i testi statici nell'HTML

Il contatore nella home e la data "Aggiornato il" nel footer si calcolano da soli dai dati.

---

## 🇬🇧 English

**GiGa Labor** is a personal website documenting projects, research and thoughts on software, intelligent systems and applied engineering. Built as an open lab: 95% human ideation, 95% AI code.

### Tech stack

- Semantic HTML5 · CSS3 with custom properties · Vanilla JavaScript (IIFE, no framework)
- Zero runtime dependencies · works on `file://` and any static HTTP server
- Built-in IT/EN multilanguage · three themes (Dark Tech, Light, High Contrast)
- Animated canvas (neural word cloud) · Typewriter hero · Panel system
- Fonts: BioRhyme (display), Inter (body), JetBrains Mono (code/UI)

### Local development

**Option 1 — Direct open** (works on modern browsers):
```
Open gigalabor-site/index.html in browser
```

**Option 2 — Local server** (recommended):
```bash
cd gigalabor-site
npx serve .
# or
python3 -m http.server 8080
```
Then visit `http://localhost:8080`

### Adding a project

1. Add a project object to the `GL.projects` array in `js/data/gl-data.js`
2. Add translations in `js/data/i18n/it.js` and `en.js` under the `projects` key
3. Create the page `pages/projects/project-name.html` (start from an existing one)
4. Run `node tools/prerender-i18n.js` to refresh the static text in the HTML

The home counter and the footer "Updated" date are computed from the data.

---

## Deploy — GitHub Pages

Il workflow `.github/workflows/deploy.yml` è già configurato.
Quando sei pronto a pubblicare:

1. Vai su **Settings → Pages** nel tuo repository GitHub
2. Source: **GitHub Actions**
3. Fai un push su `main` — il workflow si avvia automaticamente
4. Il sito sarà live su `https://<username>.github.io/<repo>/`

**Custom domain** (opzionale): crea un file `gigalabor-site/CNAME` con il tuo dominio:
```
gigalabor.it
```

---

## Licenza / License

Codice sorgente rilasciato sotto licenza [MIT](LICENSE).  
Brand, logo e contenuti originali sono proprietà di GiGa Labor.

Source code released under [MIT](LICENSE) license.  
Brand, logo and original content are property of GiGa Labor.

---

## News Pipeline (Single Source of Truth)

This project uses one unified news pipeline:

- Metadata: `js/data/gl-news.js`
- Localized full texts: `js/data/i18n/news-it.js` and `js/data/i18n/news-en.js`
- Full news page renderer: `pages/news.html`
- Home/dashboard news preview and panel: reads the same dataset (`GL.NEWS + GL.newsStrings`)

To add a news item:
1. add one metadata entry in `gl-news.js`
2. add the same `id` entry in `news-it.js`
3. add the same `id` entry in `news-en.js`

The footer "Updated" date follows the most recent `sort_date` automatically.
