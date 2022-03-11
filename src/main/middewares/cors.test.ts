import request from 'supertest'
import { setupApp } from '../config/app'


describe('CORS Middleware', () => {
  test('Should enable CORS', async () => {
    const app = await setupApp()
    app.post('/test_cors', (req, res) => {
      res.send()
    })
    await request(app)
      .get('/test_cors')
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-methods', '*')
      .expect('access-control-allow-headers', '*')
  })
})
