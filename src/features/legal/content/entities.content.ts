export type LegalEntity = {
  /** Anchor id, and the target of the reading index link. */
  id: string;
  /** Short jurisdiction label used as the section heading. */
  jurisdiction: string;
  /** Registered company name, exactly as the client supplied it. */
  name: string;
  /** Address lines, broken where the client broke them. */
  address: readonly string[];
  /** Label and value pairs: VAT, EORI, licence and tax numbers. */
  registrations: ReadonlyArray<{ label: string; value: string }>;
};

/**
 * The three companies behind Finer Things, supplied by the client 2026-10-10.
 *
 * An imprint has to name the operating entity, and here there are three across
 * two jurisdictions: an Austrian GmbH, a Dubai free zone company and a Dubai
 * mainland LLC. Which one legally operates this website is a question for the
 * client's counsel, not a judgement to make in a content file, so all three are
 * listed with their own registration numbers rather than one being promoted.
 *
 * Verbatim from the client's figures. Nothing here is normalised or corrected:
 * these are register entries, and a tidied VAT number is a wrong VAT number.
 * One known oddity is carried through as supplied and flagged in the review
 * notes: the mainland address reads "DIGIBIZ BUSIENSS CENTER".
 */
export const LEGAL_ENTITIES: readonly LegalEntity[] = [
  {
    id: 'austria',
    jurisdiction: 'Austria',
    name: 'Finer Things GmbH',
    /* The client's block repeated the company name as its first line; it is
       already the heading of this entry, so only the address follows. */
    address: ['Erdbergstrasse 10/64', '1030 Vienna', 'Austria'],
    registrations: [
      { label: 'UID No.', value: 'ATU79879017' },
      { label: 'EORI No.', value: 'ATEOS 1000141441' },
    ],
  },
  {
    id: 'free-zone',
    jurisdiction: 'United Arab Emirates, Dubai free zone',
    name: 'FINER THINGS DESIGNS FZCO',
    address: ['IFZA Business Park', 'DDP, PO Box 342001', 'Dubai', 'United Arab Emirates'],
    registrations: [
      { label: 'Licence number', value: '89295' },
      { label: 'TRN', value: '105563226700001' },
    ],
  },
  {
    id: 'mainland',
    jurisdiction: 'United Arab Emirates, Dubai mainland',
    name: 'Finer Things Decoration Materials L.L.C.',
    address: [
      'DIGIBIZ BUSIENSS CENTER L.L.C (BRANCH)',
      'Al Suq Al Kabeer, Unit R118 - OF204',
      'Dubai',
      'United Arab Emirates',
    ],
    registrations: [
      { label: 'Licence number', value: '1639535' },
      { label: 'TRN', value: '105563226700003' },
    ],
  },
];
