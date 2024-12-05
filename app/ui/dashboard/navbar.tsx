'use client'

import Link from 'next/link'
import Profile from './profile'

export default function Navbar() {
  return (
    <>
      <div className='h-20'></div>
      <nav className='bg-slate-100 text-black w-full fixed top-0 z-10 h-20 border-b border-slate-300 flex items-center justify-between px-4 sm:px-8'>
        <Link href='/' className='flex items-center'>
          <span className='text-xl font-bold'>Sinombre</span>
        </Link>
        <div className='flex items-center gap-4'>
          <Profile />
        </div>
      </nav>
    </>
  )
}
