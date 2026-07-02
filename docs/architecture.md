# Trust Accounting — Architecture

High-level system design for **Trust Accounting**, the flagship application of the Recon trust runtime. This document is a **projection**—technical depth on the Trust Accounting layer only.

For the developer-first discovery narrative (Trust Interval, runtime architecture, maturity map), see [`README.md`](../README.md). For the public Trust Interval philosophy, see [reconai.net/homepage/trust-interval](https://reconai.net/homepage/trust-interval).

This document intentionally omits internal monorepo paths, enterprise strategy, and long implementation backlogs.

## Position in the Recon Runtime

Trust Accounting is the verification layer on Recon's evidence spine. It consumes **Evidence (GhostLog)** lineage and **Trust Context (Trust Graph)** topology, then produces **Verifiable Audit Artifacts**—decomposed trust receipts, movement deltas, and diagnostics operators can read without opening model weights.

Execution authority remains in **Runtime Decisions (Mission Runtime)**; learning compounds through **Organizational Learning (Pattern Library)** and **Decision Intelligence (Alie)**. Trust Accounting measures and explains; it does not execute.

## Problem

Regulated AI deployments need **auditable trust measurement** that:

- Works across domains (finance, healthcare, legal, cyber)
- Produces operator-readable outputs, not opaque scores
- Separates **evidence translation** from **scoring logic**
- Stays observe-only until governance explicitly grants execution authority

## Layered design

### 1. Core (`@reconai/trust-accounting-core`)

Pure TypeScript builders frozen at TBN-1. No domain imports. Six builders:

| Builder | Output |
|---------|--------|
| `buildTrustReceipt` | Decomposed trust index for one scope/posture |
| `buildTrustReceiptComparison` | Cross-scope factor matrix |
| `buildTrustMovementDelta` | Temporal delta vs. prior snapshot |
| `buildTrustMomentumTimeline` | Multi-period trend from snapshot history |
| `buildTrustGrowthOpportunities` | Ranked improvement levers |
| `buildTrustGrowthDiagnostics` | Root-cause enrichment per lever |

Also exports `TrustEvidenceAdapter<T>` — the contract every vertical implements.

### 2. Domain adapters

Each adapter:

1. Defines a domain evidence interface (6 signals)
2. Maps signals → core builder params (synthetic but structurally compatible)
3. Exposes `adapterName`, `domainLabel`, `scopes()`, `extractFactors()`, `toReceiptParams()`

Adapters **never** modify weights or formulas. Adding a fifth domain is an adapter-only change.

### 3. Surfaces

| Surface | Runtime | Auth |
|---------|---------|------|
| Playground | Browser (client-side pipeline) | None |
| HTTP API | Server-side pipeline wrapper | Deployment-specific |
| Agent SDKs | In-process during agent steps | Org credentials |

All surfaces call the same core builders — no scoring drift between UI and API.

## Data flow

```
Operational monitoring
  ↓ assembles domain evidence (JSON)
TrustEvidenceAdapter.toReceiptParams(evidence, scope)
  ↓
buildTrustReceipt → TrustReceiptReport
  ↓ optional
buildTrustReceiptComparison (all scopes)
buildTrustMovementDelta (if previousEvidence)
buildTrustMomentumTimeline (if receiptHistory[])
buildTrustGrowthOpportunities → buildTrustGrowthDiagnostics
  ↓
Export JSON / HTTP response / GhostLog audit event
```

## Universal six factors

Every domain maps onto the same factor IDs:

| Factor ID | Typical meaning |
|-----------|-----------------|
| `coverage` | Breadth of policy/control adherence |
| `accuracy` | Decision or classification correctness |
| `calibration` | Confidence vs. outcome alignment |
| `drift` | Stability / trend of behavior |
| `survivability` | Long-run operational resilience |
| `trust_lock` | Human review and governance compliance |

Domain adapters choose **how** raw signals become factor inputs; core chooses **how** inputs become contributions.

## Observe-only contract

All Trust Receipt outputs include advisory semantics:

- No automatic tool execution
- No policy mutation
- No persistence in the API v1 surface

Execution authority remains in the host application's governance layer (Mission Runtime, approval flows, etc.).

## Agent integration (separate public repos)

Trust Accounting measures **evidence quality**. Agent runtimes use complementary tooling:

- **Python:** [reconai-langchain](https://github.com/Trustbyrecon/reconai-langchain) — TrustGuard, step callbacks, recovery
- **TypeScript:** `@reconai/sdk` — mission wrapping, telemetry ingest

These integrate at the orchestration layer; Trust Accounting core stays domain-agnostic.

## Versioning

- **TBN-1:** Production-validated baseline, frozen anchor
- **RFC-001:** Contract specification for SDK extraction
- Breaking schema changes require a new RFC and explicit version bump

## Further reading in this repo

- [`README.md`](../README.md) — aggregate runtime narrative
- [`examples/`](../examples/) — adapter usage by domain
- [`api/`](../api/) — HTTP integration snippets
