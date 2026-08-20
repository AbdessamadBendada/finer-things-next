# contact

The `/contact` page and the enquiry form.

`model/enquiry.schema.ts` is the single validation definition, used by both the
browser and the server action. Delivery goes through a provider port; the
active adapter logs rather than sends. See docs/FORMS.md.
