import { User, Party } from "orms";
import { IMatch, IParty } from 'models/types';
import _ from 'lodash';

const normalizeUserMatches = (userMatches: User[]): IMatch[] => {
  return userMatches.map((match: User): IMatch => ({
    id: match.id,
    name: match.name,
    gender: match.gender,
    phoneNumber: match.phoneNumber,
    address: match.address,
    description: match.description,
    job: match.job,
    imgs: match.imgs,
    interests: match.interests,
    status: (match as unknown as any)['UserMatch.status'],
  }))
}

const normalizeParties = (userParties: Party[]): IParty[] => {
  const normalizedUserParty = _.map(userParties, (party) => {
   return _.omit(party, ['UserParties', 'createdAt', 'updatedAt', 'deletedAt']) as unknown as IParty;
  });
  return normalizedUserParty;
}

export { normalizeUserMatches, normalizeParties };