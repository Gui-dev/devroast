# Design: Create Roast com Análise de IA

**Data:** 2026-03-28  
**Status:** Aprovado  
**Feature:** Create Roast com Análise Ollama

---

## 1. Visão Geral do Fluxo

```
User cola código → Toggle "roast mode" (on/off) → Click "roast_my_code"
        ↓
Frontend POST /roasts { code, language, roastMode }
        ↓
API cria registro → Chama Ollama → Atualiza record →
        ↓
Redirect para /roast/{id} mostrando resultado
```

**Nota:** O toggle já existe no UI (`home-client.tsx`), só precisamos conectar ao fluxo.

---

## 2. Arquitetura

**Stack:**
- API: Fastify + `fetch` para Ollama local
- Frontend: Next.js + TanStack Query mutation
- IA: Ollama rodando em `http://localhost:11434` com modelo `qwen2.5-coder:1.5b`

### Prompt base (roast mode - sarcástico)

```
Analyze this {language} code and provide a JSON response with:
1. "roastQuote": A roasting quote (1-2 sentences, funny/sarcastic about the code quality)
2. "issues": Array of issues, each with:
   - "title": Short descriptive title
   - "description": Detailed explanation
   - "severity": "critical" | "warning" | "good"
   - "issueType": Type of issue (e.g., "bad-practice", "security", "performance")
3. "suggestedFix": Unified diff format showing improvements
4. "score": Number from 0-10 rating the code quality

Be brutally honest and sarcastic. Use developer humor.
Respond ONLY with valid JSON, no explanations.

Code to analyze:
---
{code}
---
```

### Prompt honest mode

Mesmo formato, mas troque "brutally honest and sarcastic" por "constructive feedback" e tom mais friendly.

---

## 3. Estrutura de Arquivos

| Arquivo | Ação | Descrição |
|---------|------|-----------|
| `apps/api/src/lib/ollama-client.ts` | **NOVO** | Cliente para chamar Ollama |
| `apps/api/src/use-cases/analyze-roast.use-case.ts` | **NOVO** | Use case que chama Ollama |
| `apps/api/src/use-cases/create-roast.use-case.ts` | **MODIFICAR** | Encadear criação → análise → update |
| `apps/api/src/contracts/roast.contract.ts` | **MODIFICAR** | Adicionar método update |
| `apps/api/.env` | **MODIFICAR** | Adicionar `OLLAMA_BASE_URL` |
| `apps/web/src/app/hooks/use-create-roast.ts` | **NOVO** | Mutation hook |

---

## 4. Schema do Banco

O schema `roasts` já existe com campos necessários:
- `roastQuote` - nullable, string
- `suggestedFix` - nullable, string  
- `score` - number
- `verdict` - já existe

Tabelas já existentes:
- `analysisIssues` - para issues encontradas
- `codeDiffs` - para suggested fix

---

## 5. API: Modificação do POST /roasts

Modificar o `POST /roasts` existente para:
1. Criar roast com score=0, verdict="pending"
2. Executar análise síncrona (chamar Ollama)
3. Atualizar registro com resultado (quote, issues, diff, score, verdict)
4. Retornar roast completo

**Timeout:** 60 segundos

---

## 6. Frontend: mutation hook

```typescript
// apps/web/src/app/hooks/use-create-roast.ts
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/roasts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      if (!res.ok) throw new Error('Failed to create roast')
      return res.json()
    },
    onSuccess: (data) => {
      router.push(`/roast/${data.id}`)
    },
  })
}
```

No `home-client.tsx`, conectar:
- Toggle: passar `isRoastMode` no mutation
- Button: chamar `createRoast.mutate({ code, language, roastMode: isRoastMode ? 'roast' : 'honest' })`

---

## 7. Tratamento de Erros

| Cenário | Comportamento |
|---------|---------------|
| Ollama não responde (>60s) | Timeout + erro 504 na API |
| Ollama fora do ar | Erro 503 "IA unavailable" |
| Código vazio | 400 "Code is required" |
| Modelo não instalado | Erro explicativo |
| JSON inválido da IA | Erro 500 "Failed to parse AI response" |

---

## 8. Variáveis de Ambiente

```env
# API
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5-coder:1.5b

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3333
```

---

## 9. Testes

- Unit test: `CreateRoastUseCase` com mock do OllamaClient
- Mock responses determinísticos para testes
- Testar timeout e tratamento de erros

---

## 10. Critérios de Success

1. ✅ POST /roasts retorna roast completo com analysis em 15-60s
2. ✅ Frontend redirect para /roast/{id} após submissão
3. ✅ Roast mode toggle funciona (sarcástico vs honest)
4. ✅ Erros claros quando Ollama não disponível
5. ✅ Página de detail (/roast/{id}) exibe quote, issues e diff