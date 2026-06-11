#!/usr/bin/env bash
# Trust Accounting API v1 — full pipeline report (mirrors playground export)
#
# Usage:
#   export BASE_URL="https://your-deployment.example.com"
#   bash api/report.sh

set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000}"

curl -sS -X POST "${BASE_URL}/api/trust-accounting/report" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "legal",
    "scope": "legal_assistant",
    "evidence": {
      "citationReliability": 91,
      "escalationAccuracy": 89,
      "hallucinationRate": 4,
      "policyAdherence": 96,
      "sourceFreshness": 84,
      "reviewCompliance": 94
    }
  }' | jq .
