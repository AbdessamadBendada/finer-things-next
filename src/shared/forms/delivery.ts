import 'server-only';

/**
 * Generic delivery contract shared by every form.
 *
 * Features declare their own provider port in terms of these types — the
 * shared layer never learns what an enquiry or a subscription contains.
 */
export type DeliveryOutcome =
  { delivered: true; reference?: string } | { delivered: false; reason: string };

export type DeliveryMeta = {
  correlationId: string;
  submittedAt: Date;
};

/** A provider that can deliver a payload of type `Payload`. */
export type DeliveryProvider<Payload> = {
  readonly name: string;
  deliver(payload: Payload, meta: DeliveryMeta): Promise<DeliveryOutcome>;
};

/**
 * Bot protection seam.
 *
 * Currently a no-op by decision: abuse control lives at the Cloudflare edge
 * rather than in application code. The seam stays so a Turnstile adapter can
 * be added without touching any action.
 * See docs/adr/0003-deferred-bot-protection.md.
 */
export type BotProtection = {
  readonly name: string;
  verify(token: string | undefined): Promise<boolean>;
};

export const noopBotProtection: BotProtection = {
  name: 'noop',
  verify: async () => true,
};
