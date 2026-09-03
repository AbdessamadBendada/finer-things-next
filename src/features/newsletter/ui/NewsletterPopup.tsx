'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from 'react';

import { ROUTES } from '@/shared/config/routes';
import { Media } from '@/shared/ui/Media';

import styles from './NewsletterPopup.module.css';
import { NewsletterForm } from './NewsletterForm';

const ENGAGED_DELAY_MS = 15_000;
const PASSIVE_DELAY_MS = 40_000;
const SCROLL_THRESHOLD = 0.5;
const DISMISSED_KEY = 'finer-things.newsletter-popup.dismissed';
const SUBSCRIBED_KEY = 'finer-things.newsletter-popup.subscribed';
const CLOSE_DURATION_MS = 500;

/**
 * Routes the invitation stays away from.
 *
 * Contact is the important one: someone part-way through writing an enquiry is
 * already doing the thing the whole site is asking for, and a modal over a
 * half-filled form is the surest way to lose it. The legal pages are excluded
 * because interrupting someone reading a privacy policy to ask for their email
 * is a poor look.
 */
const EXCLUDED_ROUTES = new Set<string>([ROUTES.contact, ROUTES.privacy, ROUTES.terms]);

type ScrollLockState = {
  bodyOverflow: string;
  bodyPosition: string;
  bodyTop: string;
  bodyWidth: string;
  rootOverflow: string;
  scrollY: number;
};

/**
 * Two kinds of "no", remembered for two different lengths of time.
 *
 * Closing the dialog means "not now": it is forgotten when the tab closes, so
 * a later visit may ask again. Subscribing means "never again", and outlives
 * the session, because asking someone to join a list they already joined reads
 * as a site that is not paying attention.
 *
 * Both are per browser and per device, which is the limit of doing this
 * without accounts. A subscriber on a laptop is a stranger on a phone.
 */
function alreadyHandled() {
  try {
    return (
      window.localStorage.getItem(SUBSCRIBED_KEY) === 'true' ||
      window.sessionStorage.getItem(DISMISSED_KEY) === 'true'
    );
  } catch {
    return false;
  }
}

function rememberDismissal() {
  try {
    window.sessionStorage.setItem(DISMISSED_KEY, 'true');
  } catch {
    // Storage can be unavailable in private or restricted browsing contexts.
  }
}

function rememberSubscribed() {
  try {
    window.localStorage.setItem(SUBSCRIBED_KEY, 'true');
  } catch {
    // Same restricted contexts; the popup simply asks again next time.
  }
}

export function NewsletterPopup() {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const scrollLockRef = useRef<ScrollLockState | null>(null);
  const hasOpenedRef = useRef(false);
  const [visible, setVisible] = useState(false);

  const lockPageScroll = useCallback(() => {
    if (scrollLockRef.current) return;

    const root = document.documentElement;
    const body = document.body;
    const scrollY = window.scrollY;
    scrollLockRef.current = {
      bodyOverflow: body.style.overflow,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyWidth: body.style.width,
      rootOverflow: root.style.overflow,
      scrollY,
    };

    root.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';
  }, []);

  const unlockPageScroll = useCallback(() => {
    const lock = scrollLockRef.current;
    if (!lock) return;

    const root = document.documentElement;
    const body = document.body;
    root.style.overflow = lock.rootOverflow;
    body.style.overflow = lock.bodyOverflow;
    body.style.position = lock.bodyPosition;
    body.style.top = lock.bodyTop;
    body.style.width = lock.bodyWidth;
    scrollLockRef.current = null;
    window.scrollTo(0, lock.scrollY);
  }, []);

  const close = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog?.open || closeTimerRef.current !== null) return;

    rememberDismissal();
    setVisible(false);
    const closeDuration = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 0
      : CLOSE_DURATION_MS;
    closeTimerRef.current = window.setTimeout(() => {
      dialog.close();
      unlockPageScroll();
      closeTimerRef.current = null;
    }, closeDuration);
  }, [unlockPageScroll]);

  const rememberSubscription = useCallback(() => {
    rememberSubscribed();
    rememberDismissal();
  }, []);

  useEffect(() => {
    if (alreadyHandled() || EXCLUDED_ROUTES.has(pathname)) return;

    let timeReady = false;
    let hasScrolled = window.scrollY > 0;

    /*
     * The same escape hatch the rotating artisan imagery uses. The visual gate
     * walks every page to trigger its reveals, which scrolls past the 50%
     * threshold and opens this dialog; the modal then covers the page and
     * locks the body, so the capture is of the popup rather than the page.
     *
     * Read at open time rather than on mount, because the suite injects the
     * stylesheet after this component has mounted and armed its timers.
     * Nothing in the application sets it. See the freeze note in
     * tests/visual/pages.ts.
     */
    const suppressed = () =>
      getComputedStyle(document.documentElement)
        .getPropertyValue('--suppress-newsletter-popup')
        .trim() === '1';

    const open = () => {
      const dialog = dialogRef.current;
      if (!dialog || hasOpenedRef.current || suppressed()) return;

      hasOpenedRef.current = true;
      dialog.showModal();
      lockPageScroll();
      window.requestAnimationFrame(() => setVisible(true));
    };

    const readScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = scrollable <= 0 ? 0 : window.scrollY / scrollable;
      hasScrolled = hasScrolled || window.scrollY > 0;

      if (scrollProgress >= SCROLL_THRESHOLD || (timeReady && hasScrolled)) open();
    };

    const engagedTimer = window.setTimeout(() => {
      timeReady = true;
      if (hasScrolled) open();
    }, ENGAGED_DELAY_MS);
    const passiveTimer = window.setTimeout(open, PASSIVE_DELAY_MS);

    readScroll();
    window.addEventListener('scroll', readScroll, { passive: true });

    return () => {
      window.clearTimeout(engagedTimer);
      window.clearTimeout(passiveTimer);
      window.removeEventListener('scroll', readScroll);
      if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
      unlockPageScroll();
    };
  }, [pathname, lockPageScroll, unlockPageScroll]);

  const handleBackdropClick = (event: ReactMouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) close();
  };

  return (
    <dialog
      ref={dialogRef}
      className={`${styles.dialog}${visible ? ` ${styles.visible}` : ''}`}
      aria-labelledby="newsletter-popup-title"
      aria-describedby="newsletter-popup-description"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={handleBackdropClick}
    >
      <div className={styles.panel}>
        <div className={styles.image}>
          <Media
            src="/assets/new-work-marsa-lobby-11.webp"
            alt="Layered decorative details in the Marsa Al Arab lobby"
            sizes="(max-width: 700px) 100vw, 42vw"
          />
        </div>

        <div className={styles.content}>
          <button className={styles.close} type="button" onClick={close} aria-label="Close">
            <span aria-hidden="true">×</span>
          </button>
          <div className={styles.eyebrow}>Stay connected</div>
          <h2 id="newsletter-popup-title">A considered note, occasionally.</h2>
          <p id="newsletter-popup-description" className={styles.description}>
            New projects, objects and stories from Finer Things, shared when there is something
            worth sharing.
          </p>
          <NewsletterForm
            className={styles.form}
            idPrefix="newsletterPopup"
            onSuccess={rememberSubscription}
          />
          <p className={styles.privacy}>
            How we handle your details is explained in our{' '}
            <Link href={ROUTES.privacy}>Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </dialog>
  );
}
