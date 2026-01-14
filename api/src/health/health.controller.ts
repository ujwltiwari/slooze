import { Controller, Get, Injectable, InternalServerErrorException, HttpStatus } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { PrismaService } from "src/prisma/prisma.service";

@Controller("health")
export class HealthController {
  constructor(private readonly prisma: PrismaService) { }

  @Get()
  async healthCheck() {
    try {
      
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: "ok",
        database: "connected"
      };
    } catch (error) {
      console.error("Health check failed:", error);

      
      if (error instanceof PrismaClientKnownRequestError) {
        throw new InternalServerErrorException({
          status: "error",
          database: "disconnected",
          message: `Prisma error: ${error.message}`,
        });
      } else {
        throw new InternalServerErrorException({
          status: "error",
          database: "disconnected",
          message: "An unexpected error occurred during health check.",
        });
      }
    }
  }
}
