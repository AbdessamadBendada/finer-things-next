import 'server-only';

import { logger } from '@/shared/observability/logger';

import type { DeliveryProvider } from './delivery';

/**
 * The adapter every form currently runs against.
 *
 * It validates and records that a submission arrived, then reports success —
 * so the whole pipeline (schema, action, error handling, UI states) is real
 * and exercised, with only the final hop left to connect.
 *
 * `redact` decides what is safe to record. It defaults to nothing at all: no
 * form payload is logged unless a feature explicitly says which non-personal
 * fields may be.
 */
export function createLoggingProvider<Payload>(
  name: string,
  redact: (payload: Payload) => Record<string, unknown> = () => ({}),
): DeliveryProvider<Payload> {
  return {
    name: `log:${name}`,
    async deliver(payload, meta) {
      logger.log({
        event: `${name}.received`,
        correlationId: meta.correlationId,
        context: {
          provider: 'log',
          submittedAt: meta.submittedAt.toISOString(),
          ...redact(payload),
        },
      });

      return { delivered: true, reference: meta.correlationId };
    },
  };
}
