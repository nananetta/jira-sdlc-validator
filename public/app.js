const phases = [
  {
    id: "intake",
    name: "Intake & Triage",
    owner: "Product Owner",
    status: "Open",
    from: "Open",
    to: "Requirement Analysis",
    purpose: "Capture the business request, screen for value, and decide whether it belongs in the delivery backlog.",
    entry: ["Business need or defect is logged", "Requester and impacted system are identified", "Initial priority is proposed"],
    exit: ["Scope is accepted for analysis", "Duplicate and out-of-scope requests are closed", "Backlog item has a named owner"],
    documents: [
      { name: "Business request form", type: "Input", required: true, evidence: "Requester, problem statement, expected outcome" },
      { name: "Initial impact assessment", type: "Analysis", required: true, evidence: "Affected users, systems, risk level" },
      { name: "Backlog ticket", type: "Control", required: true, evidence: "Jira issue with priority and owner" }
    ]
  },
  {
    id: "requirements",
    name: "Requirements",
    owner: "Business Analyst",
    status: "Requirement Analysis",
    from: "Requirement Analysis",
    to: "Solution Design",
    purpose: "Turn the request into clear functional, non-functional, compliance, and acceptance requirements.",
    entry: ["Backlog item is approved for analysis", "Stakeholders are available", "Known constraints are captured"],
    exit: ["Requirements are reviewed", "Acceptance criteria are testable", "Traceability links are created"],
    documents: [
      { name: "Business requirements document", type: "Specification", required: true, evidence: "Functional scope and business rules" },
      { name: "User stories and acceptance criteria", type: "Specification", required: true, evidence: "Ready stories linked to parent request" },
      { name: "Requirement traceability matrix", type: "Control", required: true, evidence: "Requirement to design, test, and release links" }
    ]
  },
  {
    id: "design",
    name: "Solution Design",
    owner: "Solution Architect",
    status: "Solution Design",
    from: "Solution Design",
    to: "In Development",
    purpose: "Define the target architecture, interfaces, data changes, controls, and operational behavior.",
    entry: ["Approved requirements exist", "Architecture constraints are known", "Dependent systems are identified"],
    exit: ["Design is approved by technical reviewers", "Interface and data impacts are understood", "Implementation tasks are estimated"],
    documents: [
      { name: "Solution design document", type: "Design", required: true, evidence: "Architecture, components, interfaces, data flow" },
      { name: "API or integration contract", type: "Design", required: false, evidence: "Schema, payload, versioning, error handling" },
      { name: "Implementation plan", type: "Planning", required: false, evidence: "Tasks, dependencies, estimates, environments" }
    ]
  },
  {
    id: "build",
    name: "Build",
    owner: "Engineering Lead",
    status: "In Development",
    from: "In Development",
    to: "In Test",
    purpose: "Implement the approved solution with peer review, automated checks, and controlled source changes.",
    entry: ["Design is approved", "Stories are sprint-ready", "Development environment is available"],
    exit: ["Code is merged through review", "Unit checks pass", "Build artifact is versioned"],
    documents: [
      { name: "Technical task breakdown", type: "Planning", required: true, evidence: "Linked tasks with estimates and assignees" },
      { name: "Pull request review record", type: "Evidence", required: true, evidence: "Reviewer approval and resolved comments" },
      { name: "Unit test result", type: "Evidence", required: true, evidence: "Automated test run linked to commit" },
      { name: "Security scan results", type: "Evidence", required: true, evidence: "SAST, dependency, or container scan result linked to commit or build" },
      { name: "Build artifact manifest", type: "Release", required: true, evidence: "Version, commit SHA, package checksum" }
    ]
  },
  {
    id: "test",
    name: "Testing & Validation",
    owner: "QA Lead",
    status: "In Test",
    from: "In Test",
    to: "UAT",
    purpose: "Prove the change meets acceptance criteria and does not break critical system behavior.",
    entry: ["Build is deployed to test environment", "Test data is prepared", "Traceability matrix is current"],
    exit: ["Critical tests pass", "Defects are accepted or closed", "Business signs off UAT"],
    documents: [
      { name: "Test plan", type: "Test", required: true, evidence: "Scope, approach, entry and exit criteria" },
      { name: "Test cases and execution result", type: "Evidence", required: true, evidence: "Passed, failed, blocked, retested records" },
      { name: "Defect log", type: "Evidence", required: true, evidence: "Severity, disposition, retest proof" }
    ]
  },
  {
    id: "uat",
    name: "UAT",
    owner: "Business Owner",
    status: "UAT",
    from: "UAT",
    to: "Release Approval",
    purpose: "Validate the change with business users and confirm it is acceptable for release approval.",
    entry: ["QA testing is complete", "Business users and test data are ready", "Open defects have disposition"],
    exit: ["Business signs off UAT", "Release scope is confirmed", "Residual risks are accepted"],
    documents: [
      { name: "UAT test scenarios", type: "Test", required: true, evidence: "Business scenarios mapped to acceptance criteria" },
      { name: "UAT execution result", type: "Evidence", required: true, evidence: "Passed, failed, blocked, and retested records" },
      { name: "UAT signoff", type: "Approval", required: true, evidence: "Business approval with release scope" }
    ]
  },
  {
    id: "release",
    name: "Release Approval",
    owner: "Release Manager",
    status: "Release Approval",
    from: "Release Approval",
    to: "Ready for Deployment",
    purpose: "Confirm operational readiness, deployment risk, rollback approach, and stakeholder approval.",
    entry: ["UAT signoff is complete", "Release scope is frozen", "Open risks have owners"],
    exit: ["CAB or change approval is granted", "Rollback plan is verified", "Communications are scheduled"],
    documents: [
      { name: "Release notes", type: "Release", required: true, evidence: "Scope, impact, known limitations" },
      { name: "Change request", type: "Approval", required: true, evidence: "CAB approval, window, risk rating" },
      { name: "Deployment runbook", type: "Operations", required: true, evidence: "Step order, owners, timing, validation" },
      { name: "Rollback plan", type: "Operations", required: true, evidence: "Decision point and restoration steps" }
    ]
  },
  {
    id: "deploy",
    name: "Deployment",
    owner: "DevOps Lead",
    status: "Ready for Deployment",
    from: "Ready for Deployment",
    to: "Production Verified",
    purpose: "Move the approved artifact into production and verify that the release behaves as expected.",
    entry: ["Deployment window is active", "Runbook and rollback owners are present", "Artifact is approved"],
    exit: ["Smoke checks pass", "Deployment outcome is confirmed", "Release record is updated"],
    documents: [
      { name: "Deployment checklist", type: "Operations", required: false, evidence: "Pre, during, and post deployment checks" },
      { name: "Production smoke test result", type: "Evidence", required: true, evidence: "Critical path validation after deploy" }
    ]
  },
  {
    id: "operate",
    name: "Operate & Close",
    owner: "Service Owner",
    status: "Closed",
    from: "Production Verified",
    to: "Closed / Lessons Logged",
    purpose: "Confirm business outcome, close evidence gaps, and feed operational learning back into the backlog.",
    entry: ["Production verification is complete", "Support handover needs are known", "Release artifacts are archived when required"],
    exit: ["Ticket is closed", "Optional review notes are captured when useful", "Follow-up actions are tracked"],
    documents: [
      { name: "Support handover note", type: "Operations", required: false, evidence: "Known issues, dashboards, escalation path" },
      { name: "Post-implementation review", type: "Review", required: false, evidence: "Outcome, incidents, lessons, actions" },
      { name: "Evidence archive index", type: "Control", required: false, evidence: "Final document list and storage location" }
    ]
  }
];

