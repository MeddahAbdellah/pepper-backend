import { IParty } from "models/types";
import { Organizer } from "orms";
import { normalizeUserParties } from "services/user/user.helper";

export class PartyService{
  
  public static async getOrganizerParties(organizer: Organizer): Promise<IParty[]>{

    const parties = await organizer.getParties({ order: [ [ 'createdAt', 'DESC' ] ] });

    const partiesWithOrganizers = parties.map((currentParty) => {
        return { ...organizer.get({ plain: true }), ...currentParty.get({ plain: true }) };
    })
    // reused since it produce IParty
    const normalizedParties = normalizeUserParties(partiesWithOrganizers);
    return normalizedParties;
  }

}