'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  useActionState,
  useEffect,
  useRef,
  useState,
  useTransition,
  type FormEvent,
} from 'react';
import {
  useForm,
  type DefaultValues,
  type FieldValues,
  type Path,
  type UseFormReturn,
} from 'react-hook-form';
import type { ZodType } from 'zod';

import { idle, type FormResult } from './result';

type UseFormActionOptions<Values extends FieldValues> = {
  /** The Server Action. Must accept `(previousState, formData)`. */
  action: (
    state: FormResult<Extract<keyof Values, string>>,
    formData: FormData,
  ) => Promise<FormResult<Extract<keyof Values, string>>>;
  /** The same schema the action validates with. That is the whole point. */
  schema: ZodType<unknown, Values>;
  defaultValues: DefaultValues<Values>;
};

type UseFormActionReturn<Values extends FieldValues> = {
  form: UseFormReturn<Values>;
  state: FormResult<Extract<keyof Values, string>>;
  pending: boolean;
  /** Set when submission was blocked by an error with no inline message. */
  blocked: string | null;
  /** Spread onto the <form> element. */
  formProps: {
    action: (formData: FormData) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    noValidate: true;
  };
};

/**
 * Wires one Zod schema to both sides of a form.
 *
 * Progressive enhancement is the point of the arrangement:
 *
 *   - `action` is a real Server Action on the <form>, so with JavaScript
 *     disabled — or before hydration finishes — the form posts and the server
 *     validates it. Nothing about correctness depends on the client.
 *   - once hydrated, `onSubmit` takes over: React Hook Form validates against
 *     the same schema first and only then invokes the action, so a mistyped
 *     address never costs a round trip.
 *   - whatever the server rejects is mapped back onto the offending field, so
 *     server-side failures land on the right input rather than in a banner.
 *
 * `noValidate` suppresses the browser's own bubbles: the schema is the single
 * definition of what is valid, and native validation would contradict it.
 */
export function useFormAction<Values extends FieldValues>({
  action,
  schema,
  defaultValues,
}: UseFormActionOptions<Values>): UseFormActionReturn<Values> {
  type Fields = Extract<keyof Values, string>;

  const [state, formAction] = useActionState(action, idle<Fields>());
  const [pending, startTransition] = useTransition();
  const lastHandled = useRef<FormResult<Fields> | null>(null);

  /**
   * Fallback for a validation failure on a field that renders no message of
   * its own. Without this the form just stops responding, which is exactly
   * how a silently-unsubmittable enquiry form shipped once already.
   */
  const [blocked, setBlocked] = useState<string | null>(null);

  const form = useForm<Values>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- resolver generics
    resolver: zodResolver(schema as any),
    defaultValues,
    mode: 'onBlur',
  });

  const { setError, reset } = form;

  useEffect(() => {
    if (state === lastHandled.current) return;
    lastHandled.current = state;

    if (state.status === 'invalid') {
      for (const [field, message] of Object.entries(state.errors)) {
        if (message) setError(field as Path<Values>, { type: 'server', message });
      }
    }

    if (state.status === 'success') reset(defaultValues);
    // `defaultValues` is a stable literal at the call site.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, setError, reset]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    const element = event.currentTarget;
    event.preventDefault();

    void form.handleSubmit(
      () => {
        setBlocked(null);
        startTransition(() => formAction(new FormData(element)));
      },
      (errors) => {
        // If every offending field shows its own message, the inline errors
        // are enough. If any does not, say so rather than doing nothing.
        const silent = Object.entries(errors).filter(([, error]) => !error?.message);
        setBlocked(
          silent.length
            ? 'Please review the form. One of the answers could not be accepted.'
            : null,
        );
      },
    )(event);
  };

  return {
    form,
    state,
    pending,
    blocked,
    formProps: { action: formAction, onSubmit, noValidate: true },
  };
}
