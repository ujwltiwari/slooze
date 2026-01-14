import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PaymentMethod } from './payment-method.model';

@ObjectType()
export class Payment {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  orderId: number;

  @Field(() => Int)
  amount: number;

  @Field()
  status: string;

  @Field()
  createdAt: Date;
  
  @Field(() => PaymentMethod)
  paymentMethod: PaymentMethod;
}
