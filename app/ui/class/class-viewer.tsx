import { IClass, IUser } from '@/app/lib/types/db'
import HTMLParser from '../general/html-parser'
import { TextLink } from '../general/links'

export function ClassViewer({
  classInfo: { id, title, content, date, grade, course, teacher },
  user,
}: {
  classInfo: IClass
  user: IUser
}) {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-[1fr,auto] gap-4 h-full'>
      <section>
        <h1 className='text-3xl font-bold'>{title}</h1>
        <hr className='my-4' />
        <HTMLParser html={content} />
      </section>
      <aside className='hidden sm:block border-l border-gray-200 p-4 h-full'>
        <h2 className='text-xl font-bold mb-4'>Detalles</h2>
        <div className='grid grid-cols-[auto,auto] gap-y-4 gap-x-4'>
          <strong className='text-sm text-gray-600'>FECHA</strong>
          <p className='text-sm'>{date}</p>
          <strong className='text-sm text-gray-600'>GRADO</strong>
          <p className='text-sm'>{grade.name}</p>
          <strong className='text-sm text-gray-600'>CURSO</strong>
          <p className='text-sm'>{course.name}</p>
          <strong className='text-sm text-gray-600'>DOCENTE</strong>
          <p className='text-sm'>{teacher.fullName}</p>
        </div>
        {user.isTeacher && (
          <div className='flex justify-center text-center py-4'>
            <TextLink href={'/class/' + id + '/edit'}>Editar</TextLink>
          </div>
        )}
      </aside>
    </div>
  )
}
