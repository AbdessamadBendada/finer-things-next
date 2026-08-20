# newsletter

The footer sign-up form. Its own feature rather than part of the footer because
it owns a schema, a server action and a delivery provider.

Composed into the home page's footer by that page — `shared/layout` must not
import features, so the composition happens at the page level.
