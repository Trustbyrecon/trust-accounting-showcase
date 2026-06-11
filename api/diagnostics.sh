#!/usr/bin/env bash
# Trust Accounting API v1 — diagnostics with movement context (healthcare)
#
# Usage:
#   export BASE_URL="https://your-deployment.example.com"
#   bash api/diagnostics.sh

set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000}"

curl -sS -X POST "${BASE_URL}/api/trust-accounting/diagnostics" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "healthcare",
    "scope": "clinical_assistant",
    "evidence": {
      "policyAdherence": 88,
      "escalationAccuracy": 82,
      "calibrationDelta": -1.5,
      "safetyIncidents": 5,
      "survivabilityScore": 79,
      "reviewCompliance": 91
    },
    "previousEvidence": {
      "policyAdherence": 75,
      "escalationAccuracy": 70,
      "calibrationDelta": -3.0,
      "safetyIncidents": 12,
      "survivabilityScore": 65,
      "reviewCompliance": 80
    }
  }' | jq .
