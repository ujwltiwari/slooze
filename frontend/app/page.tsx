'use client';

import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Slooze Food Delivery</h1>
      
      {user ? (
        <div className="space-y-4 text-center">
          <p className="text-xl">Welcome, {user.name} ({user.role})</p>
          <div className="flex gap-4 justify-center">
            <Link href="/restaurants">
              <Button>Browse Restaurants</Button>
            </Link>
            <Link href="/orders">
              <Button variant="outline">My Orders</Button>
            </Link>
          </div>
          <Button variant="destructive" onClick={() => logout()}>Logout</Button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-xl">Please login to continue</p>
          <div className="flex gap-4">
            <Link href="/login">
              <Button>Login</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
