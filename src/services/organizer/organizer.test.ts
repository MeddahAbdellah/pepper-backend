import request from 'supertest';
import app from 'index';
import httpStatus from 'http-status';
import { Organizer } from 'orms';
import { createFakeOrganizer, createFakeParty, fake } from 'helpers/fake';
import { syncDbModels } from 'orms/pepperDb';
import { IOrganizer, IParty } from 'models/types';
import jwt from 'jsonwebtoken';
import SHA256 from 'crypto-js/sha256';
import casual from 'casual';

describe('## organizer', () => {

  let organizerObject: Organizer;
  let organizerObject2: Organizer;
  const organizerPassword = casual.password;
  let organizerToken: string;

  beforeAll(async () => {
    await syncDbModels();

    organizerObject  = await createFakeOrganizer(organizerPassword);
    organizerObject2 = await createFakeOrganizer(organizerPassword);
    organizerToken = (await request(app).post('/api/organizer/login').send({ userName: organizerObject2.userName, password: organizerPassword}).expect(httpStatus.OK)).body.token;

  });

   describe('# Login Oganizer', () => {
    test('should NOT be able to login if userName is not provided', async () => {
      await request(app).post('/api/organizer/login').send({ randomField: 'random' }).expect(httpStatus.BAD_REQUEST);
    });
  
    test('should NOT be able to login if organizer does not exist', async () => {
      await request(app).post('/api/organizer/login').send({ userName: 'Test', password: '123456' }).expect(httpStatus.UNAUTHORIZED);
    });

    test('should be able to subscribe with userName and Password', async () => {
      
      const organizerInfoTest = {
        userName: fake.username,
        phoneNumber: fake.phone,
        password: fake.password,
        title: fake.title,
        location: fake.address,
        description: fake.description,
        imgs: [(fake as unknown as any).portrait, (fake as unknown as any).portrait, (fake as unknown as any).portrait],
        foods: [(fake as unknown as any).product, (fake as unknown as any).product, (fake as unknown as any).product],
        drinks: [(fake as unknown as any).product, (fake as unknown as any).product, (fake as unknown as any).product],
      };

      const { token } = (await request(app).put('/api/organizer/login').send({ ...organizerInfoTest }).expect(httpStatus.OK)).body;
      const subscribedOrganizer = await Organizer.findOne({ 
        where: { userName:organizerInfoTest.userName, password: SHA256(organizerInfoTest.password).toString() },
        raw: true
      }) as Organizer;
      
      if (!process.env.JWT_KEY) {
        throw 'JWT key not provided';
      }

      const authentifiedUser = jwt.verify(token, process.env.JWT_KEY) as IOrganizer;
      expect(subscribedOrganizer.id).toEqual(authentifiedUser.id); 
    });
    
    test('should be able to login with userName and Password', async () => {
      const { token } = (await request(app).post('/api/organizer/login').send({ userName: organizerObject.userName, password: organizerPassword}).expect(httpStatus.OK)).body;
      if (!process.env.JWT_KEY) {
        throw 'JWT key not provided';
      }
      const authentifiedUser = jwt.verify(token, process.env.JWT_KEY) as IOrganizer;
  
      expect(organizerObject.id).toEqual(authentifiedUser.id);
    });


    test('should not able to subscribe with same userName twice', async () => {
      
      const organizerInfo2 = {
        userName: fake.username,
        phoneNumber: fake.phone,
        password: fake.password,
        title: fake.title,
        location: fake.address,
        description: fake.description,
        imgs: [(fake as unknown as any).portrait, (fake as unknown as any).portrait, (fake as unknown as any).portrait],
        foods: [(fake as unknown as any).product, (fake as unknown as any).product, (fake as unknown as any).product],
        drinks: [(fake as unknown as any).product, (fake as unknown as any).product, (fake as unknown as any).product],
      };

      await request(app).put('/api/organizer/login').send({ ...organizerInfo2 }).expect(httpStatus.OK);
      await request(app).put('/api/organizer/login').send({ ...organizerInfo2 }).expect(httpStatus.UNAUTHORIZED);
      
    });

    test('should be able to query info with the right token', async () => {
      const { token } = (await request(app).post('/api/organizer/login').send({ userName: organizerObject.userName, password: organizerPassword}).expect(httpStatus.OK)).body;

      const  organizer1  = (await request(app).get(`/api/organizer/`).
        set('Authorization', token).
        expect(httpStatus.OK)).body.organizer;
      
      expect(organizer1.id).toEqual(organizerObject.id);
    });

    test('should NOT be able to query info with the wrong token', async () => {
      await request(app).get(`/api/organizer/`).
        set('Authorization', 'wrongToken').
        expect(httpStatus.UNAUTHORIZED);
    });


  });

  describe('# Update Oganizer', () => {

    test('should be able to update organizer', async () => {
      const newInfo = { 
        title: fake.title,
        location: fake.address,
        description: fake.description,
      }
      const { token } = (await request(app).post('/api/organizer/login').send({ userName: organizerObject.userName, password: organizerPassword}).expect(httpStatus.OK)).body;
      const { organizer } = (await request(app).put(`/api/organizer/`).
        send(newInfo).
        set('Authorization', token).
        expect(httpStatus.OK)).body;
      expect({
        title: organizer.title, 
        location: organizer.location,
        description: organizer.description,
      }
      ).toEqual(newInfo);
    });
  });


  describe('# organizer parties', () => {

    test('Should be able to get organizer own parties', async() => {

      const organizerTest = await createFakeOrganizer(organizerPassword)
  
      const p1 = await createFakeParty(organizerTest)
      const p2 = await createFakeParty(organizerTest)
  
      const testToken = (await request(app).post('/api/organizer/login').
      send({ userName: organizerTest.userName, password: organizerPassword}).expect(httpStatus.OK)).body.token;
  
      const  parties  = (await request(app).get(`/api/organizer/party`).
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
  
      const parties: IParty[] = (await request(app).post(`/api/organizer/party`).
      send({...partyTest}).
      set('Authorization', organizerToken).
      expect(httpStatus.OK)).body.parties;
  
      expect(parties.length).toEqual(1);
      expect(parties[0].theme).toEqual(partyTest.theme);
      expect(parties[0].price).toEqual(partyTest.price);
    });

    test('Should be able to create delete party for organizer', async() => {
  
      const partyTest = {
        theme: casual.title,
        date: new Date(casual.date('YYYY-MM-DD')),
        price: casual.integer(0, 20),
        people: casual.integer(20, 40),
        minAge: casual.integer(20, 30),
        maxAge: casual.integer(30, 50),
      }
  
      const parties: IParty[] = (await request(app).post(`/api/organizer/party`).
      send({...partyTest}).
      set('Authorization', organizerToken).
      expect(httpStatus.OK)).body.parties;
  
      expect(parties.length).toBeGreaterThanOrEqual(1);

      const listLength = parties.length;

      const parties2: IParty[] = (await request(app).delete(`/api/organizer/party`).
      send({id : parties[0].id}).
      set('Authorization', organizerToken).
      expect(httpStatus.OK)).body.parties;

      expect(parties2.length).toEqual(listLength - 1);
    });

  })
});