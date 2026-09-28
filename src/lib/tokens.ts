import { connection } from 'next/server'

import { getPrisma } from '@/lib/db'

export interface TokenRecord {
	mint: string
	name: string
	symbol: string
	description: string | null
	image_url: string
	metadata_uri: string
	creator: string
	stocks: string[]
	signature: string
	created_at: string
}

interface TokenRow {
	mint: string
	name: string
	symbol: string
	description: string | null
	imageUrl: string
	metadataUri: string
	creator: string
	stocks: string[]
	signature: string
	createdAt: Date
}

function toRecord(token: TokenRow): TokenRecord {
	return {
		mint: token.mint,
		name: token.name,
		symbol: token.symbol,
		description: token.description,
		image_url: token.imageUrl,
		metadata_uri: token.metadataUri,
		creator: token.creator,
		stocks: token.stocks,
		signature: token.signature,
		created_at: token.createdAt.toISOString(),
	}
}

export async function getRecentTokens(limit = 6) {
	await connection()
	const prisma = getPrisma()
	if (!prisma) return []

	try {
		const tokens = await prisma.token.findMany({
			orderBy: { createdAt: 'desc' },
			take: limit,
		})
		return tokens.map(toRecord)
	} catch (error) {
		console.error('Failed to fetch recent tokens:', error)
		return []
	}
}

export async function getTokens(stock?: string) {
	await connection()
	const prisma = getPrisma()
	if (!prisma) return []

	try {
		const tokens = await prisma.token.findMany({
			where: stock ? { stocks: { has: stock } } : undefined,
			orderBy: { createdAt: 'desc' },
		})
		return tokens.map(toRecord)
	} catch (error) {
		console.error('Failed to fetch tokens:', error)
		return []
	}
}

export async function getTokenByMint(mint: string) {
	await connection()
	const prisma = getPrisma()
	if (!prisma) return null

	try {
		const token = await prisma.token.findUnique({ where: { mint } })
		return token ? toRecord(token) : null
	} catch (error) {
		console.error('Failed to fetch token:', error)
		return null
	}
}

export async function saveToken(input: Omit<TokenRecord, 'created_at'>) {
	const prisma = getPrisma()
	if (!prisma) {
		throw new Error('DATABASE_URL is not configured')
	}

	const token = await prisma.token.upsert({
		where: { mint: input.mint },
		create: {
			mint: input.mint,
			name: input.name,
			symbol: input.symbol,
			description: input.description,
			imageUrl: input.image_url,
			metadataUri: input.metadata_uri,
			creator: input.creator,
			stocks: input.stocks,
			signature: input.signature,
		},
		update: {
			name: input.name,
			symbol: input.symbol,
			description: input.description,
			imageUrl: input.image_url,
			metadataUri: input.metadata_uri,
			creator: input.creator,
			stocks: input.stocks,
			signature: input.signature,
		},
	})

	return toRecord(token)
}
