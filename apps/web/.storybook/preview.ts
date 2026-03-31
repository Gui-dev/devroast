import type { Preview } from '@storybook/nextjs-vite'
import '../src/app/globals.css'

const preview: Preview = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0c0c0c' },
        { name: 'elevated', value: '#1a1a1a' },
      ],
    },
  },
}

export default preview
