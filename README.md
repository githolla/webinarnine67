# Nine-67 webinar source

The website for **Your team has AI. Why is the work still manual?** The current demo follows a customer change at fictional **Harbor Event Rentals**: 120 guests become 160, with the same Friday, 9 AM delivery. Three employees use AI successfully, but the order still needs coordinated decisions and verified updates.

The editable application source is in `dist/`. This is a static HTML, CSS and JavaScript application with no third-party npm dependencies, database or backend service.

## Run locally

Use Node.js 20 or newer:

```sh
npm run dev
```

Open:

- `http://localhost:3000/` for the webinar cover.
- `http://localhost:3000/stats.html` for the research introduction.
- `http://localhost:3000/live.html` for the five-scene demo.
- `http://localhost:3000/host-guide.html` for Josh and Suuchi’s five-minute walkthrough.

Set `PORT` if 3000 is occupied. Stop the server with Ctrl+C. Serve the app over HTTP so ES modules load with the correct MIME type. No `npm install` is needed.

## Test and build

```sh
npm test
npm run check
npm run build
npm run preview
```

The tests exercise application behavior. The check validates JavaScript syntax and local HTML/CSS references. The build copies the checked source from `dist/` to `build/`. Preview serves `build/` locally. Run only one server on a port at a time.

## Current story

1. **The customer request.** Rachel at Northstar adds 40 guests, keeping Friday’s 9 AM delivery and the same venue.
2. **Three successful AI tasks.** Leah in Customer Service uses ChatGPT and HubSpot. Sam in Warehouse uses Copilot and the sample Rental inventory. Dana in Dispatch uses Claude and the sample Dispatch board. Each saves a useful local result.
3. **The manual coordination.** Leah still needs to combine the equipment plan, truck plan and full additional charge before she can make a complete customer commitment.
4. **The connected workflow.** Sam and Dana review the shared revision, Rachel approves the $580 additional charge, and Leah releases it. The workflow applies and verifies the approved order, dispatch and CRM updates.
5. **The customer outcome.** One confirmation draft covers 160 chairs, 40 tables, Friday at 9 AM, the same venue, and $2,100 before tax.

The main story should stay readable without opening every detail. AI conversations show useful work, not invented mistakes. A pending plan is distinct from a released order. A customer approval is distinct from an AI-generated draft.

## Scenario arithmetic

| Item | Original | Revised |
| --- | --- | --- |
| Chairs at $5 each | 120 / $600 | 160 / $800 |
| Tables at $20 each | 30 / $600 | 40 / $800 |
| Delivery | $320 | $500 |
| Total before tax | $1,520 | $2,100 |
| Additional charge | | $580 |

The increase is $400 in equipment and $180 for a second truck. These are fictional scenario assumptions, not a vendor quote or a measured saving.

## Where to edit

| File | Purpose |
| --- | --- |
| `dist/site.js` | Shared event and presenter configuration |
| `dist/live.html` | Current five-scene application shell |
| `dist/event-model.mjs` | Rental change data, decisions and workflow state |
| `dist/event-view.mjs` | Scene rendering, AI conversations and visible artifacts |
| `dist/event-demo.mjs` | Interactive controls and navigation |
| `dist/event.css` | Current demo styling |
| `tests/*.test.mjs` | Behavioral and rendering checks |
| `dist/stats.html` | Research introduction with source links |
| `dist/host-guide.html` | Five-minute walkthrough for Josh and Suuchi |
| `dist/webinar.js`, `dist/index.html` | Webinar cover and retained earlier presentation code |
| `dist/webinar.css`, `dist/brand.css` | Cover and brand styling |
| `dist/assets/` | Local logos, images and attribution |
| `scripts/` | Local server, validation and build scripts |

Earlier proposal, manufacturing and dashboard files remain in the repository as legacy source. They do not define the current event-rental story.

## Demonstration boundaries

Harbor Event Rentals, Northstar, the people, equipment availability, rates, messages, AI outputs and approvals are fictional. The sample Rental inventory and Dispatch board are generic demonstration applications. Their presence does not claim a live integration with a rental or routing vendor.

The prototype simulates system writes and recorded responses. It does not reserve equipment, book a truck, charge the customer, send an email or call AI-provider APIs. The connected workflow uses approved source records and work products; it does not silently read private AI conversations.

Live implementation would require authorized connectors, identity and permission controls, a durable workflow, explicit approval handling, verified writes and recovery behavior. Measure actual coordination time, waiting and rework in a pilot before claiming savings. The research introduction supports the problem framing, not measured Nine-67 results.

## Webinar configuration

Edit the event settings in `dist/site.js`, including the booking URL, label and presenter information. The complimentary workflow assessment takes place separately after the webinar. Josh hosts and drives the demo; Suuchi explains the build and supports questions.

## Deploy

This is a static site:

- Build command: `npm run build`
- Output directory: `build`
- Framework: Other / static
- Entry point: `index.html`
- Direct demo route: `/live.html`

Preserve relative paths and HTML filenames. `vercel.json` and `netlify.toml` contain hosting configuration. No SPA rewrite is required. `build/` is generated and ignored by Git.

Use a working branch for changes. Run tests, checks and the build before publishing. Hosting access controls must be configured in the destination account; they are not carried by the static files.

## Historical export files

The repository includes provenance from the original source export at commit `c4be3c6e77ef761911150d28487a496dbfad2793`. `SOURCE-MANIFEST.json` describes that original snapshot. The current application has since changed, so those historical hashes are not a manifest of the current demo.

The original `.openai/hosting.json` is retained for provenance. Other hosts do not need it. All core logos and images are local; Google Fonts has browser fallbacks. Asset attribution is in `dist/assets/credits.txt`.
