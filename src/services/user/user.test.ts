/* eslint-disable jest/expect-expect */
import request from 'supertest';
import app from 'index';
import httpStatus from 'http-status';
import { User, Party } from 'orms';
import { createFakeUser, createFakePartyWithItsOrganizer, fake } from 'helpers/fake';
import { syncDbModels } from 'orms/pepperDb';
import jwt from 'jsonwebtoken';
import { IUser, MatchStatus, IParty, Gender } from 'models/types';
import _ from 'lodash';
import { normalizeUserMatches } from 'services/user/user.helper';
import 'dotenv/config';

describe('## User', () => {
  let user1: User;
  let user2: User;
  let user3: User;
  let user4: User;
  let user5: User;
  let user6: User;
  let party: Party;
  beforeAll(async () => {
    await syncDbModels();
    user1 = await createFakeUser({ gender: Gender.MAN });
    user2 = await createFakeUser({ gender: Gender.MAN });
    user3 = await createFakeUser({ gender: Gender.WOMAN });
    user4 = await createFakeUser({ gender: Gender.WOMAN });
    user5 = await createFakeUser({ gender: Gender.WOMAN });
    user6 = await createFakeUser({ gender: Gender.MAN });
    party = await createFakePartyWithItsOrganizer();
  });

  // TODO: mock twilio and test verification
  describe('# Login', () => {
    test('should NOT be able to login if phoneNumber is not provided', async () => {
      await request(app).post('/api/user/login').send({ randomField: 'random' }).expect(httpStatus.BAD_REQUEST);
    });
  
    test('should NOT be able to login if phoneNumber does not exist', async () => {
      await request(app).post('/api/user/login').send({ phoneNumber: '0000000000', code: '123456' }).expect(httpStatus.UNAUTHORIZED);
    });

    test('should be able to see if user with phoneNumber does NOT exists if he actually does NOT exist', async () => {
      const { userExists } = (await request(app).get('/api/user/login').query({ phoneNumber: '0000000000' }).expect(httpStatus.OK)).body;
      expect(userExists).toBe(false);
    });

    test('should be able to see if user with phoneNumber exists if he actually does exist', async () => {
      const { userExists } = (await request(app).get('/api/user/login').query({ phoneNumber: user1.phoneNumber }).expect(httpStatus.OK)).body;
      expect(userExists).toBe(true);
    });

    test('should be able to subscribe with phoneNumber', async () => {
      const userInfo = {
        name: fake.first_name,
        gender: (fake as unknown as any).gender,
        phoneNumber: '0000000000',
        address: fake.address,
        description: fake.description,
        job: fake.company_name,
        imgs: [(fake as unknown as any).portrait, (fake as unknown as any).portrait, (fake as unknown as any).portrait],
        interests: [fake.word, fake.word, fake.word],
      };

      const { token } = (await request(app).put('/api/user/login').send({ ...userInfo, code: '123456' }).expect(httpStatus.OK)).body;
      const subscribedUser = await User.findOne({ where: { phoneNumber: '0000000000'}}) as unknown as User;
      
      if (!process.env.JWT_KEY) {
        throw 'JWT key not provided';
      }

      const authentifiedUser = jwt.verify(token, process.env.JWT_KEY) as IUser;
      expect(subscribedUser.id).toEqual(authentifiedUser.id);
    });
  
    test('should be able to login if phoneNumber exists', async () => {
      const { token } = (await request(app).post('/api/user/login').send({ phoneNumber: user1.phoneNumber, code: '123456' }).expect(httpStatus.OK)).body;
      if (!process.env.JWT_KEY) {
        throw 'JWT key not provided';
      }
      const authentifiedUser = jwt.verify(token, process.env.JWT_KEY) as IUser;
  
      expect(user1.id).toEqual(authentifiedUser.id);
    });
  });

  describe('# Query user data', () => {
    let tokenOfUser1: string;
    let tokenOfUser2: string;
    let tokenOfUser3: string;
    let tokenOfUser4: string;
    let tokenOfUser5: string;
    let tokenOfUser6: string;

    beforeAll(async () => {
      const user1Login = (await request(app).post('/api/user/login').send({ phoneNumber: user1.phoneNumber, code: '123456' }).expect(httpStatus.OK)).body;
      const user2Login = (await request(app).post('/api/user/login').send({ phoneNumber: user2.phoneNumber, code: '123456' }).expect(httpStatus.OK)).body;
      const user3Login = (await request(app).post('/api/user/login').send({ phoneNumber: user3.phoneNumber, code: '123456' }).expect(httpStatus.OK)).body;
      const user4Login = (await request(app).post('/api/user/login').send({ phoneNumber: user4.phoneNumber, code: '123456' }).expect(httpStatus.OK)).body;
      const user5Login = (await request(app).post('/api/user/login').send({ phoneNumber: user5.phoneNumber, code: '123456' }).expect(httpStatus.OK)).body;
      const user6Login = (await request(app).post('/api/user/login').send({ phoneNumber: user6.phoneNumber, code: '123456' }).expect(httpStatus.OK)).body;
      tokenOfUser1 = user1Login.token;
      tokenOfUser2 = user2Login.token;
      tokenOfUser3 = user3Login.token;
      tokenOfUser4 = user4Login.token;
      tokenOfUser5 = user5Login.token;
      tokenOfUser6 = user6Login.token;
    });

    test('should be able to query info with the right token', async () => {
      const { user } = (await request(app).get(`/api/user/`).
        set('Authorization', tokenOfUser1).
        expect(httpStatus.OK)).body;
      expect(user1.id).toEqual(user.id);
    });

    test('should be able to update user', async () => {
      const newInfo = { address: 'newAddress', job: 'newJob', description: 'newDescription' }
      const { user } = (await request(app).put(`/api/user/`).
        send(newInfo).
        set('Authorization', tokenOfUser3).
        expect(httpStatus.OK)).body;
      expect({
        address: user.address, 
        job: user.job,
        description: user.description,
      }
      ).toEqual(newInfo);
    });

    test('should NOT be able to query info with the wrong token', async () => {
      await request(app).get(`/api/user/`).
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
        expect.arrayContaining([{ ..._.omit(user2, ['createdAt', 'deletedAt', 'updatedAt']), status: MatchStatus.WAITING }])
      ));

      test('Should be Able to get matches of user', async () => {
        const returnMatches = (await request(app).get(`/api/user/matches`).
          set('Authorization', tokenOfUser1).
          expect(httpStatus.OK)).body.matches;

        expect(returnMatches).toEqual(
          expect.arrayContaining([{ ..._.omit(user2, ['createdAt', 'deletedAt', 'updatedAt']), status: MatchStatus.WAITING }])
        )
      });

      test('should find the new match in the user matches list', async () => {
        const userAfterMatch = await User.findOne({ where: { id: user1.id } });
        const userMatches = await userAfterMatch?.getMatches({ raw: true });
        const normalizedMatches = normalizeUserMatches(userMatches || []);
        expect(normalizedMatches).toEqual(
          expect.arrayContaining([{ ..._.omit(user2, ['createdAt', 'deletedAt', 'updatedAt']), status: MatchStatus.WAITING }])
        );
      });


      test('should find the new match in the second user matches list too', async () => {
        const userAfterMatch = await User.findOne({ where: { id: user2.id } });
        const matches = await userAfterMatch?.getMatches({ raw: true });
        const normalizedMatches = normalizeUserMatches(matches || []);
        expect(normalizedMatches).toEqual(
          expect.arrayContaining([{ ..._.omit(user1, ['createdAt', 'deletedAt', 'updatedAt']), status: MatchStatus.WAITING }])
        );
      });

      test('should update match for user but NOT for second user if the status is below waiting for the second user and return them', async () => {
        const user1Matches = (await request(app).put(`/api/user/matches`).
          set('Authorization', tokenOfUser1).
          send({ matchId: user2.id, status: MatchStatus.WAITING }).
          expect(httpStatus.OK)).body.matches;
        
        expect(user1Matches).toEqual(
          expect.arrayContaining([{ ..._.omit(user2, ['createdAt', 'deletedAt', 'updatedAt']), status: MatchStatus.WAITING }])
        );

        const user1AfterMatch = await User.findOne({ where: { id: user1.id } });
        const user1AfterMatchMatches = await user1AfterMatch?.getMatches({ raw: true });
        const normalizedUser1Matches = normalizeUserMatches(user1AfterMatchMatches || []);
        expect(normalizedUser1Matches).toEqual(
          expect.arrayContaining([{ ..._.omit(user2, ['createdAt', 'deletedAt', 'updatedAt']), status: MatchStatus.WAITING }])
        );

        const user2AfterMatch = await User.findOne({ where: { id: user2.id } });
        const user2AfterMatchMatches = await user2AfterMatch?.getMatches({ raw: true });
        const normalizedUser2Matches = normalizeUserMatches(user2AfterMatchMatches || []);
        expect(normalizedUser2Matches).toEqual(
          expect.arrayContaining([{ ..._.omit(user1, ['createdAt', 'deletedAt', 'updatedAt']), status: MatchStatus.WAITING }])
        );
      });

      test('should NOT be able to update match for himself', async () => {
        await request(app).put(`/api/user/matches`).
          set('Authorization', tokenOfUser1).
          send({ matchId: user1.id, status: MatchStatus.WAITING }).
          expect(httpStatus.BAD_REQUEST);
      });

      test('should NOT be able to update match status to ACCEPTED', async () => {
        await request(app).put(`/api/user/matches`).
          set('Authorization', tokenOfUser1).
          send({ matchId: user2.id, status: MatchStatus.ACCEPTED }).
          expect(httpStatus.BAD_REQUEST);
      });

      test('should NOT be able to update match status to UNCHECKED', async () => {
        await request(app).put(`/api/user/matches`).
          set('Authorization', tokenOfUser1).
          send({ matchId: user2.id, status: MatchStatus.WAITING }).
          expect(httpStatus.BAD_REQUEST);
      });

      test('should update match for second user AND for first user when the status of the first is waiting and the second is going to be waiting too', async () => {
        const user2Matches = (await request(app).put(`/api/user/matches`).
          set('Authorization', tokenOfUser2).
          send({ matchId: user1.id, status: MatchStatus.WAITING }).
          expect(httpStatus.OK)).body.matches;
        
        expect(user2Matches).toEqual(
          expect.arrayContaining([{ ..._.omit(user1, ['createdAt', 'deletedAt', 'updatedAt']), status: MatchStatus.ACCEPTED }])
        );

        const user2AfterMatch = await User.findOne({ where: { id: user2.id } });
        const user2AfterMatchMatches = await user2AfterMatch?.getMatches({ raw: true });
        const normalizedUser2Matches = normalizeUserMatches(user2AfterMatchMatches || []);
        expect(normalizedUser2Matches).toEqual(
          expect.arrayContaining([{ ..._.omit(user1, ['createdAt', 'deletedAt', 'updatedAt']), status: MatchStatus.ACCEPTED }])
        );

        const user1AfterMatch = await User.findOne({ where: { id: user1.id } });
        const user1AfterMatchMatches = await user1AfterMatch?.getMatches({ raw: true });
        const normalizedUser1Matches = normalizeUserMatches(user1AfterMatchMatches || []);
        expect(normalizedUser1Matches).toEqual(
          expect.arrayContaining([{ ..._.omit(user2, ['createdAt', 'deletedAt', 'updatedAt']), status: MatchStatus.ACCEPTED }])
        );
      });

      test('Should be able to delete a match and they should be deleted for the other user too', async () => {
        const matchesAfterDeletion = (await request(app).delete(`/api/user/matches`).
        set('Authorization', tokenOfUser1).
        send({ matchId: user2.id }).
        expect(httpStatus.OK)).body.matches;
        
        expect(matchesAfterDeletion).toEqual( expect.arrayContaining([]));

        const user1AfterDeletion = await User.findOne({ where: { id: user1.id } });
        const matchesOfUser1AfterDeletion = await user1AfterDeletion?.getMatches({ raw: true });
        const normalizedMatchesOfUser1 = normalizeUserMatches(matchesOfUser1AfterDeletion || []);
        expect(normalizedMatchesOfUser1).toEqual( expect.arrayContaining([]));

        const user2AfterDeletion = await User.findOne({ where: { id: user1.id } });
        const matchesOfUser2AfterDeletion = await user2AfterDeletion?.getMatches({ raw: true });
        const normalizedMatchesOfUser2 = normalizeUserMatches(matchesOfUser2AfterDeletion || []);
        expect(normalizedMatchesOfUser2).toEqual( expect.arrayContaining([]));
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

      test('Should be Able to get party attendees', async () => {
        await request(app).post(`/api/user/parties`).
          set('Authorization', tokenOfUser1).
          send({ partyId: party.id }).
          expect(httpStatus.OK);
        await request(app).post(`/api/user/parties`).
          set('Authorization', tokenOfUser2).
          send({ partyId: party.id }).
          expect(httpStatus.OK);
        const parties = (await request(app).get(`/api/user/parties`).
          set('Authorization', tokenOfUser1).
          expect(httpStatus.OK)).body.parties;
        expect(parties[0].attendees.map((attendee: IUser) => attendee.id)).toEqual([user1.id, user2.id]);
      });

      test('Should accept users to keep gender parity', async() => {
        await request(app).post(`/api/user/parties`).
          set('Authorization', tokenOfUser3).
          send({ partyId: party.id }).
          expect(httpStatus.OK);
        await request(app).post(`/api/user/parties`).
          set('Authorization', tokenOfUser4).
          send({ partyId: party.id }).
          expect(httpStatus.OK);
        await request(app).post(`/api/user/parties`).
          set('Authorization', tokenOfUser5).
          send({ partyId: party.id }).
          expect(httpStatus.OK);
        await request(app).post(`/api/user/parties`).
          set('Authorization', tokenOfUser6).
          send({ partyId: party.id }).
          expect(httpStatus.OK);
        const parties = (await request(app).get(`/api/user/parties`).
          set('Authorization', tokenOfUser1).
          expect(httpStatus.OK)).body.parties;
        expect(_.sortBy(parties[0].attendees.map((attendee: IUser) => attendee.id))).toEqual([user1.id, user2.id, user3.id, user4.id, user5.id, user6.id]);
      });
    });
  });
});