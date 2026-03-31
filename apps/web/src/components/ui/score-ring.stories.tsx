import type { Meta, StoryObj } from '@storybook/react'
import { ScoreRing } from './score-ring'

const meta = {
  component: ScoreRing,
  title: 'UI/ScoreRing',
} satisfies Meta<typeof ScoreRing>

export default meta
type Story = StoryObj<typeof meta>

export const Score0: Story = {
  args: {
    score: 0,
  },
}

export const Score5: Story = {
  args: {
    score: 5,
  },
}

export const Score10: Story = {
  args: {
    score: 10,
  },
}
