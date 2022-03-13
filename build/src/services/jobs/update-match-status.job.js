"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMatchStatusJob = void 0;
const tslib_1 = require("tslib");
const cron_1 = require("cron");
const user_service_1 = require("services/user/user.service");
const updateMatchStatusJob = new cron_1.CronJob('01 07 * * *', () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    yield user_service_1.UserService.updateAllUnavailableFromYesterdayToUnchecked();
    console.log('Updated All Unavailable from yesterday to unchecked');
}), null, true, 'Europe/Paris');
exports.updateMatchStatusJob = updateMatchStatusJob;
//# sourceMappingURL=update-match-status.job.js.map