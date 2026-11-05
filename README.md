# Nine-67 webinar — complete source

The full published website for **Your Team Has AI. So Why Is the Work Still Manual?**, including the Forma Digital staffing scenario, webinar cover, presenter guide, optional Q&A controls, and the retained earlier dashboard code.

The HTML, CSS, JavaScript, and image assets in `dist/` are the editable application source. This project was written directly as a static website. There is no missing React project, compiled source directory, package dependency, database, or server application.

## Run locally

Install Node.js 20 or newer, extract this ZIP, then open a terminal in this folder:

```sh
npm run dev
```

Open **http://localhost:3000/live.html** for the current four-screen demo, or **http://localhost:3000/** for the webinar cover. No `npm install` or environment variables are needed because the project has zero third-party npm dependencies.

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

## Where to edit

| File | Purpose |
| --- | --- |
| `dist/live.html` | Current four-screen Forma Digital demo markup and story |
| `dist/guided.js` | Navigation, calendar content, rehearsal cues, availability cases, approval gating, replay |
| `dist/launch-story.css` | Current demo styling and responsive layout |
| `dist/index.html` | Main application shell and retained dashboard implementation, including inline JavaScript |
| `dist/webinar.js` | Webinar cover, presentation navigation, retained presentation scenes |
| `dist/webinar.css`, `dist/brand.css` | Cover, presentation, and brand styling |
| `dist/host-guide.html` | Presenter cues and 30-minute webinar running order |
| `dist/explore.html` | Redirect to the staffing Q&A controls |
| `dist/assets/` | All bundled logos, illustrations, reference image, and asset credits |
| `scripts/` | Dependency-free local server, validation, and build scripts |

Earlier CSS/JS and dashboard scenarios are intentionally retained so this is a complete export. The active webinar cover links to the current demo in `live.html`.

## Current demo flow

1. Two managers prepare separate AI-assisted app launch plans for Luma Hotels and Rally Fitness.
2. Both plans book Alex for the same week: 80 hours requested against 40 hours available.
3. The proposed Launch Desk checks shared capacity and prepares Jamie as a replacement for Rally.
4. COO approval changes the simulated shared plan and shows the next owner for each handoff.

Use **Rehearse** for speaking cues and **Start live** to reset the opening. **Q&A · Change one fact** on screen 3 switches Jamie between confirmed, unconfirmed, and already booked. The latter two block approval.

## What is simulated

The company, clients, people, numbers, AI outputs, approvals, messages, and integrations are fictional demonstration content. This package does not call OpenAI, Microsoft, Kantata, or other APIs. Kantata is represented by a verified-export scenario, with an update queued for a person. No tasks or messages are sent. Live production integrations would require separately implemented authentication, permissions, backend services, evaluation, and connectors.

The app uses browser-local interactions. Reloading or restarting resets the current demo state. All core images and logos are included. The main cover requests Google Fonts; browsers use the declared fallback fonts when that service is unavailable. Asset attribution is in `dist/assets/credits.txt`.

## Export provenance

Published source snapshot: `c4be3c6e77ef761911150d28487a496dbfad2793`.

Application files were copied unchanged from that snapshot. Portable run/build scripts, deployment configuration, Git ignore rules, this README, and a source checksum manifest were added for the export. `SOURCE-MANIFEST.json` records SHA-256 hashes for all original tracked files so they can be compared with the source snapshot.
