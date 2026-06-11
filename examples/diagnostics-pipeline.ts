/**
 * Full diagnostics pipeline — movement + opportunities + root causes
 *
 * Demonstrates the operator workflow: compare periods, find levers, explain why.
 */

import { healthcareAdapter, buildHealthcareReceiptComparison } from "@reconai/trust-healthcare";
import type { HealthcareTrustEvidence } from "@reconai/trust-healthcare";
import {
  buildTrustReceipt,
  buildTrustMovementDelta,
  buildTrustGrowthOpportunities,
  buildTrustGrowthDiagnostics,
  snapshotFromComparison,
} from "@reconai/trust-accounting-core";

// Current period — drifting assistant (high safety incidents)
const current: HealthcareTrustEvidence = {
  policyAdherence: 78,
  escalationAccuracy: 80,
  calibrationDelta: 2.5,
  safetyIncidents: 24, // degrading drift
  survivabilityScore: 68,
  reviewCompliance: 72,
};

// Prior period — same deployment, earlier window
const previous: HealthcareTrustEvidence = {
  policyAdherence: 85,
  escalationAccuracy: 83,
  calibrationDelta: 1.0,
  safetyIncidents: 11,
  survivabilityScore: 74,
  reviewCompliance: 80,
};

const scope = "clinical_assistant";

// --- Receipts ---
const currentParams = healthcareAdapter.toReceiptParams(current, scope);
const previousParams = healthcareAdapter.toReceiptParams(previous, scope);

const currentReceipt = buildTrustReceipt(currentParams);
const previousReceipt = buildTrustReceipt(previousParams);

console.log("Current index:", currentReceipt?.trustIndex);
console.log("Previous index:", previousReceipt?.trustIndex);

// --- Movement ---
const currentComparison = buildHealthcareReceiptComparison(current);
const previousComparison = buildHealthcareReceiptComparison(previous);
const previousSnapshot = snapshotFromComparison(previousComparison);

const movement = buildTrustMovementDelta({
  comparison: currentComparison,
  previousSnapshot,
});

console.log("Aggregate delta:", movement.aggregateTrustIndexDelta);
for (const delta of movement.postureDeltas) {
  console.log(`  ${delta.posture}: ${delta.trustIndexDelta >= 0 ? "+" : ""}${delta.trustIndexDelta}`);
}

// --- Opportunities + diagnostics ---
const opportunities = buildTrustGrowthOpportunities({
  trustIndex: currentParams.trustIndexReport,
  phaseIIIHealth: currentParams.phaseIIIHealth,
  calibration: currentParams.calibration,
  drift: currentParams.drift,
  survivability: currentParams.survivability ?? null,
  trustLock: currentParams.trustLock ?? null,
  momentum: null,
});

const diagnostics = buildTrustGrowthDiagnostics({
  trustIndex: currentParams.trustIndexReport,
  phaseIIIHealth: currentParams.phaseIIIHealth,
  calibration: currentParams.calibration,
  drift: currentParams.drift,
  survivability: currentParams.survivability ?? null,
  trustLock: currentParams.trustLock ?? null,
  momentum: null,
});

console.log("\nGrowth opportunities (ranked):");
for (const opp of opportunities.opportunities.slice(0, 3)) {
  console.log(`  ${opp.rank}. ${opp.factorId} — ${opp.headline}`);
}

console.log("\nRoot-cause diagnostics:");
for (const diag of diagnostics.diagnostics.slice(0, 2)) {
  console.log(`  ${diag.factorId}: ${diag.rootCause ?? diag.headline}`);
}

// --- Export shape (matches playground / API report) ---
const report = {
  _meta: {
    domain: "healthcare",
    scope,
    generatedAt: new Date().toISOString(),
    tbnAnchor: "c2395bf6",
    observeOnly: true,
  },
  receipt: currentReceipt,
  movement,
  opportunities,
  diagnostics,
};

console.log("\nReport keys:", Object.keys(report));