const statusStyles = {
  Open: "open",
  "Requirement Analysis": "analysis",
  "Solution Design": "review",
  "In Development": "development",
  "In Test": "test",
  UAT: "uat",
  "Release Approval": "approval",
  "Ready for Deployment": "deploy",
  Closed: "closed"
};

const workflowStatuses = [
  { id: "open", label: "Open", x: 36, y: 62, kind: "start" },
  { id: "requirement-analysis", label: "Requirement Analysis", x: 250, y: 62, kind: "active" },
  { id: "solution-design", label: "Solution Design", x: 464, y: 62, kind: "approval" },
  { id: "in-development", label: "In Development", x: 678, y: 62, kind: "active" },
  { id: "in-test", label: "In Test", x: 892, y: 62, kind: "active" },
  { id: "uat", label: "UAT", x: 160, y: 296, kind: "approval" },
  { id: "release-approval", label: "Release Approval", x: 374, y: 296, kind: "approval" },
  { id: "ready-for-deployment", label: "Ready for Deployment", x: 588, y: 296, kind: "approval" },
  { id: "production-verified", label: "Production Verified", x: 802, y: 296, kind: "active" },
  { id: "closed-lessons", label: "Closed / Lessons Logged", x: 1016, y: 296, kind: "closed" },
  { id: "closed-rejected", label: "Closed / Rejected", x: 1016, y: 452, kind: "closed" }
];

const statusTransitions = [
  { from: "open", to: "requirement-analysis", label: "Request created", type: "normal" },
  { from: "requirement-analysis", to: "solution-design", label: "Requirements approved", type: "normal" },
  { from: "solution-design", to: "in-development", label: "Design approved", type: "normal" },
  { from: "in-development", to: "in-test", label: "Build complete", type: "normal" },
  { from: "in-test", to: "uat", label: "QA pass", type: "normal" },
  { from: "uat", to: "release-approval", label: "UAT pass", type: "normal" },
  { from: "release-approval", to: "ready-for-deployment", label: "CAB approves", type: "normal" },
  { from: "ready-for-deployment", to: "production-verified", label: "Deploy verified", type: "normal" },
  { from: "production-verified", to: "closed-lessons", label: "Close release", type: "normal" },
  { from: "open", to: "closed-rejected", label: "Reject or duplicate", type: "closure" },
  { from: "requirement-analysis", to: "open", label: "Need more intake info", type: "rework" },
  { from: "solution-design", to: "requirement-analysis", label: "Scope change", type: "rework" },
  { from: "in-development", to: "solution-design", label: "Design changes requirement", type: "rework" },
  { from: "in-test", to: "in-development", label: "Technical redesign", type: "rework" },
  { from: "uat", to: "in-test", label: "Defect found", type: "rework" },
  { from: "release-approval", to: "in-test", label: "Defect found", type: "rework" },
  { from: "ready-for-deployment", to: "release-approval", label: "More validation requested", type: "rework" },
  { from: "production-verified", to: "ready-for-deployment", label: "Rollback and redeploy", type: "rollback" },
  { from: "production-verified", to: "in-test", label: "Production hotfix", type: "rollback" },
  { from: "closed-lessons", to: "requirement-analysis", label: "Follow-up improvement", type: "follow-up" }
];

