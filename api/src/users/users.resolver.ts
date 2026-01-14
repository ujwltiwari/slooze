import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './models/user.model';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { Country } from '@prisma/client'; 
import * as bcrypt from 'bcrypt';

@Resolver(() => User)
export class UsersResolver {
    constructor(private readonly usersService: UsersService) { }

    @Query(() => [User])
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async users() {
        return this.usersService.findAll();
    }

    @Query(() => User)
    async user(@Args('id', { type: () => Int }) id: number) {
        return this.usersService.findById(id);
    }

    @Mutation(() => User)
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async createUser(
        @Args('email') email: string,
        @Args('password') password: string,
        @Args('name') name: string,
        @Args('role') role: string, 
        @Args('country') country: string, 
    ) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return this.usersService.createUser(
            email,
            hashedPassword,
            name,
            role as Role,
            country as Country,
        );
    }
}
