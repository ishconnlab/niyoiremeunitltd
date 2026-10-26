import asyncHandler from 'express-async-handler';
import Setting from '../models/Setting.js';

const DEFAULT_CONTACT = { name: 'NIYO IREME UNIT LTD', number: '250781294928' };

const cleanContacts = (contacts) => {
  if (!Array.isArray(contacts) || contacts.length < 1 || contacts.length > 5) {
    const error = new Error('Provide between one and five public WhatsApp contacts.');
    error.statusCode = 400;
    throw error;
  }
  const seen = new Set();
  return contacts.map((contact) => {
    const name = String(contact?.name || '').trim().slice(0, 80);
    const number = String(contact?.number || '').replace(/\D/g, '');
    if (!name || !/^\d{10,15}$/.test(number)) {
      const error = new Error('Each contact needs a name and an international phone number with 10–15 digits.');
      error.statusCode = 400;
      throw error;
    }
    if (seen.has(number)) {
      const error = new Error('WhatsApp contact numbers must be unique.');
      error.statusCode = 400;
      throw error;
    }
    seen.add(number);
    return { name, number };
  });
};

export const getPublicSettings = asyncHandler(async (_req, res) => {
  const setting = await Setting.findOne({ key: 'whatsappContacts' }).lean();
  res.json({ success: true, data: { whatsappContacts: setting?.value || [DEFAULT_CONTACT] } });
});

export const updateWhatsappContacts = asyncHandler(async (req, res) => {
  const contacts = cleanContacts(req.body.whatsappContacts);
  const setting = await Setting.findOneAndUpdate(
    { key: 'whatsappContacts' },
    { $set: { value: contacts, description: 'Company-approved public WhatsApp contacts' } },
    { upsert: true, new: true, runValidators: true }
  );
  res.json({ success: true, data: { whatsappContacts: setting.value } });
});

export { cleanContacts };