const transitionDetails = {
  "open-requirement-analysis-normal": {
    approver: "Product Owner",
    gate: "Request is accepted for analysis and has a named owner.",
    evidence: "Backlog ticket and initial impact assessment"
  },
  "requirement-analysis-solution-design-normal": {
    approver: "Product Owner",
    gate: "Requirements and acceptance criteria are clear enough for solution design.",
    evidence: "Requirements package and traceability matrix"
  },
  "solution-design-in-development-normal": {
    approver: "Solution Architect",
    gate: "Design is reviewed and implementation constraints are understood.",
    evidence: "Solution design and optional implementation plan"
  },
  "in-development-in-test-normal": {
    approver: "Engineering Lead",
    gate: "Build is complete, reviewed, and ready for controlled testing.",
    evidence: "Pull request review, unit test result, and build manifest"
  },
  "in-test-uat-normal": {
    approver: "QA Lead",
    gate: "QA execution has no unresolved blocking defects.",
    evidence: "Test execution result and defect log"
  },
  "uat-release-approval-normal": {
    approver: "Business Owner",
    gate: "Business users accept the change for release approval.",
    evidence: "UAT result and UAT signoff"
  },
  "release-approval-ready-for-deployment-normal": {
    approver: "Release Manager",
    gate: "Release scope, rollback, and deployment plan are approved.",
    evidence: "Change request, deployment runbook, rollback plan"
  },
  "ready-for-deployment-production-verified-normal": {
    approver: "DevOps Lead",
    gate: "Deployment is completed and production smoke checks pass.",
    evidence: "Production smoke test result"
  },
  "production-verified-closed-lessons-normal": {
    approver: "Service Owner",
    gate: "Production outcome is accepted and closure notes are complete.",
    evidence: "Optional support handover, post-implementation review, or archive index"
  },
  "open-closed-rejected-closure": {
    approver: "Product Owner",
    gate: "Request is duplicate, out of scope, rejected, or no longer needed.",
    evidence: "Rejection rationale and stakeholder notification"
  },
  "requirement-analysis-open-rework": {
    approver: "Business Analyst",
    gate: "Intake information is incomplete or conflicting.",
    evidence: "Clarification request on backlog ticket"
  },
  "solution-design-requirement-analysis-rework": {
    approver: "Solution Architect",
    gate: "Scope or requirement changes require analysis refresh.",
    evidence: "Updated requirement notes"
  },
  "in-development-solution-design-rework": {
    approver: "Engineering Lead",
    gate: "Implementation exposes design gaps or new constraints.",
    evidence: "Design change notes"
  },
  "in-test-in-development-rework": {
    approver: "QA Lead",
    gate: "Testing finds a defect requiring code changes.",
    evidence: "Defect log with failed test evidence"
  },
  "uat-in-test-rework": {
    approver: "Business Owner",
    gate: "UAT identifies a defect or unmet acceptance criterion.",
    evidence: "UAT defect and retest scope"
  },
  "release-approval-in-test-rework": {
    approver: "Release Manager",
    gate: "Release approval finds unresolved quality risk.",
    evidence: "Approval feedback and retest evidence request"
  },
  "ready-for-deployment-release-approval-rework": {
    approver: "Release Manager",
    gate: "Deployment readiness needs additional validation or approval.",
    evidence: "Updated change request or runbook note"
  },
  "production-verified-ready-for-deployment-rollback": {
    approver: "DevOps Lead",
    gate: "Rollback or redeploy is needed from verified production state.",
    evidence: "Rollback decision and deployment checklist"
  },
  "production-verified-in-test-rollback": {
    approver: "Service Owner",
    gate: "Production issue requires hotfix validation in test.",
    evidence: "Incident or production defect record"
  },
  "closed-lessons-requirement-analysis-follow-up": {
    approver: "Product Owner",
    gate: "Post-release learning creates a follow-up improvement.",
    evidence: "Follow-up action linked from closure notes"
  }
};

const terminalStatusDetails = {
  "closed-rejected": {
    owner: "Product Owner",
    purpose: "The request is closed because it is rejected, duplicated, out of scope, or no longer needed.",
    documents: [
      { name: "Rejection rationale", type: "Control", required: true, evidence: "Reason for closure and approver" },
      { name: "Duplicate or reference ticket", type: "Control", required: false, evidence: "Linked source item when applicable" },
      { name: "Stakeholder notification", type: "Evidence", required: true, evidence: "Requester informed of closure outcome" }
    ]
  }
};

