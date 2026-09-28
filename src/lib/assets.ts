import { randomUUID } from 'node:crypto'

import { getPrisma } from '@/lib/db'

const IMAGE_EXTENSIONS: Record<string, string> = {
	'image/jpeg': 'jpg',
	'image/jpg': 'jpg',
	'image/png': 'png',
	'image/webp': 'webp',
	'image/gif': 'gif',
}

export function imageExtension(mimeType: string) {
	return IMAGE_EXTENSIONS[mimeType] ?? null
}

export function createAssetId() {
	return randomUUID()
}

export async function saveTokenAsset(input: {
	id: string
	image: Buffer
	imageType: string
	metadata: object
}) {
	const prisma = getPrisma()
	if (!prisma) {
		throw new Error('DATABASE_URL is not configured')
	}

	await prisma.tokenAsset.create({
		data: {
			id: input.id,
			image: new Uint8Array(input.image),
			imageType: input.imageType,
			metadata: input.metadata,
		},
	})
}

export async function deleteTokenAsset(id: string) {
	const prisma = getPrisma()
	if (!prisma) return

	await prisma.tokenAsset.delete({ where: { id } }).catch(() => undefined)
}

export async function getTokenAsset(id: string) {
	const prisma = getPrisma()
	if (!prisma) return null

	return prisma.tokenAsset.findUnique({ where: { id } })
}
