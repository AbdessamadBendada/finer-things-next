import 'server-only';

import { serverEnv } from '@/shared/config/env';
import type { DeliveryMeta } from '@/shared/forms/delivery';

import type { Subscription } from '../model/subscription.schema';
import type { SubscriptionProvider } from './subscription.provider';

const ENDPOINT = 'https://connect.mailerlite.com/api/subscribers';

/**
 * Adds an address to MailerLite as **unconfirmed**.
 *
 * This is the whole reason MailerLite is here rather than a plain email API.
 * `status: 'unconfirmed'` makes MailerLite send its own confirmation email and
 * withhold the address from the list until the person clicks it, which is the
 * double opt-in adr/0002 requires. Building that here instead would mean
 * storing half-finished signups, and this project has no database to store
 * them in.
 *
 * It depends on one account setting: double opt-in must be enabled for API and
 * integrations in MailerLite. With it off, an unconfirmed subscriber is created
 * and no confirmation is ever sent, so nobody ever joins and nothing looks
 * broken. That is the failure mode to check first if signups stop arriving.
 */
export const mailerliteProvider: SubscriptionProvider = {
  name: 'mailerlite',

  async deliver(subscription: Subscription, _meta: DeliveryMeta) {
    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${serverEnv.MAILERLITE_API_KEY}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email: subscription.email,
          groups: [serverEnv.MAILERLITE_GROUP_ID],
          status: 'unconfirmed',
        }),
      });

      if (!response.ok) {
        // Describes the request, not the person. No address is included.
        const detail = await response.text().catch(() => '');
        return {
          delivered: false as const,
          reason: `mailerlite responded ${response.status}${detail ? `: ${detail.slice(0, 300)}` : ''}`,
        };
      }

      const body = (await response.json().catch(() => null)) as {
        data?: { id?: string; status?: string };
      } | null;
      return { delivered: true as const, reference: body?.data?.id };
    } catch (error) {
      return {
        delivered: false as const,
        reason: `mailerlite request failed: ${error instanceof Error ? error.message : 'unknown'}`,
      };
    }
  },
};