const terminalStatusPhaseMap = {
  "closed-rejected": "intake"
};

const documentTypeDefaults = {
  Approval: {
    owner: "Business Owner",
    reviewer: "Release Manager",
    done: "Approval is dated, scoped, and linked to the release record.",
    index: ["Approval context", "Decision log", "Approver signoff"]
  },
  Analysis: {
    owner: "Product Owner",
    reviewer: "Business Analyst",
    done: "Impact, affected users, systems, and recommendation are documented.",
    index: ["Business context", "Impact summary", "Recommendation"]
  },
  Control: {
    owner: "Product Owner",
    reviewer: "Delivery Lead",
    done: "Control objective, evidence, and review outcome are recorded.",
    index: ["Control objective", "Required evidence", "Review outcome"]
  },
  Design: {
    owner: "Solution Architect",
    reviewer: "Engineering Lead",
    done: "Design choices, interface impact, and implementation constraints are reviewable.",
    index: ["Architecture overview", "Interfaces and data", "Design decisions"]
  },
  Evidence: {
    owner: "QA Lead",
    reviewer: "Release Manager",
    done: "Result evidence is linked to the relevant build, environment, or test run.",
    index: ["Execution summary", "Observed result", "Evidence attachment log"]
  },
  Input: {
    owner: "Requester",
    reviewer: "Product Owner",
    done: "Requester, problem statement, and expected outcome are clear enough for triage.",
    index: ["Requester details", "Problem statement", "Expected outcome"]
  },
  Operations: {
    owner: "DevOps Lead",
    reviewer: "Service Owner",
    done: "Operational steps, fallback path, and escalation ownership are documented.",
    index: ["Operational scope", "Run steps or handover notes", "Fallback and escalation"]
  },
  Planning: {
    owner: "Engineering Lead",
    reviewer: "Product Owner",
    done: "Work, dependencies, assumptions, and target timing are visible.",
    index: ["Work breakdown", "Dependencies and assumptions", "Owner timeline"]
  },
  Release: {
    owner: "Release Manager",
    reviewer: "Business Owner",
    done: "Release scope, impact, limitations, and communication notes are ready.",
    index: ["Release scope", "Change impact", "Known limitations"]
  },
  Review: {
    owner: "Service Owner",
    reviewer: "Product Owner",
    done: "Outcomes, lessons, and follow-up actions have assigned owners.",
    index: ["Review summary", "Lessons learned", "Follow-up actions"]
  },
  Specification: {
    owner: "Business Analyst",
    reviewer: "Product Owner",
    done: "Requirements are testable, traceable, and approved for design.",
    index: ["Functional scope", "Acceptance criteria", "Traceability links"]
  },
  Test: {
    owner: "QA Lead",
    reviewer: "Business Owner",
    done: "Scenarios, expected results, and pass/fail criteria are documented.",
    index: ["Test objective", "Test scenarios", "Pass/fail criteria"]
  }
};

const documentOverrides = {
  "Backlog ticket": {
    owner: "Product Owner",
    reviewer: "Delivery Lead",
    done: "Ticket has priority, owner, scope statement, and parent/child links.",
    index: ["Ticket summary", "Priority and ownership", "Linked work items", "Decision history"]
  },
  "Requirement traceability matrix": {
    owner: "Business Analyst",
    reviewer: "QA Lead",
    done: "Every requirement maps to design, test evidence, and release scope.",
    index: ["Requirement list", "Design references", "Test coverage", "Release evidence links"]
  },
  "Pull request review record": {
    owner: "Engineering Lead",
    reviewer: "Peer Reviewer",
    done: "Review approval, resolved comments, and tested commit are linked.",
    index: ["Pull request summary", "Reviewers and approvals", "Resolved comments", "Commit and build links"]
  },
  "Production smoke test result": {
    owner: "DevOps Lead",
    reviewer: "Release Manager",
    done: "Critical production checks have a pass/fail result and timestamp.",
    index: ["Smoke scope", "Execution result", "Timestamp and environment", "Issue follow-up"]
  },
  "Security scan results": {
    owner: "Engineering Lead",
    reviewer: "Security Reviewer",
    done: "Scan result is linked to the build and critical/high findings are resolved or accepted.",
    index: ["Scan tool and scope", "Build or commit reference", "Findings summary", "Risk acceptance or remediation"]
  },
  "Rejection rationale": {
    owner: "Product Owner",
    reviewer: "Requester",
    done: "Closure reason and requester notification are recorded.",
    index: ["Closure reason", "Decision owner", "Requester notification", "Reference links"]
  },
  "Stakeholder notification": {
    owner: "Product Owner",
    reviewer: "Requester",
    done: "Requester and impacted stakeholders have been notified of the closure outcome.",
    index: ["Notification audience", "Closure message", "Date sent", "Follow-up contact"]
  }
};

