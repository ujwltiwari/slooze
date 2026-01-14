import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { OrdersService } from './orders.service';
import { Order } from './models/order.model';
import { CreateOrderInput } from './dto/create-order.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/user.decorator';
import { OrderStatus } from '@prisma/client';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { RolesGuard } from '../auth/roles.guard';

@Resolver(() => Order)
export class OrdersResolver {
    constructor(private readonly ordersService: OrdersService) { }

    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.MEMBER)
    @Mutation(() => Order)
    async createOrder(
        @CurrentUser() user: any,
        @Args('createOrderInput') createOrderInput: CreateOrderInput,
    ) {
        return this.ordersService.create(user, createOrderInput);
    }

    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.MEMBER)
    @Query(() => [Order])
    async orders(@CurrentUser() user: any) {
        return this.ordersService.findAll(user);
    }

    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.MEMBER)
    @Query(() => Order)
    async order(
        @CurrentUser() user: any,
        @Args('id', { type: () => Int }) id: number,
    ) {
        return this.ordersService.findOne(user, id);
    }

    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.MANAGER)
    @Mutation(() => Order)
    async checkoutOrder(
        @CurrentUser() user: any,
        @Args('id', { type: () => Int }) id: number,
        @Args('paymentMethodId', { type: () => Int }) paymentMethodId: number,
    ) {
        return this.ordersService.checkout(user, id, paymentMethodId);
    }

    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.MANAGER)
    @Mutation(() => Order)
    async cancelOrder(
        @CurrentUser() user: any,
        @Args('id', { type: () => Int }) id: number,
    ) {
        return this.ordersService.cancel(user, id);
    }
}
