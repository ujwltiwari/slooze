import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Restaurant, Country } from '@prisma/client';

interface User {
  role: string;
  country: Country;
}

@Injectable()
export class RestaurantsService {
  constructor(private prisma: PrismaService) { }

  async findAllForUser(user: User): Promise<Restaurant[]> {
    if (user.role === 'ADMIN') {
      return this.prisma.restaurant.findMany({
        include: { menuItems: true },
      });
    }

    return this.prisma.restaurant.findMany({
      where: { country: user.country },
      include: { menuItems: true },
    });
  }

  async findOneForUser(id: number, user: User): Promise<Restaurant | null> {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
      include: { menuItems: true },
    });

    if (!restaurant) return null;

    if (user.role !== 'ADMIN' && restaurant.country !== user.country) {
      
      return null;
    }

    return restaurant;
  }
}
