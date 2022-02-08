import { User, Organizer, Party } from 'orms';
import { syncDbModels } from 'orms/pepperDb';
import { fake, createFakeUser } from 'helpers/fake';

const numberOfUsersToAdd = 50;
const numberOfOrganizersToAdd = 3;

describe('## Init Data', () => {
  let users: User[];
  let organizers: Organizer[];

  beforeAll(async () => {
    await syncDbModels();
  });

  test('Add Users', async () => {
    const fakeUsersData = await Promise.all([...Array(numberOfUsersToAdd).keys()].map(async () => createFakeUser()));
    users = await User.findAll();
    expect(fakeUsersData).toBeTruthy();
  });

  test('Match Users', async () => {
    const maxNumberOfMatches = 5;
    const minNumberOfMatches = 0;
    await Promise.all(
      users.map(async (user, key) => {
        const numberOfMatches = fake.integer(minNumberOfMatches, maxNumberOfMatches);
        for await (let i of [...Array(numberOfMatches).keys()]) {
          const matchKey = fake.integer(i, numberOfUsersToAdd-1);
          if (matchKey === key) { return; }
          // If we have matched two users. We might try to match them again since we are doing things randomly without protection
          try {
            // TODO: add more realistic cases
            // library does not have typing for passing through
            const status = (fake as unknown as any).match_status;
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
      title: fake.title,
      location: fake.address,
      description: fake.description,
      imgs: [(fake as unknown as any).bar, (fake as unknown as any).bar, (fake as unknown as any).bar],
      price: fake.integer(0, 100),
      foods: [(fake as unknown as any).product, (fake as unknown as any).product, (fake as unknown as any).product],
      drinks: [(fake as unknown as any).product, (fake as unknown as any).product, (fake as unknown as any).product],
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
        const numberOfParties = fake.integer(minNumberOfParties, maxNumberOfParties);
        for await (let i of [...Array(numberOfParties).keys()]) {
         const party = await Party.create({
            theme: fake.title,
            date: new Date(fake.date('YYYY-MM-DD')),
            people: fake.integer(20, 40),
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
          const userIndex = fake.integer(i, numberOfUsersToAdd-1);;
          await users[userIndex].addParty(party);
        }
      })
    );
  });
});