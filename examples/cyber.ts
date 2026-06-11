/**
 * Cyber domain — Cyber Evidence Pack
 *
 * Reference Implementation #4. SOC / detection AI operations.
 * Package: @reconai/trust-cyber
 */

import { cyberAdapter, type CyberTrustEvidence } from "@reconai/trust-cyber";
import { buildTrustReceipt } from "@reconai/trust-accounting-core";

// ---------------------------------------------------------------------------
// Example evidence (from CYBER_EXAMPLE_EVIDENCE — public-safe fixture)
// ---------------------------------------------------------------------------

const evidence: CyberTrustEvidence = {
  controlCoverage: 88,
  detectionAccuracy: 91,
  alertCalibrationDelta: -1.8,
  controlDrift: "stable",
  postureStability: 86,
  reviewCompliance: 93,
};

// ---------------------------------------------------------------------------
// Trust receipt for cyber_defender scope
// ---------------------------------------------------------------------------

const receipt = buildTrustReceipt(cyberAdapter.toReceiptParams(evidence, "cyber_defender"));

console.log("Cyber defender index:", receipt?.trustIndex); // ~85–92 range
console.log("Drift factor:", receipt?.factors.find((f) => f.id === "drift")?.rawValue);

// ---------------------------------------------------------------------------
// Degrading posture scenario
// ---------------------------------------------------------------------------

const degradingEvidence: CyberTrustEvidence = {
  controlCoverage: 71,
  detectionAccuracy: 68,
  alertCalibrationDelta: 4.2, // over-alerting
  controlDrift: "degrading",
  postureStability: 58,
  reviewCompliance: 64,
};

const degraded = buildTrustReceipt(
  cyberAdapter.toReceiptParams(degradingEvidence, "cyber_defender")
);

console.log("Degraded index:", degraded?.trustIndex);
console.log("Why not higher:", degraded?.whyNotHigher);

// ---------------------------------------------------------------------------
// Signal semantics
// ---------------------------------------------------------------------------
//
// | Cyber signal            | Trust factor  | Notes                    |
// |-------------------------|---------------|--------------------------|
// | controlCoverage         | Coverage      | Assets with controls     |
// | detectionAccuracy       | Accuracy      | Threat classification    |
// | alertCalibrationDelta   | Calibration   | scoreCalibrationHealth   |
// | controlDrift            | Drift         | improving/stable/degrading |
// | postureStability        | Survivability | Consistency over window  |
// | reviewCompliance        | Trust Lock    | Analyst review coverage  |

const factors = cyberAdapter.extractFactors(evidence, "cyber_defender");
console.log(`${factors.length} factors extracted`); // 6

console.log("Adapter:", cyberAdapter.adapterName); // "cyber_defender"
