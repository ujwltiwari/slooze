import { Order } from "src/orders/order.entity";
import { PaymentMethod } from "src/payments/payment-method.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

export enum Role {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  MEMBER = "MEMBER",
}

export enum Country {
  INDIA = "INDIA",
  AMERICA = "AMERICA",
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  name: string;

  @Column({
    type: "enum",
    enum: Role,
    default: Role.MEMBER,
  })
  role: Role;

  @Column({
    type: "enum",
    enum: Country,
  })
  country: Country;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => PaymentMethod, (pm) => pm.user)
  paymentMethods: PaymentMethod[];
}
