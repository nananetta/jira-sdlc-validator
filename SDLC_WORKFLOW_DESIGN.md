# SDLC Workflow Design

This document summarizes the current website design so it can be reviewed and adjusted before further implementation changes.

## Purpose

The site visualizes a typical software delivery lifecycle from request intake through post-release closure. It is designed to show:

- Workflow phases and their current delivery status.
- Possible status transitions across the SDLC.
- An interactive workflow that starts from `Open` and moves through valid next statuses.
- Documents and evidence expected for each phase or status.
- Entry and exit criteria for workflow gates.

## Main Files

- `public/index.html`: page structure and section layout.
- `public/app.js`: SDLC data model, status transitions, workflow interaction behavior, and rendering logic.
- `public/styles.css`: visual layout, responsive behavior, diagram styling, and interaction behavior.
- `server.js`: simple local HTTP server.

## Page Structure

The page currently has four main areas:

1. **Overview**
   - Summarizes the SDLC board purpose.
   - Shows headline metrics: phases, core documents, approval gates.
   - Breaks core phase documents into mandatory and optional counts.

2. **Workflow Detail / Documents Needed / Available Transitions**
   - Sits below the overview.
   - Shows the selected phase details.
   - Shows entry conditions, exit gate, and required documents.
   - Shows valid outgoing transitions for the current status beside Documents Needed.

3. **Workflow**
   - Shows phase cards.
   - Contains the status diagram.
   - Contains the transition catalog.
   - Contains the `Reset` button in the Workflow header.

4. **Document Matrix**
   - Separates mandatory and optional documents for every phase.
   - Summarizes approval or evidence expectations for every phase.

## SDLC Phases

| Phase | Owner | Status | Status Movement |
|---|---|---|---|
| Intake & Triage | Product Owner | Open | Open -> Requirement Analysis |
| Requirements | Business Analyst | Requirement Analysis | Requirement Analysis -> Solution Design |
| Solution Design | Solution Architect | Solution Design | Solution Design -> In Development |
| Build | Engineering Lead | In Development | In Development -> In Test |
| Testing & Validation | QA Lead | In Test | In Test -> UAT |
| UAT | Business Owner | UAT | UAT -> Release Approval |
| Release Approval | Release Manager | Release Approval | Release Approval -> Ready for Deployment |
| Deployment | DevOps Lead | Ready for Deployment | Ready for Deployment -> Production Verified |
| Operate & Close | Service Owner | Closed | Production Verified -> Closed / Lessons Logged |

## Workflow Statuses

The status diagram uses these workflow statuses:

- `Open`
- `Requirement Analysis`
- `Solution Design`
- `In Development`
- `In Test`
- `UAT`
- `Release Approval`
- `Ready for Deployment`
- `Production Verified`
- `Closed / Lessons Logged`
- `Closed / Rejected`

## Transition Types

The status diagram includes several transition categories:

| Type | Meaning |
|---|---|
| Normal | Standard forward movement through the SDLC. |
| Rework | Sends the item back to an earlier status for clarification, redesign, or defect fixing. |
| Rollback | Sends the item back after production/release issues. |
| Closure | Closes the request without delivery. |
| Follow-up | Creates a new backlog item after closure. |

## Current Status Transitions

| From | To | Type | Label | Approver |
|---|---|---|---|---|
| Open | Requirement Analysis | Normal | Request created | Product Owner |
| Requirement Analysis | Solution Design | Normal | Requirements approved | Product Owner |
| Solution Design | In Development | Normal | Design approved | Solution Architect |
| In Development | In Test | Normal | Build complete | Engineering Lead |
| In Test | UAT | Normal | QA pass | QA Lead |
| UAT | Release Approval | Normal | UAT pass | Business Owner |
| Release Approval | Ready for Deployment | Normal | CAB approves | Release Manager |
| Ready for Deployment | Production Verified | Normal | Deploy verified | DevOps Lead |
| Production Verified | Closed / Lessons Logged | Normal | Close release | Service Owner |
| Open | Closed / Rejected | Closure | Reject or duplicate | Product Owner |
| Requirement Analysis | Open | Rework | Need more intake info | Business Analyst |
| Solution Design | Requirement Analysis | Rework | Scope change | Solution Architect |
| In Development | Solution Design | Rework | Design changes requirement | Engineering Lead |
| In Test | In Development | Rework | Technical redesign | QA Lead |
| UAT | In Test | Rework | Defect found | Business Owner |
| Release Approval | In Test | Rework | Defect found | Release Manager |
| Ready for Deployment | Release Approval | Rework | More validation requested | Release Manager |
| Production Verified | Ready for Deployment | Rollback | Rollback and redeploy | DevOps Lead |
| Production Verified | In Test | Rollback | Production hotfix | Service Owner |
| Closed / Lessons Logged | Requirement Analysis | Follow-up | Follow-up improvement | Product Owner |

Each transition also has gate and evidence text in `transitionDetails` in `public/app.js`. Available transition buttons show approver and gate criteria. The transition catalog shows approver and evidence.

## Workflow Interaction Behavior

The workflow starts at `Open`.

For the current status, it shows:

- Selected phase details.
- Current status in the phase detail status pill.
- Documents/evidence needed for the current status.
- Clickable document cards that open a sample document index popup.
- Buttons for only the valid outgoing transitions beside Documents Needed.
- Current status position in the workflow diagram.

When a transition button is clicked:

