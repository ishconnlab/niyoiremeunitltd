/**
 * Client feedback.
 *
 * NIYO IREME UNIT COMPANY LTD publishes feedback only from clients whose
 * project we completed, so the list starts empty and is filled with real,
 * verifiable quotes. Add an entry per published review:
 *
 *   {
 *     id: 'kimironko-finishing',
 *     attributionKey: 'reviews.entries.kimironkoFinishing.attribution',
 *     projectKey: 'reviews.entries.kimironkoFinishing.project',
 *     quoteKey: 'reviews.entries.kimironkoFinishing.quote',
 *     rating: 5,
 *   }
 *
 * The matching copy lives in `src/i18n/locales/en.json` and `rw.json` under
 * `reviews.entries.<id>`. The landing page renders whatever is in this list,
 * so no placeholder or invented testimonial is ever shown.
 */
export interface ClientReview {
  id: string;
  /** Who the feedback comes from, e.g. "Homeowner, Kimironko". */
  attributionKey: string;
  /** The project the feedback refers to. */
  projectKey: string;
  /** The review itself. */
  quoteKey: string;
  /** Quality mark from 1 to 5, drawn as technical ticks rather than stars. */
  rating: number;
}

export const CLIENT_REVIEWS: ClientReview[] = [
  {
    id: 'arice-kicukiro',
    attributionKey: 'reviews.entries.ariceKicukiro.attribution',
    projectKey: 'reviews.entries.ariceKicukiro.project',
    quoteKey: 'reviews.entries.ariceKicukiro.quote',
    rating: 5,
  },
  {
    id: 'joseline-rusororo',
    attributionKey: 'reviews.entries.joselineRusororo.attribution',
    projectKey: 'reviews.entries.joselineRusororo.project',
    quoteKey: 'reviews.entries.joselineRusororo.quote',
    rating: 5,
  },
  {
    id: 'jack-murugando',
    attributionKey: 'reviews.entries.jackMurugando.attribution',
    projectKey: 'reviews.entries.jackMurugando.project',
    quoteKey: 'reviews.entries.jackMurugando.quote',
    rating: 5,
  },
  {
    id: 'ingabire-noroveje',
    attributionKey: 'reviews.entries.ingabireNoroveje.attribution',
    projectKey: 'reviews.entries.ingabireNoroveje.project',
    quoteKey: 'reviews.entries.ingabireNoroveje.quote',
    rating: 5,
  },
  {
    id: 'kalekez-bumbogo',
    attributionKey: 'reviews.entries.kalekezBumbogo.attribution',
    projectKey: 'reviews.entries.kalekezBumbogo.project',
    quoteKey: 'reviews.entries.kalekezBumbogo.quote',
    rating: 5,
  },
];
