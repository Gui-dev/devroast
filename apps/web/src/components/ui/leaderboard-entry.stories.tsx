import type { Meta, StoryObj } from '@storybook/react'
import { LeaderboardEntry } from './leaderboard-entry'

const meta = {
  component: LeaderboardEntry,
  title: 'UI/LeaderboardEntry',
} satisfies Meta<typeof LeaderboardEntry>

export default meta
type Story = StoryObj<typeof meta>

export const Rank1: Story = {
  args: {
    rank: 1,
    score: 9.5,
    language: 'javascript',
    code: 'const x = () => console.log("hello")',
    lineCount: 1,
  },
}

export const Rank2: Story = {
  args: {
    rank: 2,
    score: 8.0,
    language: 'typescript',
    code: 'function greet() { return "hi" }',
    lineCount: 1,
  },
}

export const Rank3: Story = {
  args: {
    rank: 3,
    score: 7.5,
    language: 'python',
    code: 'print("hello world")',
    lineCount: 1,
  },
}

export const HighScore: Story = {
  args: {
    rank: 5,
    score: 9.8,
    language: 'javascript',
    code: 'while(true) { if (true) break }',
    lineCount: 1,
  },
}

export const LowScore: Story = {
  args: {
    rank: 10,
    score: 1.2,
    language: 'javascript',
    code: 'var a = 1; var b = 2; var c = a + b;',
    lineCount: 1,
  },
}
