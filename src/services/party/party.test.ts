import request from 'supertest';
import app from 'index';
import httpStatus from 'http-status';
import { User, Party, Organizer } from 'orms';
import { createFakeUser, createFakePartyWithItsOrganizer, createFakeOrganizer, createFakeParty } from 'helpers/fake';
import { syncDbModels } from 'orms/pepperDb';
import _ from 'lodash';
import 'dotenv/config';
import { IParty } from 'models/types';
import casual from 'casual';

describe('## Party', () => {
  let user: User;
  let tokenOfUser1: string;
  let party1: Party;
  let party2: Party;

  let organizer: Organizer;
  const organizerPassword = casual.password;
  let organizerToken: string;

  beforeAll(async () => {
    await syncDbModels();
    user = await createFakeUser();
    party1 = await createFakePartyWithItsOrganizer();
    party2 = await createFakePartyWithItsOrganizer();
    organizer = await createFakeOrganizer(organizerPassword);
    await (await User.findOne({ where: { id: user.id }}))?.addParty(party1);

    const { token } = (await request(app).post('/api/user/login').send({ phoneNumber: user.phoneNumber, code: '123456' }).expect(httpStatus.OK)).body;
    tokenOfUser1 = token;

    organizerToken = (await request(app).post('/api/organizer/login').send({ userName: organizer.userName, password: organizerPassword}).expect(httpStatus.OK)).body.token;

  });

  test('Should be able to get party that the user is not going to', async() => {
    const partiesUserCanGoTo = (await request(app).get(`/api/party`).
    set('Authorization', tokenOfUser1).
    expect(httpStatus.OK)).body.parties;

    expect(partiesUserCanGoTo.map((p: IParty) => p.id )).toEqual([party2.id]);
  });

  test('Should be able to get organizer own parties', async() => {

    const organizerTest = await createFakeOrganizer(organizerPassword)

    const p1 = await createFakeParty(organizerTest)
    const p2 = await createFakeParty(organizerTest)

    const testToken = (await request(app).post('/api/organizer/login').
    send({ userName: organizerTest.userName, password: organizerPassword}).expect(httpStatus.OK)).body.token;

    const  parties  = (await request(app).get(`/api/party/organizer`).
        set('Authorization', testToken).
        expect(httpStatus.OK)).body.parties;

    expect(parties.length).toEqual(2);
    expect(parties[0].id).toEqual(p2.id);
    expect(parties[1].id).toEqual(p1.id);
    
  });

  test('Should be able to create new party for organizer', async() => {

    const partyTest = {
      theme: casual.title,
      date: new Date(casual.date('YYYY-MM-DD')),
      price: casual.integer(0, 20),
      people: casual.integer(20, 40),
      minAge: casual.integer(20, 30),
      maxAge: casual.integer(30, 50),
    }

    const parties: IParty[] = (await request(app).post(`/api/party/create`).
    send({...partyTest}).
    set('Authorization', organizerToken).
    expect(httpStatus.OK)).body.parties;

    expect(parties.length).toEqual(1);
    expect(parties[0].theme).toEqual(partyTest.theme);
    expect(parties[0].price).toEqual(partyTest.price);
  });
});
