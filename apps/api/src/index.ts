import 'dotenv/config'
import { buildApp } from './app.js'

const PORT = Number(process.env.PORT) || 3333

async function start() {
  const app = await buildApp()

  try {
    await app.listen({ port: PORT, host: '0.0.0.0' })
    console.log(`Server is running on http://localhost:${PORT}`)
    console.log(`Swagger UI available at http://localhost:${PORT}/docs`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
