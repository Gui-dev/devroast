import type { Meta, StoryObj } from '@storybook/react'
import { DiffLine } from './diff-line'

const meta = {
  component: DiffLine,
  title: 'UI/DiffLine',
} satisfies Meta<typeof DiffLine>

export default meta
type Story = StoryObj<typeof meta>

export const Removed: Story = {
  args: {
    variant: 'removed',
    children: 'const oldCode = true',
  },
}

export const Added: Story = {
  args: {
    variant: 'added',
    children: 'const newCode = false',
  },
}

export const Context: Story = {
  args: {
    variant: 'context',
    children: 'function example() {',
  },
}
