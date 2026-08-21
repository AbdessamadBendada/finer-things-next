import type { RegisteredImage } from '@/shared/config/image-registry';

export type MaterialCard = {
  name: string;
  copy: string;
  image: RegisteredImage;
  alt: string;
  /** Marks a card standing in until the client supplies its own. */
  placeholder?: true;
};

/**
 * The materials, paraphrased from finerthingsdesigns.com/pages/materials.
 *
 * Reworded rather than copied, with the meaning kept intact. Two small fixes
 * to the source, neither of which changes what is being said: the shells entry
 * on the live site ends "the natural elegance of these precious metals", which
 * belongs to the metal entry, and the colour list there reads "azure and,
 * sienna".
 *
 * The imagery is the same material photography the home hero already uses, so
 * a visitor meets marble, leather and wood on the first screen and then reads
 * about them here.
 */
export const MATERIALS: readonly MaterialCard[] = [
  {
    name: 'Marble',
    copy: 'Marble is the epitome of sophistication and refinement, blending the classic with the contemporary. It belongs beside leather: one versatile and culturally current, the other a byword for luxury and style. Our collection spans a range of colours and a variety of finishes.',
    image: '/assets/hero7.webp',
    alt: 'Stacked marble and stone samples in several colours and finishes',
  },
  {
    name: 'Lustrous Leather',
    copy: 'Leather has been worked for centuries and is known for its durability and versatility. Long associated with luxury and style, it gives a refined and sophisticated finish. Our selection covers a wide range of choices and textures, for products that feel unique and elegant.',
    image: '/assets/hero6.webp',
    alt: 'Rolls of leather in tan, grey and deep brown',
  },
  {
    name: 'Wood',
    copy: 'Our accessories are crafted from a variety of premium woods, among them rich walnut, smooth maple and sturdy oak. Available in a range of finishes, each design carries a sense of warmth and familiarity.',
    image: '/assets/hero5.webp',
    alt: 'Wood samples in varied grains and tones',
  },
  {
    name: 'Metal',
    copy: 'Our pieces are celebrated for their timeless character. Metallic finishes set against leather create a striking contrast while keeping the whole in balance. With multiple finishes available, we work towards the most harmonious pairing possible.',
    image: '/assets/hero1.webp',
    alt: 'Brushed metal swatches in brass, copper and steel',
  },
  {
    name: 'Elegant Shells',
    copy: 'Discover the rare beauty of embellishment in textured and colourful shells, worked with care to bring out the natural elegance of the material.',
    image: '/assets/hero2.webp',
    alt: 'Polished mother of pearl shell discs',
  },
  /*
   * Six cards make two even rows of three, and the client has supplied five.
   * This repeats marble until the sixth arrives. It is flagged rather than
   * quietly duplicated so it cannot ship unnoticed: search `placeholder` to
   * find it. See docs/FEEDBACK.md.
   */
  {
    name: 'Marble',
    copy: 'Marble is the epitome of sophistication and refinement, blending the classic with the contemporary. It belongs beside leather: one versatile and culturally current, the other a byword for luxury and style. Our collection spans a range of colours and a variety of finishes.',
    image: '/assets/hero7.webp',
    alt: 'Stacked marble and stone samples in several colours and finishes',
    placeholder: true,
  },
];

/**
 * The two finishing details, kept separate from the materials above because
 * they are choices made on a material rather than materials themselves.
 */
export const DETAILS: readonly MaterialCard[] = [
  {
    name: 'Exclusive Styles',
    copy: 'The Finer Things colour palette is infinite, with hundreds of colours available, ranging from tasteful neutrals and bold greyscales to hues of coral, fuchsia, azure and sienna. The plethora of shades creates an array of endless possibilities.',
    image: '/assets/hero4.webp',
    alt: 'Folded fabric swatches in coral, azure, fuchsia and neutral tones',
  },
  {
    name: 'Stitching',
    copy: 'With a range of options available, the smaller details can often be the most impactful. Whether it is a clean tone on tone leather or a contrasting colour, we create a piece that reflects your taste.',
    image: '/assets/hero3.webp',
    alt: 'Wooden spools of thread in several colours',
  },
];

/** The journey from first conversation to a finished, installed piece. */
export const PROCESS_STEPS: readonly string[] = [
  'Initial Research & Contextual Understanding',
  'Scouting unique partnerships & concept development with artisans',
  'Initial Design Pitching',
  'Prototyping & Sampling',
  'Production & Craftsmanship Execution',
  'Delivery & Seamless Installation',
  'Ongoing Support & Post-Completion Service',
];