const phaseRailEl = document.getElementById("phaseRail");
const statusLegendEl = document.getElementById("statusLegend");
const statusDiagramEl = document.getElementById("statusDiagram");
const transitionListEl = document.getElementById("transitionList");
const transitionActionsEl = document.getElementById("transitionActions");
const transitionSummaryEl = document.getElementById("transitionSummary");
const resetWorkflowBtn = document.getElementById("resetWorkflow");
const matrixBodyEl = document.getElementById("matrixBody");
const phaseCountEl = document.getElementById("phaseCount");
const documentCountEl = document.getElementById("documentCount");
const documentBreakdownEl = document.getElementById("documentBreakdown");
const gateCountEl = document.getElementById("gateCount");
const phaseKickerEl = document.getElementById("phaseKicker");
const phaseNameEl = document.getElementById("phaseName");
const phasePurposeEl = document.getElementById("phasePurpose");
const phaseStatusEl = document.getElementById("phaseStatus");
const statusFromEl = document.getElementById("statusFrom");
const statusToEl = document.getElementById("statusTo");
const entryListEl = document.getElementById("entryList");
const exitListEl = document.getElementById("exitList");
const documentSummaryEl = document.getElementById("documentSummary");
const documentListEl = document.getElementById("documentList");
const documentModalEl = document.getElementById("documentModal");
const documentModalTitleEl = document.getElementById("documentModalTitle");
const documentModalMetaEl = document.getElementById("documentModalMeta");
const documentModalEvidenceEl = document.getElementById("documentModalEvidence");
const documentIndexListEl = document.getElementById("documentIndexList");
const documentModalCloseBtn = document.getElementById("documentModalClose");

let selectedPhaseId = phases[0].id;
let currentStatusId = "open";
let lastTransitionKey = "";
let hoveredTransitionKey = "";

const initialStatusId = new URLSearchParams(window.location.search).get("status");
if (findWorkflowStatus(initialStatusId)) {
  currentStatusId = initialStatusId;
  const initialStatus = findWorkflowStatus(currentStatusId);
  const initialPhase = phaseForStatus(initialStatus);

  if (initialPhase) {
    selectedPhaseId = initialPhase.id;
  }
}

