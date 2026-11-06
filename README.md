# Nine-67 webinar source

The website for **Your team has AI. Why is the work still manual?**

The current demonstration follows **nine people at fictional Parkside**. Everyone has a company Copilot license, but their actual AI use and results differ. A clickable company map reveals local successes, skills gaps and manual handoffs. A connected version illustrates how approved business outputs could move between people and systems after company-wide discovery and prioritization.

The editable application source is in `dist/`. This is a static HTML, CSS and JavaScript application with no third-party npm dependencies, database or backend service.

## Run locally

Use Node.js 20 or newer:

```sh
npm run dev
```

Open:

- `http://localhost:3000/` for the webinar cover.
- `http://localhost:3000/stats.html` for the standalone research introduction.
- `http://localhost:3000/live.html` for the current nine-scene demo.
- `http://localhost:3000/host-guide.html` for Josh and Suuchi’s flexible twelve-minute walkthrough.

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

1. **Dana’s confident CEO view.** Dana sees company Copilot adoption, Ben’s successful demo and an internal assistant. She uses Claude to critique an approved board deck. Dana is Parkside’s fictional CEO, not a presenter role label in the interface.
2. **The research.** Show Miro’s 83% and 69% findings and Atlassian’s 85% versus 29% immediately after the opening. This screen explains the general pattern without introducing employee examples.
3. **Meet Parkside.** A large employee-card graph introduces nine people. Card positions remain fixed between today’s view and the proposed improvements. Click a person to inspect the workspace. Show one improvement at a time, without a central AI hub.
4. **Local successes.** Explore Ben’s forecast coaching, Priya’s Refresh workflow and Nina’s team-built case workflow. Each works locally; discovery identifies what could be reused or connected.
5. **Different needs.** Ava uses AI for tone but still gathers context manually. Elena needs help with a real tracker task. Marcus needs clear guidance around his anonymized personal roleplay. Equal access does not call for identical support.
6. **Friday’s summary.** Leah reconciles the updates manually before Copilot tightens the deck. Then show the summary Dana receives. The two-hour reconciliation is a fictional scenario detail, not a measured saving.
7. **What Nine-67 discovers.** Three findings: a reusable method, different needs behind the same access, and local information that does not travel to the next owner.
8. **What Nine-67 could build.** Three focused examples: make Priya’s method reusable by another branch; guide Elena through the actual tracker task; publish Nina’s reviewed finding to Marcus and Leah with ownership and context. The service example’s main path is inspect and confirm, assign and publish, then show the three recipient views together. Full source-case review is optional.
9. **The engagement.** Company-wide assessment, prioritized build and focused pilot. Discover, Prioritize, Build, Measure. Invite operations, IT and two interdependent department leaders, each with one useful AI example and one piece of work they still chase.

## Nine people, different uses

Every featured person has a company Copilot license. Their featured task may use Copilot, another approved tool, a local workflow or a personal technique.

| Person | Department | What the walkthrough reveals |
| --- | --- | --- |
| Dana | CEO | Claude critiques the approved board deck; license adoption and a Sales demo shape her view of progress |
| Daniel | IT | AskParkside in Teams retrieves a license request form and approver; usage does not show business value |
| Ben | Sales | Copilot in Excel compares four weekly HubSpot snapshots; Ben checks repeated slips and absent buyer activity, then coaches three reps |
| Priya | Finance | Approved Claude and synthetic rows helped her write Power Query; Refresh normalizes three branch files and flags duplicates and unmatched items for human review |
| Nina | Operations | A local Teams, Power Automate and SharePoint-list workflow groups reopened cases for six users’ morning huddle; IT has not seen it |
| Marcus | Account Management | Personal Grok on mobile supports generic objection roleplay without names or client details; unclear policy keeps the useful technique private |
| Ava | Customer Service | Copilot helps with tone twenty times a day; Ava still opens six tickets to find the facts |
| Elena | Project Coordination | A generic Copilot prompt disappointed her; she still copies Thursday’s tracker and needs coaching on the real task |
| Leah | Chief of Staff | Manual Friday reconciliation precedes Copilot’s deck editing; Dana then uses the deck in Claude |

Priya’s method is a repeatable preparation step with human exception review, not autonomous financial judgment. Marcus’s roleplay is not presented as a data leak. Nina’s local tool is a useful discovery candidate, not automatically a system to replace. Elena may need coaching before a build.

## What the maps mean

The fragmented map shows fictional local practices and manual handoffs. The connected map shows a **simulated proposed design** for carrying approved business outputs and decisions to authorized people and systems. It does not collect private AI chat histories or represent a live deployment.

A line on the connected map is an opportunity to validate, not proof that an integration exists or should be built. Review source access, ownership, feasibility, permissions and the intended business outcome. Company-wide discovery produces the map and priorities; the first implementation remains focused.

## Where to edit

| File | Purpose |
| --- | --- |
| `dist/site.js` | Shared event and presenter configuration |
| `dist/live.html` | Current nine-scene application shell |
| `dist/company-model.mjs` | Fictional company data, pilot decisions and workflow state |
| `dist/company-view.mjs` | Nine scenes, employee workspaces, fragmented and connected company maps, and pilot artifacts |
| `dist/company-demo.mjs` | Interactive controls and navigation |
| `dist/company.css` | Current demo styling |
| `tests/company*.mjs` | Current company-demo behavioral and rendering checks |
| `dist/stats.html` | Standalone research introduction with source links |
| `dist/host-guide.html` | Josh’s host script and Suuchi’s discovery and build discussion |
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

Parkside, its people, workspaces, service cases and account records are fictional. Dana is the fictional CEO shown in the story. Josh hosts and operates the demo; Suuchi explains Nine-67’s discovery and build approach. The exchanges and connected graph are illustrative, not accounts of an actual client assessment or live integration.

AI responses, saved outputs, approvals, assignments, CRM updates and weekly-review changes are simulated. No live account record, customer message or AI-provider session is changed. The prototype is not evidence of measured ROI or a deployed integration.

In the optional source detail, the manager reviews eight candidate cases and excludes one unrelated case. The approved result is seven cases across three accounts. Do not call all eight related cases or imply the AI makes the final classification. Marcus’s rehearsal uses no identifying client details; it is not presented as a data leak.

The workflow uses authorized business sources and approved work products. It does not silently read private AI histories. Production implementation would require appropriate identity, permission controls, connectors, source linking, human review, reliable workflow execution and recovery behavior.

Research figures frame the broader problem. Miro’s 83% and 69% findings and Atlassian’s 85% and 29% findings come from separate, vendor-sponsored, self-reported surveys. They do not measure Parkside or prove Nine-67’s results. Source links are included on the research screen and in the presenter guide.

## Webinar configuration

Edit the event settings in `dist/site.js`, including the booking URL, label and presenter information. The CTA should identify the AI Workflow Discovery Session. Josh hosts and operates the demo; Suuchi explains Nine-67’s method and answers questions.

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
