import emailjs from 'emailjs-com';

// Wrapper pour l'envoi d'email via EmailJS
// VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY

export interface ContactFormPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface SendResult {
  status: 'ok' | 'error';
  error?: string;
}

export async function sendContactEmail(data: ContactFormPayload): Promise<SendResult> {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID as string;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string;

  if (!serviceId || !templateId || !publicKey) {
    return { status: 'error', error: 'EmailJS env vars manquantes' };
  }

  try {
    await emailjs.send(
      serviceId,
      templateId,
      {
        from_name: data.name,
        reply_to: data.email,
        subject: data.subject,
        message: data.message
      },
      publicKey
    );
    return { status: 'ok' };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    return { status: 'error', error: errorMessage };
  }
}
