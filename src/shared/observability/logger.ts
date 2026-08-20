import 'server-only';

export type LogLevel = 'info' | 'warn' | 'error';

export type LogEvent = {
  /** Dot-separated event name, e.g. `enquiry.submitted`. */
  event: string;
  level?: LogLevel;
  /** Ties a user-visible failure to its log line without exposing details. */
  correlationId?: string;
  /** Structured context. Must never contain personal data — see below. */
  context?: Record<string, unknown>;
};

export type Logger = {
  log(event: LogEvent): void;
};

/**
 * Structured console logger.
 *
 * Deliberately a port with one implementation: swapping in Sentry, Axiom or
 * Datadog later is a new adapter and an environment variable, with no call
 * site changed. See docs/adr/0004-observability-port.md.
 *
 * Personal data must never be passed in `context`. Names, email addresses and
 * message bodies are the one thing a log line must not carry; a correlation id
 * is enough to trace a failure end to end.
 */
const consoleLogger: Logger = {
  log({ event, level = 'info', correlationId, context }) {
    const payload = JSON.stringify({
      event,
      level,
      ...(correlationId ? { correlationId } : {}),
      ...(context ? { context } : {}),
      at: new Date().toISOString(),
    });

    if (level === 'error') console.error(payload);
    else if (level === 'warn') console.warn(payload);
    else console.log(payload);
  },
};

export const logger: Logger = consoleLogger;

/** Short, unguessable id used to correlate a user-facing error with a log. */
export const createCorrelationId = (): string =>
  globalThis.crypto.randomUUID().replaceAll('-', '').slice(0, 12);
