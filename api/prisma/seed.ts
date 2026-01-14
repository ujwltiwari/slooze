import { PrismaClient, Role, Country } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  const passwordHash = await bcrypt.hash('password', 10); // Standard password for all

  // 1. Create Restaurants
  const mumbaiDiner = await prisma.restaurant.create({
    data: {
      name: 'Mumbai Diner',
      country: Country.INDIA,
      address: '123 Mumbai Street',
      menuItems: {
        create: [
          { name: 'Paneer Butter Masala', price: 500 },
          { name: 'Naan Bread', price: 100 },
        ],
      },
    },
  });

  const nyEatery = await prisma.restaurant.create({
    data: {
      name: 'NY Eatery',
      country: Country.AMERICA,
      address: '456 NY Avenue',
      menuItems: {
        create: [
          { name: 'Cheeseburger', price: 1200 },
          { name: 'Fries', price: 400 },
        ],
      },
    },
  });

  // 2. Create Users (Personas)
  
  // Nick Fury (Admin)
  await prisma.user.upsert({
    where: { email: 'nick@slooze.xyz' },
    update: {},
    create: {
      email: 'nick@slooze.xyz',
      name: 'Nick Fury',
      passwordHash,
      role: Role.ADMIN,
      country: Country.INDIA, // Admin base
    },
  });

  // Captain Marvel (Manager - India)
  await prisma.user.upsert({
    where: { email: 'marvel@slooze.xyz' },
    update: {},
    create: {
      email: 'marvel@slooze.xyz',
      name: 'Captain Marvel',
      passwordHash,
      role: Role.MANAGER,
      country: Country.INDIA,
    },
  });

  // Captain America (Manager - America)
  await prisma.user.upsert({
    where: { email: 'cap@slooze.xyz' },
    update: {},
    create: {
      email: 'cap@slooze.xyz',
      name: 'Captain America',
      passwordHash,
      role: Role.MANAGER,
      country: Country.AMERICA,
    },
  });

  // Thanos (Member - India)
  await prisma.user.upsert({
    where: { email: 'thanos@slooze.xyz' },
    update: {},
    create: {
      email: 'thanos@slooze.xyz',
      name: 'Thanos',
      passwordHash,
      role: Role.MEMBER,
      country: Country.INDIA,
    },
  });

  // Thor (Member - India)
  await prisma.user.upsert({
    where: { email: 'thor@slooze.xyz' },
    update: {},
    create: {
      email: 'thor@slooze.xyz',
      name: 'Thor',
      passwordHash,
      role: Role.MEMBER,
      country: Country.INDIA,
    },
  });

  // Travis (Member - America)
  await prisma.user.upsert({
    where: { email: 'travis@slooze.xyz' },
    update: {},
    create: {
      email: 'travis@slooze.xyz',
      name: 'Travis',
      passwordHash,
      role: Role.MEMBER,
      country: Country.AMERICA,
    },
  });

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
