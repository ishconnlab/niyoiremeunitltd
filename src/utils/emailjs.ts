import emailjs from '@emailjs/browser';

const getEnv = (key: string): string => {
  try {
    if (typeof import.meta !== 'undefined') {
      const env = (import.meta as { env?: Record<string, unknown> }).env;
      if (env && typeof env[key] === 'string') {
        return (env[key] as string).trim();
      }
    }
  } catch {
    // ignore
  }

  if (typeof process !== 'undefined' && process.env) {
    const value = process.env[key];
    if (typeof value === 'string') {
      return value.trim();
    }
  }

  return '';
};

const SERVICE_ID = getEnv('VITE_EMAILJS_SERVICE_ID');
const CONTACT_TEMPLATE_ID = getEnv('VITE_EMAILJS_CONTACT_TEMPLATE_ID');
const QUOTE_TEMPLATE_ID = getEnv('VITE_EMAILJS_QUOTE_TEMPLATE_ID');
const LEGACY_TEMPLATE_ID = getEnv('VITE_EMAILJS_TEMPLATE_ID');
const PUBLIC_KEY = getEnv('VITE_EMAILJS_PUBLIC_KEY');

/** The two submitting forms, each with its own EmailJS template. */
export type EmailTemplate = 'contact' | 'quote';

export const EMAILJS_CONFIG = {
  serviceId: SERVICE_ID,
  contactTemplateId: CONTACT_TEMPLATE_ID || LEGACY_TEMPLATE_ID,
  quoteTemplateId: QUOTE_TEMPLATE_ID || LEGACY_TEMPLATE_ID,
  publicKey: PUBLIC_KEY,
} as const;

const templateIdFor = (template: EmailTemplate): string =>
  template === 'contact' ? EMAILJS_CONFIG.contactTemplateId : EMAILJS_CONFIG.quoteTemplateId;

/** True when the service ID, public key and the given form's template ID are present. */
export const isEmailConfigured = (template: EmailTemplate): boolean =>
  Boolean(EMAILJS_CONFIG.serviceId && templateIdFor(template) && EMAILJS_CONFIG.publicKey);

export class EmailNotConfiguredError extends Error {
  constructor() {
    super('EmailJS is not configured for this deployment.');
    this.name = 'EmailNotConfiguredError';
  }
}

export class EmailDeliveryError extends Error {
  constructor(message = 'Email delivery failed.') {
    super(message);
    this.name = 'EmailDeliveryError';
  }
}

/**
 * Sends a message through EmailJS using the template for the given form.
 *
 * The promise only resolves when EmailJS confirms the message was accepted by
 * the service, so a success message is never shown for a failed delivery.
 */
export const sendEmail = async (
  template: EmailTemplate,
  templateParams: Record<string, unknown>
): Promise<void> => {
  if (!isEmailConfigured(template)) {
    throw new EmailNotConfiguredError();
  }

  try {
    const result = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      templateIdFor(template),
      templateParams,
      { publicKey: EMAILJS_CONFIG.publicKey }
    );

    if (result.status !== 200 && result.status !== 201) {
      throw new EmailDeliveryError(`EmailJS responded with status ${result.status}.`);
    }
  } catch (error) {
    if (error instanceof EmailDeliveryError) throw error;
    throw new EmailDeliveryError(
      error instanceof Error ? error.message : 'Email delivery failed.'
    );
  }
};
