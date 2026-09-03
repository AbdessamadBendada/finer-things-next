'use client';

import Link from 'next/link';
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
const CLOSE_DURATION_MS = 500;

type ScrollLockState = {
  bodyOverflow: string;
  bodyPosition: string;
  bodyTop: string;
  bodyWidth: string;
  rootOverflow: string;
  scrollY: number;
};

function dismissedThisSession() {
  try {
    return window.sessionStorage.getItem(DISMISSED_KEY) === 'true';
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

export function NewsletterPopup() {
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
    rememberDismissal();
  }, []);

  useEffect(() => {
    if (dismissedThisSession()) return;

    let timeReady = false;
    let hasScrolled = window.scrollY > 0;

    const open = () => {
      const dialog = dialogRef.current;
      if (!dialog || hasOpenedRef.current) return;

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
  }, [lockPageScroll, unlockPageScroll]);

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
