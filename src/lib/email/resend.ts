import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// resend.emails.send({
//   from: 'onboarding@resend.dev',
//   to: 'betylhiro@gmail.com',
//   subject: 'Hello World',
//   html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
// });


export async function sendTestEmail() {
  try {
    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'betylhiro@gmail.com',
      subject: 'Test email z Taca.pl',
      html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
    });
    
    console.log('Email wysłany:', result);
    return result;
  } catch (error) {
    console.error('Błąd wysyłania email:', error);
    throw error;
  }
}