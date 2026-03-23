# Regras para Testes Unitários - API

## Tech Stack
- **Framework de Teste:** Vitest.
- **Estrutura:** Arquitetura hexagonal com repositories in-memory para testes.
- **Isolamento:** Cada teste cria uma nova instância do repositório in-memory.

## Estratégia de Teste

### Repositórios In-Memory
- Utilizar classes `InMemory*Repository` para isolamento de testes.
- Não testar diretamente o repositório real (que conecta ao banco de dados).
- Os repositórios in-memory implementam a mesma interface (`*Contract`) do repositório real.

### Use Cases
- Testar a lógica de negócio através dos use cases.
- Injetar o repositório in-memory como dependência.
- Cada use case deve ter seus próprios testes.

### Estrutura de Testes
```
describe('<UseCaseName>')
  └── it('should [behavior]')
  
describe('<RepositoryName>')
  └── describe('<methodName>')
        └── it('should [behavior]')
```

## Nomenclatura e Diretório

### Localização
- **Use Cases:** `src/use-cases/[use-case-name].use-case.test.ts`
- **Repositories:** `src/repositories/[repository-name].test.ts`
- **Contracts:** Não são testados diretamente (são interfaces)

### Arquivos
- Padrão: `[name].test.ts`
- Descrição: `describe('<ClassName>')` e `it('should [action]')`

## Padrões de Código

### Setup com `beforeEach`
```typescript
describe('UseCaseName', () => {
  let repository: InMemoryRepository
  
  beforeEach(() => {
    repository = new InMemoryRepository()
  })
})
```

### Criação de Dados de Teste
```typescript
const roast = await repository.create({
  code: 'const x = 1;',
  language: 'javascript',
})
```

### Ações do Use Case
```typescript
const useCase = new MyUseCase(repository)
const result = await useCase.execute(input)
```

### Aserções Comuns
```typescript
expect(result.id).toBeDefined()
expect(result.property).toBe(expectedValue)
await expect(useCase.execute(input)).rejects.toThrow('Error message')
```

## Casos de Teste Recomendados

### Use Cases
1. **Sucesso:** Dados válidos devem retornar resultado esperado
2. **Validação:** Input inválido deve lançar erro apropriado
3. **Valores default:** Campos opcionais devem ter valores padrão
4. **Transformações:** Dados devem ser transformados corretamente

### Repositories
1. **CRUD completo:** Create, Read, Update, Delete
2. **Casos de borda:** Lista vazia, id não encontrado
3. **Paginação:** Limite de resultados
4. **Relações:** Dados relacionados (se aplicável)

## O que EVITAR
- Não testar conexão com banco de dados real nos testes unitários
- Não mockar repositories manualmente (use in-memory)
- Não testar implementações internas de libraries externas
- Não usar `setTimeout` ou tempos fixos para esperar operações assíncronas

## Exemplo Completo

```typescript
import { beforeEach, describe, expect, it } from 'vitest'
import type { CreateRoastInput } from '../entities/roast.entity.js'
import { InMemoryRoastRepository } from '../repositories/in-memory/roast-in-memory.repository.js'
import { CreateRoastUseCase } from './create-roast.use-case.js'

describe('CreateRoastUseCase', () => {
  let repository: InMemoryRoastRepository
  let useCase: CreateRoastUseCase

  beforeEach(() => {
    repository = new InMemoryRoastRepository()
    useCase = new CreateRoastUseCase(repository)
  })

  it('should create a roast with valid data', async () => {
    const input: CreateRoastInput = {
      code: 'const x = 1;',
      language: 'javascript',
    }

    const roast = await useCase.execute(input)

    expect(roast.id).toBeDefined()
    expect(roast.code).toBe('const x = 1;')
  })

  it('should throw error when code is empty', async () => {
    const input: CreateRoastInput = {
      code: '',
      language: 'javascript',
    }

    await expect(useCase.execute(input)).rejects.toThrow('Code is required')
  })
})
```

## Comandos

```bash
# Rodar todos os testes da API
pnpm --filter api test

# Rodar em watch mode
pnpm --filter api test:watch

# Rodar cobertura
pnpm --filter api test:coverage
```
