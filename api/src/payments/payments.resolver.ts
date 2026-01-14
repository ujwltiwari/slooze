import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PaymentsService } from './payments.service';
import { PaymentMethod } from './models/payment-method.model';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/user.decorator';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { RolesGuard } from '../auth/roles.guard';

@Resolver(() => PaymentMethod)
export class PaymentsResolver {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Mutation(() => PaymentMethod)
  async createPaymentMethod(
    @CurrentUser() user: any,
    @Args('userId', { type: () => Int }) userId: number,
    @Args('type') type: string,
    @Args('maskedDetails') maskedDetails: string,
  ) {
    return this.paymentsService.createPaymentMethod(user, userId, type, maskedDetails);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Mutation(() => PaymentMethod)
  async updatePaymentMethod(
    @CurrentUser() user: any,
    @Args('id', { type: () => Int }) id: number,
    @Args('type') type: string,
    @Args('maskedDetails') maskedDetails: string,
  ) {
    return this.paymentsService.updatePaymentMethod(user, id, { type, maskedDetails });
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [PaymentMethod])
  async paymentMethods(@CurrentUser() user: any) {
    return this.paymentsService.findAll(user);
  }
}
