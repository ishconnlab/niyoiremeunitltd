import mongoose from 'mongoose';
import 'dotenv/config';
import connectDB from './config/db.js';
import Admin from './models/Admin.js';
import Content from './models/Content.js';
import Job from './models/Job.js';
import Setting from './models/Setting.js';
import Service from './models/Service.js';
import BlogPost from './models/BlogPost.js';

const seed = async () => {
  try {
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD before seeding an admin account');
    await connectDB();
    console.log('MongoDB connected for seeding');

    // Seed super admin
    const adminEmail = process.env.ADMIN_EMAIL.trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD;

    let admin = await Admin.findOne({ email: adminEmail });
    if (!admin) {
      admin = await Admin.create({
        email: adminEmail,
        password: adminPassword,
        role: 'super_admin',
      });
      console.log('Super admin created:', adminEmail);
    } else {
      console.log('Super admin already exists:', adminEmail);
    }

    // Seed registration setting (disabled by default once admin exists)
    const regSetting = await Setting.findOne({ key: 'registrationEnabled' });
    if (!regSetting) {
      await Setting.create({
        key: 'registrationEnabled',
        value: false,
        description: 'Whether new admin registration is allowed',
      });
      console.log('Registration setting seeded: disabled');
    } else {
      console.log('Registration setting already exists:', regSetting.value);
    }

    // Seed initial content
    const initialContent = [
      {
        section: 'home', key: 'hero',
        value: {
          eyebrow: 'NIYO IREME UNIT',
          titleTop: 'FINISHING WORKS & INTERIOR',
          titleBottom: 'DESIGN',
          intro: "Your home's beauty and quality are our priority.",
          heroImage: '/projects/interior-finishing.jpg',
        },
        imageUrl: '/projects/interior-finishing.jpg', isActive: true, order: 0,
      },
      {
        section: 'home', key: 'process',
        value: { steps: [
          { title: 'Discuss your project', body: 'Tell us about the work, the property and the result you have in mind.' },
          { title: 'Agree the scope', body: 'Review the work and confirm selections, materials and site requirements.' },
          { title: 'Complete and review', body: 'Carry out the agreed work and review the finished scope together.' },
        ] },
        isActive: true, order: 1,
      },
      {
        section: 'about', key: 'company',
        value: {
          intro: "Your home's beauty and quality are our priority.",
          body1: 'NIYO IREME UNIT LTD provides home renovation, construction finishing and interior design services.',
          body2: 'Our work includes painting, tile installation, ceilings, terrazzo, wallpaper, glass installation and related construction finishing services.',
          body3: 'We discuss project requirements, agree the work scope and confirm material selections before work begins.',
        },
        isActive: true, order: 0,
      },
      {
        section: 'footer', key: 'footer',
        value: {
          description: "Your home's beauty and quality are our priority.",
          closingTagline: 'Quality. Precision. Excellence.',
        },
        isActive: true, order: 0,
      },
      {
        section: 'company', key: 'contact',
        value: { phoneDisplay: '+250 781 294 928', phoneRaw: '+250781294928', phoneAltDisplay: '0798 679 767', phoneAltRaw: '+250798679767', email: '', location: '' },
        isActive: true, order: 0,
      },
      {
        section: 'about', key: 'hero',
        value: { eyebrow: 'About NIYO IREME UNIT LTD', title: 'Finishing work centred on your home', subtitle: 'Home renovation, construction finishing and interior design services for residential and project needs.' },
        isActive: true, order: 0,
      },
      {
        section: 'services', key: 'hero',
        value: { eyebrow: 'NIYO IREME UNIT LTD', title: 'Services for your home and project', subtitle: 'Renovation, construction, finishing and project support, planned around the scope you need.' },
        isActive: true, order: 0,
      },
      {
        section: 'gallery', key: 'hero',
        value: { eyebrow: 'Our work', title: 'Project gallery', subtitle: 'Browse examples of renovation, construction and finishing work.' },
        isActive: true, order: 0,
      },
      {
        section: 'faq', key: 'hero',
        value: { eyebrow: 'Help and answers', title: 'Frequently asked questions', subtitle: 'Straight answers about our services and how to get started.' },
        isActive: true, order: 0,
      },
      {
        section: 'contact', key: 'hero',
        value: { eyebrow: 'Get in touch', title: 'Contact NIYO IREME UNIT LTD', subtitle: 'Tell us about the project or service you would like to discuss.' },
        isActive: true, order: 0,
      },
      {
        section: 'team', key: 'hero',
        value: { eyebrow: 'Our team', title: 'Construction and finishing professionals', subtitle: 'Contact us to discuss the people and skills needed for your project.' },
        isActive: true, order: 0,
      },
      {
        section: 'privacy', key: 'hero',
        value: { eyebrow: 'Website information', title: 'Privacy policy', subtitle: 'How information submitted through this website is handled.' },
        isActive: true, order: 0,
      },
      ...['facebook', 'instagram', 'youtube', 'x'].map((channel, index) => ({
        section: 'social', key: channel, value: { url: '' }, isActive: false, order: index,
      })),
      ...[
        ['/', 'NIYO IREME UNIT LTD | PRO FINISH • HOME RENOVATION', 'Home renovation, painting, interior design, tile and ceiling installation, finishing works and project support in Kigali.'],
        ['/about', 'About NIYO IREME UNIT LTD', 'Learn about NIYO IREME UNIT LTD and its renovation, construction finishing and interior design services.'],
        ['/services', 'Services | NIYO IREME UNIT LTD', 'Explore home renovation, construction finishing, painting, tile installation and project support services.'],
        ['/gallery', 'Project gallery | NIYO IREME UNIT LTD', 'Browse examples of renovation, construction and finishing work.'],
        ['/blog', 'Renovation and finishing guides | NIYO IREME UNIT LTD', 'Practical ideas about renovation planning, painting, tiling and finishing work.'],
        ['/contact', 'Contact NIYO IREME UNIT LTD', 'Contact NIYO IREME UNIT LTD to discuss renovation, construction finishing and interior design.'],
        ['/faq', 'Frequently asked questions | NIYO IREME UNIT LTD', 'Answers about services, project scope, materials and contacting NIYO IREME UNIT LTD.'],
        ['/quote', 'Request a quotation | NIYO IREME UNIT LTD', 'Share your project requirements to discuss scope and next steps.'],
        ['/team', 'Our team | NIYO IREME UNIT LTD', 'Construction workforce and project support from NIYO IREME UNIT LTD.'],
        ['/privacy', 'Privacy policy | NIYO IREME UNIT LTD', 'Information about how this website handles data submitted through its forms.'],
      ].map(([key, title, description], index) => ({
        section: 'seo', key, value: { title, description }, isActive: true, order: index,
      })),
      {
        section: 'services',
        key: 'equipment',
        value: {
          title: 'Construction Equipment Use and Rental',
          description:
            'We use modern construction equipment on our projects and rent available equipment to customers. Ask us about availability, specifications and rental arrangements.',
          points: [
            'Use of modern construction equipment on our projects.',
            'Rental of available construction equipment.',
            'Guidance on the right equipment for your work.',
            'Availability, specifications and rental terms confirmed on request.',
          ],
        },
        isActive: true,
        order: 1,
      },
      {
        section: 'services',
        key: 'workforce',
        value: {
          title: 'Worker Recruitment and Employer Matching',
          description:
            'We help employers find skilled and experienced workers, and we connect workers with employers according to the needs of both sides.',
          points: [
            'We help employers find skilled and experienced workers.',
            'We connect workers and employers according to the needs of both sides.',
          ],
        },
        isActive: true,
        order: 2,
      },
    ];

    for (const item of initialContent) {
      const exists = await Content.findOne({ section: item.section, key: item.key });
      if (!exists) {
        await Content.create(item);
        console.log('Content seeded:', item.section, item.key);
      } else if (
        item.section === 'home' && item.key === 'hero' &&
        exists.value?.titleTop === 'Quality workmanship' &&
        ['for every home', 'for every home we build'].includes(exists.value?.titleBottom)
      ) {
        // Migrate only the previous default hero copy; preserve any custom admin edits.
        exists.value = { ...(exists.value || {}), ...item.value };
        await exists.save();
        console.log('Updated default homepage hero copy');
      } else {
        console.log('Content already exists:', item.section, item.key);
      }
    }

    const benefitSeeds = [
      ['scope', 'Clear project scope', 'Discuss requirements and agree the work before it begins.'],
      ['finishing', 'Finishing services', 'Coordinate painting, tile installation, ceilings and other finishing work.'],
      ['materials', 'Material choices', 'Confirm material options and availability for the planned work.'],
      ['communication', 'Direct communication', 'Keep project questions and next steps clear throughout the work.'],
    ];
    for (const [index, [key, title, body]] of benefitSeeds.entries()) {
      if (!(await Content.exists({ section: 'benefits', key }))) await Content.create({ section: 'benefits', key, value: { title, body }, isActive: true, order: index });
    }

    const gallerySeed = [
      ['project-1', 'finishing', 'Interior finishing example', 'interior-finishing.jpg'],
      ['project-2', 'finishing', 'Finished interior living space', 'interior-living-space.jpg'],
      ['project-3', 'finishing', 'Interior finishing detail', 'interior-finishing-detail.jpg'],
      ['project-4', 'painting', 'Painting work example', 'painting-services.jpg'],
      ['project-5', 'painting', 'Painting renovation example', 'painting-renovation.jpg'],
      ['project-6', 'painting', 'Decorative wall paint example', 'wall-paint-facebook.jpg'],
      ['project-7', 'construction', 'Construction renovation example', 'construction-renovation.jpg'],
      ['project-8', 'construction', 'Construction drawing example', 'technical-drawing.jpg'],
      ['project-9', 'construction', 'Gypsum ceiling example', 'gypsum-ceilings.jpg'],
      ['project-10', 'construction', 'Ceiling design example', 'ceiling-design.jpg'],
      ['project-11', 'construction', 'Tile installation example', 'tile-installation-2.jpg'],
      ['project-12', 'construction', 'Tile finishing example', 'tile-installation-3.jpg'],
      ['project-13', 'construction', 'Tile installation work example', 'tile-installation-masons.jpg'],
      ['project-14', 'construction', 'Glass installation example', 'glass-installation.jpg'],
      ['project-15', 'construction', 'Glass finishing example', 'glass-installation-1.jpg'],
      ['project-16', 'construction', 'Wall plastering example', 'wall-plastering.jpg'],
      ['project-17', 'workforce', 'Construction workforce example', 'at-work.jpg'],
    ];
    for (const [index, [key, category, caption, filename]] of gallerySeed.entries()) {
      if (!(await Content.exists({ section: 'gallery', key }))) {
        await Content.create({ section: 'gallery', key, value: { category, caption, image: `/projects/${filename}` }, imageUrl: `/projects/${filename}`, isActive: true, order: index });
      }
    }

    const faqSeed = [
      ['faq-quote', 'general', 'How can I ask about a project?', 'Call or WhatsApp NIYO IREME UNIT LTD at +250 781 294 928, or use the contact form to describe the work you have in mind.'],
      ['faq-scope', 'finishing', 'How is the work scope agreed?', 'Share the type of work, the property requirements and any finish selections you have made. The project scope and materials can then be discussed before work begins.'],
      ['faq-materials', 'construction', 'Can you supply construction materials?', 'Construction materials and finishing supplies are among the company services. Contact us to confirm current product availability and pricing.'],
      ['faq-workforce', 'workforce', 'Can you help find construction workers?', 'NIYO IREME UNIT LTD offers construction workforce supply and worker and employer matching. Share the trade and project requirements to discuss suitable next steps.'],
    ];
    for (const [key, category, question, answer] of faqSeed) {
      if (!(await Content.exists({ section: 'faq', key }))) {
        await Content.create({ section: 'faq', key, value: { category, question, answer }, isActive: true, order: faqSeed.findIndex((item) => item[0] === key) });
      }
    }

    // Create the editable service catalogue only when a slug is not already present.
    // Existing admin-edited records are deliberately left untouched.
    const service = (slug, title, overview, imageNames, order, groups = {}) => ({
      slug, title, overview,
      description: groups.description || `${overview} We confirm the scope, site conditions, materials and final selections with you before work begins.`,
      problems: groups.problems || ['Unclear scope or finish requirements', 'The need to coordinate work with the rest of the project'],
      includedWork: groups.includedWork || ['Review the site and agree the work in writing', 'Prepare surfaces and protect nearby areas', 'Complete the agreed installation or finishing work', 'Review the finished work with you'],
      materials: groups.materials || ['Materials and equipment are selected for the agreed scope and confirmed before work starts'],
      workflow: ['Discuss the project and inspect the site', 'Confirm scope, selections and access', 'Schedule and complete the agreed work', 'Review the result and complete handover'],
      deliverables: ['Completed work within the agreed scope', 'A site handover with the work reviewed together'],
      benefits: ['Clear scope agreed before work starts', 'Work coordinated with the project requirements', 'Direct communication throughout the job'],
      costFactors: ['Site condition and preparation needs', 'Project size and agreed work scope', 'Materials and finish selections', 'Access, location and coordination requirements'],
      customization: ['Finishes and selections agreed to suit the property', 'Scope adjusted after a site review'],
      faqs: [], relatedServices: [],
      mainImage: `/projects/${imageNames[0]}`,
      gallery: imageNames.map((name, index) => ({ url: `/projects/${name}`, alt: `${title} example ${index + 1}` })),
      seoTitle: `${title} in Kigali | NIYO IREME UNIT LTD`,
      seoDescription: `${overview} Contact NIYO IREME UNIT LTD in Kigali to discuss your project.`,
      status: 'published', isActive: true, showOnHomePage: order <= 6, order,
    });
    const initialServices = [
      service('construction', 'Home Renovation and Remodeling', 'Plan and complete home renovation, remodeling and construction work to an agreed scope.', ['construction-renovation.jpg', 'at-work.jpg', 'technical-drawing.jpg'], 1, { includedWork: ['Site review and scope planning', 'Renovation and construction work agreed for the property', 'Coordination of finishing trades', 'Handover review'] }),
      service('finishing', 'Construction and Finishing Works', 'Coordinate construction finishing work, surface preparation and installation for building projects.', ['interior-finishing.jpg', 'interior-finishing-detail.jpg', 'wall-plastering.jpg'], 2),
      service('painting', 'Interior and Exterior Painting', 'Prepare and paint interior and exterior surfaces with finishes selected for the property.', ['painting-services.jpg', 'painting-renovation.jpg', 'wall-paint-facebook.jpg'], 3, { includedWork: ['Surface inspection and preparation', 'Protection of adjacent areas', 'Application of agreed paint finishes', 'Final touch-up and review'] }),
      service('interior-design', 'Interior Design and Decoration', 'Plan interior layouts, colour choices and decorative finishes around the space and client preferences.', ['interior-living-space.jpg', 'interior-finishing.jpg', 'ceiling-design.jpg'], 4),
      service('tiling', 'Tile Installation', 'Install floor and wall tiles with attention to layout, substrate preparation and finishing details.', ['tile-installation-3.jpg', 'tile-installation-2.jpg', 'tile-installation-masons.jpg'], 5),
      service('ceilings', 'Ceiling and Plasterboard Installation', 'Install and finish gypsum and plasterboard ceilings for residential and commercial interiors.', ['gypsum-ceilings.jpg', 'ceiling-design.jpg', 'interior-finishing-detail.jpg'], 6),
      service('terrazzo', 'Terrazzo Installation and Finishing', 'Discuss terrazzo finishes and surface work suited to the project requirements.', ['tile-installation-masons.jpg', 'interior-finishing-detail.jpg', 'construction-renovation.jpg'], 7),
      service('wallpaper', 'Wallpaper Installation', 'Prepare walls and install selected wallpaper with careful alignment and edge finishing.', ['interior-finishing-detail.jpg', 'interior-living-space.jpg', 'painting-services.jpg'], 8),
      service('glass', 'Glass Installation', 'Install glass windows, panels and partitions according to the agreed site requirements.', ['glass-installation.jpg', 'glass-installation-1.jpg', 'interior-living-space.jpg'], 9),
      service('plastering', 'Plastering and Skimming', 'Prepare and level wall surfaces with plastering, skimming and related surface finishing work.', ['wall-plastering.jpg', 'construction-renovation.jpg', 'at-work.jpg'], 10),
      service('supervision', 'Construction Project Management', 'Coordinate project activities, progress reviews and quality checks within the agreed scope.', ['technical-drawing.jpg', 'at-work.jpg', 'construction-renovation.jpg'], 11),
      service('workforce', 'Construction Workforce Supply', 'Help employers find construction and finishing workers suited to their stated project needs.', ['at-work.jpg', 'technical-drawing.jpg', 'construction-renovation.jpg'], 12),
      service('workforce-matching', 'Worker and Employer Matching', 'Connect workers and employers and discuss trade, experience, project location and duration.', ['at-work.jpg', 'tile-installation-masons.jpg', 'wall-plastering.jpg'], 13),
      service('equipment', 'Construction Equipment Rental', 'Ask about available construction equipment, specifications, rental arrangements and project fit.', ['construction-renovation.jpg', 'technical-drawing.jpg', 'at-work.jpg'], 14),
      service('cleaning', 'Professional Cleaning Services', 'Arrange property and post-renovation cleaning for the agreed areas and handover needs.', ['interior-finishing-detail.jpg', 'interior-living-space.jpg', 'painting-renovation.jpg'], 15),
      service('materials', 'Construction Materials and Supplies', 'Ask about available construction and finishing materials, product options and current prices.', ['painting-services.jpg', 'tile-installation-2.jpg', 'construction-renovation.jpg'], 16),
      service('project-photography', 'Project Photography and Documentation', 'Discuss project progress photography and visual documentation for agreed work stages.', ['technical-drawing.jpg', 'at-work.jpg', 'interior-finishing.jpg'], 17),
    ];
    for (const item of initialServices) {
      if (!(await Service.exists({ slug: item.slug }))) await Service.create(item);
    }

    const initialArticles = [
      {
        title: 'How to plan a home renovation', slug: 'planning-a-home-renovation',
        excerpt: 'A clear scope, practical priorities and coordinated decisions make renovation planning easier.',
        body: 'Start by listing the changes you need and separating essential repairs from optional upgrades. Walk through each room and note visible damage, access constraints and items that need protection.\n\nAgree the work sequence before finishes are selected. Surface repairs, ceiling work and major installations need to be coordinated before final decoration and cleaning.\n\nAsk for a written scope that identifies what is included, materials to be confirmed and any work that depends on a site inspection.',
        featuredImage: { url: '/projects/construction-renovation.jpg', alt: 'Renovation and construction example' },
        categories: ['trends', 'renovation'], tags: ['renovation', 'planning'], featured: true,
        author: 'NIYO IREME UNIT LTD', status: 'published', publishedAt: new Date('2026-10-20'),
        seoTitle: 'How to Plan a Home Renovation | NIYO IREME UNIT LTD', seoDescription: 'Plan a renovation with a clear scope, practical priorities and coordinated finish selections.',
      },
      {
        title: 'Preparing walls before painting', slug: 'preparing-walls-for-painting',
        excerpt: 'A durable paint finish starts with clean, sound and suitably prepared surfaces.',
        body: 'Before painting, inspect walls for loose material, cracks, moisture and uneven areas. Preparation depends on the existing surface and finish selected.\n\nProtect floors, furniture, fittings and nearby surfaces. Remove dust and allow repaired areas to dry before applying a compatible primer or finish.\n\nColour, sheen, product choice and surface condition all affect the result. Discuss the room and its use before selecting products, especially in areas exposed to moisture or frequent cleaning.',
        featuredImage: { url: '/projects/painting-renovation.jpg', alt: 'Paint preparation and finishing example' },
        categories: ['trends', 'painting'], tags: ['painting', 'surface preparation'], featured: true,
        author: 'NIYO IREME UNIT LTD', status: 'published', publishedAt: new Date('2026-10-12'),
        seoTitle: 'Preparing Walls Before Painting | NIYO IREME UNIT LTD', seoDescription: 'Learn what to check and prepare before choosing an interior or exterior paint finish.',
      },
      {
        title: 'What to consider when choosing tiles', slug: 'choosing-tiles-for-a-room',
        excerpt: 'Room use, surface preparation, tile layout and grout selection all matter to a finished installation.',
        body: 'Begin with how the room is used and the surface where tiles will be installed. Wet areas, floors and walls can have different practical requirements, so confirm product suitability with the supplier.\n\nMeasure the area and plan the layout before installation. Tile size, pattern, edge details and cut placement affect the finished appearance. The substrate must also be checked and prepared for the selected tile system.\n\nAllow time to review samples in the room lighting and confirm tile, grout and trim selections before work starts.',
        featuredImage: { url: '/projects/tile-installation-3.jpg', alt: 'Tile installation example' },
        categories: ['trends', 'tiling'], tags: ['tiles', 'interior finishing'], featured: false,
        author: 'NIYO IREME UNIT LTD', status: 'published', publishedAt: new Date('2026-10-04'),
        seoTitle: 'Choosing Tiles for a Room | NIYO IREME UNIT LTD', seoDescription: 'Review room use, layout and surface preparation when selecting tiles for a project.',
      },
    ];
    for (const article of initialArticles) {
      if (!(await BlogPost.exists({ slug: article.slug }))) await BlogPost.create(article);
    }

    // Seed initial jobs
    const initialJobs = [
      {
        title: 'Mason',
        description: 'Skilled mason for residential and commercial construction projects.',
        location: 'Kigali, Rwanda',
        type: 'full-time',
        category: 'construction',
        isActive: true,
      },
      {
        title: 'Painter',
        description: 'Professional painter for interior and exterior finishing work.',
        location: 'Kigali, Rwanda',
        type: 'full-time',
        category: 'painting',
        isActive: true,
      },
      {
        title: 'Tile Installer',
        description: 'Experienced tile installer for floors and walls.',
        location: 'Gasabo District, Kigali',
        type: 'contract',
        category: 'tiling',
        isActive: true,
      },
    ];

    for (const job of initialJobs) {
      const exists = await Job.findOne({ title: job.title, category: job.category });
      if (!exists) {
        await Job.create(job);
        console.log('Job seeded:', job.title);
      } else {
        console.log('Job already exists:', job.title);
      }
    }

    console.log('Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seed();

