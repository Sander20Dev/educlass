import { getSupabaseServer } from '../supabase.server'
import { IClass, ICourse, IGrade, IStudent, ITeacher } from '../types/db'

export async function getUser(id: string) {
  const supabase = getSupabaseServer()
  const { data: rawUser } = await supabase
    .from('users')
    .select('id, full_name, avatar_url, is_teacher')
    .eq('id', id)
    .single()

  if (!rawUser) return null

  const user = rawUser.is_teacher
    ? await getTeacher(rawUser)
    : await getStudent(rawUser)

  if (!user) return null

  return user
}

export async function getTeachersGrades(id: string): Promise<IGrade[]> {
  const supabase = getSupabaseServer()
  const { data: grades } = await supabase
    .from('teachers_grade')
    .select('grades(id, name)')
    .eq('teacher_id', id)

  if (!grades) return []
  return grades
    .filter((grade) => grade.grades !== null)
    .map((grade) => ({
      id: grade.grades!.id,
      name: grade.grades!.name,
    }))
}

export async function getTeachersCourses(id: string): Promise<ICourse[]> {
  const supabase = getSupabaseServer()
  const { data: courses } = await supabase
    .from('teachers_course')
    .select('courses(id, name)')
    .eq('teacher_id', id)

  if (!courses) return []
  return courses
    .filter((course) => course.courses !== null)
    .map((course) => ({
      id: course.courses!.id,
      name: course.courses!.name,
    }))
}

export async function getStudentsGrade(id: string): Promise<IGrade | null> {
  const supabase = getSupabaseServer()
  const { data: grades } = await supabase
    .from('students_grade')
    .select('grades(id, name)')
    .eq('student_id', id)
    .single()

  if (!grades) return null
  return grades.grades
}

export async function getTeacher(rawUser: {
  avatar_url: string | null
  full_name: string
  id: string
  is_teacher: boolean
}): Promise<ITeacher> {
  return {
    id: rawUser.id,
    fullName: rawUser.full_name,
    avatarUrl: rawUser.avatar_url ?? undefined,
    isTeacher: true,
    grades: await getTeachersGrades(rawUser.id),
    courses: await getTeachersCourses(rawUser.id),
  }
}

export async function getStudent(rawUser: {
  avatar_url: string | null
  full_name: string
  id: string
  is_teacher: boolean
}): Promise<IStudent | null> {
  const grade = await getStudentsGrade(rawUser.id)

  if (!grade) return null

  return {
    id: rawUser.id,
    fullName: rawUser.full_name,
    avatarUrl: rawUser.avatar_url ?? undefined,
    isTeacher: false,
    grade,
  }
}

export async function getClass(id: string): Promise<IClass | null> {
  const supabase = getSupabaseServer()
  const { data: classData } = await supabase
    .from('classes')
    .select(
      'id, title, content, date, grades(id, name), courses(id, name), users(id, full_name)'
    )
    .eq('id', id)
    .single()

  if (!classData) return null

  const grade = classData.grades

  if (!grade) return null

  const course = classData.courses

  if (!course) return null

  const teacher = classData.users

  if (!teacher) return null

  return {
    id: classData.id,
    title: classData.title,
    content: classData.content,
    date: classData.date,
    grade,
    course,
    teacher: {
      id: teacher.id,
      fullName: teacher.full_name,
    },
  }
}
