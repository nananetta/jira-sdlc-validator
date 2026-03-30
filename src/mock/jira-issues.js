const jiraIssues = [
  {
    key: "SR-1042",
    title: "Payment gateway hardening for Q2 release window",
    status: "In Progress",
    fixVersion: "2026.04-Q2",
    impacts: ["Payment", "Mobile App", "Customer Portal"],
    attachments: [
      { name: "payment-flow-v3.pdf", size: "2.4 MB", owner: "Narin", updated: "2026-03-25" },
      { name: "uat-evidence.zip", size: "18.2 MB", owner: "Mali", updated: "2026-03-27" },
      { name: "uat signoff-merchant-approval.msg", size: "244 KB", owner: "May", updated: "2026-03-28" },
      { name: "rollback-checklist.xlsx", size: "148 KB", owner: "Pat", updated: "2026-03-28" }
    ],
    children: [
      {
        level: 1,
        key: "OPS-771",
        title: "Validate ingress routing and secret rotation",
        status: "Open",
        impacts: ["Payment", "Platform"],
        attachments: [
          { name: "ingress-routing-review.pdf", size: "640 KB", owner: "Aom", updated: "2026-03-24" },
          { name: "uat signoff-platform.msg", size: "120 KB", owner: "Nok", updated: "2026-03-28" }
        ],
        children: [
          {
            level: 2,
            key: "SEC-292",
            title: "Rotate gateway service account credentials",
            status: "In Progress",
            impacts: ["Security", "Platform"],
            attachments: [
              { name: "secret-rotation-plan.docx", size: "300 KB", owner: "Ton", updated: "2026-03-26" }
            ],
            children: [
              {
                level: 3,
                key: "TASK-8821",
                title: "Run smoke test after secret sync in staging",
                status: "Done",
                impacts: ["Staging", "Payment"],
                attachments: [
                  { name: "staging-smoke-result.txt", size: "24 KB", owner: "Jay", updated: "2026-03-28" }
                ],
                children: []
              }
            ]
          }
        ]
      },
      {
        level: 1,
        key: "APP-441",
        title: "Confirm mobile checkout regression coverage",
        status: "In Progress",
        impacts: ["Mobile App", "Payment"],
        attachments: [
          { name: "mobile-regression-matrix.xlsx", size: "190 KB", owner: "Prae", updated: "2026-03-27" }
        ],
        children: [
          {
            level: 2,
            key: "QA-219",
            title: "Execute edge-case checkout scenarios",
            status: "Open",
            impacts: ["Mobile App"],
            attachments: [
              { name: "uat signoff-mobile.msg", size: "98 KB", owner: "Nan", updated: "2026-03-29" }
            ],
            children: [
              {
                level: 3,
                key: "TASK-8833",
                title: "Retest guest checkout after token refresh fix",
                status: "Open",
                impacts: ["Payment"],
                attachments: [],
                children: []
              }
            ]
          }
        ]
      }
    ]
  },
  {
    key: "SR-1188",
    title: "Claims API schema alignment for external consumer rollout",
    status: "Open",
    fixVersion: "2026.04-Q2",
    impacts: ["Claims", "API Gateway", "Partner Portal"],
    attachments: [
      { name: "claims-contract-diff.docx", size: "912 KB", owner: "Beam", updated: "2026-03-24" },
      { name: "consumer-mapping.csv", size: "72 KB", owner: "Fah", updated: "2026-03-26" }
    ],
    children: [
      {
        level: 1,
        key: "API-556",
        title: "Update downstream field mapping and deprecation notes",
        status: "In Progress",
        impacts: ["Claims", "API Gateway"],
        attachments: [
          { name: "field-mapping-v5.csv", size: "80 KB", owner: "Beam", updated: "2026-03-25" }
        ],
        children: [
          {
            level: 2,
            key: "DOC-103",
            title: "Refresh integration guide for partner consumers",
            status: "Open",
            impacts: ["Partner Portal"],
            attachments: [
              { name: "partner-guide-outline.docx", size: "220 KB", owner: "Ploy", updated: "2026-03-27" }
            ],
            children: [
              {
                level: 3,
                key: "TASK-9012",
                title: "Publish preview package to sandbox channel",
                status: "Open",
                impacts: ["Sandbox", "Partner Portal"],
                attachments: [],
                children: []
              }
            ]
          }
        ]
      },
      {
        level: 1,
        key: "INT-188",
        title: "Validate partner contract compatibility set",
        status: "Open",
        impacts: ["Partner Portal", "Claims"],
        attachments: [
          { name: "uat signoff-partner-claims.msg", size: "105 KB", owner: "Guy", updated: "2026-03-28" }
        ],
        children: [
          {
            level: 2,
            key: "TASK-9021",
            title: "Check deprecated field fallbacks in sandbox",
            status: "Open",
            impacts: ["Sandbox"],
            attachments: [],
            children: [
              {
                level: 3,
                key: "TASK-9022",
                title: "Document remaining compatibility exceptions",
                status: "Open",
                impacts: ["Partner Portal"],
                attachments: [],
                children: []
              }
            ]
          }
        ]
      }
    ]
  },
  {
    key: "SR-1231",
    title: "Core ledger reconciliation patch for month-end close",
    status: "Done",
    fixVersion: "2026.05-MonthEnd",
    impacts: ["Ledger", "Finance Ops", "Reporting"],
    attachments: [
      { name: "ledger-recon-sql.sql", size: "58 KB", owner: "Tee", updated: "2026-03-20" },
      { name: "close-runbook-v2.pdf", size: "1.1 MB", owner: "Mint", updated: "2026-03-22" },
      { name: "uat signoff-finance.msg", size: "244 KB", owner: "Mai", updated: "2026-03-23" },
      { name: "evidence-pack.zip", size: "11.4 MB", owner: "Pim", updated: "2026-03-24" }
    ],
    children: [
      {
        level: 1,
        key: "FIN-312",
        title: "Backfill failed journal mappings",
        status: "Done",
        impacts: ["Ledger", "Finance Ops"],
        attachments: [
          { name: "mapping-backfill-log.txt", size: "58 KB", owner: "Mai", updated: "2026-03-22" }
        ],
        children: [
          {
            level: 2,
            key: "DATA-447",
            title: "Repair reconciliation snapshots for close window",
            status: "Done",
            impacts: ["Reporting", "Warehouse"],
            attachments: [
              { name: "uat signoff-reporting.msg", size: "112 KB", owner: "Mint", updated: "2026-03-23" }
            ],
            children: [
              {
                level: 3,
                key: "TASK-9104",
                title: "Verify delta totals against signed baseline",
                status: "Done",
                impacts: ["Reporting"],
                attachments: [],
                children: []
              }
            ]
          }
        ]
      },
      {
        level: 1,
        key: "OPS-932",
        title: "Archive month-end evidence and control records",
        status: "Done",
        impacts: ["Finance Ops", "Reporting"],
        attachments: [
          { name: "archive-checklist.pdf", size: "480 KB", owner: "Tee", updated: "2026-03-24" }
        ],
        children: [
          {
            level: 2,
            key: "TASK-9111",
            title: "Validate archive completeness against close pack",
            status: "Done",
            impacts: ["Reporting"],
            attachments: [],
            children: [
              {
                level: 3,
                key: "TASK-9112",
                title: "Store signed package in evidence repository",
                status: "Done",
                impacts: ["Finance Ops"],
                attachments: [],
                children: []
              }
            ]
          }
        ]
      }
    ]
  },
  {
    key: "SR-1305",
    title: "Identity sync improvement for enterprise onboarding batch",
    status: "In Progress",
    fixVersion: "2026.06-Onboarding",
    impacts: ["IAM", "Admin Portal", "Notifications"],
    attachments: [
      { name: "sync-sequence.png", size: "336 KB", owner: "Ice", updated: "2026-03-21" }
    ],
    children: [
      {
        level: 1,
        key: "ID-620",
        title: "Provision role inheritance and approval bypass rules",
        status: "In Progress",
        impacts: ["IAM", "Admin Portal"],
        attachments: [
          { name: "role-inheritance-notes.pdf", size: "440 KB", owner: "Ice", updated: "2026-03-23" }
        ],
        children: [
          {
            level: 2,
            key: "NOTIF-211",
            title: "Adjust email templates for onboarding delta events",
            status: "Open",
            impacts: ["Notifications"],
            attachments: [
              { name: "template-copy-review.docx", size: "76 KB", owner: "Ping", updated: "2026-03-28" }
            ],
            children: [
              {
                level: 3,
                key: "TASK-9277",
                title: "Validate preview rendering with sample tenant",
                status: "Open",
                impacts: ["Notifications", "Admin Portal"],
                attachments: [],
                children: []
              }
            ]
          }
        ]
      },
      {
        level: 1,
        key: "IAM-711",
        title: "Reconcile onboarding sync errors for pilot tenants",
        status: "Open",
        impacts: ["IAM", "Notifications"],
        attachments: [
          { name: "uat signoff-onboarding.msg", size: "102 KB", owner: "Aim", updated: "2026-03-29" }
        ],
        children: [
          {
            level: 2,
            key: "TASK-9282",
            title: "Clear duplicate role assignments in pilot batch",
            status: "Open",
            impacts: ["IAM"],
            attachments: [],
            children: [
              {
                level: 3,
                key: "TASK-9283",
                title: "Re-run sync and validate notification dispatch",
                status: "Open",
                impacts: ["Notifications"],
                attachments: [],
                children: []
              }
            ]
          }
        ]
      }
    ]
  }
];

module.exports = {
  jiraIssues
};
