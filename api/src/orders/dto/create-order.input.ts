import { Field, Int, InputType } from '@nestjs/graphql';

@InputType()
export class OrderItemInput {
  @Field(() => Int)
  menuItemId: number;

  @Field(() => Int)
  quantity: number;
}

@InputType()
export class CreateOrderInput {
  @Field(() => Int)
  restaurantId: number;

  @Field(() => [OrderItemInput])
  items: OrderItemInput[];
}
