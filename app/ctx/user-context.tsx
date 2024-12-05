'use client'
import { createContext } from 'react'
import { IUser } from '../lib/types/db'

export const UserContext = createContext<IUser>({} as IUser)

export function UserProvider({
  user,
  children,
}: Readonly<{ user: IUser; children: React.ReactNode }>) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}
