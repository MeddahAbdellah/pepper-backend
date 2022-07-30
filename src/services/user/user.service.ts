import { User, UserMatch, Party, Organizer, UserParty } from "orms";
import { normalizeUserMatches, normalizeOrganizerParties } from 'services/user/user.helper';
import { IParty, IMatch, MatchStatus, OrganizerStatus, UserPartyStatus } from 'models/types';
import { Op } from 'sequelize';
import _ from 'lodash';
export class UserService {
  public static async getUserParties(user: User): Promise<IParty[]> {
    const parties = await user.getParties({ attributes: { exclude: ['createdAt', 'deletedAt', 'updatedAt'] } });
    const matches = await user.getMatches({ raw: true });
    const partiesWithOrganizersAndAttendees = await Promise.all(
      parties.map(async (currentParty) => {
        const organizer = await currentParty.getOrganizer({
          attributes: { exclude: ['status', 'createdAt', 'deletedAt', 'updatedAt'] }
        });
        const usersSubscribedToThisParty = await currentParty.getUsers({
          attributes: { exclude: ['createdAt', 'deletedAt', 'updatedAt'] },
          raw: true,
        });
        // TODO: fix typing
        const attendeesForThisParty = usersSubscribedToThisParty.filter(
          (userSubscribedToThisParty) => [UserPartyStatus.ACCEPTED, UserPartyStatus.ATTENDED].includes((userSubscribedToThisParty as unknown as any)['UserParty.status']));

        // TODO: test this logic
        const attendeesFilteredByUserMatches = _.filter(attendeesForThisParty, (attendee) => !_.map(matches, (match) => match.id).includes(attendee.id));
        const attendees = _.map(attendeesFilteredByUserMatches, (attendee) => _.omitBy(attendee, (_value, key) => key.includes('UserParty')));
        const plainParty = currentParty.get({ plain: true });
        const userPartyStatus = plainParty['UserParty'].status;
        const outputParty = { status: userPartyStatus, ...organizer.get({ plain: true }), ..._.omit(plainParty, 'UserParty'), attendees };
        return outputParty;
      })
    );

    return partiesWithOrganizersAndAttendees;
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

  public static async updateUserMatchStatus(user: User, match: User): Promise<void | null> {
    const matchUserStatus = (await UserMatch.findOne({ where: { [Op.and]: [{ UserId: match.id }, { MatchId: user.id }] } }))?.status;

    if(matchUserStatus === MatchStatus.WAITING) {
      await UserMatch.update({ status: MatchStatus.ACCEPTED }, { where: { [Op.and]: [{ UserId: user.id }, { MatchId: match.id }] } });
      await UserMatch.update({ status: MatchStatus.ACCEPTED }, { where: { [Op.and]: [{ UserId: match.id }, { MatchId: user.id }] } });
      return null;
    }
  }

  private static async _acceptUser(party: Party, user: User) {
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

    const lastWaitingAttendeeId = (await UserParty.findAll({
      attributes: { exclude: ['createdAt', 'deletedAt', 'updatedAt'] },
      where: {
        status: UserPartyStatus.WAITING,
        PartyId: party.id,
        UserId: { [Op.not]: user.id },
      },
      order: [
        ['updatedAt', 'DESC'],
      ],
      limit: 1,
      raw: true,
      plain: true,
      // TODO: FIX typing
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as unknown as any)?.UserId;

    if (lastWaitingAttendeeId) {
      await UserParty.update(
        { status: UserPartyStatus.ACCEPTED },
        { where: { 
          [Op.and]: [
            { UserId: lastWaitingAttendeeId },
            { PartyId: party.id },
          ],
          },
        },
      );
    }
  }
  
  public static async addParty(user: User, party: Party): Promise<void> {
    await user.addParty(party);

    const lastAcceptedAttendeeId = (await UserParty.findAll({
      attributes: { exclude: ['createdAt', 'deletedAt', 'updatedAt'] },
      where: {
        status: UserPartyStatus.ACCEPTED,
        PartyId: party.id,
        UserId: { [Op.not]: user.id },
      },
      order: [
        ['updatedAt', 'DESC'],
      ],
      limit: 1,
      raw: true,
      plain: true,
      // TODO: FIX typing
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as unknown as any)?.UserId;

    const lastAcceptedAttendee = lastAcceptedAttendeeId ? await User.findOne({
      attributes: ['gender'],
      where: { id: lastAcceptedAttendeeId },
      raw: true,
    }) : null;

    if (!lastAcceptedAttendeeId || (user.gender !== lastAcceptedAttendee?.gender)) {
      await this._acceptUser(party, user);
    }
  }
}