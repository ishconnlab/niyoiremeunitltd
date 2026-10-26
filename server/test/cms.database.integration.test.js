import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mongoose from 'mongoose';
import app from '../app.js';
import Admin from '../models/Admin.js';
import BlogPost from '../models/BlogPost.js';
import Content from '../models/Content.js';
import Service from '../models/Service.js';
import Setting from '../models/Setting.js';

const testUri = process.env.MONGODB_TEST_URI;
const publicImage = (suffix) => ({ url: `https://images.example.test/${suffix}.jpg`, alt: `${suffix} example` });

test('authenticated service, blog, publishing, contacts and media workflows', { skip: !testUri && 'Set MONGODB_TEST_URI to a disposable database whose name includes test.' }, async () => {
  const parsedUri = new URL(testUri);
  const databaseName = parsedUri.pathname.replace(/^\//, '').split('?')[0];
  assert.match(databaseName, /test/i, 'MONGODB_TEST_URI must point to a database with "test" in its name');
  const previousJwtSecret = process.env.JWT_SECRET;
  const previousNodeEnv = process.env.NODE_ENV;
  const cloudinaryNames = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
  const previousCloudinary = Object.fromEntries(cloudinaryNames.map((name) => [name, process.env[name]]));
  process.env.JWT_SECRET = 'cms-integration-test-secret-at-least-32-characters';
  process.env.NODE_ENV = 'test';
  cloudinaryNames.forEach((name) => { process.env[name] = ''; });
  const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const email = `cms-test-${unique}@example.test`;
  const serviceSlug = `integration-service-${unique}`;
  const blogSlug = `integration-article-${unique}`;
  const contentKey = `integration-home-${unique}`;
  const contactsKey = 'whatsappContacts';
  let priorContacts;
  let server;
  let uploadedFile;

  try {
    await mongoose.connect(testUri);
    priorContacts = await Setting.findOne({ key: contactsKey }).lean();
    await Admin.create({ email, password: 'test-password-456', role: 'super_admin' });
    server = app.listen(0, '127.0.0.1');
    await new Promise((resolve) => server.once('listening', resolve));
    const origin = `http://127.0.0.1:${server.address().port}`;
    const login = await fetch(`${origin}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password: 'test-password-456' }) });
    assert.equal(login.status, 200);
    const cookie = login.headers.get('set-cookie')?.split(';')[0];
    assert.ok(cookie, 'successful login must set an HttpOnly session cookie');
    assert.equal((await login.json()).token, undefined, 'the session token must not be returned in JSON');
    const session = { Cookie: cookie, 'Content-Type': 'application/json' };
    assert.equal((await fetch(`${origin}/api/auth/me`, { headers: { Cookie: cookie } })).status, 200);

    const createService = await fetch(`${origin}/api/services`, { method: 'POST', headers: session, body: JSON.stringify({ slug: serviceSlug, title: 'Integration service', overview: 'Service overview', description: 'Service description', gallery: [publicImage('one'), publicImage('two'), publicImage('three')], mainImage: publicImage('one').url, status: 'published', isActive: true }) });
    assert.equal(createService.status, 201);
    assert.ok((await (await fetch(`${origin}/api/services/${serviceSlug}`)).json()).data);
    const adminServices = await fetch(`${origin}/api/services/admin`, { headers: { Cookie: cookie } });
    assert.equal(adminServices.status, 200);
    const createdService = (await createService.clone().json()).data;
    const serviceDraft = await fetch(`${origin}/api/services/${createdService._id}`, { method: 'PUT', headers: session, body: JSON.stringify({ status: 'draft' }) });
    assert.equal(serviceDraft.status, 200);
    assert.equal((await fetch(`${origin}/api/services/${serviceSlug}`)).status, 404, 'draft services must stay private');
    const publishService = await fetch(`${origin}/api/services/${createdService._id}`, { method: 'PUT', headers: session, body: JSON.stringify({ status: 'published' }) });
    assert.equal(publishService.status, 200);
    const shortGallery = await fetch(`${origin}/api/services/${createdService._id}`, { method: 'PUT', headers: session, body: JSON.stringify({ gallery: [publicImage('one')] }) });
    assert.equal(shortGallery.status, 400, 'a public service must keep its three-image gallery');

    const createDraft = await fetch(`${origin}/api/blog`, { method: 'POST', headers: session, body: JSON.stringify({ slug: blogSlug, title: 'Integration article', excerpt: 'Article excerpt', body: 'Plain text article body', status: 'draft', images: [], youtubeVideoId: '' }) });
    assert.equal(createDraft.status, 201, 'articles without images or video must save');
    const createdPost = (await createDraft.json()).data;
    assert.equal((await fetch(`${origin}/api/blog/${blogSlug}`)).status, 404);
    const publishPost = await fetch(`${origin}/api/blog/${createdPost._id}`, { method: 'PUT', headers: session, body: JSON.stringify({ status: 'published', youtubeVideoId: 'https://youtu.be/dQw4w9WgXcQ' }) });
    assert.equal(publishPost.status, 200);
    assert.equal((await (await fetch(`${origin}/api/blog/${blogSlug}`)).json()).data.youtubeVideoId, 'dQw4w9WgXcQ');
    const invalidVideo = await fetch(`${origin}/api/blog/${createdPost._id}`, { method: 'PUT', headers: session, body: JSON.stringify({ youtubeVideoId: 'https://attacker.example/video' }) });
    assert.equal(invalidVideo.status, 400);
    const sixImages = Array.from({ length: 6 }, (_, index) => publicImage(`blog-${index}`));
    const tooManyImages = await fetch(`${origin}/api/blog/${createdPost._id}`, { method: 'PUT', headers: session, body: JSON.stringify({ images: sixImages, featuredImage: null }) });
    assert.equal(tooManyImages.status, 400, 'blog gallery validation must enforce the five-image maximum');

    const deniedRole = await Admin.create({ email: `role-test-${unique}@example.test`, password: 'test-password-456', role: 'editor' }).catch((error) => error);
    assert.ok(deniedRole instanceof Error, 'the admin schema rejects non-admin roles');

    const contactResponse = await fetch(`${origin}/api/settings/whatsapp-contacts`, { method: 'PUT', headers: session, body: JSON.stringify({ whatsappContacts: [{ name: 'Test office', number: '+250 781 294 928' }, { name: 'Test enquiries', number: '+250 788 123 456' }] }) });
    assert.equal(contactResponse.status, 200);
    const publicSettings = await (await fetch(`${origin}/api/settings/public`)).json();
    assert.equal(publicSettings.data.whatsappContacts.length, 2);

    const contentCreate = await fetch(`${origin}/api/content`, { method: 'POST', headers: session, body: JSON.stringify({ section: 'home', key: contentKey, value: { title: 'Editable homepage headline' }, isActive: true }) });
    assert.equal(contentCreate.status, 201);
    const createdContent = (await contentCreate.json()).data;
    const publicContent = await (await fetch(`${origin}/api/content?section=home`)).json();
    assert.ok(publicContent.data.some((item) => item.key === contentKey));
    assert.equal((await fetch(`${origin}/api/content/${createdContent._id}`, { method: 'PUT', headers: session, body: JSON.stringify({ isActive: false }) })).status, 200);
    const hiddenContent = await (await fetch(`${origin}/api/content?section=home`)).json();
    assert.equal(hiddenContent.data.some((item) => item.key === contentKey), false, 'inactive content must be hidden from public pages');
    assert.equal((await fetch(`${origin}/api/content/${createdContent._id}`, { method: 'DELETE', headers: { Cookie: cookie } })).status, 200);

    const form = new FormData();
    const png = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 0]);
    form.set('image', new Blob([png], { type: 'image/png' }), 'test.png');
    const upload = await fetch(`${origin}/api/upload`, { method: 'POST', headers: { Cookie: cookie }, body: form });
    assert.equal(upload.status, 201);
    uploadedFile = (await upload.json()).imageUrl;
    const persisted = await fetch(`${origin}${uploadedFile}`);
    assert.equal(persisted.status, 200, 'a dev upload must be retrievable after the upload request finishes');

    assert.equal((await fetch(`${origin}/api/services/${createdService._id}`, { method: 'DELETE', headers: { Cookie: cookie } })).status, 200);
    assert.equal((await fetch(`${origin}/api/blog/${createdPost._id}`, { method: 'DELETE', headers: { Cookie: cookie } })).status, 200);
    const logout = await fetch(`${origin}/api/auth/logout`, { method: 'POST', headers: { Cookie: cookie } });
    assert.equal(logout.status, 200);
    assert.match(logout.headers.get('set-cookie') || '', /Max-Age=0|Expires=/i);
    assert.equal((await fetch(`${origin}/api/auth/me`)).status, 401);
  } finally {
    if (server) {
      server.closeAllConnections();
      await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    }
    if (mongoose.connection.readyState === 1) {
      await Service.deleteMany({ slug: serviceSlug });
      await BlogPost.deleteMany({ slug: blogSlug });
      await Content.deleteMany({ key: contentKey });
      await Admin.deleteMany({ email: { $in: [email, `role-test-${unique}@example.test`] } });
      if (priorContacts) await Setting.updateOne({ key: contactsKey }, { $set: { value: priorContacts.value, description: priorContacts.description } });
      else await Setting.deleteOne({ key: contactsKey });
    }
    if (uploadedFile?.startsWith('/uploads/')) {
      const target = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'uploads', path.basename(uploadedFile));
      await fs.rm(target, { force: true });
    }
    await mongoose.disconnect();
    if (previousJwtSecret === undefined) delete process.env.JWT_SECRET; else process.env.JWT_SECRET = previousJwtSecret;
    if (previousNodeEnv === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = previousNodeEnv;
    for (const [name, value] of Object.entries(previousCloudinary)) if (value === undefined) delete process.env[name]; else process.env[name] = value;
  }
});
