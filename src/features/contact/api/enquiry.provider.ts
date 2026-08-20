import 'server-only';

import { createLoggingProvider } from '@/shared/forms/createLoggingProvider';
import type { DeliveryProvider } from '@/shared/forms/delivery';
import { serverEnv } from '@/shared/config/env';

import type { Enquiry } from '../model/enquiry.schema';

export type EnquiryProvider = DeliveryProvider<Enquiry>;

/**
 * Records only which service was selected — never the name, address or the
 * message body. See docs/SECURITY.md.
 */
const logProvider = createLoggingProvider<Enquiry>('enquiry', (enquiry) => ({
  service: enquiry.service ?? 'unspecified',
  messageLength: enquiry.message.length,
}));

const noopProvider: EnquiryProvider = {
  name: 'noop',
  deliver: async () => ({ delivered: true }),
};

const PROVIDERS = {
  log: logProvider,
  noop: noopProvider,
} as const satisfies Record<typeof serverEnv.FORM_PROVIDER, EnquiryProvider>;

/**
 * Strategy selection. Adding Resend means adding `resend.provider.ts`, one
 * entry here, and one value to the FORM_PROVIDER enum in env.ts.
 */
export const enquiryProvider = (): EnquiryProvider => PROVIDERS[serverEnv.FORM_PROVIDER];
