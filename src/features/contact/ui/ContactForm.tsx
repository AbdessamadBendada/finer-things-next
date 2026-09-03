'use client';

import { errorProps, FieldError } from '@/shared/forms/FieldError';
import { Honeypot } from '@/shared/forms/Honeypot';
import { useFormAction } from '@/shared/forms/useFormAction';

import Link from 'next/link';

import { ROUTES } from '@/shared/config/routes';

import { submitEnquiry } from '../api/submitEnquiry.action';
import {
  CONSENT_TEXT,
  emptyEnquiry,
  ENQUIRY_SERVICES,
  enquirySchema,
  type EnquiryInput,
} from '../model/enquiry.schema';

/** Display labels for the service options; the values are the schema's. */
const SERVICE_LABELS: Record<(typeof ENQUIRY_SERVICES)[number], string> = {
  'Bespoke Accessories': 'Bespoke',
  'Styling and Curation': 'Styling & Curation',
  'Finer Living': 'Finer Living',
  'General Enquiry': 'Something else',
};

export function ContactForm() {
  const { form, state, pending, blocked, formProps } = useFormAction<EnquiryInput>({
    action: submitEnquiry,
    schema: enquirySchema,
    defaultValues: emptyEnquiry,
  });

  const { errors } = form.formState;
  const submitted = state.status === 'success';

  // Server-level failures have no field to attach to, so they surface on the
  // same status line that reports success.
  const statusMessage =
    blocked ?? (state.status === 'success' || state.status === 'error' ? state.message : '');

  return (
    <form
      {...formProps}
      className={submitted ? 'form submitted' : 'form'}
      id="contactForm"
      aria-busy={pending}
    >
      <div className="field">
        <label htmlFor="name">Your name</label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          placeholder="Name and surname"
          {...errorProps('name-error', errors.name?.message)}
          {...form.register('name')}
        />
        <FieldError id="name-error" message={errors.name?.message} />
      </div>

      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="name@company.com"
          {...errorProps('email-error', errors.email?.message)}
          {...form.register('email')}
        />
        <FieldError id="email-error" message={errors.email?.message} />
      </div>

      <fieldset className="interest">
        <legend className="interest-title">I’m interested in</legend>
        <div className="choices">
          {ENQUIRY_SERVICES.map((service) => (
            <label className="choice" key={service}>
              <input type="radio" value={service} {...form.register('service')} />
              <span>{SERVICE_LABELS[service]}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="field">
        <label htmlFor="message">Tell us about your project</label>
        <textarea
          id="message"
          placeholder="The place, its story, location and timing"
          {...errorProps('message-error', errors.message?.message)}
          {...form.register('message')}
        />
        <FieldError id="message-error" message={errors.message?.message} />
      </div>

      <Honeypot />

      {/* adr/0002: unchecked by default, tied to the privacy policy, and the
          wording version travels with the submission. The passive notice this
          replaced asserted agreement rather than asking for it. */}
      <div className="field field-consent">
        <label className="consent" htmlFor="consent">
          <input
            id="consent"
            type="checkbox"
            {...errorProps('consent-error', errors.consent?.message)}
            {...form.register('consent')}
          />
          <span>
            {CONSENT_TEXT} See our <Link href={ROUTES.privacy}>Privacy Policy</Link>.
          </span>
        </label>
        <FieldError id="consent-error" message={errors.consent?.message} />
      </div>

      <div className="form-bottom">
        <button className="submit" type="submit" disabled={pending}>
          {pending ? 'Sending…' : 'Send enquiry →'}
        </button>
        <p className="status" id="formStatus" role="status" aria-live="polite">
          {statusMessage}
        </p>
      </div>

      {state.status === 'error' && state.correlationId && (
        <p className="privacy-note">Reference: {state.correlationId}</p>
      )}

      <p className="privacy-note">
        The wording above is a placeholder pending legal review. See docs/PRELAUNCH.md.
      </p>
    </form>
  );
}
