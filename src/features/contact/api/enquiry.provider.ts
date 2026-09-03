import 'server-only';

import { createLoggingProvider } from '@/shared/forms/createLoggingProvider';
import type { DeliveryProvider } from '@/shared/forms/delivery';
import { serverEnv } from '@/shared/config/env';

import { CONSENT_VERSION, type Enquiry } from '../model/enquiry.schema';
import { resendProvider } from './resend.provider';

export type EnquiryProvider = DeliveryProvider<Enquiry>;

/**
 * Records only which service was selected — never the name, address or the
 * message body. See docs/SECURITY.md.
 */
const logProvider = createLoggingProvider<Enquiry>('enquiry', (enquiry) => ({
  service: enquiry.service ?? 'unspecified',
  messageLength: enquiry.message.length,
  consentVersion: CONSENT_VERSION,
}));

const noopProvider: EnquiryProvider = {
  name: 'noop',
  deliver: async () => ({ delivered: true }),
};

const PROVIDERS = {
  log: logProvider,
  noop: noopProvider,
  resend: resendProvider,
} as const satisfies Record<typeof serverEnv.FORM_PROVIDER, EnquiryProvider>;

/** Strategy selection, keyed by `FORM_PROVIDER`. */
export const enquiryProvider = (): EnquiryProvider => PROVIDERS[serverEnv.FORM_PROVIDER];
