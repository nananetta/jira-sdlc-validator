const fixVersionEl = document.getElementById("fixVersion");
const systemImpactEl = document.getElementById("systemImpact");
const ticketStatusEl = document.getElementById("ticketStatus");
const validationStatusEl = document.getElementById("validationStatus");
const issueListEl = document.getElementById("issueList");
const resultsMetaEl = document.getElementById("resultsMeta");
const rootIssueCountEl = document.getElementById("rootIssueCount");
const attachmentCountEl = document.getElementById("attachmentCount");
const level1CountEl = document.getElementById("level1Count");
const openCountEl = document.getElementById("openCount");
const inProgressCountEl = document.getElementById("inProgressCount");
const doneCountEl = document.getElementById("doneCount");
const openPercentEl = document.getElementById("openPercent");
const inProgressPercentEl = document.getElementById("inProgressPercent");
const donePercentEl = document.getElementById("donePercent");
const openCircleEl = document.getElementById("openCircle");
const inProgressCircleEl = document.getElementById("inProgressCircle");
const doneCircleEl = document.getElementById("doneCircle");
const applyFiltersBtn = document.getElementById("applyFilters");
const resetFiltersBtn = document.getElementById("resetFilters");

function statusClass(status) {
  if (status === "Done") return "status-done";
  if (status === "In Progress") return "status-progress";
  return "status-open";
}

function ensureOptions(selectEl, values, defaultLabel) {
  selectEl.innerHTML = `<option value="all">${defaultLabel}</option>`;

  values.forEach(value => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    selectEl.appendChild(option);
  });
}

function percentage(count, total) {
  if (!total) {
    return "0%";
  }

  return `${(count / total) * 100}%`;
}

function circleOffset(count, total) {
  const circumference = 264;
  if (!total) {
    return circumference;
  }

  return circumference - (count / total) * circumference;
}

