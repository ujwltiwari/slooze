import { PrismaClient } from '@prisma/client'

console.log('Starting test...')
try {
    const prisma = new PrismaClient()
    console.log('Prisma Client instantiated successfully.')
    prisma.$disconnect()
} catch (e) {
    console.error('Failed to instantiate Prisma Client:', e)
}
