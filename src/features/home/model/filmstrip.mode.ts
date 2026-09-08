/**
 * Which featured-work presentation the home page uses.
 *
 * Two complete implementations ship side by side so the choice can be reversed
 * in one line while the client reviews it.
 *
 * `scroll` — the original. A 400svh section with a sticky pin, where vertical
 *   scroll is mapped to horizontal travel. Client review found it confusing:
 *   the page stops advancing for four screens with no indication of how long
 *   that lasts.
 *
 * `slider` — a native horizontal scroller with snap points, arrows and a
 *   position counter. Vertical scroll stays vertical. Swiping, trackpads and
 *   the keyboard all work without any interception, and the section costs one
 *   screen instead of four.
 *
 * Flip this constant to switch. Nothing else needs to change: the markup, the
 * styling and the motion all branch on it.
 */
export type FilmstripMode = 'slider' | 'scroll';

export const FILMSTRIP_MODE: FilmstripMode = 'slider';
