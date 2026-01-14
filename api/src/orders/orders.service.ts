import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderInput } from './dto/create-order.input';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) { }

  async create(user: any, dto: CreateOrderInput) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: dto.restaurantId },
    });
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    if (user.role !== 'ADMIN' && restaurant.country !== user.country) {
      throw new ForbiddenException('Cross-country ordering not allowed');
    }

    const menuItemIds = dto.items.map((i) => i.menuItemId);
    const menuItems = await this.prisma.menuItem.findMany({
      where: { id: { in: menuItemIds } },
    });

    if (menuItems.length !== dto.items.length) {
      
      
      
    }

    let total = 0;
    const orderItemsData = dto.items.map((item) => {
      const mi = menuItems.find((m) => m.id === item.menuItemId);
      if (!mi) throw new NotFoundException(`Menu item ${item.menuItemId} not found`);
      total += mi.price * item.quantity;

      return {
        menuItemId: mi.id,
        quantity: item.quantity,
        unitPrice: mi.price,
      };
    });

    return this.prisma.order.create({
      data: {
        userId: user.id,
        restaurantId: restaurant.id,
        totalAmount: total,
        status: OrderStatus.PENDING,
        items: {
          create: orderItemsData,
        },
      },
      include: { items: true, restaurant: true, user: true },
    });
  }

  async findAll(user: any) {
    const include = { items: { include: { menuItem: true } }, restaurant: true, user: true };
    if (user.role === 'ADMIN') {
      return this.prisma.order.findMany({ include });
    }
    if (user.role === 'MANAGER') {
      return this.prisma.order.findMany({
        where: { restaurant: { country: user.country } },
        include,
      });
    }
    return this.prisma.order.findMany({
      where: { userId: user.id },
      include,
    });
  }

  async findOne(user: any, id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: { include: { menuItem: true } }, restaurant: true, user: true },
    });
    if (!order) throw new NotFoundException('Order not found');

    if (user.role === 'MEMBER' && order.userId !== user.id) {
      throw new ForbiddenException();
    }

    if (user.role === 'MANAGER' && order.restaurant.country !== user.country) {
      throw new ForbiddenException();
    }

    return order;
  }

  async checkout(user: any, id: number, paymentMethodId: number) {
    if (user.role === 'MEMBER')
      throw new ForbiddenException('Members cannot pay (Requirement spec)');

    
    const order = await this.findOne(user, id);

    if (order.status !== OrderStatus.PENDING) {
      throw new ForbiddenException('Only pending orders can be paid');
    }

    const pm = await this.prisma.paymentMethod.findUnique({
      where: { id: paymentMethodId },
    });

    
    
    
    
    
    
    if (!pm) throw new NotFoundException('Payment method not found');
    if (pm.userId !== user.id && user.role !== 'ADMIN') { 
      
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.payment.create({
        data: {
          orderId: order.id,
          paymentMethodId: pm.id,
          amount: order.totalAmount,
          status: 'SUCCESS',
        },
      });
      return tx.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.PAID },
        include: { items: { include: { menuItem: true } }, restaurant: true, user: true },
      });
    });
  }

  async cancel(user: any, id: number) {
    if (user.role === 'MEMBER')
      throw new ForbiddenException('Members cannot cancel');

    const order = await this.findOne(user, id);

    if (order.status === OrderStatus.CANCELLED) {
      return order;
    }

    return this.prisma.order.update({
      where: { id },
      data: { status: OrderStatus.CANCELLED },
      include: { items: true, restaurant: true, user: true },
    });
  }
}
