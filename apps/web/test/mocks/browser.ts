import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)

export async function enableMSW() {
  await worker.start({
    onUnhandledRequest: 'bypass',
  })
}
