# Yubei Li — Academic Homepage

A single-page static site (plain HTML/CSS/JS, no build step) for GitHub Pages.

```
/
├── index.html              ← all page content (About, Publications, Education)
├── .nojekyll               ← tells GitHub Pages to serve files as-is
├── README.md
└── assets/
    ├── css/style.css       ← all styling (colors/fonts at the top in :root)
    ├── js/main.js          ← photo/CV fallbacks + nav highlight (optional)
    ├── images/
    │   └── profile.jpg     ← (add later) your profile photo
    └── Yubei_Li_CV.pdf     ← (add later) your CV
```

All paths are relative, so the site works whether it is served from
`https://<username>.github.io/` or from a project subpath.

---

## 1. Preview locally

From this folder:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>. (Opening `index.html` directly also works, but the
"CV missing" check only runs when the page is served over http.)

## 2. Deploy on GitHub Pages

**Option A — user site (recommended, gives `https://freya-lyb.github.io/`):**

1. Create a public repository named exactly `Freya-lyb.github.io`.
2. Upload / push the contents of this folder to the repository root.
3. Repository → **Settings → Pages** → Source: *Deploy from a branch*, Branch: `main`, folder `/ (root)`.
4. Wait ~1 minute; the site appears at `https://freya-lyb.github.io/`.

```bash
git init && git add . && git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/Freya-lyb/Freya-lyb.github.io.git
git push -u origin main
```

**Option B — project site:** any repo name works; it will be served at
`https://freya-lyb.github.io/<repo-name>/`.

Once the final URL is known, uncomment the `canonical` / `og:url` lines near the top of
`index.html` and fill in the URL.

## 3. Replace the profile photo

Save your photo as **`assets/images/profile.jpg`**. No code changes needed.

- Portrait orientation works best (the slot is 4:5, e.g. 880×1100 px).
- Keep it under ~300 KB for fast loading.
- Until the file exists, a neutral "YL" monogram is shown automatically.
- Different filename or format? Change the `src` of the `<img data-photo>` tag in `index.html`.
- If the face is cropped awkwardly, adjust `object-position` in `.photo img` in `style.css`.

## 4. Add the final CV

Save the PDF as **`assets/Yubei_Li_CV.pdf`**. No code changes needed.

While the file is missing, the CV links (nav bar + About links) are shown greyed out
with a "CV coming soon" tooltip instead of leading to a 404.
To use a different filename, search `index.html` for `Yubei_Li_CV.pdf` (2 places).

## 5. Where publication content lives

Everything is in `index.html`, inside `<section id="publications">`.
Each paper is one `<article class="pub">` block:

```html
<article class="pub">
  <div class="pub-badge"><span class="badge badge-venue">COLM</span></div>
  <div class="pub-body">
    <h4 class="pub-title"><a href="PAPER_URL">Paper Title</a></h4>
    <p class="pub-authors">Author A, <strong class="me">Yubei Li</strong>, Author C</p>
    <p class="pub-links">
      <a href="PAPER_URL">Paper</a>
    </p>
  </div>
</article>
```

## 6. Add a new publication

1. Copy an existing `<article class="pub">…</article>` block.
2. Paste it where it belongs (newest/most important first within a year).
3. Edit badge, title, authors, and links.
   - Accepted venue → `class="badge badge-venue"` (light blue).
   - Preprint / under review → `class="badge"` (grey).
   - Always wrap your name as `<strong class="me">Yubei Li</strong>`.
   - No public link yet → remove the `<a>` around the title and delete the whole
     `<p class="pub-links">` line (so no empty/broken button appears).
4. New year? Add `<h3 class="year">2027</h3>` above that year's papers.

When a preprint is accepted, just change its badge text (e.g. `Preprint` → `AAAI`)
and class (`badge` → `badge badge-venue`).

## 7. Add a Code link later (e.g. Codebook Agent)

In the Codebook Agent block there is a commented-out line:

```html
<!-- <a href="https://github.com/Freya-lyb/REPO-NAME">Code</a> -->
```

Remove the `<!--` / `-->` comment markers and put in the real repository URL.
Other optional links (Project, Slides, Poster) are added the same way inside `<p class="pub-links">`.

## 8. Add the MEMCON paper link later

Find the "Memory as a Controlled Process" block in `index.html` and:

1. Wrap the title in a link:
   ```html
   <h4 class="pub-title"><a href="PAPER_URL">Memory as a Controlled Process: …</a></h4>
   ```
2. Add this line right after the authors paragraph:
   ```html
   <p class="pub-links"><a href="PAPER_URL">Paper</a></p>
   ```

## News and Honors & Awards

Both live in `index.html` (`<section id="news">` and `<section id="awards">`) and use the same format:

```html
<li>
  <span class="dated-when">Oct 2026</span>
  <span class="dated-what">What happened, with <a href="URL">a link</a> if useful.</span>
</li>
```

Newest first. Keep News to ~3–5 items and remove old ones over time.

## Display settings (dark mode & accessibility)

The ◐ button at the right of the nav bar opens a small panel where visitors can choose:

- **Theme**: Auto (follows their OS) / Light / Dark
- **Text size**: A / A+ / A++ (100% / 112.5% / 125%)
- **High contrast**: darker text, stronger borders, underlined links (on automatically if the OS asks for more contrast)
- **Color-blind friendly**: Okabe–Ito color-blind-safe blue; links always underlined; badges are distinguished
  by shape (filled = accepted venue, outlined = preprint), so nothing depends on color alone

Choices are saved in the visitor's own browser (localStorage) and applied before the page paints.
Without JavaScript the button is hidden and the page simply follows the OS light/dark setting.

Where it lives:
- Colors for every mode: the token blocks at the top of `assets/css/style.css`
  (`:root`, `[data-theme="dark"]`, `[data-contrast="high"]`, `[data-cvd="on"]`).
  If you change a color in light mode, change the matching dark-mode token too.
- Panel markup: `<div id="display-panel">` in `index.html`.
- Logic: section 0 of `assets/js/main.js`, plus a tiny inline script in `<head>` that prevents a flash of the wrong theme.

## Chinese name font

李芋蓓 uses the Google Fonts brush running-script face **Zhi Mang Xing** (志莽行书), loaded with `text=李芋蓓` so only those
three characters (a few KB) are downloaded. To switch, change the family name in the Google Fonts `<link>`
in `index.html` and in `--font-cn` in `style.css`. Alternatives: Ma Shan Zheng (brush regular script),
Long Cang (pen handwriting), ZCOOL XiaoWei (elegant serif), Liu Jian Mao Cao (cursive).
If Google Fonts can't load, the name falls back to the visitor's Kaiti (楷体) font.

## Other small edits

- **Footer "Last updated"**: bottom of `index.html`.
- **Colors / fonts**: the `:root` block at the top of `assets/css/style.css`.
- **Hobbies line**: the `<p class="outside">` at the end of the Education section — delete it to remove.
