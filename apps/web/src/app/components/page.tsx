import { Button } from '@/components/ui/button'

export default function ComponentsPage() {
  return (
    <main className="flex min-h-screen flex-col gap-16 bg-bg-page p-8">
      <section className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-text-primary">{'//'} component_library</h1>

        <div className="h-px w-full bg-border-primary" />
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-sm font-bold text-text-primary">
          <span className="text-accent-green">{'//'}</span> buttons
        </h2>

        <div className="flex flex-wrap items-center gap-4">
          <Button variant="default">$ roast_my_code</Button>
          <Button variant="secondary">$ share_roast</Button>
          <Button variant="link">$ view_all &gt;&gt;</Button>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm">sm</Button>
          <Button size="default">default</Button>
          <Button size="lg">lg</Button>
          <Button disabled>disabled</Button>
        </div>
      </section>
    </main>
  )
}
