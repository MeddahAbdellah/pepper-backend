import { syncDbModels } from 'orms/pepperDb';

describe('## Init Data', () => {

  beforeAll(async () => {
    await syncDbModels();
  });

});