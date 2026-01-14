"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
console.log('Starting test...');
try {
    const prisma = new client_1.PrismaClient();
    console.log('Prisma Client instantiated successfully.');
    prisma.$disconnect();
}
catch (e) {
    console.error('Failed to instantiate Prisma Client:', e);
}
