/**
 * Healthcare domain — Clinical Compliance Pack
 *
 * Reference Implementation #2. Four native clinical scopes.
 * Package: @reconai/trust-healthcare
 */

import {
  healthcareAdapter,
  buildHealthcareReceiptComparison,
  type HealthcareTrustEvidence,
} from "@reconai/trust-healthcare";
import { buildTrustReceipt, buildTrustGrowthDiagnostics, buildTrustGrowthOpportunities } from "@reconai/trust-accounting-core";

// ---------------------------------------------------------------------------
// Scenario: Gold Standard clinical assistant
// (from healthcare-scenarios fixture — sanitized for public portfolio)
// ---------------------------------------------------------------------------

const goldStandard: HealthcareTrustEvidence = {
  policyAdherence: 96,
  escalationAccuracy: 94,
  calibrationDelta: 0.8,
  safetyIncidents: 2,
  survivabilityScore: 93,
  reviewCompliance: 97,
};

const receipt = buildTrustReceipt(
  healthcareAdapter.toReceiptParams(goldStandard, "clinical_assistant")
);

console.log("Gold standard index:", receipt?.trustIndex); // expect ≥ 85

// ---------------------------------------------------------------------------
// Cross-scope comparison (no financial posture names leak)
// ---------------------------------------------------------------------------

const comparison = buildHealthcareReceiptComparison(goldStandard);

console.log("Clinical scopes compared:", comparison.postures);
// clinical_assistant | triage_assistant | care_navigator | documentation_agent

// ---------------------------------------------------------------------------
// Scenario: Escalation failure (low escalationAccuracy dominates diagnostics)
// ---------------------------------------------------------------------------

const escalationFailure: HealthcareTrustEvidence = {
  policyAdherence: 82,
  escalationAccuracy: 38, // critically low
  calibrationDelta: 1.0,
  safetyIncidents: 6,
  survivabilityScore: 70,
  reviewCompliance: 78,
};

const failureParams = healthcareAdapter.toReceiptParams(escalationFailure, "triage_assistant");
const failureReceipt = buildTrustReceipt(failureParams);

const opportunities = buildTrustGrowthOpportunities({
  trustIndex: failureParams.trustIndexReport,
  phaseIIIHealth: failureParams.phaseIIIHealth,
  calibration: failureParams.calibration,
  drift: failureParams.drift,
  survivability: failureParams.survivability ?? null,
  trustLock: failureParams.trustLock ?? null,
  momentum: null,
});

const diagnostics = buildTrustGrowthDiagnostics({
  trustIndex: failureParams.trustIndexReport,
  phaseIIIHealth: failureParams.phaseIIIHealth,
  calibration: failureParams.calibration,
  drift: failureParams.drift,
  survivability: failureParams.survivability ?? null,
  trustLock: failureParams.trustLock ?? null,
  momentum: null,
});

console.log("Primary growth factor:", opportunities.opportunities[0]?.factorId); // accuracy
console.log("Root cause:", diagnostics.diagnostics[0]?.rootCause);

// ---------------------------------------------------------------------------
// Scope selection
// ---------------------------------------------------------------------------

const scopes = healthcareAdapter.scopes();
for (const scope of scopes) {
  const scoped = buildTrustReceipt(healthcareAdapter.toReceiptParams(goldStandard, scope));
  console.log(`${scope}: ${scoped?.trustIndex}`);
}
