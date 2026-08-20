import { z } from 'zod';

/**
 * Newsletter subscription. Same two-sided enforcement as the enquiry schema.
 *
 * Note for launch: EU practice expects double opt-in before an address counts
 * as subscribed. That is deliberately not implemented yet — see
 * docs/adr/0002-deferred-compliance.md — and must be in place before a real
 * mailing provider is connected.
 */
export const subscriptionSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(160, 'That address is longer than we can store.')
    .email('Please enter a valid email address.'),

  /** Honeypot; see enquiry.schema.ts. */
  company: z.string().max(0).optional(),
});

export type Subscription = z.infer<typeof subscriptionSchema>;
export type SubscriptionField = keyof Subscription;

export const emptySubscription = {
  email: '',
  company: '',
} satisfies Record<SubscriptionField, unknown>;
