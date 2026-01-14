
'use client'

import { useState } from 'react'
import { Protected } from '@/components/protected'
import { useAuth } from '@/components/auth-provider'
import { useQuery, useMutation } from '@apollo/client/react'
import { GET_PAYMENT_METHODS_QUERY, CREATE_PAYMENT_METHOD_MUTATION, UPDATE_PAYMENT_METHOD_MUTATION } from '@/lib/graphql'

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

type PaymentMethod = {
  id: number
  type: string
  maskedDetails: string
}

export default function PaymentsPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'

  
  const { data, loading, error } = useQuery(GET_PAYMENT_METHODS_QUERY);
  const methods: PaymentMethod[] = (data as any)?.paymentMethods || [];

  
  const [createPaymentMethod] = useMutation(CREATE_PAYMENT_METHOD_MUTATION, {
    refetchQueries: [GET_PAYMENT_METHODS_QUERY]
  });
  
  const [updatePaymentMethod] = useMutation(UPDATE_PAYMENT_METHOD_MUTATION, {
    refetchQueries: [GET_PAYMENT_METHODS_QUERY]
  });

  
  const [newType, setNewType] = useState('CARD')
  const [newMaskedDetails, setNewMaskedDetails] = useState('')

  
  const [editRow, setEditRow] = useState<
    Record<number, { type: string; maskedDetails: string }>
  >({})

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAdmin) return

    try {
        await createPaymentMethod({
            variables: {
                userId: user?.id ? Number(user.id) : 0, 
                type: newType,
                maskedDetails: newMaskedDetails,
            }
        });
        setNewType('CARD')
        setNewMaskedDetails('')
        alert('Payment method added');
    } catch(e: any) {
        alert('Error: ' + e.message);
    }
  }

  const startEdit = (m: PaymentMethod) => {
    setEditRow((prev) => ({
      ...prev,
      [m.id]: { type: m.type, maskedDetails: m.maskedDetails },
    }))
  }

  const cancelEdit = (id: number) => {
    setEditRow((prev) => {
      const copy = { ...prev }
      delete copy[id]
      return copy
    })
  }

  const saveEdit = async (id: number) => {
    if (!isAdmin) return
    const row = editRow[id]
    if (!row) return

    try {
        await updatePaymentMethod({
            variables: {
                id,
                type: row.type,
                maskedDetails: row.maskedDetails
            }
        });
        cancelEdit(id)
    } catch(e: any) {
        alert('Update failed: ' + e.message);
    }
  }

  return (
    <Protected>
      <div className='p-6 space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle>Payment methods</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {loading && <p>Loading...</p>}
            {error && <p className='text-red-600'>Error: {error.message}</p>}
            {!loading && methods.length === 0 && (
              <p>No payment methods configured.</p>
            )}

            {methods.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Masked details</TableHead>
                    {isAdmin && <TableHead>Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {methods.map((m: any) => {
                    const editing = editRow[m.id]
                    return (
                      <TableRow key={m.id}>
                        <TableCell>{m.id}</TableCell>
                        <TableCell>
                          {editing ? (
                            <Input
                              value={editing.type}
                              onChange={(e) =>
                                setEditRow((prev) => ({
                                  ...prev,
                                  [m.id]: {
                                    ...prev[m.id],
                                    type: e.target.value,
                                  },
                                }))
                              }
                            />
                          ) : (
                            m.type
                          )}
                        </TableCell>
                        <TableCell>
                          {editing ? (
                            <Input
                              value={editing.maskedDetails}
                              onChange={(e) =>
                                setEditRow((prev) => ({
                                  ...prev,
                                  [m.id]: {
                                    ...prev[m.id],
                                    maskedDetails: e.target.value,
                                  },
                                }))
                              }
                            />
                          ) : (
                            m.maskedDetails || '-'
                          )}
                        </TableCell>
                        {isAdmin && (
                          <TableCell className='space-x-2'>
                            {editing ? (
                              <>
                                <Button
                                  size='sm'
                                  onClick={() => saveEdit(m.id)}
                                >
                                  Save
                                </Button>
                                <Button
                                  size='sm'
                                  variant='outline'
                                  onClick={() => cancelEdit(m.id)}
                                >
                                  Cancel
                                </Button>
                              </>
                            ) : (
                              <Button
                                size='sm'
                                variant='outline'
                                onClick={() => startEdit(m)}
                              >
                                Edit
                              </Button>
                            )}
                          </TableCell>
                        )}
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {isAdmin && (
          <Card>
            <CardHeader>
              <CardTitle>Add new payment method</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleCreate}
                className='flex flex-col md:flex-row gap-3'
              >
                <Input
                  placeholder='Type (e.g. CARD, UPI)'
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  required
                />
                <Input
                  placeholder='Masked details (e.g. Visa **** 4242)'
                  value={newMaskedDetails}
                  onChange={(e) => setNewMaskedDetails(e.target.value)}
                  required
                />
                <Button type='submit'>Add</Button>
              </form>
              <p className='text-xs text-muted-foreground mt-2'>
                Only Admin can create or update payment methods, per spec.
              </p>
            </CardContent>
          </Card>
        )}

        {!isAdmin && (
          <p className='text-xs text-muted-foreground'>
            You can view payment methods and use them during checkout. Only
            Admin can modify them.
          </p>
        )}
      </div>
    </Protected>
  )
}
