# R12 Books

Responsive website for an independent bookstore (Web Designing case study).

**Client problem:** desktop-only site with a 9-second load caused by heavy images.
**CSS track:** Bootstrap 5 (CDN) plus a small custom stylesheet.

## Pages
- `index.html` - Home: hero with inline SVG, staff picks, map iframe, visit details
- `catalogue.html` - Book table, reservation list (JavaScript + Local Storage), pickup form

## Performance choices
- Illustrations are inline SVG and CSS covers, so there are no heavy photos
- Map iframe uses `loading="lazy"`
- Fonts use `preconnect` and `display=swap`
- `defer` on all scripts

## Run locally
Open `index.html` in a browser. No build step.

## Deploy
Push to GitHub, then Settings > Pages > Deploy from branch `main` / root.

## Notes
Student project. All business names and details are fictional. The form does not send data anywhere.
