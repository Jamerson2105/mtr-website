# MedTech Robotics Website

A static website for MedTech Robotics, a University of Waterloo student design team building robotics for public safety, emergency response and healthcare.

It's plain HTML, CSS and JavaScript, so there's **no build step and nothing to install**.

```
.
├── index.html          # All page content (Home, Vision, Projects, Highlights, Subteams, Gallery, Contact)
├── css/styles.css      # All styling; team colours live at the top in :root
├── js/main.js          # Mobile menu, scrolling gallery, contact form submission
├── js/gallery-data.js  # List of gallery photos (auto-generated, see below)
├── assets/img/         # Web-ready images used by the site (logo, placeholders)
│   └── gallery/        # Compressed activity photos (auto-generated)
├── images/             # Original activity photos: drop new ones here
├── scripts/            # optimize_images.py: builds the gallery from images/
├── .nojekyll           # Tells GitHub Pages to serve files as-is
└── README.md
```

## Previewing locally

Open `index.html` in a browser, or run a tiny local server (recommended so paths behave exactly like they will online):

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Editing content

All text is in **`index.html`**, split into clearly commented sections (`<!-- ===== PROJECTS ===== -->` etc.). Search for `TODO` to find everything that still needs real info.

| What | Where |
|---|---|
| Hero headline / mission | `#home` section in `index.html` |
| "Our Vision" | `#about` section |
| Awards | `#highlights`: one `<li>` per award |
| Projects | `#projects`: each project is one `<article class="card">`. Copy/paste one to add a project, delete one to remove it. Use `tag-current` or `tag-past` for the status badge. |
| Subteams | `#subteams`: one `<article class="subteam">` each. |
| Logo wordmark | `assets/img/wordmark.svg`: "MedTech Robotics" set in Quadrillion Semi-Bold, converted to outlines. The free Typodermic license allows logos but **not** embedding the font in a web page, so the site uses this image instead of `@font-face`. Keep the font files out of the repo. |
| Colours | Top of `css/styles.css`: `--navy`, `--teal`, `--teal-dark` (use `--teal-dark` for teal text on white so it stays readable) |

### Page images

Images used directly on the page live in `assets/img/` (already compressed to WebP):

| File | Used for |
|---|---|
| `logo.webp` | Header logo + browser tab icon (from `images/mtr_logo.webp`) |
| `apple-touch-icon.png` | iPhone home-screen icon + link previews (180×180 PNG) |
| `hero.webp` | Hero background (tinted by a navy/teal overlay, set in `.hero` in `css/styles.css`) |
| `team.webp` | "Our Vision" photo |
| `highlight-form-and-function.webp` | "Past Highlights" photo |
| `project-*.webp` | Project cards (cropped to 16:10) |

To change one, compress the new photo (WebP, max 1600px wide; e.g. with [squoosh.app](https://squoosh.app)), save it in `assets/img/`, and update the `src`, `width`/`height` and `alt` in `index.html`. For portrait photos on project cards, adjust `style="object-position: center 30%;"` on the `<img>` to choose which part shows in the crop.

### Activity photo gallery

The **"Life on the Team"** section is a strip of photos that scrolls by on its own. It pauses when someone hovers over it, and shows each photo's caption on hover. It stays hidden (along with its "Gallery" menu link) until there's at least one photo.

To add or remove photos:

1. Put the original photos in `images/` (any size; JPG, PNG or WebP). Delete a file from `images/` to remove it from the gallery.
2. Run this from the repo root (needs Python 3 + Pillow: `pip install Pillow`):
   ```bash
   python3 scripts/optimize_images.py
   ```
   Each photo is resized to at most **1600px wide**, turned the right way up, stripped of metadata (including phone GPS location) and saved as **WebP** in `assets/img/gallery/`. The script then rewrites `js/gallery-data.js`, the list the gallery reads from.
3. Commit both `assets/img/gallery/` and `js/gallery-data.js`, then push.

Tips:
- **Captions come from the file name**: `boat-pool_test.jpg` becomes "Boat pool test". Name files descriptively, since the caption is also the alt text screen readers use.
- **Order is alphabetical.** Prefix names with `01-`, `02-` ... to control it (the number is left out of the caption).
- Files with "logo" in the name are skipped.
- To tweak a single caption, edit `js/gallery-data.js` directly, but re-running the script overwrites it.
- Visitors whose system asks for reduced motion get a strip they swipe through by hand instead of auto-scrolling.

## Contact form (FormSubmit)

The form emails messages to **aghilmurugan@gmail.com** through [FormSubmit](https://formsubmit.co). No backend or account needed.

- The destination address is in the form's `action` URL in `index.html`: `https://formsubmit.co/ajax/aghilmurugan@gmail.com`. Change the address there to route messages elsewhere.
- **First-time activation:** the first submission sends a confirmation email to that address. Click the link in it, and later messages are delivered normally.
- Optional: after activation, FormSubmit gives you a random alias string. Replace the email in the `action` URL with it so the address isn't visible in the page source.
- `js/main.js` submits the form with `fetch`, so visitors stay on the page and see a green success or red error message.
- The hidden `_honey` field is a **honeypot**. Real users never see it, and FormSubmit drops submissions where a bot fills it in.
- Edit the email subject line via the hidden `_subject` input.

## Deploying to GitHub Pages

1. Push this folder to a GitHub repository (the files should sit at the repo root, with `index.html` at the top level):
   ```bash
   git add .
   git commit -m "Initial website"
   git branch -M main
   git remote add origin https://github.com/<your-org>/<repo-name>.git
   git push -u origin main
   ```
2. On GitHub, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to *Deploy from a branch*, then choose branch **`main`** and folder **`/ (root)`**. Save.
4. After a minute or two the site is live at `https://<your-org>.github.io/<repo-name>/`.

Every push to `main` redeploys automatically.

### Custom domain

Say you own `medtechrobotics.ca`:

1. **In GitHub:** Settings → Pages → **Custom domain**, enter `www.medtechrobotics.ca` (or the bare domain), then Save. GitHub commits a `CNAME` file to the repo for you. Don't delete it.
2. **At your domain registrar's DNS settings:**
   - For `www` (subdomain): add a **CNAME** record `www` → `<your-org>.github.io`
   - For the bare/apex domain (`medtechrobotics.ca`): add four **A** records pointing to
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
     (optionally also AAAA records `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`)
   - Setting up both lets GitHub redirect one to the other automatically.
3. DNS can take anywhere from a few minutes to 24 hours to propagate. Once the check passes in Settings → Pages, tick **Enforce HTTPS**.
4. Recommended: verify the domain under your GitHub **account/org Settings → Pages** to prevent domain takeover.

See GitHub's docs: [Managing a custom domain for your GitHub Pages site](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

## Checklist before launch

- [ ] Confirm the FormSubmit activation email (send a test message first)
- [x] Add the team logo
- [x] Add activity photos and project images
- [ ] Link the CTV News story in the Highlights section
- [ ] Optional: add one-line descriptions under each subteam
