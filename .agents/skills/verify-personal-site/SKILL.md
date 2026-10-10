---
name: verify-personal-site
description: Launch and verify Diego Sanchez Tirado's static personal-site web UI before or after content, deployment, or domain changes.
---

# Verify the personal site

## Launch

Run `python3 server.py` from the repository root. The site is ready when `curl -fsS http://127.0.0.1:8790/` succeeds. Record the PID you started and stop only that PID after verification.

## Doctor

Run `curl -fsSI http://127.0.0.1:8790/`. Continue only when the response is `200`, `X-Content-Type-Options` is `nosniff`, and `Referrer-Policy` is `no-referrer`.

## Drive

Run `npm run verify` for a deterministic HTTP check and retained evidence. For visual verification, open `http://127.0.0.1:8790/` in a browser and use the stable controls and anchors in `features/`: primary navigation links target `#about`, `#work`, `#experience`, and `#contact`; the theme control is `button#theme`; the resume link targets `Diego-Sanchez-Tirado-Resume.pdf`.

## Evidence

The script stores the fetched landing page, response headers, server log, and resume in `docs/qa/runtime/`. For a visual change, also save desktop and mobile screenshots there showing the action and resulting state. A pass must exercise the real HTTP server and the real published assets, not a generated mock.

## Cleanup

The script traps exit and stops only the server PID it started. If launching manually, stop that recorded PID. Keep `docs/qa/runtime/` as evidence.

## Helpers

`scripts/verify-site.sh` is the canonical launch, doctor, drive, evidence, and cleanup helper. Override its isolated port with `VERIFY_PORT` only after making `server.py` accept the same port.
