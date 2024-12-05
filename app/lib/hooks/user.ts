import { UserContext } from '@/app/ctx/user-context'
import { useContext } from 'react'

export function useUser() {
  const user = useContext(UserContext)
  return user
}
