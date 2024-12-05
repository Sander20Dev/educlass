export interface IMinimalUser {
  id: string
  fullName: string
  avatarUrl?: string
}

export interface ITeacher extends IMinimalUser {
  isTeacher: true
  grades: IGrade[]
  courses: ICourse[]
}

export interface IStudent extends IMinimalUser {
  isTeacher: false
  grade: IGrade
}

export type IUser = ITeacher | IStudent

export interface IGrade {
  id: number
  name: string
}

export interface ICourse {
  id: number
  name: string
}

export interface IMinimalClass {
  id: number
  title: string
  date: string
  grade: IGrade
  teacher: IMinimalUser
  course: ICourse
}

export interface IClass extends IMinimalClass {
  content: string
}
