const { jiraIssues } = require("../mock/jira-issues");

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function buildMeta(items, selectedVersion) {
  return {
    rootIssueCount: items.length,
    attachmentCount: items.reduce((sum, item) => sum + item.attachments.length, 0),
    level1Count: items.reduce((sum, item) => sum + item.children.length, 0),
    selectedRelease: selectedVersion === "all" ? "All" : selectedVersion
  };
}

function hasUatSignoffAttachment(attachments) {
  return attachments.some(attachment => attachment.name.toLowerCase().includes("uat signoff"));
}

function enrichIssue(issue) {
  const attachments = issue.attachments || [];
  const children = issue.children || [];
  const isValid = hasUatSignoffAttachment(attachments);

  return {
    ...issue,
    attachments,
    children: children.map(enrichIssue),
    attachmentValidation: {
      isValid,
      label: isValid ? "Validated" : "Pending"
    }
  };
}

function handleIssueApiRequest(url, res) {
  const fixVersion = url.searchParams.get("fixVersion") || "all";
  const systemImpact = url.searchParams.get("systemImpact") || "all";
  const status = url.searchParams.get("status") || "all";
  const validationStatus = url.searchParams.get("validationStatus") || "all";

  const enrichedIssues = jiraIssues.map(enrichIssue);

  const items = enrichedIssues.filter(issue => {
    const versionMatch = fixVersion === "all" || issue.fixVersion === fixVersion;
    const impactMatch = systemImpact === "all" || issue.impacts.includes(systemImpact);
    const statusMatch = status === "all" || issue.status === status;
    const validationMatch =
      validationStatus === "all" ||
      issue.attachmentValidation.label.toLowerCase() === validationStatus.toLowerCase();
    return versionMatch && impactMatch && statusMatch && validationMatch;
  });

  const fixVersions = [...new Set(enrichedIssues.map(issue => issue.fixVersion))];
  const impacts = [...new Set(enrichedIssues.flatMap(issue => issue.impacts))].sort();
  const statuses = [...new Set(enrichedIssues.map(issue => issue.status))];
  const validationStatuses = [...new Set(enrichedIssues.map(issue => issue.attachmentValidation.label))];

  sendJson(res, 200, {
    filters: {
      fixVersions,
      impacts,
      statuses,
      validationStatuses,
      selected: {
        fixVersion,
        systemImpact,
        status,
        validationStatus
      }
    },
    meta: buildMeta(items, fixVersion),
    items
  });
}

module.exports = {
  handleIssueApiRequest
};
