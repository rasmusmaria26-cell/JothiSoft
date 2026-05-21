import twilio from 'twilio';
import * as dotenv from 'dotenv';
import path from 'path';

let clientInstance: twilio.Twilio | null = null;

/**
 * Lazily instantiates and returns the Twilio client using environment variables.
 * Automatically force-reloads the .env configuration in development to ensure
 * hot-reloaded env variables are picked up without requiring server restarts!
 */
function getTwilioClient(): twilio.Twilio | null {
  // Dynamic hot-reload of env variables in development
  try {
    dotenv.config({ path: path.resolve(__dirname, '../../.env'), override: true });
  } catch (err) {
    console.error('[SMS Service] Failed to hot-reload env file:', err);
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    return null;
  }

  // Re-instantiate if SID/Token changes or has not been created yet
  if (!clientInstance) {
    clientInstance = twilio(accountSid, authToken);
  }
  return clientInstance;
}

/**
 * Sends a registration OTP verification code via Twilio SMS.
 * Falls back safely to console simulator if Twilio credentials are not loaded.
 */
export async function sendOtpSms(toPhone: string, code: string): Promise<boolean> {
  console.log(`[SMS Service]: Preparing OTP SMS to ${toPhone}`);

  const client = getTwilioClient();
  const fromPhone = process.env.TWILIO_PHONE_NUMBER;

  if (!client || !fromPhone) {
    console.warn('[SMS Service]: Twilio client or sender phone number not configured. Falling back to local console simulator.');
    return false;
  }

  try {
    const message = await client.messages.create({
      body: `ஜோதிசாஃப்ட் சரிபார்ப்பு குறியீடு: ${code}\nJothiSoft Verification OTP: ${code}`,
      from: fromPhone,
      to: toPhone,
    });

    console.log(`[SMS Service]: OTP sent successfully! Message SID: ${message.sid}`);
    return true;
  } catch (error: any) {
    console.error('[SMS Service]: Twilio SMS Delivery Failed:', error);
    throw new Error(error.message || 'SMS delivery failed via Twilio gateway');
  }
}
