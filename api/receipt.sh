#!/usr/bin/env bash
# Trust Accounting API v1 — generate a Trust Receipt (healthcare)
#
# Usage:
#   export BASE_URL="https://your-deployment.example.com"
#   bash api/receipt.sh

set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000}"

curl -sS -X POST "${BASE_URL}/api/trust-accounting/receipt" \
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
    }
  }' | jq .
