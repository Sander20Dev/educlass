import clsx from 'clsx'

export function OutlineButton({
  children,
  selected,
  ...props
}: Readonly<
  {
    children: React.ReactNode
    selected?: boolean
  } & React.ButtonHTMLAttributes<HTMLButtonElement>
>) {
  return (
    <button
      {...props}
      className={clsx(
        'font-medium rounded-lg text-sm px-5 py-2.5 text-center border border-blue-700 transition focus:outline-none focus:ring-4 focus:ring-blue-300',
        {
          'text-blue-700 hover:text-white hover:bg-blue-800': !selected,
          'bg-blue-800 text-white': selected,
        }
      )}>
      {children}
    </button>
  )
}

export function SmOutlineButton({
  children,
  selected,
  ...props
}: Readonly<
  {
    children: React.ReactNode
    selected?: boolean
  } & React.ButtonHTMLAttributes<HTMLButtonElement>
>) {
  return (
    <button
      {...props}
      className={clsx(
        'font-medium rounded-md text-sm px-4 py-2 text-center border border-blue-700 transition focus:outline-none focus:ring-4 focus:ring-blue-300',
        {
          'text-blue-700 hover:text-white hover:bg-blue-800': !selected,
          'bg-blue-800 text-white': selected,
        },
        props.className
      )}>
      {children}
    </button>
  )
}
