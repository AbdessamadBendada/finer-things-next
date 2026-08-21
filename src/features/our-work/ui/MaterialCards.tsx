import { Media } from '@/shared/ui/Media';

import type { MaterialCard } from '../content/materials.content';

/**
 * A grid of material cards: photograph, name, and copy that arrives on hover.
 *
 * The name and a scrim are always on screen so the row can be read at a
 * glance; hovering deepens the scrim and lifts the paragraph in. That was the
 * treatment chosen in review over "everything always visible" (too much type
 * over the photography) and "nothing until hover" (unreadable on a phone).
 *
 * Touch has no hover, so the paragraph is simply shown from the start below
 * the hover breakpoint. See the `.material-card` block in brand.css. The card
 * is not a link and holds no controls, so nothing here is reachable only by
 * hovering.
 */
export function MaterialCards({
  cards,
  columns,
}: {
  cards: readonly MaterialCard[];
  /** 3 for the materials grid, 2 for the finishing details. */
  columns: 2 | 3;
}) {
  return (
    <div className="material-grid" data-columns={columns}>
      {cards.map((card, index) => (
        <figure
          className="material-card rise"
          key={`${card.name}-${index}`}
          {...(card.placeholder ? { 'data-placeholder': 'true' } : {})}
        >
          <Media src={card.image} alt={card.alt} />
          <figcaption className="material-copy">
            <h3>{card.name}</h3>
            {/* The wrapper is what collapses. A hidden paragraph that still
                occupied its own height pushed each name to a different
                position, so the row of names sat visibly unaligned. */}
            <div className="material-reveal">
              <p>{card.copy}</p>
            </div>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
