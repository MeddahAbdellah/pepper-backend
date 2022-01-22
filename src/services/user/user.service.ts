import { User } from "orms";
import { normalizeUserParties, normalizeUserMatches } from 'services/user/user.helper';
import { IParty, IMatch } from 'models/types';

export class UserService {
  public static async getUserParties(user: User): Promise<IParty[]> {
    const parties = await user.getParties();
    const partiesWithOrganizers = await Promise.all(
      await parties.map(async (currentParty) => {
        const organizer = await currentParty.getOrganizer();
        return { ...currentParty.get({ plain: true }), ...organizer.get({ plain: true }) };
      })
    );
    const normalizedParties = normalizeUserParties(partiesWithOrganizers);
    return normalizedParties;
  }

  public static async getUserMatches(user: User): Promise<IMatch[]> {
    const matches = await user.getMatches({ raw: true });
    const normalizedMatches = normalizeUserMatches(matches);
    return normalizedMatches;
  }
}