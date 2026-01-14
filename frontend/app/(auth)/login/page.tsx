'use client'

import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

type FormData = { email: string; password: string }

export default function LoginPage() {
  const { register, handleSubmit } = useForm<FormData>()
  const { login, user, loading } = useAuth()
  const router = useRouter()

  if (!loading && user) {
    router.replace('/dashboard')
    return null
  }

  const onSubmit = async (data: FormData) => {
    try {
      await login(data.email, data.password)
      router.replace('/dashboard')
    } catch {
      alert('Invalid credentials')
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className='space-y-1'>
              <Label htmlFor='email'>Email</Label>
              <Input id='email' type='email' required {...register('email')} />
            </div>
            <div className='space-y-1'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                required
                {...register('password')}
              />
            </div>
            <Button type='submit' className='w-full' disabled={loading}>
              {loading ? 'Checking...' : 'Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
