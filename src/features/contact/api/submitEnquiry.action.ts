'use server';

import { z } from 'zod';

import { noopBotProtection } from '@/shared/forms/delivery';
import { failure, invalid, success, type FormResult } from '@/shared/forms/result';
import { createCorrelationId, logger } from '@/shared/observability/logger';

import { enquirySchema, type EnquiryField } from '../model/enquiry.schema';
import { enquiryProvider } from './enquiry.provider';

export type EnquiryResult = FormResult<EnquiryField>;

/**
 * Handles a contact enquiry.
 *
 * The pipeline is deliberately linear and identical for both forms:
 *   parse -> bot check -> deliver -> log -> typed result.
 *
 * It is invoked as a plain `<form action>`, so it works before hydration and
 * with JavaScript disabled; React Hook Form layers inline validation on top
 * but is never required for correctness.
 */
export async function submitEnquiry(
  _previous: EnquiryResult,
  formData: FormData,
): Promise<EnquiryResult> {
  const correlationId = createCorrelationId();

  const parsed = enquirySchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    service: formData.get('service') ?? undefined,
    message: formData.get('message'),
    company: formData.get('company') ?? undefined,
  });

  if (!parsed.success) {
    const flattened = z.flattenError(parsed.error).fieldErrors;
    const errors = Object.fromEntries(
      Object.entries(flattened).map(([field, messages]) => [field, messages?.[0]]),
    ) as Partial<Record<EnquiryField, string>>;

    // The honeypot is invisible, so a failure there is a bot, not a person.
    // It is answered with the ordinary success message rather than an error.
    if (errors.company) {
      logger.log({ event: 'enquiry.rejected', correlationId, context: { reason: 'honeypot' } });
      return success('Thank you. Your enquiry is on its way.');
    }

    logger.log({
      event: 'enquiry.invalid',
      level: 'warn',
      correlationId,
      context: { fields: Object.keys(errors) },
    });
    return invalid(errors, 'Please check the highlighted fields.');
  }

  if (!(await noopBotProtection.verify(undefined))) {
    return failure('We could not verify this submission. Please try again.', correlationId);
  }

  try {
    const provider = enquiryProvider();
    const outcome = await provider.deliver(parsed.data, {
      correlationId,
      submittedAt: new Date(),
    });

    if (!outcome.delivered) {
      logger.log({
        event: 'enquiry.undelivered',
        level: 'error',
        correlationId,
        context: { provider: provider.name, reason: outcome.reason },
      });
      return failure(
        'We could not send your enquiry just now. Please try again, or email us directly.',
        correlationId,
      );
    }

    logger.log({
      event: 'enquiry.delivered',
      correlationId,
      context: { provider: provider.name },
    });

    return success('Thank you. Your enquiry is on its way, and we will reply personally.');
  } catch (error) {
    logger.log({
      event: 'enquiry.failed',
      level: 'error',
      correlationId,
      // The message only; a stack could contain the payload.
      context: { reason: error instanceof Error ? error.message : 'unknown' },
    });
    return failure(
      'Something went wrong at our end. Please try again in a moment.',
      correlationId,
    );
  }
}
