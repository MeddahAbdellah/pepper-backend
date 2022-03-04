import request from 'supertest';
import app from 'index';
import httpStatus from 'http-status';
import { Organizer } from 'orms';
import { fake } from 'helpers/fake';
import { syncDbModels } from 'orms/pepperDb';
import { IOrganizer } from 'models/types';
import jwt from 'jsonwebtoken';
import SHA256 from 'crypto-js/sha256';


describe('Should call organizer route', () => {

  const organizer = {
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
  let tokenOrganizer: string;
  let organizerObject: IOrganizer;

  beforeAll(async () => {
    await syncDbModels();

    tokenOrganizer = (await request(app).put('/api/organizer/login').send({ ...organizer }).expect(httpStatus.OK)).body.token;

    if (!process.env.JWT_KEY) {
      throw 'JWT key not provided';
    }

    organizerObject = jwt.verify(tokenOrganizer, process.env.JWT_KEY) as IOrganizer;

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
      const subscribedUser = await Organizer.findOne({ where: { userName:organizerInfoTest.userName, password: SHA256(organizerInfoTest.password).toString()}}) as unknown as Organizer;
      
      if (!process.env.JWT_KEY) {
        throw 'JWT key not provided';
      }

      const authentifiedUser = jwt.verify(token, process.env.JWT_KEY) as IOrganizer;
      expect(subscribedUser.id).toEqual(authentifiedUser.id); 
    });
    
    test('should be able to login with userName and Password', async () => {
      const { token } = (await request(app).post('/api/organizer/login').send({ userName: organizer.userName, password: organizer.password}).expect(httpStatus.OK)).body;
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
      const  organizer1  = (await request(app).get(`/api/organizer/`).
        set('Authorization', tokenOrganizer).
        expect(httpStatus.OK)).body.organizer;
      
      expect(organizer1.id).toEqual(organizerObject.id);
    });

    test('should NOT be able to query info with the wrong token', async () => {
      await request(app).get(`/api/organizer/`).
        set('Authorization', 'wrongToken').
        expect(httpStatus.UNAUTHORIZED);
    });
  });
});