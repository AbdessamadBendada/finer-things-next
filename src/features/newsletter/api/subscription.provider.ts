import 'server-only';

import { createLoggingProvider } from '@/shared/forms/createLoggingProvider';
import type { DeliveryProvider } from '@/shared/forms/delivery';
import { serverEnv } from '@/shared/config/env';

import type { Subscription } from '../model/subscription.schema';
import { mailerliteProvider } from './mailerlite.provider';

export type SubscriptionProvider = DeliveryProvider<Subscription>;

/** Records the event only — an email address is personal data. */
const logProvider = createLoggingProvider<Subscription>('subscription');

const noopProvider: SubscriptionProvider = {
  name: 'noop',
  deliver: async () => ({ delivered: true }),
};

/*
 * Keyed by `NEWSLETTER_PROVIDER`, not `FORM_PROVIDER`.
 *
 * The two switches are separate because their prerequisites are: an enquiry
 * can go live as soon as a mailbox exists, while a subscription cannot until
 * consent and double opt-in do. One switch would mean turning on list
 * collection as a side effect of turning on the contact form.
 */
const PROVIDERS = {
  log: logProvider,
  noop: noopProvider,
  mailerlite: mailerliteProvider,
} as const satisfies Record<typeof serverEnv.NEWSLETTER_PROVIDER, SubscriptionProvider>;

export const subscriptionProvider = (): SubscriptionProvider =>
  PROVIDERS[serverEnv.NEWSLETTER_PROVIDER];
