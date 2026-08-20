/**
 * The single shape every form action returns.
 *
 * A discriminated union rather than a bag of optional fields: the UI has to
 * handle each case explicitly, so a state can never be silently forgotten.
 */
export type FormResult<Fields extends string = string> =
  | { status: 'idle' }
  | { status: 'success'; message: string }
  | {
      status: 'invalid';
      /** Field-level messages, keyed by input name. */
      errors: Partial<Record<Fields, string>>;
      message?: string;
    }
  | {
      status: 'error';
      message: string;
      /** Shown to the user so a support request can be traced to a log line. */
      correlationId?: string;
    };

export const idle = <Fields extends string>(): FormResult<Fields> => ({ status: 'idle' });

export const success = <Fields extends string>(message: string): FormResult<Fields> => ({
  status: 'success',
  message,
});

export const invalid = <Fields extends string>(
  errors: Partial<Record<Fields, string>>,
  message?: string,
): FormResult<Fields> => ({ status: 'invalid', errors, message });

export const failure = <Fields extends string>(
  message: string,
  correlationId?: string,
): FormResult<Fields> => ({ status: 'error', message, correlationId });
