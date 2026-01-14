'use client'

import Link from 'next/link'
import { Protected } from '@/components/protected'
import { useAuth } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function DashboardPage() {
  const { user, logout } = useAuth()

  return (
    <Protected>
      <div className='min-h-screen bg-muted/40 p-6'>
        <div className='max-w-4xl mx-auto space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Welcome, {user?.email}</CardTitle>
            </CardHeader>
            <CardContent className='space-y-2'>
              <p>Role: {user?.role}</p>
              <p>Country: {user?.country}</p>
              <div className='flex gap-2 mt-4 flex-wrap'>
                <Button asChild variant='outline'>
                  <Link href='/restaurants'>Restaurants</Link>
                </Button>
                <Button asChild variant='outline'>
                  <Link href='/orders'>Orders</Link>
                </Button>
                <Button asChild variant='outline'>
                  <Link href='/payments'>Payment methods</Link>
                </Button>
                {user?.role === 'ADMIN' && (
                  <Button asChild variant='outline'>
                    <Link href='/admin/users'>Admin: Users</Link>
                  </Button>
                )}
                <Button variant='destructive' onClick={logout}>
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Protected>
  )
}
