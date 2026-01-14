import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthResponse } from './models/auth-response.model';
import { LoginInput } from './dto/login.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './gql-auth.guard';
import { User } from '../users/models/user.model';
import { CurrentUser } from './user.decorator';
import { GqlExecutionContext } from '@nestjs/graphql';

@Resolver()
export class AuthResolver {
    constructor(private authService: AuthService) { }

    @Mutation(() => AuthResponse)
    async login(@Args('loginInput') loginInput: LoginInput) {
        return this.authService.login(loginInput.email, loginInput.password);
    }

    @UseGuards(GqlAuthGuard)
    @Query(() => User)
    async me(@CurrentUser() user: any) {
        
        return user;
    }
}
