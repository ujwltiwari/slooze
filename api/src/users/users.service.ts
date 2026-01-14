import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Role, Country } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async createUser(
    email: string,
    passwordHash: string,
    name: string,
    role: Role = Role.MEMBER,
    country: Country = Country.INDIA,
  ): Promise<User> {
    return this.prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role,
        country,
      },
    });
  }
}