function createList(items) {
  return items.map(item => `<li>${item}</li>`).join("");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function statusClass(status) {
  return statusStyles[status] || "default";
}

function findWorkflowStatus(id) {
  return workflowStatuses.find(status => status.id === id);
}

function findWorkflowStatusByLabel(label) {
  return workflowStatuses.find(status => status.label === label);
}

function statusForPhase(phase) {
  return findWorkflowStatusByLabel(phase.status) || findWorkflowStatusByLabel(phase.to) || findWorkflowStatusByLabel(phase.from);
}

function phaseForStatus(status) {
  return (
    phases.find(phase => phase.status === status.label) ||
    phases.find(phase => phase.from === status.label) ||
    phases.find(phase => phase.to === status.label) ||
    phases.find(phase => phase.id === terminalStatusPhaseMap[status.id])
  );
}

function selectStatus(statusId, lastTransition = "") {
  const status = findWorkflowStatus(statusId);
  const phase = status ? phaseForStatus(status) : null;

  if (!status) {
    return;
  }

  currentStatusId = status.id;
  if (phase) {
    selectedPhaseId = phase.id;
  }

  lastTransitionKey = lastTransition;
  hoveredTransitionKey = "";
  updateStatusUrl();
}

function selectPhase(phaseId) {
  const phase = phases.find(item => item.id === phaseId);
  const status = phase ? statusForPhase(phase) : null;

  if (!phase) {
    return;
  }

  selectedPhaseId = phase.id;
  if (status) {
    selectStatus(status.id);
  }
}

function transitionKey(transition) {
  return `${transition.from}-${transition.to}-${transition.type}`;
}

function transitionProfile(transition) {
  return transitionDetails[transitionKey(transition)] || {
    approver: "Phase Owner",
    gate: "Transition criteria are met and recorded.",
    evidence: "Workflow ticket update"
  };
}

function updateStatusUrl() {
  const nextUrl = new URL(window.location.href);

  nextUrl.searchParams.set("status", currentStatusId);
  window.history.replaceState({}, "", nextUrl);
}

function outgoingTransitions(statusId) {
  return statusTransitions.filter(transition => transition.from === statusId);
}

function detailForStatus(statusId) {
  if (terminalStatusDetails[statusId]) {
    return terminalStatusDetails[statusId];
  }

  const status = findWorkflowStatus(statusId);
  const outboundPhase = phases.find(phase => phase.from === status.label);
  const inboundPhase = phases.find(phase => phase.to === status.label);
  const phase = outboundPhase || inboundPhase || phases[0];

  return {
    owner: phase.owner,
    purpose: outboundPhase
      ? `Ready for ${phase.name}. ${phase.purpose}`
      : `Terminal status reached from ${phase.name}. ${phase.exit[phase.exit.length - 1]}.`,
    documents: phase.documents
  };
}

function documentProfile(document) {
  const defaults = documentTypeDefaults[document.type] || {
    owner: "Delivery Owner",
    reviewer: "Phase Owner",
    done: "Document is complete, reviewed, and linked to the workflow item.",
    index: ["Document objective", "Required content", "Review notes"]
  };
  const override = documentOverrides[document.name] || {};

  return {
    ...defaults,
    ...override,
    index: override.index || document.index || defaults.index
  };
}

function sampleDocumentIndex(document) {
  const profile = documentProfile(document);

  return [
    "Document purpose and scope",
    ...profile.index,
    "Owners, reviewers, and approval history",
    "Version history and storage location"
  ];
}

function openDocumentModal(document) {
  const profile = documentProfile(document);

  documentModalTitleEl.textContent = document.name;
  documentModalMetaEl.textContent = `${document.type} · ${document.required ? "Mandatory" : "Optional"}`;
  documentModalEvidenceEl.innerHTML = `
    <span><strong>Owner:</strong> ${escapeHtml(profile.owner)}</span>
    <span><strong>Reviewer:</strong> ${escapeHtml(profile.reviewer)}</span>
    <span><strong>Done criteria:</strong> ${escapeHtml(profile.done)}</span>
    <span><strong>Evidence:</strong> ${escapeHtml(document.evidence)}</span>
  `;
  documentIndexListEl.innerHTML = sampleDocumentIndex(document)
    .map(section => `<li>${escapeHtml(section)}</li>`)
    .join("");
  documentModalEl.hidden = false;
  documentModalCloseBtn.focus();
}

function closeDocumentModal() {
  documentModalEl.hidden = true;
}

function splitLabel(label) {
  const words = label.split(" ");
  const lines = [];
  let current = "";

  words.forEach(word => {
    const next = current ? `${current} ${word}` : word;
    if (next.length > 18 && current) {
      lines.push(current);
      current = word;
      return;
    }

    current = next;
  });

  if (current) {
    lines.push(current);
  }

  return lines;
}

function renderMetrics() {
  const phaseDocuments = phases.flatMap(phase => phase.documents);
  const requiredDocuments = phaseDocuments.filter(document => document.required).length;
  const optionalDocuments = phaseDocuments.length - requiredDocuments;

  phaseCountEl.textContent = phases.length;
  documentCountEl.textContent = phaseDocuments.length;
  documentBreakdownEl.textContent = `${requiredDocuments} mandatory + ${optionalDocuments} optional`;
  gateCountEl.textContent = phases.length;
}

function coreDocumentCount() {
  return phases.reduce((sum, phase) => sum + phase.documents.length, 0);
}

function renderLegend() {
  const uniqueStatuses = [...new Set(phases.map(phase => phase.status))];
  statusLegendEl.innerHTML = uniqueStatuses
    .map(status => `<span><i class="dot dot-${statusClass(status)}"></i>${status}</span>`)
    .join("");
}

function renderPhaseRail() {
  phaseRailEl.innerHTML = phases
    .map((phase, index) => {
      const isSelected = phase.id === selectedPhaseId;
      return `
        <button class="phase-node ${isSelected ? "is-selected" : ""}" data-phase-id="${phase.id}" type="button">
          <span class="phase-number">${String(index + 1).padStart(2, "0")}</span>
          <span class="phase-node-copy">
            <strong>${phase.name}</strong>
            <small>${phase.from} → ${phase.to}</small>
          </span>
          <span class="mini-status mini-${statusClass(phase.status)}">${phase.status}</span>
        </button>
      `;
    })
    .join("");

  phaseRailEl.querySelectorAll(".phase-node").forEach(button => {
    button.addEventListener("click", () => {
      selectPhase(button.dataset.phaseId);
      render();
    });
  });
}

function renderStatusDiagram() {
  const nodeWidth = 115.2;
  const nodeHeight = 50.4;

  statusDiagramEl.innerHTML = `
    <title id="statusDiagramTitle">SDLC workflow status diagram</title>
    <desc id="statusDiagramDescription">Workflow statuses connected by possible status changes.</desc>
    <defs>
      <marker id="arrow-normal" markerWidth="4.32" markerHeight="4.32" refX="3.6" refY="2.16" orient="auto">
        <path d="M0,0 L4.32,2.16 L0,4.32 Z"></path>
      </marker>
      <marker id="arrow-rework" markerWidth="4.32" markerHeight="4.32" refX="3.6" refY="2.16" orient="auto">
        <path d="M0,0 L4.32,2.16 L0,4.32 Z"></path>
      </marker>
      <marker id="arrow-rollback" markerWidth="4.32" markerHeight="4.32" refX="3.6" refY="2.16" orient="auto">
        <path d="M0,0 L4.32,2.16 L0,4.32 Z"></path>
      </marker>
      <marker id="arrow-closure" markerWidth="4.32" markerHeight="4.32" refX="3.6" refY="2.16" orient="auto">
        <path d="M0,0 L4.32,2.16 L0,4.32 Z"></path>
      </marker>
      <marker id="arrow-follow-up" markerWidth="4.32" markerHeight="4.32" refX="3.6" refY="2.16" orient="auto">
        <path d="M0,0 L4.32,2.16 L0,4.32 Z"></path>
      </marker>
    </defs>
  `;

  const edges = document.createElementNS("http://www.w3.org/2000/svg", "g");
  edges.setAttribute("class", "diagram-edges");

  statusTransitions.forEach(transition => {
    const from = findWorkflowStatus(transition.from);
    const to = findWorkflowStatus(transition.to);
    const isAvailable = transition.from === currentStatusId;
    const isLast = transitionKey(transition) === lastTransitionKey;
    const isHovered = transitionKey(transition) === hoveredTransitionKey;
    const fromCenterX = from.x + nodeWidth / 2;
    const fromCenterY = from.y + nodeHeight / 2;
    const toCenterX = to.x + nodeWidth / 2;
    const toCenterY = to.y + nodeHeight / 2;
    const isForward = toCenterX >= fromCenterX;
    const startX = isForward ? from.x + nodeWidth : from.x;
    const endX = isForward ? to.x : to.x + nodeWidth;
    const startY = fromCenterY;
    const endY = toCenterY;
    const distance = Math.abs(endX - startX);
    const curve = Math.max(44, Math.min(110, distance / 3));
    const controlOneX = startX + (isForward ? curve : -curve);
    const controlTwoX = endX - (isForward ? curve : -curve);
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

    path.setAttribute(
      "class",
      `diagram-edge edge-${transition.type}${isAvailable ? " is-available" : ""}${isLast ? " is-last" : ""}${isHovered ? " is-hovered" : ""}`
    );
    path.dataset.from = transition.from;
    path.dataset.to = transition.to;
    path.setAttribute("d", `M ${startX} ${startY} C ${controlOneX} ${startY}, ${controlTwoX} ${endY}, ${endX} ${endY}`);
    path.setAttribute("marker-end", `url(#arrow-${transition.type})`);
    edges.appendChild(path);
  });

  const nodes = document.createElementNS("http://www.w3.org/2000/svg", "g");
  nodes.setAttribute("class", "diagram-nodes");

  workflowStatuses.forEach(status => {
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const isCurrent = status.id === currentStatusId;
    const isReachable = outgoingTransitions(currentStatusId).some(transition => transition.to === status.id);
    group.setAttribute(
      "class",
      `diagram-node node-${status.kind}${isCurrent ? " is-current" : ""}${isReachable ? " is-reachable" : ""}`
    );
    group.setAttribute("transform", `translate(${status.x} ${status.y})`);
    group.setAttribute("role", "button");
    group.setAttribute("tabindex", "0");
    group.setAttribute("aria-label", `Select ${status.label}`);
    group.addEventListener("click", () => {
      selectStatus(status.id);
      render();
    });
    group.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectStatus(status.id);
        render();
      }
    });

    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("width", nodeWidth);
    rect.setAttribute("height", nodeHeight);
    rect.setAttribute("rx", "7.2");
    rect.setAttribute("ry", "7.2");

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", String(nodeWidth / 2));
    text.setAttribute("y", String(nodeHeight / 2 - 5.76));
    text.setAttribute("text-anchor", "middle");

    splitLabel(status.label).forEach((line, index) => {
      const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
      tspan.setAttribute("x", String(nodeWidth / 2));
      tspan.setAttribute("dy", index === 0 ? "0" : "12.24");
      tspan.textContent = line;
      text.appendChild(tspan);
    });

    group.appendChild(rect);
    group.appendChild(text);
    nodes.appendChild(group);
  });

  statusDiagramEl.appendChild(edges);
  statusDiagramEl.appendChild(nodes);
}

