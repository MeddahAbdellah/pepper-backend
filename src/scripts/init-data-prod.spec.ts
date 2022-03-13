import { syncDbModels } from 'orms/pepperDb';

describe('## Init Data', () => {

  beforeAll(async () => {
    await syncDbModels();
  });

  test('Db initialized', () => expect(true).toBe(true))
});