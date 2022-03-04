import twilio from 'twilio';
import 'dotenv/config';
import EnvHelper from 'helpers/envHelper';

if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
  throw 'Twilio credentials are not provided';
}

enum TwilioVerificationStatus {
  Pending = 'pending',
  Approved = 'approved',
}

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const localCode = '123456';
const twilioChannel = 'sms';

export default class AuthHelper {

  public static async createVerification(phoneNumber: string, countryPrefix = '+33'): Promise<void> {
    if (EnvHelper.isLocal() || EnvHelper.isTest()) {
      return;
    }

    if (!process.env.TWILIO_SERVICE_ID) {
      throw 'Twilio service id is not provided';
    }

    const verification = await twilioClient.verify.services(process.env.TWILIO_SERVICE_ID)
             .verifications
             .create({to: `${countryPrefix}${phoneNumber.substring(1)}`, channel: twilioChannel});
    console.log('Twilio verification', verification);
  }

  public static async checkVerification(phoneNumber: string, code: string, countryPrefix = '+33'): Promise<boolean> {
    if (EnvHelper.isLocal() || EnvHelper.isTest()) {
      return code === localCode;
    }

    if (!process.env.TWILIO_SERVICE_ID) {
      throw 'Twilio service id is not provided';
    }

    const verificationCheck = await twilioClient.verify.services(process.env.TWILIO_SERVICE_ID)
      .verificationChecks
      .create({to: `${countryPrefix}${phoneNumber.substring(1)}`, code});

    console.log('Twilio verificationCheck', verificationCheck);

    return verificationCheck.status === TwilioVerificationStatus.Approved;
  }

};