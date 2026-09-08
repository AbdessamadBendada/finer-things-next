import type { RegisteredImage } from '@/shared/config/image-registry';

export type MaterialCard = {
  name: string;
  copy: string;
  image: RegisteredImage;
  alt: string;
};

/**
 * The materials, from the photography the client supplied.
 *
 * This replaces a set paraphrased from their old website. It is a different
 * list: no marble and no metal, and horn, lacquer, resin and fabric are new.
 * The copy is written to the photographs rather than carried over, because
 * four of the six cards previously described materials that are not in the
 * set they sent.
 *
 * Nine were supplied and six are shown, which fills two even rows and retires
 * the duplicate that stood in while only five existed. Stitching moved to the
 * finishing details below, where it belongs: it is a choice made on leather
 * rather than a material of its own. Fabric and glass are held back for the
 * same reason space allows only six, and are the first candidates if this
 * grows to nine.
 */
export const MATERIALS: readonly MaterialCard[] = [
  {
    name: 'Lustrous Leather',
    copy: 'Worked for centuries and known for its durability, leather takes colour and texture like nothing else. Our selection runs from smooth full-grain to open suede, in a range wide enough that a piece can be matched to a room rather than approximated.',
    image: '/assets/new-material-leather.webp',
    alt: 'A rolled leather edge, close, with contrast saddle stitching',
  },
  {
    name: 'Wood',
    copy: 'Rich walnut, pale oak, smooth maple. Cut, turned and finished so the grain is part of the design rather than a surface it happens to have, and warm in the hand in a way no other material manages.',
    image: '/assets/new-material-wood.webp',
    alt: 'Cut lengths of walnut, oak and maple stacked on a workbench',
  },
  {
    name: 'Horn',
    copy: 'No two plates are alike. Polished horn moves from honey through amber to near black in the space of a single piece, which is why we use it where a repeated pattern would flatten the work.',
    image: '/assets/new-material-horn.webp',
    alt: 'Polished horn plates, banded from honey through amber to black',
  },
  {
    name: 'Lacquer',
    copy: 'Built in many thin coats and polished between each one, until the surface reads as depth rather than shine. It suits the pieces that should be quiet in a room and hold the eye when it arrives.',
    image: '/assets/new-material-lacquer.webp',
    alt: 'The corner of a deep oxblood lacquered box, mirror-polished',
  },
  {
    name: 'Resin',
    copy: 'Poured, cured and cut, with pigment, gold leaf or nothing at all suspended inside. Resin takes the character we ask of it, which makes it the most exact of the materials we work in.',
    image: '/assets/new-material-resin.webp',
    alt: 'Cast resin panels, some clouded, some with gold leaf suspended inside',
  },
  {
    name: 'Elegant Shells',
    copy: 'Mother of pearl, cut and laid by hand. The light in it changes as you move past, so a surface that is quiet from one chair is luminous from the next.',
    image: '/assets/new-material-shell.webp',
    alt: 'Cut mother-of-pearl tiles, iridescent against a pale ground',
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
    image: '/assets/new-material-fabric.webp',
    alt: 'Linen and leather swatches in neutrals, olive and oxblood',
  },
  {
    name: 'Stitching',
    copy: 'With a range of options available, the smaller details can often be the most impactful. Whether it is a clean tone on tone leather or a contrasting colour, we create a piece that reflects your taste.',
    image: '/assets/new-material-stitching.webp',
    alt: 'Contrast saddle stitching running along a leather edge',
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
