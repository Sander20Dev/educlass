import { getClass } from '@/app/lib/db/server'
import LoggedPageTemplate from '@/app/lib/logged-page/template'
import { setupUser } from '@/app/lib/utils/setup-user'
import ClassEditor from '@/app/ui/class/class-editor'
import ForbiddenPage from '@/app/ui/general/forbidden-page'
import { notFound, redirect } from 'next/navigation'

export default async function ClassPage({
  params: { classId },
}: Readonly<{ params: { classId: string } }>) {
  const { rawUser, user } = await setupUser()

  if (!rawUser) return redirect('/login')

  if (!user) return <ForbiddenPage />

  if (!user.isTeacher) return notFound()

  const classData = await getClass(classId)

  if (!classData) notFound()
  if (classData.teacher.id !== user.id) notFound()

  return (
    <LoggedPageTemplate user={user}>
      <ClassEditor {...classData} />
    </LoggedPageTemplate>
  )
}
