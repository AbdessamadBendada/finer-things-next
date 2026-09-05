'use client';

import { errorProps, FieldError } from '@/shared/forms/FieldError';
import { Honeypot } from '@/shared/forms/Honeypot';
import { useFormAction } from '@/shared/forms/useFormAction';

import { subscribe } from '../api/subscribe.action';
import {
  emptySubscription,
  subscriptionSchema,
  type Subscription,
} from '../model/subscription.schema';

export function NewsletterForm() {
  const { form, state, pending, blocked, formProps } = useFormAction<Subscription>({
    action: subscribe,
    schema: subscriptionSchema,
    defaultValues: emptySubscription,
  });

  const message = form.formState.errors.email?.message;
  const status =
    blocked ?? (state.status === 'success' || state.status === 'error' ? state.message : '');
  return (
    <form {...formProps} className="newsletter-form" id="newsletterForm" aria-busy={pending}>
      <label htmlFor="newsletterEmail" hidden>
        Email address
      </label>
      <input
        id="newsletterEmail"
        type="email"
        autoComplete="email"
        placeholder="Your email address"
        {...errorProps('newsletter-error', message)}
        {...form.register('email')}
      />
      <button type="submit" disabled={pending}>
        {pending ? 'Sending…' : 'Subscribe'}
      </button>
      <Honeypot name="newsletterCompany" />
      <FieldError id="newsletter-error" message={message} />
      <p className="status" role="status" aria-live="polite">
        {status}
      </p>
    </form>
  );
}
