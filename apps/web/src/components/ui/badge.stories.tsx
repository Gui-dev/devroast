import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './badge'

const meta = {
  component: Badge,
  title: 'UI/Badge',
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Critical: Story = {
  args: {
    variant: 'critical',
    children: 'critical',
  },
}

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'warning',
  },
}

export const Good: Story = {
  args: {
    variant: 'good',
    children: 'good',
  },
}

export const NeedsSeriousHelp: Story = {
  args: {
    variant: 'needs_serious_help',
    children: 'needs serious help',
  },
}
