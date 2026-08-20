import { z } from 'zod';

/** The four options offered on the contact form, in display order. */
export const ENQUIRY_SERVICES = [
  'Bespoke Accessories',
  'Styling and Curation',
  'Finer Living',
  'General Enquiry',
] as const;

export type EnquiryService = (typeof ENQUIRY_SERVICES)[number];

/**
 * The single source of truth for enquiry validation.
 *
 * This exact schema runs in two places: through `zodResolver` in the browser
 * for immediate feedback, and again inside the Server Action before anything
 * is delivered. The client pass is a convenience; the server pass is the
 * security boundary, and it never trusts what the browser sent.
 */
export const enquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Please tell us your name.')
    .max(80, 'That name is longer than we can store.'),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(160, 'That address is longer than we can store.')
    .email('Please enter an email address we can reply to.'),

  /**
   * Optional. An unchecked radio group reports an empty string rather than
   * `undefined`, and `z.enum().optional()` rejects that — which silently
   * blocked every enquiry from anyone who did not pick an interest. The
   * empty string is normalised here so both sides agree.
   */
  service: z
    .union([z.enum(ENQUIRY_SERVICES), z.literal('')])
    .optional()
    .transform((value) => (value === '' ? undefined : value)),

  message: z
    .string()
    .trim()
    .min(20, 'A sentence or two about the project helps us reply properly.')
    .max(2000, 'Please keep the note under 2000 characters.'),

  /**
   * Honeypot. Real people never see this field, so any value at all means the
   * submission was automated. Kept even though bot protection is deferred to
   * the edge: it costs nothing and catches naive scripts.
   */
  company: z.string().max(0).optional(),
});

/** What the action receives after parsing — `service` is normalised. */
export type Enquiry = z.output<typeof enquirySchema>;

/**
 * What the form holds before parsing. React Hook Form works with this shape,
 * which is why it is a separate type: an unchecked radio group is `''` here
 * and `undefined` by the time the action sees it.
 */
export type EnquiryInput = z.input<typeof enquirySchema>;

export type EnquiryField = keyof Enquiry;

/** The shape RHF holds before validation, so inputs stay controlled. */
export const emptyEnquiry: EnquiryInput = {
  name: '',
  email: '',
  service: '',
  message: '',
  company: '',
};
