import 'server-only';

import { createLoggingProvider } from '@/shared/forms/createLoggingProvider';
import type { DeliveryProvider } from '@/shared/forms/delivery';
import { serverEnv } from '@/shared/config/env';

import type { Subscription } from '../model/subscription.schema';

export type SubscriptionProvider = DeliveryProvider<Subscription>;

/** Records the event only — an email address is personal data. */
const logProvider = createLoggingProvider<Subscription>('subscription');

const noopProvider: SubscriptionProvider = {
  name: 'noop',
  deliver: async () => ({ delivered: true }),
};

const PROVIDERS = {
  log: logProvider,
  noop: noopProvider,
} as const satisfies Record<typeof serverEnv.FORM_PROVIDER, SubscriptionProvider>;

export const subscriptionProvider = (): SubscriptionProvider =>
  PROVIDERS[serverEnv.FORM_PROVIDER];
