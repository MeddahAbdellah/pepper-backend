"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runJobs = void 0;
const update_match_status_job_1 = require("services/jobs/update-match-status.job");
const runJobs = () => {
    update_match_status_job_1.updateMatchStatusJob.start();
};
exports.runJobs = runJobs;
//# sourceMappingURL=index.js.map