import 'dotenv/config';           
import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function sendSMS(to, body) {
  return client.messages.create({
    from: process.env.TWILIO_NUMBER,
    to,
    body
  });
}

