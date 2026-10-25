import { TeamMember } from '../types';

/**
 * The leadership and the teams that carry out our work.
 *
 * No personal names, years of experience or certificates are listed here:
 * NIYO IREME UNIT COMPANY LTD presents the roles and responsibilities that
 * run on every site rather than invented credentials. All copy lives in
 * `src/i18n/locales/en.json` and `src/i18n/locales/rw.json` under
 * `team.members.<id>`.
 */

/**
 * The managing director (CEO) of NIYO IREME UNIT COMPANY LTD.
 *
 * The portrait is an illustrative photograph: replace `image` with the
 * official photograph and drop the `photoNoteKey` copy once it is available.
 */
export const LEADERSHIP: TeamMember = {
  id: 'leadership',
  image:
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80',
  imageAltKey: 'team.members.leadership.imageAlt',
  roleKey: 'team.members.leadership.role',
  specialtyKey: 'team.members.leadership.specialty',
  bioKey: 'team.members.leadership.bio',
  badgeKey: 'team.members.leadership.badge',
  photoNoteKey: 'team.members.leadership.photoNote',
  responsibilityKeys: [
    'team.members.leadership.responsibilities.0',
    'team.members.leadership.responsibilities.1',
    'team.members.leadership.responsibilities.2',
    'team.members.leadership.responsibilities.3',
  ],
};

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'supervision',
    image:
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=900&q=80',
    imageAltKey: 'team.members.supervision.imageAlt',
    roleKey: 'team.members.supervision.role',
    specialtyKey: 'team.members.supervision.specialty',
    bioKey: 'team.members.supervision.bio',
    badgeKey: 'team.members.supervision.badge',
    responsibilityKeys: [
      'team.members.supervision.responsibilities.0',
      'team.members.supervision.responsibilities.1',
      'team.members.supervision.responsibilities.2',
    ],
  },
  {
    id: 'finishing',
    image:
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80',
    imageAltKey: 'team.members.finishing.imageAlt',
    roleKey: 'team.members.finishing.role',
    specialtyKey: 'team.members.finishing.specialty',
    bioKey: 'team.members.finishing.bio',
    badgeKey: 'team.members.finishing.badge',
    responsibilityKeys: [
      'team.members.finishing.responsibilities.0',
      'team.members.finishing.responsibilities.1',
      'team.members.finishing.responsibilities.2',
    ],
  },
  {
    id: 'painting',
    image:
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=900&q=80',
    imageAltKey: 'team.members.painting.imageAlt',
    roleKey: 'team.members.painting.role',
    specialtyKey: 'team.members.painting.specialty',
    bioKey: 'team.members.painting.bio',
    badgeKey: 'team.members.painting.badge',
    responsibilityKeys: [
      'team.members.painting.responsibilities.0',
      'team.members.painting.responsibilities.1',
      'team.members.painting.responsibilities.2',
    ],
  },
  {
    id: 'workforce',
    image:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80',
    imageAltKey: 'team.members.workforce.imageAlt',
    roleKey: 'team.members.workforce.role',
    specialtyKey: 'team.members.workforce.specialty',
    bioKey: 'team.members.workforce.bio',
    badgeKey: 'team.members.workforce.badge',
    responsibilityKeys: [
      'team.members.workforce.responsibilities.0',
      'team.members.workforce.responsibilities.1',
      'team.members.workforce.responsibilities.2',
    ],
  },
];

