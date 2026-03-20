import { cn } from "@/lib/cn";
import { type HTMLAttributes, forwardRef } from "react";
import { codeToHtml } from "shiki";

const CodeBlock = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "w-full overflow-hidden rounded-md border border-border-primary",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

CodeBlock.displayName = "CodeBlock";

const CodeBlockHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-3 border-b border-border-primary bg-bg-surface px-4 py-2.5",
        className,
      )}
      {...props}
    >
      <span className="size-2.5 rounded-full bg-accent-red" />
      <span className="size-2.5 rounded-full bg-accent-amber" />
      <span className="size-2.5 rounded-full bg-accent-green" />
      {children && (
        <span className="ml-auto font-mono text-[12px] text-text-tertiary">
          {children}
        </span>
      )}
    </div>
  );
});

CodeBlockHeader.displayName = "CodeBlockHeader";

const CodeBlockContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & {
    code: string;
    lang?: string;
  }
>(
  async ({ className, code, lang = "javascript", ...props }, ref) => {
    const html = await codeToHtml(code, {
      lang,
      theme: "vesper",
    });

    const lines = code.split("\n");

    return (
      <div ref={ref} className={cn("flex", className)} {...props}>
        <div className="flex w-10 flex-col border-r border-border-primary bg-bg-surface py-3 pr-4 font-mono text-[13px] leading-normal text-text-tertiary">
          {lines.map((_, i) => (
            <span key={`line-${i + 1}`} className="w-full text-right">
              {i + 1}
            </span>
          ))}
        </div>
        <div
          className="min-w-0 flex-1 overflow-x-auto bg-bg-page px-4 py-3 [&>pre]:bg-transparent! [&>pre]:p-0!"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    );
  },
);

CodeBlockContent.displayName = "CodeBlockContent";

export { CodeBlock, CodeBlockHeader, CodeBlockContent };
