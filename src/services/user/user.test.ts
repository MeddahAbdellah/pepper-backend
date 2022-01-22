import request from 'supertest';
import app from 'index';
import httpStatus from 'http-status';
import { User, Party } from 'orms';
import { createFakeUser, createFakePartyWithItsOrganizer } from 'helpers/fake';
import { syncDbModels } from 'orms/pepperDb';
import jwt from 'jsonwebtoken';
import { IUser, MatchStatus, IParty } from 'models/types';
import _ from 'lodash';
import { normalizeUserMatches } from 'services/user/user.helper';

describe('## User', () => {
  let user1: User;
  let user2: User;
  let party: Party;
  beforeAll(async () => {
    await syncDbModels();
    user1 = await createFakeUser();
    user2 = await createFakeUser();
    party = await createFakePartyWithItsOrganizer();
  });

  describe('# Login', () => {
    test('should NOT be able to login if phoneNumber is not provided', async () => {
      await request(app).post('/api/user/login').send({ randomField: 'random' }).expect(httpStatus.BAD_REQUEST);
    });
  
    test('should NOT be able to login if phoneNumber does not exist', async () => {
      await request(app).post('/api/user/login').send({ phoneNumber: '0000000000'}).expect(httpStatus.UNAUTHORIZED);
    });
  
    test('should be able to login if phoneNumber exists', async () => {
      const { token } = (await request(app).post('/api/user/login').send({ phoneNumber: user1.phoneNumber}).expect(httpStatus.OK)).body;
      const authentifiedUser = jwt.verify(token, 'testKey') as IUser;
  
      expect(user1.id).toEqual(authentifiedUser.id);
    });
  });

  describe('# Query user data', () => {
    let tokenOfUser1: string;

    beforeAll(async () => {
      const userLogin = (await request(app).post('/api/user/login').send({ phoneNumber: user1.phoneNumber}).expect(httpStatus.OK)).body;
      tokenOfUser1 = userLogin.token;
    });

    test('should be able to query info with the right token', async () => {
      const { user } = (await request(app).get(`/api/user/info`).
        set('Authorization', tokenOfUser1).
        expect(httpStatus.OK)).body;
      expect(user1.id).toEqual(user.id);
    });

    test('should NOT be able to query info with the wrong token', async () => {
      await request(app).get(`/api/user/info`).
        set('Authorization', 'wrongToken').
        expect(httpStatus.UNAUTHORIZED);
    });

    describe('# User Matches', () => {
      let matches: User[];
      beforeAll(async () => {
        matches = (await request(app).post(`/api/user/matches`).
        set('Authorization', tokenOfUser1).
        send({ matchId: user2.id }).
        expect(httpStatus.OK)).body.matches;
      });

      test('Query should return the list of matches', () => expect(matches).toEqual(
        expect.arrayContaining([{ ..._.omit(user2, ['createdAt', 'deletedAt', 'updatedAt']), status: MatchStatus.UNAVAILABLE }])
      ));

      test('Should be Able to get matches of user', async () => {
        const returnMatches = (await request(app).get(`/api/user/matches`).
          set('Authorization', tokenOfUser1).
          expect(httpStatus.OK)).body.matches;

        expect(returnMatches).toEqual(
          expect.arrayContaining([{ ..._.omit(user2, ['createdAt', 'deletedAt', 'updatedAt']), status: MatchStatus.UNAVAILABLE }])
        )
      });

      test('should find the new match in the user matches list', async () => {
        const userAfterMatch = await User.findOne({ where: { id: user1.id } });
        const userMatches = await userAfterMatch?.getMatches({ raw: true });
        const normalizedMatches = normalizeUserMatches(userMatches || []);
        expect(normalizedMatches).toEqual(
          expect.arrayContaining([{ ..._.omit(user2, ['createdAt', 'deletedAt', 'updatedAt']), status: MatchStatus.UNAVAILABLE }])
        );
      });


      test('should find the new match in the second user matches list too', async () => {
        const userAfterMatch = await User.findOne({ where: { id: user2.id } });
        const matches = await userAfterMatch?.getMatches({ raw: true });
        const normalizedMatches = normalizeUserMatches(matches || []);
        expect(normalizedMatches).toEqual(
          expect.arrayContaining([{ ..._.omit(user1, ['createdAt', 'deletedAt', 'updatedAt']), status: MatchStatus.UNAVAILABLE }])
        );
      });

      test('should update match for user but NOT for second user and return them', async () => {
        const user1Matches = (await request(app).put(`/api/user/matches`).
          set('Authorization', tokenOfUser1).
          send({ matchId: user2.id, status: MatchStatus.ACCEPTED }).
          expect(httpStatus.OK)).body.matches;
        
        expect(user1Matches).toEqual(
          expect.arrayContaining([{ ..._.omit(user2, ['createdAt', 'deletedAt', 'updatedAt']), status: MatchStatus.ACCEPTED }])
        );

        const user1AfterMatch = await User.findOne({ where: { id: user1.id } });
        const user1AfterMatchMatches = await user1AfterMatch?.getMatches({ raw: true });
        const normalizedUser1Matches = normalizeUserMatches(user1AfterMatchMatches || []);
        expect(normalizedUser1Matches).toEqual(
          expect.arrayContaining([{ ..._.omit(user2, ['createdAt', 'deletedAt', 'updatedAt']), status: MatchStatus.ACCEPTED }])
        );

        const user2AfterMatch = await User.findOne({ where: { id: user2.id } });
        const user2AfterMatchMatches = await user2AfterMatch?.getMatches({ raw: true });
        const normalizedUser2Matches = normalizeUserMatches(user2AfterMatchMatches || []);
        expect(normalizedUser2Matches).toEqual(
          expect.arrayContaining([{ ..._.omit(user1, ['createdAt', 'deletedAt', 'updatedAt']), status: MatchStatus.UNAVAILABLE }])
        );
      });
    });


    // TODO: check parties with the fields not only ids
    describe('# User Parties', () => {
      test('Should be Able to add party to user and return them', async () => {
        const parties = (await request(app).post(`/api/user/parties`).
          set('Authorization', tokenOfUser1).
          send({ partyId: party.id }).
          expect(httpStatus.OK)).body.parties;
        
        expect(parties.map((currentParty: IParty) => currentParty.id)).toEqual([party.id]);

        const userAfterAddingParty = await User.findOne({ where: { id: user1.id } });
        const AfterAddingParty = await userAfterAddingParty?.getParties({ raw: true });
        expect(AfterAddingParty?.map((currentParty: Party) => currentParty.id)).toEqual([party.id]);
      });

      test('Should be Able to get parties of user', async () => {
        const parties = (await request(app).get(`/api/user/parties`).
          set('Authorization', tokenOfUser1).
          expect(httpStatus.OK)).body.parties;
        
        expect(parties.map((currentParty: IParty) => currentParty.id)).toEqual([party.id]);

        const userAfterAddingParty = await User.findOne({ where: { id: user1.id } });
        const AfterAddingParty = await userAfterAddingParty?.getParties({ raw: true });
        expect(AfterAddingParty?.map((currentParty: Party) => currentParty.id)).toEqual([party.id]);
      });

      test('Should be Able to cancel user\'s party and return them', async () => {
        const parties = (await request(app).delete(`/api/user/parties`).
          set('Authorization', tokenOfUser1).
          send({ partyId: party.id }).
          expect(httpStatus.OK)).body.parties;
        
        expect(parties.map((currentParty: IParty) => currentParty.id)).toEqual([]);
  
        const userAfterAddingParty = await User.findOne({ where: { id: user1.id } });
        const AfterAddingParty = await userAfterAddingParty?.getParties({ raw: true });
        expect(AfterAddingParty?.map((currentParty: Party) => currentParty.id)).toEqual([]);
      });
    });
  });
});