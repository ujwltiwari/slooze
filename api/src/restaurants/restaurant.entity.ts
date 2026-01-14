import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { MenuItem } from "../menu-items/menu-item.entity";
import { Order } from "../orders/order.entity";

export enum Country {
  INDIA = "INDIA",
  AMERICA = "AMERICA",
}

@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: "enum",
    enum: Country,
  })
  country: Country;

  @Column()
  address: string;

  @OneToMany(() => MenuItem, (menuItem) => menuItem.restaurant)
  menuItems: MenuItem[];

  @OneToMany(() => Order, (order) => order.restaurant)
  orders: Order[];
}
