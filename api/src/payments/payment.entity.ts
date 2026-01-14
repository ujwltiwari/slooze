import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { Order } from "../orders/order.entity";
import { PaymentMethod } from "./payment-method.entity";

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.payments)
  order: Order;

  @Column()
  orderId: number;

  @ManyToOne(() => PaymentMethod, (pm) => pm.payments)
  paymentMethod: PaymentMethod;

  @Column()
  paymentMethodId: number;

  @Column("int")
  amount: number;

  @Column()
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}
