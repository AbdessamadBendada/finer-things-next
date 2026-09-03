import 'server-only';

import { serverEnv } from '@/shared/config/env';
import type { DeliveryMeta } from '@/shared/forms/delivery';

import { CONSENT_VERSION, type Enquiry } from '../model/enquiry.schema';
import type { EnquiryProvider } from './enquiry.provider';

const ENDPOINT = 'https://api.resend.com/emails';

/**
 * Plain text rather than HTML, deliberately.
 *
 * Every line here is attacker-controlled: `message` is a free-text field a
 * stranger types. Composing HTML from it would mean escaping it correctly
 * forever, and the studio gains nothing from markup in an enquiry. Text has no
 * injection surface to get wrong.
 */
function compose(enquiry: Enquiry, meta: DeliveryMeta): string {
  return [
    `From:      ${enquiry.name} <${enquiry.email}>`,
    `Interest:  ${enquiry.service ?? 'Not specified'}`,
    `Received:  ${meta.submittedAt.toISOString()}`,
    `Reference: ${meta.correlationId}`,
    `Consent:   given, wording ${CONSENT_VERSION}`,
    '',
    enquiry.message,
  ].join('\n');
}

/**
 * Delivers an enquiry as an email through Resend's HTTP API.
 *
 * HTTP rather than SMTP because the Cloudflare Workers target cannot open SMTP
 * connections at all, and because sending as your own domain from a server
 * needs SPF and DKIM that a mailbox password does not provide. See
 * docs/DEPLOYMENT.md.
 *
 * `reply_to` is the enquirer, so the studio answers by hitting reply rather
 * than copying an address out of the body.
 */
export const resendProvider: EnquiryProvider = {
  name: 'resend',

  async deliver(enquiry: Enquiry, meta: DeliveryMeta) {
    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${serverEnv.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: serverEnv.ENQUIRY_FROM,
          to: [serverEnv.ENQUIRY_TO],
          reply_to: enquiry.email,
          subject: `Enquiry from ${enquiry.name}`,
          text: compose(enquiry, meta),
        }),
      });

      if (!response.ok) {
        /*
         * Resend's error body names the failure, and none of it is personal
         * data: it describes the request, not the enquirer. It is worth
         * keeping, because the two failures that matter in practice are an
         * invalid key and an unverified sending domain, and they are
         * indistinguishable from a bare status code.
         */
        const detail = await response.text().catch(() => '');
        return {
          delivered: false as const,
          reason: `resend responded ${response.status}${detail ? `: ${detail.slice(0, 300)}` : ''}`,
        };
      }

      const body = (await response.json().catch(() => null)) as { id?: string } | null;
      return { delivered: true as const, reference: body?.id };
    } catch (error) {
      // A network failure, not a rejection. The caller decides what the visitor sees.
      return {
        delivered: false as const,
        reason: `resend request failed: ${error instanceof Error ? error.message : 'unknown'}`,
      };
    }
  },
};
