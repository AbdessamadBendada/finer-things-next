# services

The three service pages: Bespoke Accessories, Styling & Curation, Finer Living.

They are one template rendered three times — 84 of their ~92 CSS rules were
identical — so the template lives in `styles/service-page.module.css` and each
page's module holds only its own art direction: the clip-path choreography its
story imagery reveals with, and Finer Living's making-of films. The shells
compose both stylesheets.

Motion is shared the same way: `useServicePageMotion` takes the drift
constants that differ. Finer Living adds `useProductFilms`.
