import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { CodeEditor } from './code-editor'

const meta = {
  component: CodeEditor,
  title: 'UI/CodeEditor',
} satisfies Meta<typeof CodeEditor>

export default meta

type Story = StoryObj<typeof meta>

function CodeEditorWithState({
  initialValue,
  initialLanguage,
}: {
  initialValue?: string
  initialLanguage?: string | null
}) {
  const [value, setValue] = useState(initialValue ?? '')
  const [language, setLanguage] = useState<string | null>(initialLanguage ?? null)
  return (
    <CodeEditor
      value={value}
      onChange={setValue}
      language={language}
      onLanguageChange={setLanguage}
    />
  )
}

export const Empty: Story = {
  render: () => <CodeEditorWithState />,
  args: { value: '', onChange: () => {}, language: null },
}

export const WithValue: Story = {
  render: () => (
    <CodeEditorWithState
      initialValue="function hello() {\n  console.log('world')\n}"
      initialLanguage="javascript"
    />
  ),
  args: { value: '', onChange: () => {}, language: 'javascript' },
}

export const OverLimit: Story = {
  render: () => (
    <CodeEditorWithState initialValue={'x'.repeat(2100)} initialLanguage="javascript" />
  ),
  args: { value: '', onChange: () => {}, language: 'javascript' },
}