function renderTransitionActions() {
  const status = findWorkflowStatus(currentStatusId);
  const transitions = outgoingTransitions(currentStatusId);

  transitionSummaryEl.textContent = `Valid next moves from ${status.label}.`;

  if (transitions.length === 0) {
    transitionActionsEl.innerHTML = `
      <div class="empty-transition-status">
        No outgoing transitions from this status.
      </div>
    `;
    return;
  }

  transitionActionsEl.innerHTML = transitions
    .map(transition => {
      const to = findWorkflowStatus(transition.to);
      const profile = transitionProfile(transition);
      return `
        <button class="transition-action action-${transition.type}" type="button" data-transition-key="${transitionKey(transition)}">
          <span>${transition.label}</span>
          <strong>${status.label} → ${to.label}</strong>
          <small>Approver: ${escapeHtml(profile.approver)}</small>
          <em>${escapeHtml(profile.gate)}</em>
        </button>
      `;
    })
    .join("");

  transitionActionsEl.querySelectorAll(".transition-action").forEach(button => {
    const showTransitionHover = () => {
      hoveredTransitionKey = button.dataset.transitionKey;
      renderStatusDiagram();
    };
    const clearTransitionHover = event => {
      if (event.relatedTarget && button.contains(event.relatedTarget)) {
        return;
      }

      hoveredTransitionKey = "";
      renderStatusDiagram();
    };

    button.addEventListener("mouseenter", showTransitionHover);
    button.addEventListener("mouseover", showTransitionHover);
    button.addEventListener("pointerenter", showTransitionHover);
    button.addEventListener("pointerover", showTransitionHover);
    button.addEventListener("mouseleave", clearTransitionHover);
    button.addEventListener("mouseout", clearTransitionHover);
    button.addEventListener("pointerleave", clearTransitionHover);
    button.addEventListener("pointerout", clearTransitionHover);
    button.addEventListener("focus", showTransitionHover);
    button.addEventListener("blur", clearTransitionHover);
    button.addEventListener("click", () => {
      const transition = transitions.find(item => transitionKey(item) === button.dataset.transitionKey);
      selectStatus(transition.to, transitionKey(transition));
      render();
    });
  });
}

