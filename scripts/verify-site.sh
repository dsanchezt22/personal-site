#!/usr/bin/env bash
set -euo pipefail

root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
port=${VERIFY_PORT:-8790}
evidence_dir=${VERIFY_EVIDENCE_DIR:-"$root/docs/qa/runtime"}
mkdir -p "$evidence_dir"

python3 "$root/server.py" >"$evidence_dir/server.log" 2>&1 &
server_pid=$!
cleanup() {
  kill "$server_pid" 2>/dev/null || true
  wait "$server_pid" 2>/dev/null || true
}
trap cleanup EXIT

ready=0
for _ in $(seq 1 40); do
  if curl -fsS "http://127.0.0.1:$port/" >"$evidence_dir/index.html"; then
    ready=1
    break
  fi
  sleep 0.1
done
test "$ready" -eq 1

curl -fsSI "http://127.0.0.1:$port/" >"$evidence_dir/index.headers"
curl -fsS "http://127.0.0.1:$port/Diego-Sanchez-Tirado-Resume.pdf" >"$evidence_dir/resume.pdf"

rg -q '<title>Diego Sanchez Tirado</title>' "$evidence_dir/index.html"
rg -q 'id="about"' "$evidence_dir/index.html"
rg -q 'id="work"' "$evidence_dir/index.html"
rg -q 'id="experience"' "$evidence_dir/index.html"
rg -q 'id="contact"' "$evidence_dir/index.html"
rg -qi '^X-Content-Type-Options: nosniff' "$evidence_dir/index.headers"
rg -qi '^Referrer-Policy: no-referrer' "$evidence_dir/index.headers"
test -s "$evidence_dir/resume.pdf"

printf 'Verified landing page, About, Work, Experience, Contact, headers, and resume.\n'
printf 'Evidence: %s\n' "$evidence_dir"
