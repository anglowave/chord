import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

import { PrismaClient } from '@/generated/prisma/client'

const globalForPrisma = globalThis as typeof globalThis & {
	prisma?: PrismaClient
}

export function getPrisma() {
	const connectionString = process.env.DATABASE_URL
	if (!connectionString) return null

	if (globalForPrisma.prisma) return globalForPrisma.prisma

	const pool = new Pool({
		connectionString,
		max: 1,
	})
	const adapter = new PrismaPg(pool)
	const prisma = new PrismaClient({ adapter })
	globalForPrisma.prisma = prisma
	return prisma
}
