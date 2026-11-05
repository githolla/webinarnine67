# Nine-67 webinar: complete source

The full published website for **Your team has AI. Why is the work still manual?**, including the Summit Advisory proposal-coordination scenario, webinar cover, presenter guide, optional Q&A controls, and the retained earlier dashboard code.

The HTML, CSS, JavaScript, and image assets in `dist/` are the editable application source. This project was written directly as a static website. There is no missing React project, compiled source directory, package dependency, database, or server application.

## Run locally

Install Node.js 20 or newer, extract this ZIP, then open a terminal in this folder:

```sh
npm run dev
```

Open **http://localhost:3000/** for the webinar cover, **http://localhost:3000/stats.html** for the opening stats, or **http://localhost:3000/live.html** for the five-scene interactive demo. Add `?presenter=1` to any page to show presenter controls in that browser tab; `?presenter=0` hides them again. No `npm install` or environment variables are needed because the project has zero third-party npm dependencies.

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
| `dist/live.html` | Five-scene proposal application shell |
| `dist/proposal-model.mjs` | Requirements, approval dependencies, safe retries and release state |
| `dist/proposal-view.mjs` | Five scene views, sample artifacts, AI conversations and sidebars |
| `dist/proposal-demo.mjs`, `dist/proposal.css` | Interactive application controller and responsive styling |
| `tests/proposal.test.mjs` | Approval, revision, retry, readiness and render tests |
| `dist/guided.js` | Retained previous manufacturing demo logic; not loaded by the current app |
| `dist/launch-story.css` | Opening stats and retained earlier demo styles |
| `dist/stats.html` | Opening stats screen with sources |
| `dist/webinar.js` | Webinar cover (`coverScene`) and presentation shell; later scenes are the retained earlier deck |
| `dist/index.html` | Cover entry point and retained dashboard implementation |
| `dist/webinar.css`, `dist/brand.css` | Cover and brand styling |
| `dist/host-guide.html` | Five-minute proposal demo walkthrough, exception tests and closing message |
| `dist/explore.html` | Redirect to the Q&A controls on screen 4 |
| `dist/assets/` | Logos, illustrations, reference image, and asset credits |
| `scripts/` | Dependency-free local server, validation, and build scripts |

Earlier CSS/JS and dashboard scenarios are intentionally retained but are no longer linked from the cover.

## Current flow

Cover → opening stats → demo:

1. **Five finished tasks:** explore sales, delivery, finance, legal and marketing AI conversations and original Austin deliverables.
2. **One client change:** record Rachel’s request to add Denver after all original contributions are complete.
3. **Leah connects it all:** walk six manual handoffs with explicitly illustrative effort and waiting assumptions.
4. **Connected workflow:** trace the requirement, approve dependent revisions, authorize the packet and simulate verified writes. Test CRM failure and a new source revision.
5. **One finished proposal:** review the aligned summary and draft customer email; download a sample HTML summary; invite the workflow assessment.

Run `npm test`, `npm run check`, and `npm run build`. The application has no external runtime dependencies. ES modules must be served over HTTP; `npm run dev` provides the correct MIME types. The final scene stays blocked until all approvals and simulated writes pass. A new revision clears prior approval; failed writes can be retried without repeating completed writes.

## What is simulated

The company, clients, people, numbers, AI outputs, approvals, messages, and integrations are fictional demonstration content. This package does not call OpenAI, Microsoft, business systems, or other APIs. Word, spreadsheet and PDF imports are represented by structured sample content. SharePoint, HubSpot and Jira writes are simulated. The downloadable artifact is an HTML proposal summary, not a native Office file. The 160 minutes of active effort and up to three days elapsed are scenario assumptions, not measured ROI. No tasks or messages are sent. Live production integrations would require separately implemented authentication, permissions, backend services, evaluation, and connectors.

The app uses browser-local interactions. Reloading or restarting resets the current demo state. All core images and logos are included. The main cover requests Google Fonts; browsers use the declared fallback fonts when that service is unavailable. Asset attribution is in `dist/assets/credits.txt`.

## Export provenance

Published source snapshot: `c4be3c6e77ef761911150d28487a496dbfad2793`.

Application files were copied unchanged from that snapshot. Portable run/build scripts, deployment configuration, Git ignore rules, this README, and a source checksum manifest were added for the export. `SOURCE-MANIFEST.json` records SHA-256 hashes for all original tracked files so they can be compared with the source snapshot.
