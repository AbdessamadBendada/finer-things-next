export type NavLink = {
  href: string;
  label: string;
  /** Renders `aria-current="page"` on the link for the page you are on. */
  current?: boolean;
};

/** In-page anchors stay plain <a>; only route changes go through <Link>. */
export const isAnchorLink = (href: string): boolean => href.startsWith('#');
