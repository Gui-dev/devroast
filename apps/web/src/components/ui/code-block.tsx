import { cn } from "@/lib/cn";
import { type HTMLAttributes, forwardRef } from "react";
import { codeToHtml } from "shiki";

export type CodeBlockProps = HTMLAttributes<HTMLDivElement> & {
  lang?: string;
};

const CodeBlock = forwardRef<HTMLDivElement, CodeBlockProps>(
  async ({ className, lang = "javascript", children, ...props }, ref) => {
    const code = typeof children === "string" ? children : "";
    const html = await codeToHtml(code, {
      lang,
      theme: "vesper",
    });

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {children}
        <div
          className="rounded-md border border-border-primary overflow-hidden"
          dangerouslySetInnerHTML={{ __html: html }}
        />
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
>(({ className, code, lang = "javascript", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex", className)}
      {...props}
    >
      <div className="flex w-10 flex-col gap-1.5 border-r border-border-primary bg-bg-surface px-2.5 py-3 font-mono text-[13px] leading-normal text-text-tertiary">
        {code.split("\n").map((_, i) => {
          const lineNumber = i + 1;
          return (
            <span key={`line-${lineNumber}`} className="w-full text-right pr-4">
              {lineNumber}
            </span>
          );
        })}
      </div>
    </div>
  );
});

CodeBlockContent.displayName = "CodeBlockContent";

export { CodeBlock, CodeBlockHeader, CodeBlockContent };
