# Joy Chinonso Elias — Portfolio

A responsive static landing page based on the supplied Figma Home frame (`3:227`).

The user's requested heading, supporting sentence, and dropdown alignment are applied. Original exported artwork, logos, photos, and fonts are stored locally. The animated portrait is losslessly converted to animated WebP, preserving all 216 frames and the 9.072-second loop. Two binary parts are joined in the browser so each hosted asset stays small enough for static hosting. A still Figma export appears immediately and is retained for reduced motion.

Open a local preview with `node serve.mjs`, then visit `http://127.0.0.1:4173/`.

The site lives in `dist/` and requires no build dependencies. `index.html` contains the content, `styles.css` contains responsive styling, and `app.js` handles menus, FAQ disclosure, and animation controls. Testimonials move at 18 pixels per second. Hovering, clicking, swiping, or keyboard browsing latches the pause until vertical page scrolling resumes playback; leaving the carousel does not resume it.

Case-study, services, and extended-about buttons link to their existing Figma prototype screens. Email and social destinations come from the source design. The source has no resume download or Chimanda case-study page, so those links open an email request. FAQ answers are based on the supplied design-process copy.

Validation covers desktop and mobile rendering, local assets, section anchors, dropdown and FAQ behavior, animation controls, and reduced-motion handling. Hosting uses the existing Sites identity in `.openai/hosting.json`.
