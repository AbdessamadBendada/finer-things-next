import styles from './FieldError.module.css';

/**
 * Inline validation message.
 *
 * The legacy forms had no error styling at all, so this is the one piece of
 * UI the migration adds. It is drawn entirely from the existing type scale and
 * the page's own accent colour, and it renders nothing until something is
 * actually wrong — so a clean form is still pixel-identical to the original.
 */
export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p className={styles.fieldError} id={id} role="alert">
      {message}
    </p>
  );
}

/** ARIA wiring for an input that may be showing an error. */
export const errorProps = (id: string, message?: string) =>
  ({
    'aria-invalid': message ? true : undefined,
    'aria-describedby': message ? id : undefined,
  }) as const;
