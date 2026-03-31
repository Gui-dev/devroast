import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './badge'
import { Card, CardDescription, CardHeader, CardTitle } from './card'

const meta = {
  component: Card,
  title: 'UI/Card',
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <Badge variant="critical">critical</Badge>
      </CardHeader>
      <CardTitle>Unused variable</CardTitle>
      <CardDescription>The variable `foo` is declared but never used in the scope.</CardDescription>
    </Card>
  ),
}

export const Critical: Story = {
  render: () => (
    <Card variant="critical">
      <CardHeader>
        <Badge variant="critical">critical</Badge>
      </CardHeader>
      <CardTitle>Memory leak</CardTitle>
      <CardDescription>
        Event listener is not removed on unmount, causing a memory leak.
      </CardDescription>
    </Card>
  ),
}

export const Warning: Story = {
  render: () => (
    <Card variant="warning">
      <CardHeader>
        <Badge variant="warning">warning</Badge>
      </CardHeader>
      <CardTitle>Deprecated API</CardTitle>
      <CardDescription>Using deprecated `componentWillMount` lifecycle method.</CardDescription>
    </Card>
  ),
}

export const Good: Story = {
  render: () => (
    <Card variant="good">
      <CardHeader>
        <Badge variant="good">good</Badge>
      </CardHeader>
      <CardTitle>Clean code</CardTitle>
      <CardDescription>Well-structured and follows best practices.</CardDescription>
    </Card>
  ),
}
