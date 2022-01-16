import { initDb, pepperDb } from 'orms/pepperDb';
import { initParty, associateParty } from 'orms/party.orm';
import { initUser, associateUser } from 'orms/user.orm';
import { initOrganizer, associateOrganizer } from 'orms/organizer.orm';
(async () => await initDb())();
initOrganizer(pepperDb);
initParty(pepperDb);
initUser(pepperDb);

associateOrganizer();
associateParty();
associateUser();
export { Party } from 'orms/party.orm';
export { Organizer } from 'orms/organizer.orm';
export { User } from 'orms/user.orm';

