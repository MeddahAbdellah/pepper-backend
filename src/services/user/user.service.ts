import { User, UserMatch, Party } from "orms";
import { normalizeUserParties, normalizeUserMatches } from 'services/user/user.helper';
import { IParty, IMatch, MatchStatus } from 'models/types';
import { Op } from 'sequelize';
import moment from 'moment';

export class UserService {
  public static async getUserParties(user: User): Promise<IParty[]> {
    const parties = await user.getParties();
    const partiesWithOrganizers = await Promise.all(
      await parties.map(async (currentParty) => {
        const organizer = await currentParty.getOrganizer();
        return { ...organizer.get({ plain: true }), ...currentParty.get({ plain: true }) };
      })
    );
    const normalizedParties = normalizeUserParties(partiesWithOrganizers);
    return normalizedParties;
  }

  public static async getPartiesUserCanGoTo(user: User): Promise<IParty[]> {
    const userParties = await user.getParties();
    const parties = await Party.findAll({ where: {
        id: {
            [Op.notIn]: userParties.map((userParty) => userParty.id),
        }
      }
    });

    const partiesWithOrganizers = await Promise.all(
      await parties.map(async (currentParty) => {
        const organizer = await currentParty.getOrganizer();
        return { ...organizer.get({ plain: true }), ...currentParty.get({ plain: true }) };
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

  public static async updateUserMatchStatus(user: User, match: User, status: MatchStatus): Promise<void | null> {
    const userMatchStatus = (await UserMatch.findOne({ where: { UserId: user.id}}))?.status;
    const matchUserStatus = (await UserMatch.findOne({ where: { UserId: match.id}}))?.status;

    if(!userMatchStatus || !matchUserStatus) {
      throw 'Match and User are not actually matched';
    }

    if( status === MatchStatus.WAITING && matchUserStatus === MatchStatus.WAITING) {
      await UserMatch.update({ status: MatchStatus.ACCEPTED }, { where: { [Op.and]: [{ UserId: user.id }, { MatchId: match.id }] } });
      await UserMatch.update({ status: MatchStatus.ACCEPTED }, { where: { [Op.and]: [{ UserId: match.id }, { MatchId: user.id }] } });
      return null;
    }

    await UserMatch.update({ status }, { where: { [Op.and]: [{ UserId: user.id }, { MatchId: match.id }] } });
  }

  public static async updateAllUnavailableFromYesterdayToUnchecked(): Promise<void> {
    const todayFirstHour = moment().startOf('day').add(6, 'hours').toDate();
    await UserMatch.update(
      { status: MatchStatus.UNCHECKED },
      { where: { 
        [Op.and]: [
          { status: MatchStatus.UNAVAILABLE },
          { createdAt: { [Op.lt]: todayFirstHour } }
        ],
        },
      },
    );
  }
}