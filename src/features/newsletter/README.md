# Newsletter

The site-wide sign-up form and its delayed, centered editorial invitation. This is its
own feature rather than part of the footer because it owns a schema, a server
action, a delivery provider and the popup's browser behavior.

The same `NewsletterForm` is composed into every route group's footer and into
`NewsletterPopup` at the root layout. The compact modal opens immediately at
50% scroll, after 15 seconds for someone who has begun scrolling, or after 40
seconds for someone who has not scrolled. Dismissal is remembered in session
storage, so it remains dismissed across reloads but resets when the tab closes.
Its native modal dialog provides focus containment and Escape handling. The
card itself never scrolls, and the document is locked in place until the modal
finishes closing. On unusually short mobile screens, the photograph is hidden
so all form content continues to fit without overflow.

`shared/layout` must not import features, so footer composition stays in the
route group layouts. The root `app` layer may import the popup feature directly.

Delivery remains deliberately non-live. Do not connect a provider until the
consent, double opt-in, retention and legal-copy blockers in
`docs/adr/0002-deferred-compliance.md` are resolved.
