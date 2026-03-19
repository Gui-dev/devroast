# Regras para Testes Unitários Frontend

## Tech Stack
- **Framework de Teste:** Vitest.
- **Library de Renderização:** React Testing Library (@testing-library/react).
- **Matchers:** @testing-library/jest-dom (para asserções como `toBeInTheDocument`).
- **Mocks de Framework:** Use `vi.mock('next/navigation')` para roteamento e `vi.mock('next/image')`.

## Estratégia de Teste
- **Foco:** Comportamento do componente e lógica de hooks.
- **Interação:** Use `user-event` em vez de `fireEvent` para simular interações reais.
- **Mocks de API:** Utilize o MSW (Mock Service Worker) para interceptar chamadas `fetch` em vez de dar mock global no fetch.
- **Isolamento:** Teste um componente por vez. Dê mock em componentes filhos complexos se necessário.

## Nomenclatura e Diretório
- **Localização:** SEMPRE junto ao componente `src/components/[component-name].spec.tsx` ou `src/hooks/[hook-name].spec.ts` ou `src/lib/[lib-name].spec.ts` e `src/http/[http-name].spec.ts`.
- **Arquivos:** `[component-name].spec.tsx` ou `[hook-name].spec.ts`.
- **Descrição:** Padrão `describe('<Component />')` e `it('should render correctly')`.

## Padrões de Código
- **Queries:** Prefira `getByRole` ou `getByLabelText` para garantir acessibilidade. Evite `testId` a menos que seja estritamente necessário.
- **Cleanup:** O Vitest deve estar configurado para limpar o DOM automaticamente após cada teste.
- **Props:** Teste o componente com diferentes variações de props (estados vazios, carregamento, erro).

## O que EVITAR
- Não teste detalhes de implementação (ex: nomes de funções internas). Teste o que o usuário vê.
- Não use `waitFor` com tempos fixos; use a detecção de mudanças no DOM.
