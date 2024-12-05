'use client'

import { supabaseClient } from '@/app/lib/supabase.client'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)

    try {
      await supabaseClient.auth.signInWithPassword({
        email: formData.get('email')?.toString() ?? '',
        password: formData.get('password')?.toString() ?? '',
      })
      router.replace('/')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <form className='space-y-4 md:space-y-6' onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor='email'
          className='block mb-2 text-sm font-medium text-gray-900'>
          Your email
        </label>
        <input
          type='email'
          name='email'
          id='email'
          className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5'
          placeholder='name@company.com'
          required
        />
      </div>
      <div>
        <label
          htmlFor='password'
          className='block mb-2 text-sm font-medium text-gray-900'>
          Password
        </label>
        <input
          type='password'
          name='password'
          id='password'
          placeholder='••••••••'
          className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5'
          required
        />
      </div>
      <button
        type='submit'
        className='w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center'>
        Sign in
      </button>
      <p className='text-sm font-light text-gray-500'>
        Don’t have an account yet?{' '}
        <a href='#' className='font-medium text-blue-600 hover:underline'>
          Sign up
        </a>
      </p>
    </form>
  )
}
