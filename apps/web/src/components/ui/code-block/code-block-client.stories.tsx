import type { Meta, StoryObj } from '@storybook/react'
import { CodeBlockClient } from './code-block-client'

const meta = {
  component: CodeBlockClient,
  title: 'UI/CodeBlockClient',
} satisfies Meta<typeof CodeBlockClient>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    code: 'console.log("hello world")',
    lang: 'javascript',
  },
}

export const MultiLine: Story = {
  args: {
    code: 'function greet(name) {\n  return `Hello, ${name}!`\n}\n\ngreet("world")',
    lang: 'javascript',
  },
}
