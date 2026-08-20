import styles from './Honeypot.module.css';

/**
 * A field no human ever fills in.
 *
 * Positioned off-screen rather than `display: none`, since the simplest bots
 * skip hidden inputs but happily complete positioned ones. Hidden from
 * assistive technology and removed from the tab order, so it is invisible to
 * real users by every measure that matters.
 */
export function Honeypot({ name = 'company' }: { name?: string }) {
  return (
    <div className={styles.honeypot} aria-hidden="true">
      <label htmlFor={`${name}-hp`}>Company</label>
      <input
        id={`${name}-hp`}
        name={name}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
      />
    </div>
  );
}
