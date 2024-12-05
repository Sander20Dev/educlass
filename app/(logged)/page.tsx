import Calendar from '../ui/dashboard/calendar'
import LoggedPageTemplate from '../lib/logged-page/template'
import { setupUser } from '../lib/utils/setup-user'
import { redirect } from 'next/navigation'
import ForbiddenPage from '../ui/general/forbidden-page'

export default async function Dashboard() {
  const { rawUser, user } = await setupUser()

  if (!rawUser) return redirect('/login')

  if (!user) return <ForbiddenPage />

  return (
    <LoggedPageTemplate user={user}>
      <Calendar />
    </LoggedPageTemplate>
  )
}
