import type { Meta, StoryObj } from '@storybook/react'
import { Link } from './link'

const meta = {
  component: Link,
  title: 'UI/Link',
} satisfies Meta<typeof Link>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    href: '#',
    children: 'View leaderboard',
  },
}
