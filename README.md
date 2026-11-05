# Nine-67 webinar: complete source

The full published website for **Your team has AI. Why is the work still manual?**, including the Keystone Workwear logo-change scenario, webinar cover, presenter guide, optional Q&A controls, and the retained earlier dashboard code.

The HTML, CSS, JavaScript, and image assets in `dist/` are the editable application source. This project was written directly as a static website. There is no missing React project, compiled source directory, package dependency, database, or server application.

## Run locally

Install Node.js 20 or newer, extract this ZIP, then open a terminal in this folder:

```sh
npm run dev
```

Open **http://localhost:3000/** for the webinar cover, **http://localhost:3000/stats.html** for the opening stats, or **http://localhost:3000/live.html** for the seven-screen demo. Add `?presenter=1` to any page to show presenter controls in that browser tab; `?presenter=0` hides them again. No `npm install` or environment variables are needed because the project has zero third-party npm dependencies.

Stop the local server with Ctrl+C. Set `PORT` if 3000 is already occupied.

## Check and build

```sh
npm run check
npm run build
npm run preview
```

The check validates JavaScript syntax (including inline scripts) and local HTML/CSS references. The build checks the app and copies the editable `dist/` files to `build/`. Preview serves `build/` at the same local address. Run only one local server on a port at a time.

## Put it in Git

Create an empty GitHub repository, then run these commands inside this extracted folder. Replace the example URL with your repository URL.

```sh
git init
git add .
git commit -m "Add complete Nine-67 webinar demo"
git branch -M main
git remote add origin https://github.com/YOUR-ACCOUNT/YOUR-REPOSITORY.git
git push -u origin main
```

The ZIP excludes the original `.git` directory and credentials so you can create your own repository. All application source and assets from the published source snapshot are included. `build/` is ignored because it can be regenerated.

## Deploy

This is a static site. Serve the contents of `build/`, or serve `dist/` directly if your host does not need a build step. Keep the HTML filenames and relative folder structure intact.

- Build command: `npm run build`
- Output directory: `build`
- Framework: Other / static
- Entry point: `index.html`
- Direct live demo route: `/live.html`

Included `vercel.json` and `netlify.toml` declare the build command and output directory. Import your repository into your hosting account and use the extracted project folder as the project root. No SPA rewrite is required. Deployment to a new account has not been performed as part of this export.

The original `.openai/hosting.json` is preserved for completeness. Its project ID identifies the existing ChatGPT Site; it is not an API key. Other hosts do not need that file. The existing Site's private access controls do **not** travel with these static files. Configure access in your chosen host if the demo should remain private.

## Before the webinar

Edit `dist/site.js`:

- `bookingUrl` (and optional `bookingLabel`): shows the booking link and a QR code on the assessment screen.
- `novemberSlots`: shows "we are holding N sessions in November".
- `presenters[].portrait`: path to a portrait image in `dist/assets/` (shown in grayscale). Initials show until set.

## Where to edit

| File | Purpose |
| --- | --- |
| `dist/site.js` | Event config (booking link, slots, portraits) and presenter mode, shared by every page |
| `dist/live.html` | Seven-screen Keystone Workwear demo markup |
| `dist/guided.js` | Demo navigation, rehearsal cues, Q&A availability states, approval gating, assessment screen |
| `dist/launch-story.css` | Demo, stats and assessment styling, including the 720p compaction rules |
| `dist/stats.html` | Opening stats screen with sources |
| `dist/webinar.js` | Webinar cover (`coverScene`) and presentation shell; later scenes are the retained earlier deck |
| `dist/index.html` | Cover entry point and retained dashboard implementation |
| `dist/webinar.css`, `dist/brand.css` | Cover and brand styling |
| `dist/host-guide.html` | 30-minute run-of-show, scripts, polls, Q&A answers, stats wording, go-live checklist |
| `dist/explore.html` | Redirect to the Q&A controls on screen 4 |
| `dist/assets/` | Logos, illustrations, reference image, and asset credits |
| `scripts/` | Dependency-free local server, validation, and build scripts |

Earlier CSS/JS and dashboard scenarios are intentionally retained but are no longer linked from the cover.

## Current flow

Cover → opening stats → demo:

1. **The order:** Keystone Workwear, a fictional uniform maker. Ridgeline Roofing emails a new logo for 5,000 shirts; Leah replies “Got it” with Copilot. Both logos shown side by side.
2. **Three AIs:** sales, design and production each used AI on order 4821, and each stopped at its own department.
3. **The press:** the operator’s screen shows the old logo marked Approved. “Would you hit Start?” and where the new logo actually is.
4. **The fallout:** the run goes through; the shirts reach 40 branches with the old logo. Cost and the general pattern.
5. **The desk:** rewind to Monday. The desk matches the email to the order, Leah holds the job, design approves the proof, and production releases it.
6. **Right shirt:** the operator’s screen swaps to the new logo, same 1:00 PM slot, and only then Leah confirms with the customer.
7. **Your handoffs:** the complimentary workflow assessment.

**Q&A · Change one fact** on screen 5 switches the new artwork between proof approved, proof not approved yet, and failing the print check. The latter two hold the job and block release.

## What is simulated

The company, clients, people, numbers, AI outputs, approvals, messages, and integrations are fictional demonstration content. This package does not call OpenAI, Microsoft, ERP systems, or other APIs. The work order is represented by a simulated update, with an update queued for a person. No tasks or messages are sent. Live production integrations would require separately implemented authentication, permissions, backend services, evaluation, and connectors.

The app uses browser-local interactions. Reloading or restarting resets the current demo state. All core images and logos are included. The main cover requests Google Fonts; browsers use the declared fallback fonts when that service is unavailable. Asset attribution is in `dist/assets/credits.txt`.

## Export provenance

Published source snapshot: `c4be3c6e77ef761911150d28487a496dbfad2793`.

Application files were copied unchanged from that snapshot. Portable run/build scripts, deployment configuration, Git ignore rules, this README, and a source checksum manifest were added for the export. `SOURCE-MANIFEST.json` records SHA-256 hashes for all original tracked files so they can be compared with the source snapshot.