function renderTransitionList() {
  const labels = {
    normal: "Normal",
    rework: "Rework",
    rollback: "Rollback",
    closure: "Closure",
    "follow-up": "Follow-up"
  };

  transitionListEl.innerHTML = statusTransitions
    .map(transition => {
      const from = findWorkflowStatus(transition.from);
      const to = findWorkflowStatus(transition.to);
      const isAvailable = transition.from === currentStatusId;
      const isLast = transitionKey(transition) === lastTransitionKey;
      const profile = transitionProfile(transition);
      return `
        <article class="transition-card transition-${transition.type}${isAvailable ? " is-available" : ""}${isLast ? " is-last" : ""}">
          <span class="transition-type">${labels[transition.type]}</span>
          <strong>${from.label} → ${to.label}</strong>
          <p>${transition.label}</p>
          <small>Approver: ${escapeHtml(profile.approver)}</small>
          <small>Evidence: ${escapeHtml(profile.evidence)}</small>
        </article>
      `;
    })
    .join("");
}

function renderSelectedPhase() {
  const phase = phases.find(item => item.id === selectedPhaseId) || phases[0];
  const currentStatus = findWorkflowStatus(currentStatusId);
  const detail = detailForStatus(currentStatusId);
  const requiredCount = detail.documents.filter(document => document.required).length;

  phaseKickerEl.textContent = `${phase.owner} Owner`;
  phaseNameEl.textContent = phase.name;
  phasePurposeEl.textContent = phase.purpose;
  phaseStatusEl.textContent = currentStatus.label;
  phaseStatusEl.className = `status-pill status-${statusClass(currentStatus.label)}`;
  statusFromEl.textContent = phase.from;
  statusToEl.textContent = phase.to;
  entryListEl.innerHTML = createList(phase.entry);
  exitListEl.innerHTML = createList(phase.exit);
  documentSummaryEl.textContent = terminalStatusDetails[currentStatusId]
    ? `${detail.documents.length} exception documents for ${currentStatus.label}. Not included in the ${coreDocumentCount()} core document metric.`
    : `${detail.documents.length} documents, ${requiredCount} required for ${currentStatus.label}.`;
  documentListEl.innerHTML = detail.documents
    .map((document, index) => {
      const profile = documentProfile(document);

      return `
      <article class="document-card" data-document-index="${index}" role="button" tabindex="0" aria-label="Open sample index for ${escapeHtml(document.name)}">
        <div>
          <div class="document-title-row">
            <h3>${escapeHtml(document.name)}</h3>
            <span class="requirement ${document.required ? "is-required" : ""}">
              ${document.required ? "Required" : "Optional"}
            </span>
          </div>
          <p>${escapeHtml(document.evidence)}</p>
          <div class="document-meta-line">
            <span>Owner: ${escapeHtml(profile.owner)}</span>
            <span>Reviewer: ${escapeHtml(profile.reviewer)}</span>
          </div>
        </div>
        <span class="doc-type">${escapeHtml(document.type)}</span>
      </article>
    `;
    })
    .join("");

  documentListEl.querySelectorAll(".document-card").forEach(card => {
    const document = detail.documents[Number(card.dataset.documentIndex)];
    const openCardDocument = () => openDocumentModal(document);

    card.addEventListener("click", openCardDocument);
    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openCardDocument();
      }
    });
  });
}

function renderMatrix() {
  matrixBodyEl.innerHTML = phases
    .map(phase => {
      const mandatoryDocuments = phase.documents
        .filter(document => document.required)
        .map(document => document.name)
        .join(", ") || "None";
      const optionalDocuments = phase.documents
        .filter(document => !document.required)
        .map(document => document.name)
        .join(", ") || "None";
      return `
        <tr>
          <td><strong>${phase.name}</strong><span>${phase.owner}</span></td>
          <td>${phase.from} → ${phase.to}</td>
          <td>${mandatoryDocuments}</td>
          <td>${optionalDocuments}</td>
          <td>${phase.exit[phase.exit.length - 1]}</td>
        </tr>
      `;
    })
    .join("");
}

resetWorkflowBtn.addEventListener("click", () => {
  selectStatus("open");
  render();
});

documentModalCloseBtn.addEventListener("click", closeDocumentModal);
documentModalEl.querySelector("[data-close-document-modal]").addEventListener("click", closeDocumentModal);
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !documentModalEl.hidden) {
    closeDocumentModal();
  }
});

function render() {
  renderMetrics();
  renderLegend();
  renderPhaseRail();
  renderStatusDiagram();
  renderTransitionActions();
  renderTransitionList();
  renderSelectedPhase();
  renderMatrix();
}

render();
