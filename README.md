# Joy Chinonso Elias — Portfolio

The Moniepoint case study (`128:609`) is implemented at `moniepoint.html`, with locally stored Figma exports, the full research and redesign sections, responsive phone compositions, settings switches, lesson disclosures, and shared navigation/footer. Homepage project links, dropdown navigation, and the other case studies link directly to it. Figma reports no timeline animation on this frame. Lesson disclosure text summarizes the design's research and handoff content.

A responsive static portfolio based on the supplied Figma Home frame (`3:227`) and Aierth case study (`41:874`).

The user's requested heading, supporting sentence, and dropdown alignment are applied. Original exported artwork, logos, photos, and fonts are stored locally. The animated portrait is losslessly converted to animated WebP, preserving all 216 frames and the 9.072-second loop. Two binary parts are joined in the browser so each hosted asset stays small enough for static hosting. A still Figma export appears immediately and is retained for reduced motion.

Open a local preview with `node serve.mjs`, then visit `http://127.0.0.1:4173/`.

The site lives in `dist/` and requires no build dependencies. `index.html` contains the content, `styles.css` contains responsive styling, and `app.js` handles menus, FAQ disclosure, and animation controls. Testimonials move at 18 pixels per second. Hovering, clicking, swiping, or keyboard browsing latches the pause until vertical page scrolling resumes playback; leaving the carousel does not resume it.

The Aierth page is at `aierth.html`, with original artwork, diagrams, screenshots, and responsive layouts. The CapturePRO page is at `capturepro.html`, with the original product artwork and responsive case-study sections. The homepage menu, project buttons, project images, and footer route into the implemented case-study pages. The Chimamanda footer link opens the assistant section within the Aierth case study. Other case studies, services, and extended-about buttons retain their Figma prototype destinations. Email and social destinations come from the source design. The source has no resume download, so that link opens an email request. FAQ and case-study lesson disclosure answers are based on the supplied design-process copy. Figma exposes no timeline animation or video for the Aierth or CapturePRO pages.

The testimonial carousel hides its scrollbar while retaining automatic movement, latched interaction pause, drag, swipe, horizontal wheel scrolling, keyboard controls, and vertical-page-scroll resume.

Validation covers desktop and mobile rendering, local assets, section anchors, dropdown and FAQ behavior, animation controls, and reduced-motion handling. Hosting uses the existing Sites identity in `.openai/hosting.json`.

Services is available at services.html. The page uses the Figma service and package content, exported icons, two manually browsable carousels, responsive layouts, and shared portfolio navigation. Carousel navigation supports dots, horizontal scrolling, mouse drag, and keyboard arrows/Home/End, with reduced-motion support. FAQ answers were drafted from the service descriptions because the supplied frame contains only collapsed questions. Contact buttons use the portfolio email address. Moniepoint lesson chevrons use the correctly proportioned exported Services chevron.

