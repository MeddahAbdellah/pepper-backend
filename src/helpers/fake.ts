import { User, Party, Organizer } from "orms";
import { Gender, MatchStatus } from 'models/types';
import casual from 'casual';

casual.define('img', () => ({ uri: 'https://picsum.photos/200/300' }));
casual.define('gender', () => casual.boolean ? Gender.MAN : Gender.WOMAN );
casual.define('phoneNumber', () => casual.numerify('+336########') );
casual.define('product', () => ({ name: casual.word, price: casual.integer(3, 20) }) );
casual.define('match_status', () => [
  MatchStatus.ACCEPTED,
  MatchStatus.UNAVAILABLE,
  MatchStatus.UNCHECKED,
  MatchStatus.WAITING,
][casual.integer(0, 3)]);

const createFakeUser = async (): Promise<User> => {
  const user = await User.create({
    name: casual.first_name,
    gender: (casual as unknown as any).gender,
    phoneNumber: (casual as unknown as any).phoneNumber,
    address: casual.address,
    description: casual.description,
    job: casual.company_name,
    imgs: [(casual as unknown as any).img, (casual as unknown as any).img, (casual as unknown as any).img],
    interests: [casual.word, casual.word, casual.word],
  });

  return user.get({ plain: true });
}

const createFakePartyWithItsOrganizer = async (): Promise<Party> => {
  const organizer = await Organizer.create({
    title: casual.title,
    location: casual.address,
    description: casual.description,
    imgs: [(casual as unknown as any).img, (casual as unknown as any).img, (casual as unknown as any).img],
    price: casual.integer(0, 100),
    foods: [casual.word, casual.word, casual.word],
    drinks: [casual.word, casual.word, casual.word],
  });

  const party = await Party.create({
    theme: casual.title,
    date: new Date(casual.date('YYYY-MM-DD')),
    people: casual.integer(20, 40),
    minAge: casual.integer(18, 21),
    maxAge: casual.integer(28, 30),
  });
  
  organizer.addParty(party);
  return party;
}

export { createFakePartyWithItsOrganizer, createFakeUser, casual as fake };