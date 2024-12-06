import { getClass } from '@/app/lib/db/server'
import LoggedPageTemplate from '@/app/lib/logged-page/template'
import { PageProps } from '@/app/lib/types/types'
import { setupUser } from '@/app/lib/utils/setup-user'
import { ClassViewer } from '@/app/ui/class/class-viewer'
import ForbiddenPage from '@/app/ui/general/forbidden-page'
import { TextLink } from '@/app/ui/general/links'
import { IconChevronLeft } from '@tabler/icons-react'
import { notFound, redirect } from 'next/navigation'

export default async function ClassPage({
  params,
}: PageProps<{ classId: string }>) {
  const { classId } = await params
  const { rawUser, user } = await setupUser()

  if (!rawUser) return redirect('/login')

  if (!user) return <ForbiddenPage />

  const classData = await getClass(classId)

  if (!classData) notFound()

  return (
    <LoggedPageTemplate user={user}>
      <TextLink href='/' className='[&:hover_svg]:-translate-x-1'>
        <IconChevronLeft className='inline transition' />{' '}
        {'Volver a la página principal'}
      </TextLink>
      <ClassViewer classInfo={classData} user={user} />
    </LoggedPageTemplate>
  )
}
