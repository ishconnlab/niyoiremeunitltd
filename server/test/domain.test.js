import test from 'node:test';
import assert from 'node:assert/strict';
import Service from '../models/Service.js';
import BlogPost from '../models/BlogPost.js';
import Content from '../models/Content.js';
import { extractYouTubeVideoId } from '../utils/youtube.js';
import { cleanContacts } from '../controllers/settingsController.js';

test('service records require a URL-safe slug and useful copy', async () => {
  const service = new Service({ slug: 'bad slug', title: 'Painting', overview: 'Paint a property', description: 'Description' });
  await assert.rejects(service.validate());
});

test('service image galleries validate their maximum size', async () => {
  const gallery = Array.from({ length: 11 }, (_, index) => ({ url: `/image-${index}.jpg`, alt: `Image ${index}` }));
  const service = new Service({ slug: 'painting', title: 'Painting', overview: 'Paint a property', description: 'Description', gallery });
  await assert.rejects(service.validate(), /at most 10 gallery images/);
});

test('published services require a three-image relevant gallery', async () => {
  const service = new Service({ slug: 'published-example', title: 'Painting', overview: 'Paint a property', description: 'Description', status: 'published', gallery: [{ url: '/one.jpg', alt: 'One' }, { url: '/two.jpg', alt: 'Two' }] });
  await assert.rejects(service.validate(), /at least three gallery images/);
});

test('website content starts unpublished and can be published or unpublished', async () => {
  const content = new Content({ section: 'home', key: 'hero-draft', value: { title: 'Draft headline' } });
  assert.equal(content.isActive, false);
  await content.validate();
  content.isActive = true;
  await content.validate();
  assert.equal(content.isActive, true);
  content.isActive = false;
  await content.validate();
  assert.equal(content.isActive, false);
});

test('blog posts can be published without images or a video', async () => {
  const post = new BlogPost({ title: 'Planning a renovation', slug: 'planning-a-renovation', excerpt: 'A practical guide.', body: 'Review the project scope.', status: 'published' });
  await post.validate();
  assert.equal(post.images.length, 0);
  assert.equal(post.youtubeVideoId, '');
  assert.ok(post.publishedAt instanceof Date);
});

test('blog galleries have a five-image maximum including the featured image', async () => {
  const images = Array.from({ length: 5 }, (_, index) => ({ url: `/image-${index}.jpg`, alt: `Image ${index}` }));
  const post = new BlogPost({ title: 'A guide', slug: 'a-guide', excerpt: 'Summary', body: 'Text', featuredImage: { url: '/featured.jpg', alt: 'Featured' }, images });
  await assert.rejects(post.validate(), /at most five images in total/);
});

test('YouTube URLs are reduced to validated video IDs', () => {
  assert.equal(extractYouTubeVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ'), 'dQw4w9WgXcQ');
  assert.equal(extractYouTubeVideoId('https://youtu.be/dQw4w9WgXcQ?t=20'), 'dQw4w9WgXcQ');
  assert.equal(extractYouTubeVideoId('https://attacker.example/embed/dQw4w9WgXcQ'), '');
  assert.equal(extractYouTubeVideoId('https://youtube.com/watch?v=bad'), '');
});

test('WhatsApp contacts require unique international numbers and a maximum of five', () => {
  assert.deepEqual(cleanContacts([{ name: 'Office', number: '+250 781 294 928' }]), [{ name: 'Office', number: '250781294928' }]);
  assert.throws(() => cleanContacts([{ name: 'One', number: '250781294928' }, { name: 'Two', number: '250781294928' }]), /must be unique/);
  assert.throws(() => cleanContacts(Array.from({ length: 6 }, (_, i) => ({ name: `Contact ${i}`, number: `2507812949${i}0` }))), /one and five/);
});
