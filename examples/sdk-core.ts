/**
 * Trust Accounting — core SDK pipeline
 *
 * Illustrates the six TBN-1 builders and the adapter contract.
 * Packages: @reconai/trust-accounting-core, @reconai/trust-healthcare
 *
 * This file is portfolio documentation — run against published packages when available.
 */

import {
  buildTrustReceipt,
  buildTrustReceiptComparison,
  buildTrustMovementDelta,
  buildTrustMomentumTimeline,
  buildTrustGrowthOpportunities,
  buildTrustGrowthDiagnostics,
  snapshotFromComparison,
  type TrustEvidenceAdapter,
} from "@reconai/trust-accounting-core";
import { healthcareAdapter, type HealthcareTrustEvidence } from "@reconai/trust-healthcare";

// ---------------------------------------------------------------------------
// 1. Adapter contract (every domain pack implements this)
// ---------------------------------------------------------------------------

function demonstrateAdapterContract(adapter: TrustEvidenceAdapter<HealthcareTrustEvidence>) {
  console.log(adapter.adapterName); // "healthcare_ops" — used in audit trails
  console.log(adapter.domainLabel); // "Healthcare Compliance Pack"
  console.log(adapter.scopes()); // ["clinical_assistant", "triage_assistant", ...]
}

// ---------------------------------------------------------------------------
// 2. Evidence → Receipt
// ---------------------------------------------------------------------------

const currentEvidence: HealthcareTrustEvidence = {
  policyAdherence: 88,
  escalationAccuracy: 82,
  calibrationDelta: -1.5,
  safetyIncidents: 5,
  survivabilityScore: 79,
  reviewCompliance: 91,
};

const scope = "clinical_assistant";
const receipt = buildTrustReceipt(healthcareAdapter.toReceiptParams(currentEvidence, scope));

if (receipt) {
  console.log("Trust index:", receipt.trustIndex);
  console.log("Factors:", receipt.factors.map((f) => `${f.id}=${f.contribution}`));
  console.log("Summary:", receipt.aliethiaSummary);
}

// ---------------------------------------------------------------------------
// 3. Cross-scope comparison
// ---------------------------------------------------------------------------

// Healthcare pack provides a domain-native comparison helper
import { buildHealthcareReceiptComparison } from "@reconai/trust-healthcare";

const comparison = buildHealthcareReceiptComparison(currentEvidence);
console.log("Compared scopes:", comparison.postures);

// ---------------------------------------------------------------------------
// 4. Movement delta (requires previous evidence snapshot)
// ---------------------------------------------------------------------------

const previousEvidence: HealthcareTrustEvidence = {
  policyAdherence: 75,
  escalationAccuracy: 70,
  calibrationDelta: -3.0,
  safetyIncidents: 12,
  survivabilityScore: 65,
  reviewCompliance: 80,
};

const prevComparison = buildHealthcareReceiptComparison(previousEvidence);
const prevSnapshot = snapshotFromComparison(prevComparison);

const movement = buildTrustMovementDelta({
  comparison,
  previousSnapshot: prevSnapshot,
});

console.log("Movement aggregate delta:", movement.aggregateTrustIndexDelta);

// ---------------------------------------------------------------------------
// 5. Growth opportunities + diagnostics (via adapter-mapped params)
// ---------------------------------------------------------------------------

const receiptParams = healthcareAdapter.toReceiptParams(currentEvidence, scope);

const opportunities = buildTrustGrowthOpportunities({
  trustIndex: receiptParams.trustIndexReport,
  phaseIIIHealth: receiptParams.phaseIIIHealth,
  calibration: receiptParams.calibration,
  drift: receiptParams.drift,
  survivability: receiptParams.survivability ?? null,
  trustLock: receiptParams.trustLock ?? null,
  momentum: null,
});

const diagnostics = buildTrustGrowthDiagnostics({
  trustIndex: receiptParams.trustIndexReport,
  phaseIIIHealth: receiptParams.phaseIIIHealth,
  calibration: receiptParams.calibration,
  drift: receiptParams.drift,
  survivability: receiptParams.survivability ?? null,
  trustLock: receiptParams.trustLock ?? null,
  momentum: null,
});

console.log("Top lever:", opportunities.opportunities[0]?.factorId);
console.log("Root cause:", diagnostics.diagnostics[0]?.rootCause);

// ---------------------------------------------------------------------------
// 6. Momentum timeline (financial domain — receipt history required)
// ---------------------------------------------------------------------------

// buildTrustMomentumTimeline accepts an array of prior receipts from snapshot history.
// See examples/financial.ts for a financial-domain timeline example.

demonstrateAdapterContract(healthcareAdapter);
