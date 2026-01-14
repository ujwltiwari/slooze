'use client'

import { useState } from 'react'
import { Protected } from '@/components/protected'
import { useAuth } from '@/components/auth-provider'
import { useQuery, useMutation } from '@apollo/client/react'
import { GET_ORDERS_QUERY, GET_PAYMENT_METHODS_QUERY, CANCEL_MUTATION, CHECKOUT_MUTATION } from '@/lib/graphql'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type OrderItem = { id: number; menuItemId: number; quantity: number };
type Order = {
  id: number;
  restaurantId: number;
  status: string; 
  items: any[];
  restaurant: { name: string };
};

type PaymentMethod = { id: number; type: string; maskedDetails: string };

export default function OrdersPage() {
  const { user } = useAuth();
  const [selectedPm, setSelectedPm] = useState<Record<number, number | null>>({});

  const { data: ordersData, loading: ordersLoading, error: ordersError } = useQuery(GET_ORDERS_QUERY, {
    pollInterval: 5000,
  });
  
  const { data: pmData } = useQuery(GET_PAYMENT_METHODS_QUERY);

  const [cancelOrder] = useMutation(CANCEL_MUTATION, {
    refetchQueries: [GET_ORDERS_QUERY],
  });
  
  const [checkoutOrder] = useMutation(CHECKOUT_MUTATION, {
    refetchQueries: [GET_ORDERS_QUERY],
  });

  const orders: Order[] = (ordersData as any)?.orders || [];
  const methods: PaymentMethod[] = (pmData as any)?.paymentMethods || [];
  const loading = ordersLoading;
  const error = ordersError?.message;

  const canCheckout = user?.role === 'ADMIN' || user?.role === 'MANAGER';
  const canCancel = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  const handleCancel = async (id: number) => {
    try {
      await cancelOrder({ variables: { id } });
    } catch (e: any) {
      alert('Failed to cancel: ' + e.message);
    }
  };

  const handleCheckout = async (id: number) => {
    const pmId = selectedPm[id];
    if (!pmId) return;
    try {
      await checkoutOrder({ variables: { id, paymentMethodId: pmId } });
    } catch (e: any) {
      alert('Failed to checkout: ' + e.message);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <Badge variant="warning">Pending</Badge>;
      case 'PAID': return <Badge variant="success">Paid</Badge>;
      case 'CANCELLED': return <Badge variant="destructive">Cancelled</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Protected>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Your Orders</h1>
        </div>
        
        {loading && <p>Loading orders...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        
        {!loading && orders.length === 0 && (
            <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                    No orders found. Go to Restaurants to place one!
                </CardContent>
            </Card>
        )}

        {orders.length > 0 && (
            <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Restaurant</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Items</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-medium">#{o.id}</TableCell>
                  <TableCell>{o.restaurant?.name || 'Unknown'}</TableCell>
                  <TableCell>{getStatusBadge(o.status)}</TableCell>
                  <TableCell>{o.items.length} items</TableCell>
                  <TableCell className="text-right space-x-2">
                    {o.status === 'PENDING' && (
                      <div className="flex items-center justify-end gap-2">
                        {canCheckout && (
                          <div className="flex items-center gap-2">
                            <Select
                              value={selectedPm[o.id] ? String(selectedPm[o.id]) : ''}
                              onValueChange={(val) => setSelectedPm((prev) => ({ ...prev, [o.id]: Number(val) }))}
                            >
                              <SelectTrigger className="w-[140px] h-8">
                                <SelectValue placeholder="Pay with..." />
                              </SelectTrigger>
                              <SelectContent>
                                {methods.map((m) => (
                                  <SelectItem key={m.id} value={String(m.id)}>
                                    {m.type} •••• {m.maskedDetails}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              size="sm"
                              onClick={() => handleCheckout(o.id)}
                              disabled={!selectedPm[o.id]}
                            >
                              Pay
                            </Button>
                          </div>
                        )}
                        
                        {canCancel && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">Cancel</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Cancel Order #{o.id}?</AlertDialogTitle>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Keep Order</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleCancel(o.id)}>
                                  Yes, Cancel
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                        
                        {!canCheckout && !canCancel && <span className="text-xs text-muted-foreground">Read-only</span>}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        )}
      </div>
    </Protected>
  );
}
