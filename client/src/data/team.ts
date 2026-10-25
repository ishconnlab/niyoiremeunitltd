import { TeamMember } from '../types';

/**
 * Team members of NIYO IREME UNIT COMPANY LTD.
 *
 * Names and roles are taken from the client-supplied roster. Roles marked
 * "(to be confirmed)" are supplied verbatim from informal messages and must
 * be verified before publication. No phone numbers or WhatsApp contacts are
 * included yet ” individual numbers must be supplied by the company before
 * call/WhatsApp buttons are enabled for any member.
 *
 * Photographs are initials-based SVG placeholders. Replace each `/assets/team/<id>.svg`
 * path with the official team photograph once supplied.
 */

export const LEADERSHIP: TeamMember = {
  id: 'leadership',
  name: 'Managing Director',
  image: '/assets/team/cyuzuzo-ella-kevine.svg',
  imageAltKey: 'team.leadership.imageAlt',
  roleKey: 'team.leadership.role',
  specialtyKey: 'team.leadership.specialty',
  bioKey: 'team.leadership.bio',
  badgeKey: 'team.leadership.badge',
  photoNoteKey: 'team.leadership.photoNote',
  responsibilityKeys: [
    'team.leadership.responsibilities.0',
    'team.leadership.responsibilities.1',
    'team.leadership.responsibilities.2',
    'team.leadership.responsibilities.3',
  ],
};

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'cyuzuzo-ella-kevine',
    name: 'Cyuzuzo Ella Kevine',
    image: '/assets/team/cyuzuzo-ella-kevine.svg',
    imageAltKey: 'team.members.cyuzuzo-ella-kevine.imageAlt',
    roleKey: 'team.members.cyuzuzo-ella-kevine.role',
    specialtyKey: 'team.members.cyuzuzo-ella-kevine.specialty',
    bioKey: 'team.members.cyuzuzo-ella-kevine.bio',
    badgeKey: 'team.members.cyuzuzo-ella-kevine.badge',
    phone: '+250798679767',
    whatsapp: '250798679767',
    responsibilityKeys: [
      'team.members.cyuzuzo-ella-kevine.responsibilities.0',
      'team.members.cyuzuzo-ella-kevine.responsibilities.1',
    ],
  },
  {
    id: 'niyoshuti-izaac',
    name: 'Niyoshuti Izaac',
    image: '/assets/team/niyoshuti-izaac.svg',
    imageAltKey: 'team.members.niyoshuti-izaac.imageAlt',
    roleKey: 'team.members.niyoshuti-izaac.role',
    specialtyKey: 'team.members.niyoshuti-izaac.specialty',
    bioKey: 'team.members.niyoshuti-izaac.bio',
    badgeKey: 'team.members.niyoshuti-izaac.badge',
    phone: '+250791932833',
    whatsapp: '250791932833',
    responsibilityKeys: [
      'team.members.niyoshuti-izaac.responsibilities.0',
    ],
  },
  {
    id: 'niyonsenga-claude',
    name: 'Niyonsenga Claude',
    image: '/assets/team/niyonsenga-claude.svg',
    imageAltKey: 'team.members.niyonsenga-claude.imageAlt',
    roleKey: 'team.members.niyonsenga-claude.role',
    specialtyKey: 'team.members.niyonsenga-claude.specialty',
    bioKey: 'team.members.niyonsenga-claude.bio',
    badgeKey: 'team.members.niyonsenga-claude.badge',
    responsibilityKeys: [],
  },
  {
    id: 'kontabure-mouse-byukusenge',
    name: 'Kontabure Mouse Byukusenge',
    image: '/assets/team/kontabure.svg',
    imageAltKey: 'team.members.kontabure-mouse-byukusenge.imageAlt',
    roleKey: 'team.members.kontabure-mouse-byukusenge.role',
    specialtyKey: 'team.members.kontabure-mouse-byukusenge.specialty',
    bioKey: 'team.members.kontabure-mouse-byukusenge.bio',
    badgeKey: 'team.members.kontabure-mouse-byukusenge.badge',
    responsibilityKeys: [
      'team.members.kontabure-mouse-byukusenge.responsibilities.0',
      'team.members.kontabure-mouse-byukusenge.responsibilities.1',
    ],
  },
  {
    id: 'pascali',
    name: 'Pascali',
    image: '/assets/team/paskali.svg',
    imageAltKey: 'team.members.pascali.imageAlt',
    roleKey: 'team.members.pascali.role',
    specialtyKey: 'team.members.pascali.specialty',
    bioKey: 'team.members.pascali.bio',
    badgeKey: 'team.members.pascali.badge',
    responsibilityKeys: [
      'team.members.pascali.responsibilities.0',
    ],
  },
  {
    id: 'shimiyimana-samuel',
    name: 'Shimiyimana Samuel',
    image: '/assets/team/shimiyimana-samwer.svg',
    imageAltKey: 'team.members.shimiyimana-samuel.imageAlt',
    roleKey: 'team.members.shimiyimana-samuel.role',
    specialtyKey: 'team.members.shimiyimana-samuel.specialty',
    bioKey: 'team.members.shimiyimana-samuel.bio',
    badgeKey: 'team.members.shimiyimana-samuel.badge',
    phone: '+250785762278',
    whatsapp: '250785762278',
    responsibilityKeys: [
      'team.members.shimiyimana-samuel.responsibilities.0',
    ],
  },
  {
    id: 'hahirwa-basenga-saimoni-pitabyukusenge',
    name: 'Hahirwa Basenga Saimoni Pitabyukusenge',
    image: '/assets/team/hahirwa-basenga-saimoni-pitabyukusenge.svg',
    imageAltKey: 'team.members.hahirwa-basenga-saimoni-pitabyukusenge.imageAlt',
    roleKey: 'team.members.hahirwa-basenga-saimoni-pitabyukusenge.role',
    specialtyKey: 'team.members.hahirwa-basenga-saimoni-pitabyukusenge.specialty',
    bioKey: 'team.members.hahirwa-basenga-saimoni-pitabyukusenge.bio',
    badgeKey: 'team.members.hahirwa-basenga-saimoni-pitabyukusenge.badge',
    responsibilityKeys: [
      'team.members.hahirwa-basenga-saimoni-pitabyukusenge.responsibilities.0',
    ],
  },
];
