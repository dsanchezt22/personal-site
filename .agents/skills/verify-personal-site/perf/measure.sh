#!/usr/bin/env bash
# measure.sh <url> <outdir>: Chrome performance traces of the served site at desktop and
# phone width with the CPU slowed 4x, then one row of numbers per trace (see analyze.mjs).
#   load     reload the page                      -> fcp, lcp, tbt
#   idle     4 s doing nothing on the first screen -> raster and paint should be ~0
#   pointer  4 s of pointer movement over the hero -> raster ~0, fps 60
#   scroll   8 s scroll from top to bottom         -> fps, frames over 33 ms
# Headless Chrome rasters on the CPU by default, which is the harsh case. For numbers
# on a real GPU, start the session with
#   CHROME_DEVTOOLS_AXI_SESSION=gpu CHROME_DEVTOOLS_AXI_CHROME_ARGS="--enable-gpu --ignore-gpu-blocklist --use-angle=vulkan --enable-features=Vulkan"
set -euo pipefail
url=$1; out=$2; here=$(dirname "$(readlink -f "$0")")
export CHROME_DEVTOOLS_AXI_SESSION=${CHROME_DEVTOOLS_AXI_SESSION:-perf}
mkdir -p "$out"
ax() { chrome-devtools-axi "$@"; }
for dev in desktop phone; do
  if [ $dev = desktop ]; then vp="1440x900x2"; else vp="390x844x3,mobile,touch"; fi
  ax open about:blank >/dev/null
  ax emulate --viewport "$vp" --cpu 4 >/dev/null
  ax open "$url" >/dev/null
  # load: reload under trace; the tool stops it itself
  ax perf-start --file "$out/load-$dev.json.gz" >/dev/null
  for _ in $(seq 1 60); do ax perf-stop 2>&1 | grep -q 'no active' && break; sleep 1; done
  for sc in idle pointer scroll; do
    ax open "$url" >/dev/null
    ax eval "() => new Promise((r) => setTimeout(r, 2500))" >/dev/null
    ax perf-start --no-reload --no-auto-stop --file "$out/$sc-$dev.json.gz" >/dev/null
    ax eval "$(cat "$here/drive-$sc.js")" > "$out/$sc-$dev.raf.txt"
    ax perf-stop --file "$out/$sc-$dev.json.gz" >/dev/null
  done
done
ax emulate --cpu 1 >/dev/null
node "$here/analyze.mjs" "$out" | tee "$out/summary.txt"
