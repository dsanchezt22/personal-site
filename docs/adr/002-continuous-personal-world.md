# One continuous personal world

Status: implemented and verified for Diego's 2026-10-12 correction.

The portfolio is about Diego. The water glass is an opening gesture, not the brand or subject. A short automatic ice-drop introduction pulls back into a sculptural workspace. One persistent WebGL scene and one continuous camera path connect introduction, personal background, hardware/research, developer tools, applied AI at Verdnt, and contact. There are no independent pinned mini-scenes. The old tea-island artwork and test-kitchen copy leave the homepage.

Palette: cool paper #eef2f5, ink #182b3c, ice #d9eaf3, cobalt #426fa7, copper #b67955. Keep the self-hosted Manrope and Inter. Quiet left-aligned personal information accompanies the camera journey; full project descriptions stay available through native detail dialogs. On phones, visual space sits above the reading area. The header always links to resume and chapter navigation.

Use Three.js for actual perspective, glass, shadows, and the continuous camera path, bundled locally with esbuild. Three.js is justified by this requested 3D experience, rather than recreating a rendering engine. The small current HTML/CSS/JS site and existing Cloudflare hosting remain. No external assets are loaded at runtime. A readable HTML list is the fallback for reduced motion, unsupported WebGL, no JavaScript, and an explicit motion-off choice. Sound remains opt-in.

Acceptance: the intro ends without a click; ice visibly falls into water; scrolling moves the same canvas/camera through all six chapters in both directions; all links and detail dialogs work with keyboard; the old marketing wording/image are absent; personal identity and social/resume links lead the experience; no clipped text at phone/tablet/desktop widths.
