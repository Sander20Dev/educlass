import { supabaseClient } from '../supabase.client'
import { IGrade, IMinimalClass } from '../types/db'

export async function getMinimalClasses(
  date: Date,
  grade: IGrade | IGrade[]
): Promise<IMinimalClass[]> {
  const dateString = [
    date.getFullYear(),
    (date.getMonth() + 1).toString().padStart(2, '0'),
    date.getDate().toString().padStart(2, '0'),
  ].join('-')

  const grades = Array.isArray(grade) ? grade.map((g) => g.id) : [grade.id]

  const { data: classes } = await supabaseClient
    .from('classes')
    .select(
      'id, title, date, grade_id, grades(id, name), users(id, full_name), courses(id, name)'
    )
    .eq('date', dateString)
    .in('grade_id', grades)

  if (!classes) return []

  return classes
    .filter(
      (classData) => classData.grades && classData.users && classData.courses
    )
    .map((classData) => ({
      id: classData.id,
      title: classData.title,
      date: classData.date,
      grade: classData.grades!,
      teacher: {
        id: classData.users!.id,
        fullName: classData.users!.full_name,
      },
      course: classData.courses!,
    }))
}
