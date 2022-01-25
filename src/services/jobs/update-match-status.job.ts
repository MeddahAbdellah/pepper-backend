import { CronJob } from 'cron';
import { UserService } from 'services/user/user.service';

const updateMatchStatusJob = new CronJob('01 07 * * *', async () => {
  await UserService.updateAllUnavailableFromYesterdayToUnchecked();
  console.log('Updated All Unavailable from yesterday to unchecked');
}, null, true, 'Europe/Paris');

export { updateMatchStatusJob };
