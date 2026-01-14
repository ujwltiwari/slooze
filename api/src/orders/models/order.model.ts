import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { OrderStatus } from '@prisma/client';
import { OrderItem } from './order-item.model';
import { Restaurant } from '../../restaurants/models/restaurant.model';
import { User } from '../../users/models/user.model';

registerEnumType(OrderStatus, { name: 'OrderStatus' });

@ObjectType()
export class Order {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  userId: number;

  @Field(() => User)
  user: User;

  @Field(() => Int)
  restaurantId: number;

  @Field(() => Restaurant)
  restaurant: Restaurant;

  @Field(() => OrderStatus)
  status: OrderStatus;

  @Field(() => Int)
  totalAmount: number;

  @Field()
  createdAt: Date;

  @Field(() => [OrderItem])
  items: OrderItem[];
}
