
'use client'

import { useState } from 'react'
import { Protected } from '@/components/protected'
import { useQuery, useMutation } from '@apollo/client/react'
import { GET_USERS_QUERY, CREATE_USER_MUTATION } from '@/lib/graphql'
import { useAuth, Role, Country } from '@/components/auth-provider'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select" 


export default function AdminUsersPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'

  const { data, loading, error, refetch } = useQuery(GET_USERS_QUERY);
  const users = (data as any)?.users || [];

  const [createUser] = useMutation(CREATE_USER_MUTATION, {
    onCompleted: () => {
      refetch();
      setForm({ name: '', email: '', password: '', role: 'MEMBER', country: 'INDIA' });
      alert('User created successfully');
    },
    onError: (e) => alert(e.message)
  });

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'MEMBER' as Role,
    country: 'INDIA' as Country,
  })

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  
  const handleSelectChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAdmin) return
    createUser({ variables: form });
  }

  if (loading) return <div className="p-6">Loading users...</div>
  if (error) return <div className='p-6 text-red-600'>Error: {error.message}</div>

  return (
    <Protected>
      <div className='p-6 space-y-6'>
        
        {isAdmin && (
          <Card>
            <CardHeader>
              <CardTitle>Create New User</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmit}
                className='flex flex-col gap-4'
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    name='name'
                    value={form.name}
                    onChange={handleChange}
                    placeholder='Name'
                    required
                  />
                  <Input
                    name='email'
                    type='email'
                    value={form.email}
                    onChange={handleChange}
                    placeholder='Email'
                    required
                  />
                  <Input
                    name='password'
                    type='password'
                    value={form.password}
                    onChange={handleChange}
                    placeholder='Password'
                    required
                  />
                  <div className="flex gap-4">
                    {}
                    <div className="w-full">
                        <select
                        name='role'
                        value={form.role}
                        onChange={(e) => handleSelectChange('role', e.target.value)}
                        className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
                        >
                        <option value='ADMIN'>ADMIN</option>
                        <option value='MANAGER'>MANAGER</option>
                        <option value='MEMBER'>MEMBER</option>
                        </select>
                    </div>
                    <div className="w-full">
                        <select
                        name='country'
                        value={form.country}
                        onChange={(e) => handleSelectChange('country', e.target.value)}
                        className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
                        >
                        <option value='INDIA'>INDIA</option>
                        <option value='AMERICA'>AMERICA</option>
                        </select>
                    </div>
                  </div>
                </div>
                <Button type='submit' className="w-full md:w-auto self-end">
                  Create User
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
             <CardTitle>All Users</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Country</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(users as any[]).map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.role}</TableCell>
                    <TableCell>{u.country}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Protected>
  )
}
