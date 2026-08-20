# Forms

Two forms: the contact enquiry (`/contact`) and the newsletter sign-up (in the
home footer). Both follow the same shape.

## One schema, enforced twice

```
features/contact/model/enquiry.schema.ts   ← the single definition
        │
        ├── browser: zodResolver → inline errors as you type
        └── server:  safeParse in the action → the security boundary
```

The client pass is a convenience. The server pass is the one that counts, and
it re-parses `FormData` from scratch — it never trusts what the browser sent.
There is exactly one schema; adding a second definition of what is valid is the
one thing that would break this design.

## Progressive enhancement

`useFormAction` wires it together:

- the `<form>` carries a real Server Action, so it submits and validates with
  JavaScript disabled or before hydration completes;
- once hydrated, `onSubmit` validates first and only then calls the action;
- server-side field errors are mapped back onto the offending input via
  `setError`, so a rejection lands on the right field rather than in a banner.

`noValidate` is set deliberately: the schema is the single definition of
validity, and the browser's native bubbles would contradict its messages.

## Delivery is a strategy

No mail provider is connected yet. Rather than leave the forms inert, they run
end to end against a port:

```
shared/forms/delivery.ts              DeliveryProvider<Payload>
features/contact/api/
  enquiry.provider.ts                 selects an adapter from FORM_PROVIDER
  submitEnquiry.action.ts             parse → bot check → deliver → log
```

The active adapter (`log`) validates, records that a submission arrived, and
reports success. Everything except the final hop is real and exercised.

### Connecting a real provider

1. Add `features/contact/api/resend.provider.ts` implementing
   `DeliveryProvider<Enquiry>`.
2. Add it to the `PROVIDERS` map in `enquiry.provider.ts`.
3. Add `'resend'` to the `FORM_PROVIDER` enum in `shared/config/env.ts`.
4. Set `FORM_PROVIDER=resend`.

No action, schema, hook or component changes. The `satisfies Record<…>`
constraint on the map means a missing adapter is a type error, not a runtime
surprise.

**Before doing this, read [adr/0002-deferred-compliance.md](adr/0002-deferred-compliance.md).**
The consent checkbox and newsletter double opt-in are not implemented, and
connecting live delivery without them has legal implications.

## A trap worth knowing about

An unchecked radio group does not report `undefined` to React Hook Form — it
reports an empty string. `z.enum([...]).optional()` rejects that, so the
contact form silently refused to submit for anyone who did not pick an
interest: no error message, no request, nothing. The schema now normalises
`''` to `undefined`, and there is a regression test for it.

Two consequences worth keeping:

- **Input and output types are separate.** `EnquiryInput` is what the form
  holds (`service` may be `''`); `Enquiry` is what the action receives after
  parsing. React Hook Form is typed with the input shape.
- **Validation can never fail silently again.** `useFormAction` returns
  `blocked`: if submission is stopped by an error on a field that renders no
  message of its own, the status line says so instead of nothing happening.

## Error states

Actions return a discriminated union (`shared/forms/result.ts`): `idle`,
`success`, `invalid` with field errors, or `error` with a correlation id. The
UI has to handle each case, so none can be silently forgotten.

The correlation id is shown to the user on failure and written to the log,
which is what makes a support request traceable without logging any personal
data.

## Anti-spam

A honeypot field is included on both forms — off-screen, `tabindex="-1"`, and
hidden from assistive technology. A submission that fills it in is answered
with the ordinary success message rather than an error, so a bot learns
nothing.

Beyond that, abuse control is at the Cloudflare edge rather than in
application code
([adr/0003-deferred-bot-protection.md](adr/0003-deferred-bot-protection.md)).
Rate-limit rules to configure are in [DEPLOYMENT.md](DEPLOYMENT.md).

## Error UI

The legacy forms had no error styling. `FieldError` adds inline messages built
from the existing type scale and the current page's accent colour, wired with
`aria-invalid` and `aria-describedby`. It renders nothing when there is no
error — which is why a clean form is still pixel-identical to the original.
