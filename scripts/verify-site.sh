#!/usr/bin/env bash
set -euo pipefail
root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
port=${VERIFY_PORT:-8791}
evidence_dir=${VERIFY_EVIDENCE_DIR:-"$root/docs/qa/runtime"}
mkdir -p "$evidence_dir"
PORT="$port" python3 "$root/server.py" >"$evidence_dir/server.log" 2>&1 &
server_pid=$!
cleanup() { kill "$server_pid" 2>/dev/null || true; wait "$server_pid" 2>/dev/null || true; }
trap cleanup EXIT
ready=0
for _ in $(seq 1 40); do
  kill -0 "$server_pid" 2>/dev/null || { cat "$evidence_dir/server.log"; exit 1; }
  if curl -fsS "http://127.0.0.1:$port/" >"$evidence_dir/index.html" 2>/dev/null; then ready=1; break; fi
  sleep 0.1
done
test "$ready" -eq 1
python3 "$root/scripts/check-site.py" "http://127.0.0.1:$port/" | tee "$evidence_dir/checks.txt"
curl -fsSI "http://127.0.0.1:$port/" >"$evidence_dir/index.headers"
printf 'Evidence: %s\n' "$evidence_dir"
