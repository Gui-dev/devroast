import type { FastifyInstance } from 'fastify'
import supertest from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { buildTestApp } from '../test/helpers/build-test-app.js'

describe('roast routes', () => {
  let app: FastifyInstance

  beforeEach(async () => {
    app = await buildTestApp()
  }, 30000)

  afterEach(async () => {
    await app.close()
  })

  describe('POST /roasts', () => {
    it('should create a roast with valid code', async () => {
      const response = await supertest(app.server)
        .post('/roasts')
        .send({ code: 'const x = 1', language: 'javascript' })
        .expect(201)

      expect(response.body).toHaveProperty('id')
      expect(response.body.code).toBe('const x = 1')
      expect(response.body.language).toBe('javascript')
    })

    it('should return 400 for empty code', async () => {
      const response = await supertest(app.server)
        .post('/roasts')
        .send({ code: '', language: 'javascript' })
        .expect(400)

      expect(response.body).toHaveProperty('error')
    })
  })

  describe('GET /roasts', () => {
    it('should list roasts with limit', async () => {
      await supertest(app.server)
        .post('/roasts')
        .send({ code: 'const x = 1', language: 'javascript' })

      const response = await supertest(app.server).get('/roasts').query({ limit: 10 }).expect(200)

      expect(Array.isArray(response.body)).toBe(true)
    })
  })

  describe('GET /roasts/:id', () => {
    it('should return 404 for non-existent roast', async () => {
      const response = await supertest(app.server).get('/roasts/non-existent-id').expect(404)

      expect(response.body).toHaveProperty('error')
    })
  })
})
