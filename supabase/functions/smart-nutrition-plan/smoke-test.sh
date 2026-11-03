#!/usr/bin/env bash
# Reproducible checks for smart-nutrition-plan.
# Required env: SMART_PLAN_URL, PRO_ATHLETE_TOKEN, OTHER_ATHLETE_TOKEN, NON_PRO_ATHLETE_TOKEN,
#   UNASSIGNED_PRO_TOKEN, PRO_ATHLETE_ID, OTHER_ATHLETE_ID, NON_PRO_ATHLETE_ID, INCOMPLETE_ATHLETE_ID (hub or local UUIDs)
set -u

: "${SMART_PLAN_URL:?set SMART_PLAN_URL}"
RUN_ID="$(date +%s)"
pass=0
fail=0

call() {
  local token="$1" body="$2"
  curl -s -w '\n%{http_code}' -X POST "$SMART_PLAN_URL" \
    -H 'Content-Type: application/json' \
    ${token:+-H "Authorization: Bearer $token"} \
    -d "$body"
}

expect() {
  local name="$1" expected="$2" token="$3" body="$4"
  local out status
  out="$(call "$token" "$body")"
  status="${out##*$'\n'}"
  if [ "$status" = "$expected" ]; then
    pass=$((pass + 1)); echo "PASS $name -> $status"
  else
    fail=$((fail + 1)); echo "FAIL $name -> expected $expected got $status: ${out%$'\n'*}"
  fi
  LAST_BODY="${out%$'\n'*}"
}

expect "no session" 401 "" \
  "{\"athlete_id\":\"$PRO_ATHLETE_ID\",\"plan_kind\":\"personal\",\"mode\":\"full\",\"request_key\":\"nosess-$RUN_ID\"}"

expect "athlete without Pro" 403 "$NON_PRO_ATHLETE_TOKEN" \
  "{\"athlete_id\":\"$NON_PRO_ATHLETE_ID\",\"plan_kind\":\"personal\",\"mode\":\"full\",\"request_key\":\"nopro-$RUN_ID\"}"

expect "athlete A targets athlete B" 403 "$PRO_ATHLETE_TOKEN" \
  "{\"athlete_id\":\"$OTHER_ATHLETE_ID\",\"plan_kind\":\"personal\",\"mode\":\"full\",\"request_key\":\"cross-$RUN_ID\"}"

expect "professional targets unassigned athlete" 403 "$UNASSIGNED_PRO_TOKEN" \
  "{\"athlete_id\":\"$PRO_ATHLETE_ID\",\"plan_kind\":\"professional\",\"mode\":\"full\",\"professional_justification\":\"test\",\"request_key\":\"unassigned-$RUN_ID\"}"

expect "Pro athlete with incomplete data" 422 "$PRO_ATHLETE_TOKEN" \
  "{\"athlete_id\":\"$INCOMPLETE_ATHLETE_ID\",\"plan_kind\":\"personal\",\"mode\":\"full\",\"request_key\":\"incomplete-$RUN_ID\"}"

REQUEST_KEY="full-$RUN_ID"
expect "Pro athlete with complete data" 201 "$PRO_ATHLETE_TOKEN" \
  "{\"athlete_id\":\"$PRO_ATHLETE_ID\",\"plan_kind\":\"personal\",\"mode\":\"full\",\"request_key\":\"$REQUEST_KEY\"}"
PLAN_ID="$(printf '%s' "$LAST_BODY" | sed -n 's/.*"plan":{[^}]*"id":"\([^"]*\)".*/\1/p')"

expect "second full generation same month" 429 "$PRO_ATHLETE_TOKEN" \
  "{\"athlete_id\":\"$PRO_ATHLETE_ID\",\"plan_kind\":\"personal\",\"mode\":\"full\",\"request_key\":\"full2-$RUN_ID\"}"

expect "partial review within limit" 201 "$PRO_ATHLETE_TOKEN" \
  "{\"athlete_id\":\"$PRO_ATHLETE_ID\",\"plan_kind\":\"personal\",\"mode\":\"partial\",\"parent_plan_id\":\"$PLAN_ID\",\"request_key\":\"partial-$RUN_ID\"}"

expect "repeated request_key is idempotent" 200 "$PRO_ATHLETE_TOKEN" \
  "{\"athlete_id\":\"$PRO_ATHLETE_ID\",\"plan_kind\":\"personal\",\"mode\":\"full\",\"request_key\":\"$REQUEST_KEY\"}"

echo "passed=$pass failed=$fail"
[ "$fail" -eq 0 ]
