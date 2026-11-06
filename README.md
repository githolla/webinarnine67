# Nine-67 webinar source

The website for **Your team has AI. Why is the work still manual?**

The current demonstration is **“We Bought Copilot. Then We Asked People to Show Us Last Tuesday.”** At fictional Northstar, a 150-person company, six employees show how they actually use AI. Their chief of staff still reconciles the separate updates. Nine-67 then demonstrates company-wide discovery, opportunity prioritization and a focused connected-work pilot.

The editable application source is in `dist/`. This is a static HTML, CSS and JavaScript application with no third-party npm dependencies, database or backend service.

## Run locally

Use Node.js 20 or newer:

```sh
npm run dev
```

Open:

- `http://localhost:3000/` for the webinar cover.
- `http://localhost:3000/stats.html` for the standalone research introduction.
- `http://localhost:3000/live.html` for the current seven-scene demo.
- `http://localhost:3000/host-guide.html` for Josh and Suuchi’s flexible ten-minute walkthrough.

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

1. **The CEO’s view.** Suuchi plays Northstar’s CEO. The company bought Copilot, Sales has shown useful work, IT built an assistant, and the CEO uses Claude for board preparation. Josh asks what he would see beside employees on an ordinary Tuesday.
2. **Last Tuesday.** Six workspaces reveal distinct uses of AI: email tone, forecast analysis, ticket grouping, conversation rehearsal, policy retrieval and board preparation.
3. **What reaches the CEO.** Compare those workspaces with the Friday material that reaches Claude. Faster updates do not automatically carry their cross-department context.
4. **Leah’s Friday.** The chief of staff still has to establish which updates concern the same work and chase the missing context and ownership.
5. **Nine-67 discovery.** Inventory current AI use across the company, map handoffs and prioritize opportunities. Broad discovery leads to a focused first build.
6. **A connected service pilot.** A manager reviews eight candidate cases and excludes one unrelated case. Seven reviewed cases affect three accounts. Work is assigned to Nina; Marcus sees the approved context, owner and due date in the CRM; progress flows into the weekly review.
7. **The discovery invitation.** Discover, Prioritize, Build, Measure. Invite operations, IT and two interdependent department leaders. Each brings one useful AI example and one piece of work they still chase.

The first half shows what people actually do. The second half explains how Nine-67 works. Keep the distinction between AI-assisted individual productivity and completed cross-company work clear.

## The six workspaces

| Person | Department | AI use |
| --- | --- | --- |
| Ava | Customer Service | Copilot helps with the tone of a customer email |
| Ben | Sales | Copilot in Excel helps analyze forecast slippage |
| Nina | Operations | The team’s AskOps bot in Teams groups 18 tickets into three issues |
| Marcus | Account Management | Personal Grok on mobile supports a roleplay without identifying client details |
| Daniel | IT | An internal assistant retrieves policy information; tool ownership does not provide complete visibility into actual AI use |
| Suuchi | CEO | Claude helps prepare for the board using Leah’s Friday updates |

Leah is the chief of staff who manually reconciles those updates. Do not portray every employee as using the same workflow or imply every useful AI task requires integration. The discovery should preserve working practices while identifying where information, decisions and work stop at department boundaries.

## Where to edit

| File | Purpose |
| --- | --- |
| `dist/site.js` | Shared event and presenter configuration |
| `dist/live.html` | Current seven-scene application shell |
| `dist/company-model.mjs` | Fictional company data, pilot decisions and workflow state |
| `dist/company-view.mjs` | Scenes, employee workspaces, discovery map and pilot artifacts |
| `dist/company-demo.mjs` | Interactive controls and navigation |
| `dist/company.css` | Current demo styling |
| `tests/company*.mjs` | Current company-demo behavioral and rendering checks |
| `dist/stats.html` | Standalone research introduction with source links |
| `dist/host-guide.html` | Josh’s host script, Suuchi’s CEO roleplay and the second-half build discussion |
| `dist/webinar.js`, `dist/index.html` | Webinar cover and retained earlier presentation code |
| `dist/webinar.css`, `dist/brand.css` | Cover and brand styling |
| `dist/assets/` | Local logos, images and attribution |
| `scripts/` | Local server, validation and build scripts |

Earlier event-rental, proposal, manufacturing and dashboard files remain as legacy source. They do not define the current company-discovery story.

## The offer

**Book an AI Workflow Discovery Session.**

See how your teams use AI today and where Nine-67 can connect the work across your company.

The initial conversation includes operations, IT and leaders from two departments that depend on each other. Ask each participant for one example of AI helping today and one example of work they still have to chase.

Discovery is company-wide. It produces a current-use inventory, a handoff map and prioritized opportunities. The first pilot is focused and has an owner, explicit review points, authorized source access, clear completion conditions and agreed baseline measures. Measure the pilot before expanding. The offer is not limited to a single workflow selected before discovery.

## Demonstration boundaries

Northstar, its people, workspaces, service cases and account records are fictional. Suuchi plays the fictional CEO during the opening, then speaks as Nine-67’s CEO during the methods discussion. The exchanges are illustrative, not accounts of an actual client assessment.

AI responses, saved outputs, approvals, assignments, CRM updates and weekly-review changes are simulated. No live account record, customer message or AI-provider session is changed. The prototype is not evidence of measured ROI or a deployed integration.

The manager reviews eight candidate cases and excludes one unrelated case. The approved result is seven cases across three accounts. Do not call all eight related cases or imply the AI makes the final classification. Marcus’s rehearsal uses no identifying client details; it is not presented as a data leak.

The workflow uses authorized business sources and approved work products. It does not silently read private AI histories. Production implementation would require appropriate identity, permission controls, connectors, source linking, human review, reliable workflow execution and recovery behavior.

Research figures frame the broader problem. Miro’s 83% and 69% findings and Atlassian’s 85% and 29% findings come from separate, vendor-sponsored, self-reported surveys. They do not measure Northstar or prove Nine-67’s results. Source links are included on the research screen and in the presenter guide.

## Webinar configuration

Edit the event settings in `dist/site.js`, including the booking URL, label and presenter information. The CTA should identify the AI Workflow Discovery Session. Josh hosts and operates the demo; Suuchi supports the opening roleplay, explains Nine-67’s method and answers questions.

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
