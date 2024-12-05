'use client'

import { useUser } from '@/app/lib/hooks/user'
import { IClass, ITeacher } from '@/app/lib/types/db'
import React, { useState } from 'react'
import TextEditor from '../general/text-editor'
import { OutlineButton } from '../general/buttons'
import { supabaseClient } from '@/app/lib/supabase.client'
import { TextLink } from '../general/links'

export default function ClassEditor(classInfo: IClass) {
  const teacher = useUser() as ITeacher

  const [title, setTitle] = useState(classInfo.title)
  const [content, setContent] = useState(classInfo.content)
  const [date, setDate] = useState(classInfo.date)
  const [grade, setGrade] = useState(classInfo.grade.id)
  const [course, setCourse] = useState(classInfo.course.id)

  const handleSave = async () => {
    try {
      const result = await supabaseClient
        .from('classes')
        .update({
          title,
          content,
          date,
          grade_id: grade,
          course_id: course,
          teacher_id: teacher.id,
        })
        .eq('id', classInfo.id)

      if (result.error) {
        throw result.error
      }
      alert('Clase guardada con éxito')
    } catch (error) {
      console.log(error)
      alert('Error al guardar la clase')
    }
  }

  return (
    <div className='flex flex-col gap-4'>
      <h1 className='text-3xl font-bold'>Editar clase</h1>
      <section>
        <h2 className='text-xl font-bold mb-4'>Título</h2>
        <input
          className='w-full p-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400'
          placeholder='Título de la clase'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </section>
      <div className='grid grid-cols-1 sm:grid-cols-[1fr,auto] gap-4 h-full'>
        <section>
          <h2 className='text-xl font-bold mb-4'>Contenido</h2>
          <TextEditor value={content} onChange={setContent} />
        </section>
        <aside className='hidden sm:block border-l border-gray-200 p-4 h-full'>
          <h2 className='text-xl font-bold mb-4'>Detalles</h2>
          <div className='grid grid-cols-[auto,auto] gap-y-4 gap-x-4'>
            <strong className='text-sm text-gray-600'>FECHA</strong>
            <input
              type='date'
              className='text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 px-2 py-1'
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <strong className='text-sm text-gray-600'>GRADO</strong>
            <select
              className='text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 px-2 py-1'
              value={grade}
              onChange={(e) => setGrade(+e.target.value)}>
              {teacher.grades.map((grade) => (
                <option key={grade.id} value={grade.id}>
                  {grade.name}
                </option>
              ))}
            </select>
            <strong className='text-sm text-gray-600'>CURSO</strong>
            <select
              className='text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 px-2 py-1'
              value={course}
              onChange={(e) => setCourse(+e.target.value)}>
              {teacher.courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
            <strong className='text-sm text-gray-600'>DOCENTE</strong>
            <p className='text-sm'>{classInfo.teacher.fullName}</p>
          </div>
          <div className='flex justify-center items-end gap-4 text-center py-4'>
            <TextLink className='block' href={'/class/' + classInfo.id}>
              Volver
            </TextLink>
            <OutlineButton onClick={handleSave}>Guardar</OutlineButton>
          </div>
        </aside>
      </div>
    </div>
  )
}
