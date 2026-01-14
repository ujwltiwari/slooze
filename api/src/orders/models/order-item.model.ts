import { Field, Int, ObjectType } from '@nestjs/graphql';
import { MenuItem } from '../../menu-items/models/menu-item.model';

@ObjectType()
export class OrderItem {
    @Field(() => Int)
    id: number;

    @Field(() => Int)
    menuItemId: number;

    @Field(() => MenuItem)
    menuItem: MenuItem;

    @Field(() => Int)
    quantity: number;

    @Field(() => Int)
    unitPrice: number;
}
