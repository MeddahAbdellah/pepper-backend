import request from 'supertest';
import app from 'index';
import httpStatus from 'http-status';
import { Organizer } from 'orms';
import { createFakeOrganizer, fake } from 'helpers/fake';
import { syncDbModels } from 'orms/pepperDb';
import { IOrganizer } from 'models/types';
import jwt from 'jsonwebtoken';
import SHA256 from 'crypto-js/sha256';

describe('## organizer', () => {

  let organizerObject: Organizer;
  const organizerPassword = fake.password;

  beforeAll(async () => {
    await syncDbModels();

    organizerObject  = await createFakeOrganizer(organizerPassword);

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
});