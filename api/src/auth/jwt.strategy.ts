import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import type { JwtUser } from "./user.decorator";
import type { Request } from "express";
import { UsersService } from "../users/users.service";

interface JwtPayload {
  sub: number;
  role: "ADMIN" | "MANAGER" | "MEMBER";
  country: "INDIA" | "AMERICA";
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request | undefined) => {
          const token = req?.cookies?.token ?? null;
          return token;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),

      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? "secretKey",
    });
  }

  async validate(payload: JwtPayload) {
    console.log("Validating JWT payload:", payload);
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
}
