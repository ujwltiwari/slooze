import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MenuItem {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field(() => Int)
  price: number;

  @Field()
  isAvailable: boolean;
  
  @Field(() => Int)
  restaurantId: number;
}
