'use client'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

interface CreateRoastInput {
  code: string
  language: string
  roastMode: 'honest' | 'roast'
}

export function useCreateRoast() {
  const router = useRouter()

  return useMutation({
    mutationFn: async (input: CreateRoastInput) => {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333'
      const res = await fetch(`${baseUrl}/roasts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      if (!res.ok) throw new Error('Failed to create roast')
      return res.json()
    },
    onSuccess: data => {
      router.push(`/roast/${data.id}`)
    },
  })
}
