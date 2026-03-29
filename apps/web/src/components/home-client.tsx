'use client'

import { useCreateRoast } from '@/app/hooks/use-create-roast'
import { Button } from '@/components/ui/button'
import { CodeEditor } from '@/components/ui/code-editor'
import { Toggle } from '@/components/ui/toggle'
import { useState } from 'react'

export function HomeClient() {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState<string | null>(null)
  const [isOverLimit, setIsOverLimit] = useState(false)
  const [isRoastMode, setIsRoastMode] = useState(true)
  const createRoast = useCreateRoast()

  const handleCodeChange = (newCode: string) => {
    setCode(newCode)
  }

  const handleLanguageChange = (newLanguage: string | null) => {
    setLanguage(newLanguage)
  }

  const handleLimitExceeded = (exceeded: boolean) => {
    setIsOverLimit(exceeded)
  }

  const handleSubmit = async () => {
    if (!code || isOverLimit) return

    try {
      await createRoast.mutateAsync({
        code,
        language: language || 'javascript',
        roastMode: isRoastMode ? 'roast' : 'honest',
      })
    } catch (error) {
      // Error will be handled by react-query, but we can log it
      console.error('Failed to create roast:', error)
    }
  }

  return (
    <>
      <div className="mx-auto w-full max-w-195">
        <CodeEditor
          value={code}
          language={language}
          onChange={handleCodeChange}
          onLanguageChange={handleLanguageChange}
          onLimitExceeded={handleLimitExceeded}
        />
      </div>

      {isOverLimit && (
        <div className="mx-auto flex w-full max-w-195 items-center gap-2 font-mono text-xs text-accent-red">
          <svg
            className="size-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>limite de 2.000 caracteres excedido</span>
        </div>
      )}

      <div className="mx-auto flex w-full max-w-195 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Toggle
            label="roast mode"
            defaultPressed={isRoastMode}
            onPressedChange={setIsRoastMode}
          />
          <span className="font-sans text-xs text-text-tertiary">
            {'//'} maximum sarcasm enabled
          </span>
        </div>
        <Button disabled={!code || isOverLimit || createRoast.isPending} onClick={handleSubmit}>
          {createRoast.isPending ? '$ roasting...' : '$ roast_my_code'}
        </Button>
      </div>
    </>
  )
}
