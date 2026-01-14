'use client';

import { useState } from 'react';
import { Protected } from '@/components/protected';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_RESTAURANTS_QUERY, CREATE_ORDER_MUTATION, GET_ORDERS_QUERY } from '@/lib/graphql';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type MenuItem = {
  id: number;
  name: string;
  price: number;
};
type Restaurant = { id: number; name: string; address: string; menuItems: MenuItem[] };

export default function RestaurantsPage() {
  const { data, loading, error } = useQuery(GET_RESTAURANTS_QUERY);
  const restaurants: Restaurant[] = (data as any)?.restaurants || [];
  
  const [createOrder] = useMutation(CREATE_ORDER_MUTATION, {
    refetchQueries: [GET_ORDERS_QUERY],
  });

  
  const [menuItemId, setMenuItemId] = useState('');
  const [quantity, setQuantity] = useState('1');

  const handleQuickOrder = async (restaurantId: number) => {
    if (!menuItemId || !quantity) return;
    try {
      await createOrder({
        variables: {
          restaurantId,
          items: [{ menuItemId: Number(menuItemId), quantity: Number(quantity) }],
        },
      });
      alert('Order created');
    } catch (e: any) {
      alert('Failed to create order: ' + e.message);
    }
  };

  return (
    <Protected>
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">Restaurants</h1>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-600">Error: {error.message}</p>}
        <div className="flex gap-4 mb-4">
          <div className="space-y-1">
            <Label htmlFor="menuItemId">Menu item ID</Label>
            <Input
              id="menuItemId"
              value={menuItemId}
              onChange={(e) => setMenuItemId(e.target.value)}
              placeholder="e.g. 1"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="qty">Qty</Label>
            <Input
              id="qty"
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {restaurants.map((r) => (
            <Card key={r.id}>
              <CardHeader>
                <CardTitle>{r.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{r.address}</p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Menu</h4>
                  {r.menuItems?.length > 0 ? (
                    <ul className="space-y-2">
                      {r.menuItems.map((item: any) => (
                        <li key={item.id} className="flex items-center justify-between text-sm border p-2 rounded">
                          <span>{item.name} (${item.price})</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              
                              setMenuItemId(item.id.toString());
                              setQuantity('1'); 
                              
                              
                              createOrder({
                                variables: {
                                  restaurantId: r.id,
                                  items: [{ menuItemId: Number(item.id), quantity: 1 }],
                                },
                              })
                                .then(() => alert(`Ordered 1x ${item.name}`))
                                .catch((e) => alert(e.message));
                            }}
                          >
                            Order 1
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No items available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Protected>
  );
}

