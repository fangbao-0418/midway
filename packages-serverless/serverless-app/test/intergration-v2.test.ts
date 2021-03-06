import { join } from 'path';
import * as assert from 'assert';
import { close } from '@midwayjs/mock';
import { createFunctionApp } from './util';
const request = require('supertest');
const cwd = join(__dirname, 'fixtures/integration-v2');
describe('test/index.test.ts', () => {
  let app;
  beforeAll(async () => {
    app = await createFunctionApp(cwd, {
      baseDir: join(cwd, 'src/apis'),
    });
  });
  afterAll(async () => {
    await close(app);
  });
  it('http get no-yml', done => {
    request(app)
      .get('/hello?name=test&age=123')
      .expect(200)
      .then(response => {
        assert(response.body.path === '/hello');
        assert(response.body.method === 'GET');
        assert(response.body.headers);
        assert(response.body.query.name === 'test');
        assert(response.body.query.age === '123');
        done();
      })
      .catch(err => done(err));
  });
});
