import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { User } from "../users/user.entity";
import { Payment } from "./payment.entity";

@Entity()
export class PaymentMethod {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.paymentMethods)
  user: User;

  @Column()
  userId: number;

  @Column()
  type: string;

  @Column()
  maskedDetails: string;

  @OneToMany(() => Payment, (payment) => payment.paymentMethod)
  payments: Payment[];
}
