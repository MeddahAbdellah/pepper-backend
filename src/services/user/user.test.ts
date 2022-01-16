import request from 'supertest';
import app from 'index';
import httpStatus from 'http-status';
import { User, Party } from 'orms';
import { Gender } from 'models/types';

describe('## User', () => {

  test('should be able to login', async () => {
    await User.create(
      {
        name: 'Sam',
        gender: Gender.MAN,
        phoneNumber: '07437209358',
        address: 'Paris',
        description: 'random',
        job: 'Engineer',
        imgs: [
          { uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cG9ydHJhaXR8ZW58MHx8MHx8&w=1000&q=80' },
          { uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGJlYXV0aWZ1bCUyMCUyMHdvbWFufGVufDB8fDB8fA%3D%3D&w=1000&q=80' },
          { uri: 'https://images.pexels.com/photos/38554/girl-people-landscape-sun-38554.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
          { uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8bWFuJTIwYW5kJTIwd29tYW58ZW58MHx8MHx8&w=1000&q=80' },
        ],
        interests: ['Science', 'Art', 'Socialism'],
      }
    );
    const party = await Party.create(
      {
        title: 'FleuruKs',
        theme: 'Soirée Internationl',
        date: '24 octobre',
        location: 'Paris 14',
        people: '34',
        minAge: '19',
        maxAge: '28',
        description: 'test',
        foods: [
          { name: 'Steak', price: 10 },
          { name: 'Chicken', price: 12 },
          { name: 'Porc', price: 8 },
          { name: 'Beef', price: 14 },
        ],
        drinks: [
          { name: 'Beer', price: 6 },
          { name: 'Champain', price: 8 },
          { name: 'Whiskey', price: 9 },
          { name: 'Wine', price: 14 },
        ],
        price: 0,
        imgs: [
          { uri: 'https://image.jimcdn.com/app/cms/image/transf/none/path/s2f6af3166883d3ee/image/i8c4fa5b2ed1f62b8/version/1454158048/image.jpg' },
          { uri: 'https://image.jimcdn.com/app/cms/image/transf/none/path/s2f6af3166883d3ee/image/i8c4fa5b2ed1f62b8/version/1454158048/image.jpg' },
          { uri: 'https://image.jimcdn.com/app/cms/image/transf/none/path/s2f6af3166883d3ee/image/i8c4fa5b2ed1f62b8/version/1454158048/image.jpg' },
        ],
      }
    );

    const user = await User.findAll({ include: 'parties' });
    // @ts-ignore
    await user[0].addParty(party);
    console.log('party', party);
    console.log('user', user);
    await request(app).post('/api/user/login').send({ phoneNumber: '0600000000'}).expect(httpStatus.BAD_REQUEST);
  });

  test('should not be able to login if phoneNumber is not specifier', async () => {
    await request(app).post('/api/user/login').send({ test: 'data'}).expect(httpStatus.BAD_REQUEST);
  });
});