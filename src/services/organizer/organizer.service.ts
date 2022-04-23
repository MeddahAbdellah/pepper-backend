import { IParty } from "models/types";
import { Organizer } from "orms";
import { normalizeOrganizerParties } from "services/user/user.helper";

export class OrganizerService{
  
  public static async getOrganizerParties(organizer: Organizer): Promise<IParty[]>{

    const parties = await organizer.getParties({ order: [ [ 'createdAt', 'DESC' ] ] });

    const partiesWithOrganizers = parties.map((currentParty) => {
        return { ...organizer.get({ plain: true }), ...currentParty.get({ plain: true }) };
    })
    // reused since it produce IParty
    const normalizedParties = normalizeOrganizerParties(partiesWithOrganizers);
    return normalizedParties;
  }

}