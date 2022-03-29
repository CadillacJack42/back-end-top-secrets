const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const testUser = {
  first_name: 'First',
  last_name: 'Last',
  email: 'me@mine.com',
  password: '123456',
};

const createNewUser = async (userData = {}) => {
  const password = userData.password ?? testUser.password;

  const agent = request.agent(app);

  const user = await UserService.create({
    ...testUser,
    ...userData,
  });

  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });

  return [agent, user];
};

describe('backend-top-secret routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('Should `sign up` a user and enter their data into user table', async () => {
    const res = await require(app).post('/api/v1/users').send(testUser);
    const expected = {
      id: expect.any(String),
      first_name: 'First',
      last_name: 'Last',
      email: 'me@mine.com',
      user_id: expect.any(String),
    };
    expect(res.body).toEqual(expected);
  });
});
