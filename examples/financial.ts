/**
 * Financial domain — Exposure Guard Trust Pack
 *
 * Reference Implementation #1. Maps portfolio postures to trust receipts.
 * Package: @reconai/trust-financial
 */

import { financialAdapter, type ExposureGuardEvidence } from "@reconai/trust-financial";
import {
  buildTrustReceipt,
  buildTrustReceiptComparison,
  buildTrustMomentumTimeline,
} from "@reconai/trust-accounting-core";

// ---------------------------------------------------------------------------
// Simplified evidence (playground-friendly shape)
// ---------------------------------------------------------------------------

/**
 * For quick exploration, the playground accepts simplified JSON:
 *
 * {
 *   "accuracy": 55,
 *   "coverage": 71,
 *   "calibration": -3,
 *   "drift": "stable",
 *   "survivability": 55,
 *   "trustLock": 77
 * }
 *
 * Production paths assemble full ExposureGuardEvidence from monitoring pipelines.
 */

// Minimal structurally-valid evidence (truncated for portfolio demo)
const evidence = {
  phaseIIIHealth: {
    averageAccuracy: 78,
    coverageScore: 75,
    recordsCurrent: 40,
    recordsTarget: 50,
  },
  confidenceCalibration: { averageDelta: -1.2 },
  calibrationDrift: { overallDriftState: "stable" as const },
  survivabilityMetrics: { stabilityScore: 82 },
  trustLock: { score: 88, eligible: true },
  trustIndexReport: {
    overallTrustIndex: 77,
    byPosture: [
      { posture: "aggressive", trustIndex: 89 },
      { posture: "balanced", trustIndex: 96 },
      { posture: "defensive", trustIndex: 61 },
      { posture: "cash_heavy", trustIndex: 61 },
    ],
  },
} as unknown as ExposureGuardEvidence;

// ---------------------------------------------------------------------------
// Single posture receipt
// ---------------------------------------------------------------------------

const balancedReceipt = buildTrustReceipt(
  financialAdapter.toReceiptParams(evidence, "balanced")
);

console.log("Balanced posture index:", balancedReceipt?.trustIndex); // TBN-1 baseline: 96

// ---------------------------------------------------------------------------
// Cross-posture comparison matrix
// ---------------------------------------------------------------------------

const comparison = buildTrustReceiptComparison(financialAdapter.toComparisonParams(evidence));

for (const row of comparison.rows) {
  console.log(`${row.factorId}:`, row.cells.map((c) => c.contribution));
}

// ---------------------------------------------------------------------------
// Momentum timeline (financial domain only — 2+ historical snapshots)
// ---------------------------------------------------------------------------

const history = [
  { accuracy: 40, coverage: 60, drift: "degrading" },
  { accuracy: 50, coverage: 68, drift: "stable" },
  { accuracy: 55, coverage: 71, drift: "stable" },
];

// In production, map each history entry through financialAdapter before timeline build.
// buildTrustMomentumTimeline({ snapshots: [...] })

console.log("Postures:", financialAdapter.scopes());
// ["aggressive", "balanced", "defensive", "cash_heavy"]
