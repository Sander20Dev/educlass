import clsx from 'clsx'
import Link from 'next/link'

export function TextLink({
  href,
  children,
  ...props
}: Readonly<{ href: string; children: React.ReactNode }> &
  React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <Link
      href={href}
      {...props}
      className={clsx(
        'font-medium text-blue-600 underline hover:no-underline',
        props.className
      )}>
      {children}
    </Link>
  )
}

export function ButtonLink({
  href,
  children,
}: Readonly<{ href: string; children: React.ReactNode }>) {
  return (
    <Link
      href={href}
      className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none'>
      {children}
    </Link>
  )
}
