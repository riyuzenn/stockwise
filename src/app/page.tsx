import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import LoginPage from '@/app/login-page'

export default async function HomePage() {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')

  if (session) {
    redirect('/dashboard')
  }

  return <LoginPage />
}
