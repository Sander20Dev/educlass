import LoginForm from '@/app/ui/login/login-form'

export default function Login() {
  return (
    <main className='flex items-center justify-center min-h-screen'>
      <div className='w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0'>
        <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
          <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl'>
            Sign in to your account
          </h1>
          <LoginForm />
        </div>
      </div>
    </main>
  )
}
