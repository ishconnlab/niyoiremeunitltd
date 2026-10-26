import test from 'node:test';
import assert from 'node:assert/strict';
import { buildWhatsAppUrl, buildWhatsAppUrls } from './whatsapp';

test('WhatsApp inquiry URLs encode the service name and prepared inquiry for the international contact number', () => {
    const url = buildWhatsAppUrl({ name: 'Office', number: '+250 781 294 928' }, 'Interior Design & Decoration');
    const parsed = new URL(url);
    assert.equal(parsed.origin + parsed.pathname, 'https://wa.me/250781294928');
    assert.match(parsed.searchParams.get('text') || '', /Interior Design & Decoration/);
    assert.match(parsed.searchParams.get('text') || '', /estimated cost, and next steps/);
});

test('multi-contact WhatsApp inquiries build one prepared conversation URL per selected contact', () => {
    const contacts = [
      { name: 'Office', number: '+250 781 294 928' },
      { name: 'Enquiries', number: '+250 788 123 456' },
    ];
    const urls = buildWhatsAppUrls(contacts, 'Tile Installation');
    assert.deepEqual(urls.map(({ url }) => new URL(url).pathname), ['/250781294928', '/250788123456']);
    assert.ok(urls.every(({ url }) => new URL(url).searchParams.get('text')?.includes('Tile Installation')));
});

test('WhatsApp inquiry rejects a missing or invalid public contact number', () => {
  assert.throws(() => buildWhatsAppUrl({ name: 'Office', number: '123' }, 'Painting'), /unavailable/);
});
