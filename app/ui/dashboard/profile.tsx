'use client'

import { supabaseClient } from '@/app/lib/supabase.client'
import { OutlineButton } from '../general/buttons'
import { useUser } from '@/app/lib/hooks/user'
import { IconX } from '@tabler/icons-react'
import { useState } from 'react'

export default function Profile() {
  const user = useUser()

  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleLogout = async () => {
    await supabaseClient.auth.signOut()
    window.location.reload()
  }

  return (
    <div className='relative'>
      <button
        className='ring-4 ring-slate-200 focus:outline-none hover:ring-slate-400 focus:ring-slate-400 transition rounded-full'
        onClick={handleToggle}>
        <img
          className='w-10 h-10 rounded-full'
          src={user.avatarUrl ?? '/avatar.png'}
          alt='avatar'
        />
      </button>
      {isOpen && (
        <div className='absolute top-10 right-10 flex flex-col gap-1 p-4 bg-white rounded-xl border border-slate-200 shadow-md w-72 text-center items-center'>
          <button
            className='absolute top-4 right-4 hover:bg-slate-200 focus:ring-2  focus:outline-none hover:ring-slate-400 focus:ring-slate-400 transition rounded-full'
            onClick={handleClose}>
            <IconX className='w-6 h-6' />
          </button>
          <img
            src={user.avatarUrl ?? '/avatar.png'}
            alt='avatar'
            className='border border-slate-200 rounded-full w-56 h-56'
          />
          <div className='my-4'>
            <p className='text-lg font-semibold'>{user.fullName}</p>
            <p className='text-slate-600'>
              {user.isTeacher ? 'Docente' : user.grade.name}
            </p>
          </div>
          <OutlineButton onClick={handleLogout}>Cerrar sesión</OutlineButton>
        </div>
      )}
    </div>
  )
}
