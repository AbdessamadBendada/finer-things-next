# Newsletter

The site-wide sign-up form is its own feature rather than part of the footer
because it owns a schema, a server action and a delivery provider.

`NewsletterForm` is composed into every route group's footer.
`shared/layout` must not import features, so footer composition stays in the
route group layouts.

Delivery remains deliberately non-live. Do not connect a provider until the
consent, double opt-in, retention and legal-copy blockers in
`docs/adr/0002-deferred-compliance.md` are resolved.
