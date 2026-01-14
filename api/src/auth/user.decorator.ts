import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

export type JwtUser = {
  id: number;
  role: "ADMIN" | "MANAGER" | "MEMBER";
  country: "INDIA" | "AMERICA";
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): JwtUser | undefined => {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    return request.user as JwtUser | undefined;
  },
);
