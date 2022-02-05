import { User, UserMatch } from 'orms';
import { createFakeUser } from 'helpers/fake';
import { syncDbModels } from 'orms/pepperDb';
import moment from 'moment';
import { UserService } from 'services/user/user.service';
import { MatchStatus } from 'models/types';

describe('## User', () => {
  let user1: User;
  let user2: User;

  beforeAll(async () => {
    await syncDbModels();
    user1 = await createFakeUser();
    user2 = await createFakeUser();
    const user1Orm = await User.findOne({ where: { id: user1.id }});
    const user2Orm = await User.findOne({ where: { id: user2.id }});
    if(!user2Orm || !user1Orm) {
      return;
    }
    await user1Orm?.addMatch(user2Orm);
    await user2Orm?.addMatch(user1Orm);
    const yesterday = moment().subtract(1, 'days').startOf('day').format("YYYY-MM-DD");

    await UserMatch.update({ createdAt:  yesterday }, { where: {} });
  });
  // TODO: add test for 5am for example
  test('# updateAllUnavailableFromYesterdayToUnchecked should update all unchecked', async () => {
    await UserService.updateAllUnavailableFromYesterdayToUnchecked();
    const userMatches = await UserMatch.findAll({ where: {status: MatchStatus.UNCHECKED }});
    expect(userMatches.length).toEqual(2);
  });

  test('# updateAllUnavailableFromYesterdayToUnchecked should NOT update if NOT unchecked', async () => {
    await UserMatch.update({ status: MatchStatus.WAITING }, { where: {} });
    await UserService.updateAllUnavailableFromYesterdayToUnchecked();
    const userMatches = await UserMatch.findAll({ where: {status: MatchStatus.UNCHECKED }});
    expect(userMatches.length).toEqual(0);
  });

});