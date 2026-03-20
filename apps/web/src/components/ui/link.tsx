import NextLink from 'next/link'

export type LinkProps = React.ComponentProps<typeof NextLink>

function Link({ href, children, ...props }: LinkProps) {
  return (
    <NextLink
      href={href}
      className="font-mono text-[13px] text-text-secondary transition-colors hover:text-text-primary"
      {...props}
    >
      {children}
    </NextLink>
  )
}

export { Link }
