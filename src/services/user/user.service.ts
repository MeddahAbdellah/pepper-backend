import { User, UserMatch, Party, Organizer, UserParty } from "orms";
import { normalizeUserParties, normalizeUserMatches, normalizeOrganizerParties } from 'services/user/user.helper';
import { IParty, IMatch, MatchStatus, OrganizerStatus, UserPartyStatus } from 'models/types';
import { Op } from 'sequelize';
import moment from 'moment';
import _ from 'lodash';
export class UserService {
  public static async getUserParties(user: User): Promise<IParty[]> {
    const parties = await user.getParties({ attributes: { exclude: ['createdAt', 'deletedAt', 'updatedAt'] } });
    const matches = await user.getMatches({ raw: true });
    const partiesWithOrganizersAndAttendees = await Promise.all(
      await parties.map(async (currentParty) => {
        const organizer = await currentParty.getOrganizer({
          attributes: { exclude: ['status', 'createdAt', 'deletedAt', 'updatedAt'] }
        });
        const attendeesForThisParty = await currentParty.getUsers({
          attributes: { exclude: ['createdAt', 'deletedAt', 'updatedAt'] },
          raw: true,
        });
        // TODO: test this logic
        const attendeesFilteredByUserMatches = _.filter(attendeesForThisParty, (attendee) => !_.map(matches, (match) => match.id).includes(attendee.id));
        const attendees = _.map(attendeesFilteredByUserMatches, (attendee) => _.omitBy(attendee, (_value, key) => key.includes('UserParty')));
        return { ...organizer.get({ plain: true }), ...currentParty.get({ plain: true }), attendees };
      })
    );

    const normalizedParties = normalizeUserParties(partiesWithOrganizersAndAttendees);
    return normalizedParties;
  }

  public static async getPartiesUserCanGoTo(user: User): Promise<IParty[]> {
    const userParties = await user.getParties();
    const acceptedOrganizers = await Organizer.findAll({ where: { status: OrganizerStatus.Accepted }});
    const parties = await Party.findAll({ where: {
        id: {
            [Op.notIn]: userParties.map((userParty) => userParty.id),
        },
        OrganizerId: {
            [Op.in]: acceptedOrganizers.map((organizer) => organizer.id),
        }
      }
    });

    const partiesWithOrganizers = await Promise.all(
      await parties.map(async (currentParty) => {
        const organizer = await currentParty.getOrganizer();
        return { ...organizer.get({ plain: true }), ...currentParty.get({ plain: true }) };
      })
    );
    const normalizedParties = normalizeOrganizerParties(partiesWithOrganizers);
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
  
  public static async addParty(user: User, party: Party): Promise<void> {
    const firstWaitingAttendeeId = (await UserParty.findAll({
      attributes: { exclude: ['createdAt', 'deletedAt', 'updatedAt'] },
      where: {
        status: UserPartyStatus.WAITING,
        PartyId: party.id,
        UserId: { [Op.not]: user.id },
      },
      order: [
        ['createdAt', 'ASC'],
      ],
      limit: 1,
      raw: true,
      plain: true,
      // TODO: FIX typing
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as unknown as any)?.UserId;

    const lastAcceptedAttendeeId = (await UserParty.findAll({
      attributes: { exclude: ['createdAt', 'deletedAt', 'updatedAt'] },
      where: {
        status: UserPartyStatus.ACCEPTED,
        PartyId: party.id,
        UserId: { [Op.not]: user.id },
      },
      order: [
        ['createdAt', 'DESC'],
      ],
      limit: 1,
      raw: true,
      plain: true,
      // TODO: FIX typing
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as unknown as any)?.UserId;
    await user.addParty(party);

    const acceptUser = async () => {
      if (firstWaitingAttendeeId) {
        await UserParty.update(
          { status: UserPartyStatus.ACCEPTED },
          { where: { 
            [Op.and]: [
              { UserId: firstWaitingAttendeeId },
              { PartyId: party.id },
            ],
            },
          },
        );
      }
      
      await UserParty.update(
        { status: UserPartyStatus.ACCEPTED },
        { where: { 
          [Op.and]: [
            { UserId: user.id },
            { PartyId: party.id },
          ],
          },
        },
      );
    }

    if (!lastAcceptedAttendeeId) {
      await acceptUser();
      return;
    }

    const lastAcceptedAttendeeGender = (await User.findOne({
      attributes: ['gender'],
      where: { id: lastAcceptedAttendeeId },
      raw: true,
    }))?.gender;

    const firstWaitingAttendeeGender = (await User.findOne({
      attributes: ['gender'],
      where: { id: firstWaitingAttendeeId },
      raw: true,
    }))?.gender;

    if (user.gender !== lastAcceptedAttendeeGender || user.gender !== firstWaitingAttendeeGender) {
      await acceptUser();
    }
  }
}