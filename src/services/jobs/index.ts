import { updateMatchStatusJob } from 'services/jobs/update-match-status.job';

const runJobs = () => {
  updateMatchStatusJob.start();
}

export { runJobs };