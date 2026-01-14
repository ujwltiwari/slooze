import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './models/restaurant.model';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/user.decorator';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { RolesGuard } from '../auth/roles.guard';

@Resolver(() => Restaurant)
export class RestaurantsResolver {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER, Role.MEMBER)
  @Query(() => [Restaurant])
  async restaurants(@CurrentUser() user: any) {
    return this.restaurantsService.findAllForUser(user);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER, Role.MEMBER)
  @Query(() => Restaurant, { nullable: true })
  async restaurant(
    @CurrentUser() user: any,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.restaurantsService.findOneForUser(id, user);
  }
}
