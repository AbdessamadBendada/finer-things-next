'use server';

import { z } from 'zod';

import { failure, invalid, success, type FormResult } from '@/shared/forms/result';
import { createCorrelationId, logger } from '@/shared/observability/logger';

import { subscriptionSchema, type SubscriptionField } from '../model/subscription.schema';
import { subscriptionProvider } from './subscription.provider';

export type SubscriptionResult = FormResult<SubscriptionField>;

/** Newsletter sign-up. Mirrors submitEnquiry — see that file for the pipeline. */
export async function subscribe(
  _previous: SubscriptionResult,
  formData: FormData,
): Promise<SubscriptionResult> {
  const correlationId = createCorrelationId();

  const parsed = subscriptionSchema.safeParse({
    email: formData.get('email'),
    company: formData.get('company') ?? undefined,
  });

  if (!parsed.success) {
    const flattened = z.flattenError(parsed.error).fieldErrors;
    const errors = Object.fromEntries(
      Object.entries(flattened).map(([field, messages]) => [field, messages?.[0]]),
    ) as Partial<Record<SubscriptionField, string>>;

    if (errors.company) {
      logger.log({
        event: 'subscription.rejected',
        correlationId,
        context: { reason: 'honeypot' },
      });
      return success('Thank you for subscribing.');
    }

    return invalid(errors);
  }

  try {
    const provider = subscriptionProvider();
    const outcome = await provider.deliver(parsed.data, {
      correlationId,
      submittedAt: new Date(),
    });

    if (!outcome.delivered) {
      logger.log({
        event: 'subscription.undelivered',
        level: 'error',
        correlationId,
        context: { provider: provider.name, reason: outcome.reason },
      });
      return failure('We could not sign you up just now. Please try again.', correlationId);
    }

    logger.log({
      event: 'subscription.delivered',
      correlationId,
      context: { provider: provider.name },
    });

    return success('Thank you. We will be in touch occasionally, and never often.');
  } catch (error) {
    logger.log({
      event: 'subscription.failed',
      level: 'error',
      correlationId,
      context: { reason: error instanceof Error ? error.message : 'unknown' },
    });
    return failure('Something went wrong at our end. Please try again.', correlationId);
  }
}
