import type { FastifyInstance } from 'fastify'
import supertest from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { buildTestApp } from '../test/helpers/build-test-app.js'

describe('leaderboard routes', () => {
  let app: FastifyInstance

  beforeEach(async () => {
    app = await buildTestApp()
  }, 30000)

  afterEach(async () => {
    await app.close()
  })

  describe('GET /leaderboard/worst', () => {
    it('should return worst roasts', async () => {
      const response = await supertest(app.server).get('/leaderboard/worst').expect(200)

      expect(Array.isArray(response.body)).toBe(true)
    })
  })

  describe('GET /leaderboard', () => {
    it('should return full leaderboard', async () => {
      const response = await supertest(app.server).get('/leaderboard').expect(200)

      expect(Array.isArray(response.body)).toBe(true)
    })
  })
})
