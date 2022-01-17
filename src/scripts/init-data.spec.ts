import casual from 'casual';
import { User, Organizer, Party } from 'orms';
import { Gender, MatchStatus } from 'models/types';
import { syncDbModels } from 'orms/pepperDb';

const numberOfUsersToAdd = 50;
const numberOfOrganizersToAdd = 3;

describe('## Init Data', () => {
  let users: User[];
  let organizers: Organizer[];

  beforeAll(async () => {
    await syncDbModels();
    casual.define('img', () => ({ uri: 'https://picsum.photos/200/300' }));
    casual.define('gender', () => casual.boolean ? Gender.MAN : Gender.WOMAN );
    casual.define('match_status', () => [
      MatchStatus.ACCEPTED,
      MatchStatus.UNAVAILABLE,
      MatchStatus.UNCHECKED,
      MatchStatus.WAITING,
    ][casual.integer(0, 3)]);
  });

  test('Add Users', async () => {
    const fakeUsersData = [...Array(numberOfUsersToAdd).keys()].map(() => ({
      name: casual.first_name,
      gender: (casual as unknown as any).gender,
      phoneNumber: casual.phone,
      address: casual.address,
      description: casual.description,
      job: casual.company_name,
      imgs: [(casual as unknown as any).img, (casual as unknown as any).img, (casual as unknown as any).img],
      interests: [casual.word, casual.word, casual.word],
    }));
    users = await Promise.all(
      fakeUsersData.map(async (userData) => {
        const createdUser = await User.create(userData);
        return createdUser;
      })
    );
    expect(users).toBeTruthy();
  });

  test('Match Users', async () => {
    const maxNumberOfMatches = 5;
    const minNumberOfMatches = 0;
    await Promise.all(
      users.map(async (user, key) => {
        const numberOfMatches = casual.integer(minNumberOfMatches, maxNumberOfMatches);
        for await (let i of [...Array(numberOfMatches).keys()]) {
          const matchKey = casual.integer(i, numberOfUsersToAdd-1);
          if (matchKey === key) { return; }
          // If we have matched two users. We might try to match them again since we are doing things randomly without protection
          try {
            // TODO: add more realistic cases
            // library does not have typing for passing through
            const status = (casual as unknown as any).match_status;
            //@ts-ignore
            await user.addMatch(users[matchKey], { through: { status }});
            //@ts-ignore
            await users[matchKey].addMatch(user , { through: { status }});
          } catch(e){}
        }
      })
    );
  });

  test('Add Organizers', async () => {
    const fakeOrganizersData = [...Array(numberOfOrganizersToAdd).keys()].map(() => ({
      title: casual.title,
      location: casual.address,
      description: casual.description,
      imgs: [(casual as unknown as any).img, (casual as unknown as any).img, (casual as unknown as any).img],
      price: casual.integer(0, 100),
      foods: [casual.word, casual.word, casual.word],
      drinks: [casual.word, casual.word, casual.word],
    }));

    organizers = await Promise.all(
      fakeOrganizersData.map(async (organizerData) => {
        const createdUser = await Organizer.create(organizerData);
        return createdUser;
      })
    );
    expect(organizers).toBeTruthy();
  });

  test('Add Parties to organizers', async () => {
    const maxNumberOfParties = 5;
    const minNumberOfParties = 0;
    await Promise.all(
      organizers.map(async (organizer) => {
        const numberOfParties = casual.integer(minNumberOfParties, maxNumberOfParties);
        console.log('CASUUAL', new Date(casual.date('YYYY-MM-DD')));
        for await (let i of [...Array(numberOfParties).keys()]) {
         const party = await Party.create({
            theme: casual.title,
            date: new Date(casual.date('YYYY-MM-DD')),
            people: casual.integer(20, 40),
            minAge: 18,
            maxAge: 25 + i,
          });
          await organizer.addParty(party);
        }
      })
    );
  });

  test('Add Parties to Users', async () => {
    const parties = await Party.findAll();
    await Promise.all(
      parties.map(async (party) => {
        for await (let i of [...Array(party.people).keys()]) {
          const userIndex = casual.integer(i, numberOfUsersToAdd-1);;
          await users[userIndex].addParty(party);
        }
      })
    );
  });
});