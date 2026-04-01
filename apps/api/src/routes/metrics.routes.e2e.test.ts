import type { FastifyInstance } from 'fastify'
import supertest from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { buildTestApp } from '../test/helpers/build-test-app.js'

describe('metrics routes', () => {
  let app: FastifyInstance

  beforeEach(async () => {
    app = await buildTestApp()
  }, 30000)

  afterEach(async () => {
    await app.close()
  })

  describe('GET /metrics', () => {
    it('should return metrics with empty database', async () => {
      const response = await supertest(app.server).get('/metrics').expect(200)

      expect(response.body).toHaveProperty('totalRoasts')
      expect(response.body).toHaveProperty('avgScore')
    })
  })
})
