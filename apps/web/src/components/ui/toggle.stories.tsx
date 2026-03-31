import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from 'storybook/test'
import { Toggle } from './toggle'

const meta = {
  component: Toggle,
  title: 'UI/Toggle',
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Roast mode',
  },
}

export const Checked: Story = {
  args: {
    defaultPressed: true,
    label: 'Roast mode',
  },
}

export const WithInteraction: Story = {
  args: {
    label: 'Roast mode',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const toggle = canvas.getByRole('switch')
    await expect(toggle).not.toBeChecked()
    await userEvent.click(toggle)
    await expect(toggle).toBeChecked()
  },
}
