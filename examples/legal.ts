/**
 * Legal domain — Legal Evidence Pack
 *
 * Reference Implementation #3. Citation reliability, hallucination monitoring.
 * Package: @reconai/trust-legal
 */

import { legalAdapter, type LegalTrustEvidence } from "@reconai/trust-legal";
import { buildTrustReceipt, buildTrustGrowthDiagnostics, buildTrustGrowthOpportunities } from "@reconai/trust-accounting-core";

// ---------------------------------------------------------------------------
// Example evidence (from LEGAL_EXAMPLE_EVIDENCE — public-safe fixture)
// ---------------------------------------------------------------------------

const evidence: LegalTrustEvidence = {
  citationReliability: 91,
  sourceFreshness: 84,
  policyAdherence: 96,
  escalationAccuracy: 89,
  hallucinationRate: 4, // inverted for calibration — lower is better
  reviewCompliance: 94,
};

// ---------------------------------------------------------------------------
// Trust receipt
// ---------------------------------------------------------------------------

const receipt = buildTrustReceipt(legalAdapter.toReceiptParams(evidence, "legal_assistant"));

console.log("Legal assistant index:", receipt?.trustIndex); // ~91 ("strong")
console.log("Summary:", receipt?.aliethiaSummary);

// ---------------------------------------------------------------------------
// Factor extraction (for audit trail / GhostLog events)
// ---------------------------------------------------------------------------

const factors = legalAdapter.extractFactors(evidence, "legal_assistant");
console.log(
  "Factor contributions:",
  factors.map((f) => ({ id: f.id, contribution: f.contribution }))
);

// ---------------------------------------------------------------------------
// High hallucination rate scenario
// ---------------------------------------------------------------------------

const riskyEvidence: LegalTrustEvidence = {
  ...evidence,
  hallucinationRate: 28, // elevated — calibration penalty
  citationReliability: 62,
};

const riskyParams = legalAdapter.toReceiptParams(riskyEvidence, "legal_assistant");
const riskyReceipt = buildTrustReceipt(riskyParams);

const opportunities = buildTrustGrowthOpportunities({
  trustIndex: riskyParams.trustIndexReport,
  phaseIIIHealth: riskyParams.phaseIIIHealth,
  calibration: riskyParams.calibration,
  drift: riskyParams.drift,
  survivability: riskyParams.survivability ?? null,
  trustLock: riskyParams.trustLock ?? null,
  momentum: null,
});

console.log("Top improvement lever:", opportunities.opportunities[0]?.factorId);

// ---------------------------------------------------------------------------
// Signal semantics (adapter-owned translation)
// ---------------------------------------------------------------------------
//
// | Legal signal          | Trust factor  | Notes                          |
// |-----------------------|---------------|--------------------------------|
// | citationReliability   | Coverage      | Direct 0–100                   |
// | escalationAccuracy    | Accuracy      | Direct 0–100                   |
// | hallucinationRate     | Calibration   | Inverted — lower rate = better |
// | policyAdherence       | Drift         | ≥90 improving, ≥75 stable      |
// | sourceFreshness       | Survivability | Direct pass-through            |
// | reviewCompliance      | Trust Lock    | ≥80 eligible                   |

console.log("Adapter:", legalAdapter.adapterName); // "legal_ops"
