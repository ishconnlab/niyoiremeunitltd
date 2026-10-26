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

export const CLIENT_REVIEWS: ClientReview[] = [];

