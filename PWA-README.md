# Install Aesthetic Color Studio as a PWA

## Run locally
1. Open this folder in VS Code.
2. Start a local static server (for example, the VS Code Live Server extension). Do not open index.html directly with file://.
3. Open the localhost URL in Chrome or Edge.
4. Use the install icon in the browser address bar or menu.

## Publish
Upload the project files to your HTTPS host (GitHub Pages works). Keep `index.html`, `script.js`, `manifest.webmanifest`, `service-worker.js`, and the `icons` folder at the same published root.

## Offline note
The app shell is cached, but the current page loads Tailwind CSS and Google Fonts from external CDNs. Styling may be incomplete offline until those dependencies are stored locally. The screen eyedropper also depends on browser support and secure context.
