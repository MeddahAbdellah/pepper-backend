"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const twilio_1 = (0, tslib_1.__importDefault)(require("twilio"));
require("dotenv/config");
const envHelper_1 = (0, tslib_1.__importDefault)(require("helpers/envHelper"));
if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    throw 'Twilio credentials are not provided';
}
var TwilioVerificationStatus;
(function (TwilioVerificationStatus) {
    TwilioVerificationStatus["Pending"] = "pending";
    TwilioVerificationStatus["Approved"] = "approved";
})(TwilioVerificationStatus || (TwilioVerificationStatus = {}));
const twilioClient = (0, twilio_1.default)(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const localCode = '123456';
const twilioChannel = 'sms';
class AuthHelper {
    static createVerification(phoneNumber, countryPrefix = '+33') {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            if (envHelper_1.default.isLocal() || envHelper_1.default.isTest()) {
                return;
            }
            if (!process.env.TWILIO_SERVICE_ID) {
                throw 'Twilio service id is not provided';
            }
            const verification = yield twilioClient.verify.services(process.env.TWILIO_SERVICE_ID)
                .verifications
                .create({ to: `${countryPrefix}${phoneNumber.substring(1)}`, channel: twilioChannel });
            console.log('Twilio verification', verification);
        });
    }
    static checkVerification(phoneNumber, code, countryPrefix = '+33') {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            if (envHelper_1.default.isLocal() || envHelper_1.default.isTest()) {
                return code === localCode;
            }
            if (!process.env.TWILIO_SERVICE_ID) {
                throw 'Twilio service id is not provided';
            }
            const verificationCheck = yield twilioClient.verify.services(process.env.TWILIO_SERVICE_ID)
                .verificationChecks
                .create({ to: `${countryPrefix}${phoneNumber.substring(1)}`, code });
            console.log('Twilio verificationCheck', verificationCheck);
            return verificationCheck.status === TwilioVerificationStatus.Approved;
        });
    }
}
exports.default = AuthHelper;
;
//# sourceMappingURL=auth.js.map