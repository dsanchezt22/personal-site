# Theme preference

## Sub-features

Light/dark toggle, pressed state, saved preference, system-color fallback.

## How to get to it (user POV)

Open any page position and activate the Dark or Light button in the header.

## Driving it with browser and HTTP

Activate `button#theme`; verify its text and `aria-pressed` change, `data-theme` changes on the root element, and the choice persists after reload.

## Gotchas

HTTP-only verification can prove the control ships but cannot prove browser storage behavior; use a real browser for theme changes.
