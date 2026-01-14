
'use client'

import { useState } from 'react'
import { Protected } from '@/components/protected'
import { useQuery, useMutation } from '@apollo/client/react'
import { GET_USERS_QUERY, CREATE_USER_MUTATION } from '@/lib/graphql'

export default function AdminUsers() {
  const { data, loading, error, refetch } = useQuery(GET_USERS_QUERY);
  const users = (data as any)?.users || [];

  const [createUser] = useMutation(CREATE_USER_MUTATION, {
    onCompleted: () => {
      refetch();
      setFormData({ name: '', email: '', password: '', role: 'MEMBER', country: 'INDIA' });
      alert('User created successfully');
    },
    onError: (e) => alert(e.message)
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'MEMBER',
    country: 'INDIA',
  })

  const handleChange = (e: any) =>
    setFormData((d) => ({ ...d, [e.target.name]: e.target.value }))

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    
    createUser({ variables: formData });
  }

  if (loading) return <p className="p-6">Loading users...</p>
  if (error) return <p className='p-6 text-red-600'>Error: {error.message}</p>

  return (
    <Protected>
      <div className='p-6'>
        <h1 className='text-3xl mb-4 text-white font-bold'>Admin User Management</h1>

        <form onSubmit={handleSubmit} className='mb-6 space-y-4 max-w-md bg-zinc-900 p-4 rounded-lg border border-zinc-800'>
            <h3 className="text-lg font-semibold text-white">Create New User</h3>
          <input
            name='name'
            placeholder='Name'
            value={formData.name}
            onChange={handleChange}
            className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
            required
          />
          <input
            name='email'
            type='email'
            placeholder='Email'
            value={formData.email}
            onChange={handleChange}
            className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
            required
          />
          <input
            name='password'
            type='password'
            placeholder='Password'
            value={formData.password}
            onChange={handleChange}
            className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
            required
          />
          <select
            name='role'
            value={formData.role}
            onChange={handleChange}
            className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
          >
            <option value='ADMIN'>Admin</option>
            <option value='MANAGER'>Manager</option>
            <option value='MEMBER'>Member</option>
          </select>
          <select
            name='country'
            value={formData.country}
            onChange={handleChange}
            className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
          >
            <option value='INDIA'>India</option>
            <option value='AMERICA'>America</option>
          </select>
          <button type='submit' className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 w-full'>
            Create User
          </button>
        </form>

        <div className="rounded-md border border-zinc-800">
        <table className='min-w-full text-sm mt-0'>
          <thead className="bg-zinc-900 border-b border-zinc-800">
            <tr>
              <th className='py-3 px-4 text-left font-medium text-zinc-400'>Name</th>
              <th className='py-3 px-4 text-left font-medium text-zinc-400'>Email</th>
              <th className='py-3 px-4 text-left font-medium text-zinc-400'>Role</th>
              <th className='py-3 px-4 text-left font-medium text-zinc-400'>Country</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u: any) => (
              <tr key={u.id} className='border-b border-zinc-800 hover:bg-zinc-900/50 transition-colors'>
                <td className='py-3 px-4 text-zinc-300'>{u.name}</td>
                <td className='py-3 px-4 text-zinc-300'>{u.email}</td>
                <td className='py-3 px-4 text-zinc-300'>{u.role}</td>
                <td className='py-3 px-4 text-zinc-300'>{u.country}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </Protected>
  )
}
