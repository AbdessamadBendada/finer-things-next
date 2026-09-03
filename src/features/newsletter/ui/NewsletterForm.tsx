'use client';

import { useEffect } from 'react';

import { errorProps, FieldError } from '@/shared/forms/FieldError';
import { Honeypot } from '@/shared/forms/Honeypot';
import { useFormAction } from '@/shared/forms/useFormAction';

import { subscribe } from '../api/subscribe.action';
import {
  emptySubscription,
  subscriptionSchema,
  type Subscription,
} from '../model/subscription.schema';

type NewsletterFormProps = {
  className?: string;
  idPrefix?: string;
  onSuccess?: () => void;
};

export function NewsletterForm({ className, idPrefix, onSuccess }: NewsletterFormProps = {}) {
  const { form, state, pending, blocked, formProps } = useFormAction<Subscription>({
    action: subscribe,
    schema: subscriptionSchema,
    defaultValues: emptySubscription,
  });

  const message = form.formState.errors.email?.message;
  const status =
    blocked ?? (state.status === 'success' || state.status === 'error' ? state.message : '');
  const formId = idPrefix ? `${idPrefix}Form` : 'newsletterForm';
  const emailId = idPrefix ? `${idPrefix}Email` : 'newsletterEmail';
  const errorId = idPrefix ? `${idPrefix}Error` : 'newsletter-error';

  useEffect(() => {
    if (state.status === 'success') onSuccess?.();
  }, [onSuccess, state.status]);

  return (
    <form
      {...formProps}
      className={`newsletter-form${className ? ` ${className}` : ''}`}
      id={formId}
      aria-busy={pending}
    >
      <label htmlFor={emailId} hidden>
        Email address
      </label>
      <input
        id={emailId}
        type="email"
        autoComplete="email"
        placeholder="Your email address"
        {...errorProps(errorId, message)}
        {...form.register('email')}
      />
      <button type="submit" disabled={pending}>
        {pending ? 'Sending…' : 'Subscribe'}
      </button>
      <Honeypot name="newsletterCompany" />
      <FieldError id={errorId} message={message} />
      <p className="status" role="status" aria-live="polite">
        {status}
      </p>
    </form>
  );
}
