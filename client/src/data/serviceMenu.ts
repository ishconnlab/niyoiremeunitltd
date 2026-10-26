export interface ServiceMenuItem {
  slug: string;
  title: string;
  overview?: string;
}

export interface ServiceMenuGroup {
  id: string;
  title: string;
  iconName: string;
  services: ServiceMenuItem[];
}

const GROUPS: Array<Omit<ServiceMenuGroup, 'services'> & { slugs: string[] }> = [
  { id: 'renovation', title: 'Renovation & construction', iconName: 'Building2', slugs: ['construction', 'finishing', 'plastering', 'supervision'] },
  { id: 'interior-finishing', title: 'Interior finishing', iconName: 'Paintbrush2', slugs: ['painting', 'interior-design', 'tiling', 'ceilings', 'terrazzo', 'wallpaper', 'glass'] },
  { id: 'project-support', title: 'Project support', iconName: 'ClipboardList', slugs: ['workforce', 'workforce-matching', 'cleaning', 'project-photography'] },
  { id: 'equipment-supplies', title: 'Equipment & supplies', iconName: 'ShoppingBag', slugs: ['equipment', 'materials'] },
];

/** Group active service records into a two-level navigation menu. */
export function groupServicesForMenu(items: ServiceMenuItem[]): ServiceMenuGroup[] {
  const remaining = new Map(items.map((item) => [item.slug, item]));
  const groups = GROUPS.map(({ slugs, ...group }) => ({
    ...group,
    services: slugs.flatMap((slug) => {
      const service = remaining.get(slug);
      if (!service) return [];
      remaining.delete(slug);
      return [service];
    }),
  })).filter((group) => group.services.length > 0);

  if (remaining.size > 0) {
    groups.push({
      id: 'more-services',
      title: 'More services',
      iconName: 'Building2',
      services: [...remaining.values()].sort((a, b) => a.title.localeCompare(b.title)),
    });
  }

  return groups;
}
