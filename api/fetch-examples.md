# Trust Accounting API — fetch examples

Replace `BASE_URL` with your deployment origin. All endpoints are **observe-only** POST routes.

## Healthcare receipt

```typescript
const response = await fetch(`${BASE_URL}/api/trust-accounting/receipt`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    domain: "healthcare",
    scope: "clinical_assistant",
    evidence: {
      policyAdherence: 88,
      escalationAccuracy: 82,
      calibrationDelta: -1.5,
      safetyIncidents: 5,
      survivabilityScore: 79,
      reviewCompliance: 91,
    },
  }),
});

const { receipt } = await response.json();
console.log(receipt.trustIndex, receipt.aliethiaSummary);
```

## Cyber diagnostics

```typescript
const response = await fetch(`${BASE_URL}/api/trust-accounting/diagnostics`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    domain: "cyber",
    scope: "cyber_defender",
    evidence: {
      controlCoverage: 88,
      detectionAccuracy: 91,
      alertCalibrationDelta: -1.8,
      controlDrift: "stable",
      postureStability: 86,
      reviewCompliance: 93,
    },
  }),
});

const { opportunities, diagnostics } = await response.json();
```

## Financial full report (with timeline history)

```typescript
const response = await fetch(`${BASE_URL}/api/trust-accounting/report`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    domain: "financial",
    scope: "balanced",
    evidence: {
      accuracy: 55,
      coverage: 71,
      calibration: -3,
      drift: "stable",
      survivability: 55,
      trustLock: 77,
    },
    receiptHistory: [
      { accuracy: 40, coverage: 60, drift: "degrading" },
      { accuracy: 50, coverage: 68, drift: "stable" },
      { accuracy: 55, coverage: 71, drift: "stable" },
    ],
  }),
});

const report = await response.json();
// report._meta, report.receipt, report.comparison, report.movement,
// report.timeline, report.opportunities, report.diagnostics
```

## Error responses

| Status | Meaning |
|--------|---------|
| `400` | Invalid domain, scope, or evidence shape |
| `422` | Pipeline error (adapter translation failure) |

## Domains and scopes

| Domain | Scopes |
|--------|--------|
| `financial` | `aggressive`, `balanced`, `defensive`, `cash_heavy` |
| `healthcare` | `clinical_assistant`, `triage_assistant`, `care_navigator`, `documentation_agent` |
| `legal` | `legal_assistant` |
| `cyber` | `cyber_defender` |

See [`openapi-reference.yaml`](openapi-reference.yaml) for schema details.
