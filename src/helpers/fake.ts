import { User, Party, Organizer } from "orms";
import { Gender, IOrganizer, IUser, MatchStatus, OrganizerStatus } from 'models/types';
import casual from 'casual';
import moment from "moment";

casual.define('portrait', () => ({ uri: `https://source.unsplash.com/collection/9948714?${casual.integer(1, 100)}` }));
casual.define('bar', () => ({ uri: `https://source.unsplash.com/collection/3639161?${casual.integer(1, 20)}` }));
casual.define('gender', () => casual.boolean ? Gender.MAN : Gender.WOMAN );
casual.define('phoneNumber', () => casual.numerify('06########') );
casual.define('product', () => ({ name: casual.word, price: casual.integer(3, 20) }) );
casual.define('match_status', () => [
  MatchStatus.ACCEPTED,
  MatchStatus.WAITING,
][casual.integer(0, 1)]);

const createFakeUser = async (overrideProps?: Partial<IUser>): Promise<User> => {
  const user = await User.create({
    name: casual.first_name,
    gender: (casual as unknown as any).gender,
    phoneNumber: (casual as unknown as any).phoneNumber,
    address: casual.address,
    description: casual.description,
    job: casual.company_name,
    imgs: [(casual as unknown as any).portrait, (casual as unknown as any).portrait, (casual as unknown as any).portrait],
    interests: [casual.word, casual.word, casual.word],
    facebook: casual.name,
    instagram: casual.name,
    snapchat: casual.name,
    ...(overrideProps ? overrideProps : {})
  });

  return user.get({ plain: true });
}

const createFakeOrganizer = async (password = casual.password as any): Promise<Organizer> => {
  const organizer = await Organizer.create({
    phoneNumber: (casual as unknown as any).phoneNumber,
    userName: casual.username,
    password: password,
    title: casual.title,
    location: casual.address,
    description: casual.description,
    imgs: [(casual as unknown as any).portrait, (casual as unknown as any).portrait, (casual as unknown as any).portrait],
    foods: [(casual as unknown as any).product, (casual as unknown as any).product, (casual as unknown as any).product],
    drinks: [(casual as unknown as any).product, (casual as unknown as any).product, (casual as unknown as any).product],
    status: OrganizerStatus.Pending
  });

  return organizer.get({ plain: true });
}

const createFakePartyWithItsOrganizer = async (): Promise<Party> => {
  const organizer = await Organizer.create({
    phoneNumber: (casual as unknown as any).phoneNumber,
    userName: casual.username,
    password: casual.password,
    title: casual.title,
    location: casual.address,
    description: casual.description,
    imgs: [(casual as unknown as any).bar, (casual as unknown as any).bar, (casual as unknown as any).bar],
    foods: [(casual as unknown as any).product, (casual as unknown as any).product, (casual as unknown as any).product],
    drinks: [(casual as unknown as any).product, (casual as unknown as any).product, (casual as unknown as any).product],
    status: OrganizerStatus.Accepted
  });

  const party = await Party.create({
    theme: casual.title,
    date: moment(),
    price: casual.integer(0, 100),
    people: casual.integer(20, 40),
    minAge: casual.integer(18, 21),
    maxAge: casual.integer(28, 30),
  });
  
  await organizer.addParty(party);
  const createdParty = await Party.findOne({ where: { id: party.id }, raw: false });
  if (!createdParty) {
    throw 'Fake party creation failed';
  }
  return createdParty;
}

const createFakeParty = async (organizerInfo: Organizer | IOrganizer): Promise<Party> => {

  const organizer = await Organizer.findOne({ where: { id: organizerInfo.id }, raw: false });

  const party = await Party.create({
    theme: casual.title,
    date: moment(),
    price: casual.integer(0, 100),
    people: casual.integer(20, 40),
    minAge: casual.integer(18, 21),
    maxAge: casual.integer(28, 30),
  });
  await organizer?.addParty(party);
  const createdParty = await Party.findOne({ where: { id: party.id }, raw: false });
  if (!createdParty) {
    throw 'Fake party creation failed';
  }
  return createdParty;
}

export { createFakePartyWithItsOrganizer, createFakeUser, createFakeOrganizer, createFakeParty, casual as fake };
