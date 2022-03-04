import request from 'supertest';
import app from 'index';
import httpStatus from 'http-status';
import { User, Party } from 'orms';
import { createFakeUser, createFakePartyWithItsOrganizer } from 'helpers/fake';
import { syncDbModels } from 'orms/pepperDb';
import _ from 'lodash';
import 'dotenv/config';
import { IParty } from 'models/types';

describe('## Party', () => {
  let user: User;
  let tokenOfUser1: string;
  let party1: Party;
  let party2: Party;

  beforeAll(async () => {
    await syncDbModels();
    user = await createFakeUser();
    party1 = await createFakePartyWithItsOrganizer();
    party2 = await createFakePartyWithItsOrganizer();
    await (await User.findOne({ where: { id: user.id }}))?.addParty(party1);

    const { token } = (await request(app).post('/api/user/login').send({ phoneNumber: user.phoneNumber, code: '123456' }).expect(httpStatus.OK)).body;
    tokenOfUser1 = token;
  });

  test('Should be able to get party that the user is not going to', async() => {
    const partiesUserCanGoTo = (await request(app).get(`/api/party`).
    set('Authorization', tokenOfUser1).
    expect(httpStatus.OK)).body.parties;

    expect(partiesUserCanGoTo.map((p: IParty) => p.id )).toEqual([party2.id]);
  });
});