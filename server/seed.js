import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from './models/Admin.js';
import Content from './models/Content.js';
import Job from './models/Job.js';
import Setting from './models/Setting.js';

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding');

    // Seed super admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@niyoiremeunitltd.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminNiyoIreme2026!';

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
      } else {
        console.log('Content already exists:', item.section, item.key);
      }
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

