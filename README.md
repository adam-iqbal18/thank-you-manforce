# Thank you, Manforce

A small static website opened from a QR code on a farewell card. A visitor types their name and picks their department and position, and the site shows them a personal thank-you note.

Plain HTML, CSS and JavaScript. There is no build step, framework, tracking or cookies. The only external request is the Google Fonts stylesheet.

```
index.html            form page (name, department, position)
note.html             note page (the personal note and the WhatsApp button)
favicon.svg
src/config.js         sign-off, last-day stamp text, supervisor regex, WhatsApp number, department and position lists
src/content.js        every wish, position line, the supervisor message and the keep-in-touch text
src/form.js           form page logic
src/note-page.js      note page logic
src/note.js           shared note logic
src/save-image.js     draws the note as a PNG for "Save my note" (you normally never touch these four)
src/styles.css        design tokens and layout
scripts/serve.js      local server (no dependencies)
scripts/make-qr.js    QR code generator
.github/workflows/pages.yml   GitHub Pages deployment
```

## Run it locally

The page uses JavaScript modules, so open it through a local server rather than double-clicking `index.html`.

With Node 18 or newer:

```bash
npm run dev
```

Then open http://localhost:5173.

With Python and no Node:

```bash
python -m http.server 5173
```

## Edit the words

- **Sign-off:** `SIGN_OFF` in `src/config.js`.
- **Wishes:** in `src/content.js`, `WISHES` has one list per department. Add or remove lines freely. A list with only one wish still works, and the "Another wish" button is hidden for it. "Another wish" cycles through the list in order.
- **Position lines:** `POSITION_LINES` in `src/content.js`. The intern line (`i`) is a placeholder, so rewrite it as you like.
- **Supervisor message:** `SUPERVISOR_MESSAGE` in `src/content.js`. The name that triggers it is `SUPERVISOR_PATTERN` in `src/config.js`.
- **Stamp text:** `LAST_DAY` in `src/config.js`.
- **WhatsApp button:** set `WHATSAPP_NUMBER` in `src/config.js` to your number with the country code, digits only (for example `60123456789`). While it is empty, the keep-in-touch section is hidden. Its heading, text, button label and pre-filled message are `CONNECT` in `src/content.js`.

## Change departments or positions

1. In `src/config.js`, edit `DEPARTMENTS` (or `POSITIONS`). Each entry has a short `value` and the `label` people see.
2. In `src/content.js`, add a `WISHES` list (or `POSITION_LINES` entry) with the same `value` as its key.

A department with no wishes falls back to the `oth` wishes, so nothing breaks if you forget step 2.

## Deploy to GitHub Pages

1. Create a GitHub repository (for example `thank-you-manforce`) and push these files to the `main` branch.
2. In the repository, go to **Settings → Pages**. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. The included workflow (`.github/workflows/pages.yml`) runs on every push to `main`. It publishes `index.html`, `note.html`, `favicon.svg` and `src/`.
4. When it finishes, your URL appears in the **Actions** run and under **Settings → Pages**. It usually looks like `https://<your-username>.github.io/thank-you-manforce/`.

Netlify or Vercel also work: import the repository, leave the build command empty and set the publish directory to the repository root.

## Make the QR code

Once you have the live URL:

```bash
npm install
```

```bash
npm run qr -- https://<your-username>.github.io/thank-you-manforce/
```

This writes `print/qr.svg` and `print/qr.png` (1200 × 1200 px). Scan the PNG with your phone to check it before printing. Point the QR code at the main address (the form page), not `note.html`.

## Accessibility and privacy notes

- Real labels, visible marigold focus rings, `aria-live` on the wish so "Another wish" is announced, `role="alert"` error messages, 48 px touch targets, light and dark mode, and reduced motion.
- Everything a visitor types stays in their browser and is inserted with `textContent`. The form passes it to the note page through `sessionStorage` (this browser tab only, cleared when the tab closes). "Save my note" draws the image in the browser too: phones get the share sheet ("Save Image" puts it in the gallery), computers download a PNG, and in-app browsers that allow neither show the image to press and hold. Nothing is sent anywhere unless the visitor taps the WhatsApp button, which opens WhatsApp with their name in a message they can edit before sending.