function toDomId(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function buildIssueCard(issue, options = {}) {
  const { nested = false } = options;
  const article = document.createElement("article");
  const levelClass = issue.level ? `issue-level-${issue.level}` : "issue-level-root";
  article.className = nested ? `issue-card issue-card-nested ${levelClass}` : `issue-card ${levelClass}`;
  const issueIdBase = `${toDomId(issue.key)}${issue.level ? `-level-${issue.level}` : "-root"}`;
  const attachmentsSectionId = `${issueIdBase}-attachments`;
  const relatedSectionId = `${issueIdBase}-related`;
  const validationClass = issue.attachmentValidation.isValid ? "is-valid" : "is-pending";
  const validationIcon = issue.attachmentValidation.isValid
    ? '<span class="validation-icon" aria-hidden="true">✓</span>'
    : "";
  const versionPill = issue.fixVersion ? `<span class="pill">${issue.fixVersion}</span>` : "";
  const impactPills = nested
    ? ""
    : `
        <div class="pill-row">
          ${issue.impacts.map(impact => `<span class="pill pill-impact">${impact}</span>`).join("")}
        </div>
      `;
  const childLabel = issue.level ? `Related Jira Path (Level ${issue.level + 1} to Level 3)` : "Related Jira Path (Level 1 to Level 3)";
  const childHint = issue.children.length > 0
    ? "Expand to show the nested Jira issue hierarchy"
    : "No related Jira issues under this ticket";

  const attachmentItems = issue.attachments.map(item => `
    <div class="attachment-item">
      <div>
        <strong>${item.name}</strong>
        <div class="attachment-meta">Owner: ${item.owner} | Updated: ${item.updated}</div>
      </div>
      <div class="attachment-meta">${item.size}</div>
    </div>
  `).join("");

  article.innerHTML = `
    <div class="issue-main">
      <div>
        <div class="issue-keyline">
          ${issue.level ? `<span class="node-level">Level ${issue.level}</span>` : ""}
          <span class="issue-key">${issue.key}</span>
          ${versionPill}
        </div>
        <h2 class="issue-title">${issue.title}</h2>
        ${impactPills}
      </div>
      <div class="status">
        <div class="status-label">${issue.level ? "Issue Status" : "Root Issue Status"}</div>
        <div class="status-value ${statusClass(issue.status)}">${issue.status}</div>
      </div>
    </div>
    <details class="detail-row" id="${attachmentsSectionId}">
      <summary class="detail-toggle" aria-controls="${attachmentsSectionId}">
        <span class="detail-copy">
          <span class="detail-label">Attachments (${issue.attachments.length})</span>
          <span class="detail-meta">
            <span class="detail-hint">Expand to show the attachment list</span>
            <span class="validation-status ${validationClass}">
              ${validationIcon}
              Validation Status: ${issue.attachmentValidation.label}
            </span>
          </span>
        </span>
        <span class="caret"></span>
      </summary>
      <div class="detail-content">
        <div class="attachment-list">${attachmentItems}</div>
      </div>
    </details>
    <details class="detail-row" id="${relatedSectionId}">
      <summary class="detail-toggle" aria-controls="${relatedSectionId}">
        <span class="detail-copy">
          <span class="detail-label">${childLabel}</span>
          <span class="detail-hint">${childHint}</span>
        </span>
        <span class="caret"></span>
      </summary>
      <div class="detail-content">
        <div class="nested-issues"></div>
      </div>
    </details>
  `;

  const nestedIssuesEl = article.querySelector(".nested-issues");
  if (issue.children.length > 0) {
    issue.children.forEach(child => {
      nestedIssuesEl.appendChild(buildIssueCard(child, { nested: true }));
    });
  } else {
    nestedIssuesEl.innerHTML = `
      <div class="empty empty-nested">
        No related Jira issues under ${issue.key}.
      </div>
    `;
  }

  return article;
}

function renderResult(data) {
  const { filters, items, meta } = data;

  ensureOptions(fixVersionEl, filters.fixVersions, "All fix versions");
  ensureOptions(systemImpactEl, filters.impacts, "All system impacts");
  ensureOptions(ticketStatusEl, filters.statuses, "All statuses");
  ensureOptions(validationStatusEl, filters.validationStatuses, "All validation states");
  fixVersionEl.value = filters.selected.fixVersion;
  systemImpactEl.value = filters.selected.systemImpact;
  ticketStatusEl.value = filters.selected.status;
  validationStatusEl.value = filters.selected.validationStatus;

  rootIssueCountEl.textContent = meta.rootIssueCount;
  attachmentCountEl.textContent = meta.attachmentCount;
  level1CountEl.textContent = meta.level1Count;

  const openCount = items.filter(item => item.status === "Open").length;
  const inProgressCount = items.filter(item => item.status === "In Progress").length;
  const doneCount = items.filter(item => item.status === "Done").length;

  openCountEl.textContent = openCount;
  inProgressCountEl.textContent = inProgressCount;
  doneCountEl.textContent = doneCount;
  openPercentEl.textContent = percentage(openCount, items.length);
  inProgressPercentEl.textContent = percentage(inProgressCount, items.length);
  donePercentEl.textContent = percentage(doneCount, items.length);
  openCircleEl.style.strokeDashoffset = circleOffset(openCount, items.length);
  inProgressCircleEl.style.strokeDashoffset = circleOffset(inProgressCount, items.length);
  doneCircleEl.style.strokeDashoffset = circleOffset(doneCount, items.length);

  const versionLabel = filters.selected.fixVersion === "all" ? "all fix versions" : filters.selected.fixVersion;
  const impactLabel = filters.selected.systemImpact === "all" ? "all system impacts" : filters.selected.systemImpact;
  const statusLabel = filters.selected.status === "all" ? "all statuses" : filters.selected.status;
  const validationLabel =
    filters.selected.validationStatus === "all" ? "all validation states" : filters.selected.validationStatus;
  resultsMetaEl.textContent = `Showing ${items.length} root issues for ${versionLabel}, ${impactLabel}, ${statusLabel}, and ${validationLabel}.`;

  issueListEl.innerHTML = "";

  if (items.length === 0) {
    issueListEl.innerHTML = `
      <div class="empty">
        No mock Jira issues matched the selected fixVersion and system impact.
      </div>
    `;
    return;
  }

  items.forEach(issue => {
    issueListEl.appendChild(buildIssueCard(issue));
  });
}

async function fetchIssues() {
  const apiUrl = new URL("../api/issues", window.location.href);
  apiUrl.searchParams.set("fixVersion", fixVersionEl.value || "all");
  apiUrl.searchParams.set("systemImpact", systemImpactEl.value || "all");
  apiUrl.searchParams.set("status", ticketStatusEl.value || "all");
  apiUrl.searchParams.set("validationStatus", validationStatusEl.value || "all");

  resultsMetaEl.textContent = "Loading mock Jira issues...";

  try {
    const response = await fetch(apiUrl.toString());
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    renderResult(data);
  } catch (error) {
    issueListEl.innerHTML = `
      <div class="empty">
        Unable to load mock Jira data.
      </div>
    `;
    resultsMetaEl.textContent = `Failed to fetch issues: ${error.message}`;
  }
}

applyFiltersBtn.addEventListener("click", fetchIssues);
resetFiltersBtn.addEventListener("click", () => {
  fixVersionEl.value = "all";
  systemImpactEl.value = "all";
  ticketStatusEl.value = "all";
  validationStatusEl.value = "all";
  fetchIssues();
});

fetchIssues();