1. The current status changes to the transition target.
2. The selected workflow phase aligns to the new status.
3. The detail text and documents refresh.
4. The transition buttons refresh to show valid moves from the new status.
5. The diagram highlights:
   - Current status node.
   - Available outgoing transition lines.
   - Last transition taken.

When a workflow phase card is clicked:

1. The selected phase changes.
2. The current status changes to the phase's mapped status.
3. The available transitions, documents, detail panel, and diagram update from the same selected status.

When a status node in the workflow diagram is clicked:

1. The current status changes to the clicked node.
2. The selected workflow phase aligns to that status where a phase mapping exists.
3. The available transitions, documents, detail panel, and URL update from the selected status.

The selected status is persisted in the URL as `?status=<status-id>`, so a reviewer can share a direct link to a workflow state.

When hovering or focusing a transition button:

- The matching transition line in the status diagram gets a stronger highlight.

The `Reset` button in the Workflow header returns the workflow to `Open`.

When a document card is clicked:

1. A popup opens with the document name, type, and mandatory/optional classification.
2. The popup shows owner, reviewer, done criteria, and evidence summary.
3. The popup lists a sample document index based on the document type or document-specific override.
4. The popup can be closed with the close button, backdrop click, or `Escape`.

## Diagram Styling

The workflow diagram is rendered as SVG in `renderStatusDiagram()` and styled in `public/styles.css`.

Current diagram behavior:

- Only the selected/current status node uses color.
- All non-selected status nodes are grey, including reachable next statuses.
- Available, last-taken, and hovered transition lines are emphasized by line opacity and stroke width.
- Transition line colors still indicate transition type:
  - Normal: blue.
  - Rework: amber dashed.
  - Rollback: red dashed.
  - Closure: grey.
  - Follow-up: teal dashed.

Current diagram sizing:

| Element | Current Value |
|---|---:|
| Status node box | `115.2 x 50.4` |
| Status node corner radius | `7.2` |
| Diagram text | `10.8px` |
| Base transition line | `2.16px` |
| Available transition line | `2.88px` |
| Last transition line | `3.6px` |
| Hovered transition line | `5.04px` |
| Current node stroke | `3.6px` |
| Arrowhead marker | `4.32 x 4.32` |

## Document Model

Documents are attached to phases in `public/app.js`.

Each document has:

- `name`
- `type`
- `required`
- `evidence`

Document owner, reviewer, done criteria, and default sample index are resolved from `documentTypeDefaults`. Individual documents can override those values through `documentOverrides`.

Example:

```js
{ name: "Business request form", type: "Input", required: true, evidence: "Requester, problem statement, expected outcome" }
```

The Documents Needed panel derives documents from the current selected status. `Closed / Rejected` has a custom terminal document set.

Core phase document count:

- Total core documents: `29`.
- Mandatory documents: `23`.
- Optional documents: `6`.
- `Closed / Rejected` terminal documents are separate exception-status documents and are not included in the core phase document metric.

Current phase documents:

| Phase | Documents |
|---|---|
| Intake & Triage | Business request form; Initial impact assessment; Backlog ticket |
| Requirements | Business requirements document; User stories and acceptance criteria; Requirement traceability matrix |
| Solution Design | Solution design document; API or integration contract (optional); Implementation plan (optional) |
| Build | Technical task breakdown; Pull request review record; Unit test result; Security scan results; Build artifact manifest |
| Testing & Validation | Test plan; Test cases and execution result; Defect log |
| UAT | UAT test scenarios; UAT execution result; UAT signoff |
| Release Approval | Release notes; Change request; Deployment runbook; Rollback plan |
| Deployment | Deployment checklist (optional); Production smoke test result |
| Operate & Close | Support handover note (optional); Post-implementation review (optional); Evidence archive index (optional) |

## Visual Layout

Current desktop layout:

- Overview is full width.
- Workflow Detail, Documents Needed, and Available Transitions sit below overview.
- Workflow is full width below the detail row.
- In the detail row:
  - Phase detail is on the left.
  - Documents Needed is in the middle.
  - Available Transitions is on the right.
- The Workflow header contains the status legend and `Reset` button.
- Document Matrix is full width below.

Current mobile layout:

- All major sections stack vertically.
- The status diagram scrolls horizontally inside its own panel.
- The document matrix scrolls horizontally inside its own panel.

## Adjustment Notes

Common future changes can be made in these places:

- Add/remove phases: edit the `phases` array in `public/app.js`.
- Add/remove statuses: edit `workflowStatuses` in `public/app.js`.
- Add/remove transitions: edit `statusTransitions` in `public/app.js`.
- Change transition approver/gate/evidence: edit `transitionDetails` in `public/app.js`.
- Change documents: edit each phase `documents` array in `public/app.js`.
- Change document owner/reviewer/done/index defaults: edit `documentTypeDefaults` in `public/app.js`.
- Change document-specific metadata or index: edit `documentOverrides` in `public/app.js`.
- Change rejected-status documents: edit `terminalStatusDetails` in `public/app.js`.
- Change section layout: edit `public/index.html` and related classes in `public/styles.css`.
- Change diagram position: update `x` and `y` values in `workflowStatuses`.
- Change arrow size: update SVG marker definitions in `renderStatusDiagram()`.

## Open Review Questions

- Are the phase names correct for the target organization?
- Should `Closed / Rejected` be part of the main workflow or treated as an exception only?
- Should UAT and QA be separate statuses?
- Should CAB approval be mandatory for all releases or only high-risk changes?
- Should rollback return to `Ready for Deployment`, `In Test`, or both?
- Are all required documents realistic for lightweight changes?
- Should documents differ by change type, risk level, or system impact?
