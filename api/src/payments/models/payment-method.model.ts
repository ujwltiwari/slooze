import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaymentMethod {
    @Field(() => Int)
    id: number;

    @Field()
    type: string;

    @Field()
    maskedDetails: string;
}
