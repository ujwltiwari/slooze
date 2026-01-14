import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Country } from '@prisma/client';
import { MenuItem } from '../../menu-items/models/menu-item.model';

@ObjectType()
export class Restaurant {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field(() => Country)
  country: Country;

  @Field()
  address: string;

  @Field(() => [MenuItem], { nullable: true })
  menuItems?: MenuItem[];
}
