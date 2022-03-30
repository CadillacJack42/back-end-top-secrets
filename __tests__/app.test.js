const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const UserServices = require('../lib/services/UserServices');
const { agent } = require('supertest');

const testUser = {
  first_name: 'First',
  last_name: 'Last',
  email: 'me@mine.com',
  password: '123456',
};

const createNewUser = async (userData = {}) => {
  const password = userData.password ?? testUser.password;

  const agent = request.agent(app);

  const user = await UserServices.create({
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
    const res = await request(app).post('/api/v1/users').send(testUser);
    const expected = {
      id: expect.any(String),
      first_name: 'First',
      last_name: 'Last',
      email: 'me@mine.com',
      user_id: expect.any(String),
    };
    expect(res.body).toEqual(expected);
  });

  it('Should `sign in` a user', async () => {
    const agent = request.agent(app);

    const user = await UserServices.create({
      ...testUser,
    });

    const { email } = user;
    const password = testUser.password;

    const expected = {
      message: 'Successfully signed in!',
    };

    const res = await agent
      .post('/api/v1/users/sessions')
      .send({ email, password });

    expect(res.body).toEqual(expected);
    expect(res.status).toEqual(200);
  });

  it('Should `sign out` a user', async () => {
    const [agent, user] = await createNewUser();
    const res = await agent.delete('/api/v1/users/sessions');
    expect(res.body).toEqual({
      success: true,
      message: 'Successfully signed out!',
    });
    expect(res.status).toEqual(200);
  });

  it('Should return a 401 when unauthenticated trys to view top secrets', async () => {
    const res = await request(app).get('/api/v1/secrets');
    expect(res.body).toEqual({
      message: 'You must be signed in to view this page',
      status: 401,
    });
  });

  it('Should allow authenticated user to create post', async () => {
    const [agent, user] = await createNewUser();
    const res = await agent
      .post('/api/v1/secrets')
      .send({ title: 'Secret Post', description: 'This is a secret' });

    const expected = {
      id: expect.any(String),
      created_at: expect.any(String),
      title: 'Secret Post',
      description: 'This is a secret',
    };
    expect(res.body).toEqual(expected);
  });

  it('Should return list of secrets if user signed in', async () => {
    const [agent, user] = await createNewUser();
    const res = await agent.get('/api/v1/secrets');

    expect(res.body).toEqual([
      {
        id: expect.any(String),
        created_at: expect.any(String),
        title: 'This is a title',
        description: 'This is a description',
      },
    ]);
  });
});
