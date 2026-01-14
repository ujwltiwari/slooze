import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentMethod } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  private checkAdmin(user: any) {
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can manage payment methods');
    }
  }

  async findAll(user: any): Promise<PaymentMethod[]> {
    
    
    if (user.role === 'ADMIN') return this.prisma.paymentMethod.findMany();
    
    return this.prisma.paymentMethod.findMany({ where: { userId: user.id } });
  }

  async createPaymentMethod(
    user: any,
    userId: number,
    type: string,
    maskedDetails: string,
  ): Promise<PaymentMethod> {
    this.checkAdmin(user);
    
    return this.prisma.paymentMethod.create({
      data: {
        userId,
        type,
        maskedDetails,
      },
      include: { user: true },
    });
  }

  async updatePaymentMethod(
    user: any,
    id: number,
    data: Partial<Pick<PaymentMethod, 'type' | 'maskedDetails'>>,
  ): Promise<PaymentMethod> {
    this.checkAdmin(user);
    
    
    const pm = await this.prisma.paymentMethod.findUnique({ where: { id } });
    if (!pm) throw new NotFoundException('Payment method not found');

    return this.prisma.paymentMethod.update({
      where: { id },
      data,
      include: { user: true },
    });
  }
}
