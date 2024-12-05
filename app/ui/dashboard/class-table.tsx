import { IMinimalClass } from '@/app/lib/types/db'
import { TextLink } from '../general/links'
import { IconLoader2 } from '@tabler/icons-react'

export default function ClassTable({
  classes,
}: Readonly<{ classes: IMinimalClass[] | null }>) {
  return (
    <div className='relative overflow-x-auto border border-slate-300 shadow-md sm:rounded-lg'>
      <table className='w-full text-sm text-left rtl:text-right text-slate-800'>
        <thead className='text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200'>
          <tr>
            <th scope='col' className='px-6 py-3'>
              Título
            </th>
            <th scope='col' className='px-6 py-3'>
              Curso
            </th>
            <th scope='col' className='px-6 py-3'>
              Docente
            </th>
            <th scope='col' className='px-6 py-3'></th>
          </tr>
        </thead>
        <tbody>
          {classes == null && (
            <tr className='bg-white h-52'>
              <td colSpan={4}>
                <div className='w-full h-full flex justify-center items-center text-center text-lg font-bold text-slate-500'>
                  <IconLoader2 className='animate-spin w-10 h-10' />
                </div>
              </td>
            </tr>
          )}
          {classes != null && classes.length === 0 && (
            <tr className='bg-white h-52'>
              <td colSpan={4}>
                <div className='w-full h-full flex justify-center items-center text-center text-lg font-bold text-slate-500'>
                  No se encontraron clases.
                </div>
              </td>
            </tr>
          )}
          {classes != null &&
            classes.length > 0 &&
            classes.map((classData) => (
              <tr key={classData.id} className='odd:bg-white even:bg-slate-50'>
                <th
                  scope='row'
                  className='w-1/3 font-medium text-slate-900 relative before:content-["&nbsp;"] before:invisible'>
                  <span className='px-6 py-4 absolute inset-0 whitespace-nowrap overflow-hidden text-ellipsis'>
                    {classData.title}
                  </span>
                </th>
                <td className='w-1/4 relative before:content-["&nbsp;"] before:invisible'>
                  <span className='px-6 py-4 absolute inset-0 whitespace-nowrap overflow-hidden text-ellipsis'>
                    {classData.course.name}
                  </span>
                </td>
                <td className='w-1/4 relative before:content-["&nbsp;"] before:invisible'>
                  <span className='px-6 py-4 absolute inset-0 whitespace-nowrap overflow-hidden text-ellipsis'>
                    {classData.teacher.fullName}
                  </span>
                </td>
                <td className='px-6 py-4 w-1/6 relative before:content-["&nbsp;"] before:invisible'>
                  <TextLink className='inline' href={'/class/' + classData.id}>
                    Ver
                  </TextLink>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}
