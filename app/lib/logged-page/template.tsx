import { UserProvider } from '@/app/ctx/user-context'
import { IUser } from '../types/db'
import Navbar from '@/app/ui/dashboard/navbar'

export default function LoggedPageTemplate({
  user,
  children,
}: Readonly<{ user: IUser; children: React.ReactNode }>) {
  return (
    <UserProvider user={user}>
      <header>
        <Navbar />
      </header>
      <main className='w-full max-w-5xl p-8 mx-auto bg-white min-h-[calc(100vh_-_80px)] border-x border-slate-200'>
        {children}
      </main>
    </UserProvider>
  )
}
