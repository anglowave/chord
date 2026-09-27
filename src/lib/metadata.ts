import { CREATED_ON } from '@/lib/pump/constants'
import type { MetadataPair } from '@/lib/pump/verify-token'

export interface TokenMetadataInput {
	name: string
	symbol: string
	description?: string
	image: string
	twitter?: string
	telegram?: string
	website?: string
	pairs: MetadataPair[]
}

export function buildTokenMetadata(input: TokenMetadataInput) {
	return {
		name: input.name,
		symbol: input.symbol,
		description: input.description ?? '',
		image: input.image,
		showName: true,
		createdOn: CREATED_ON,
		...(input.twitter ? { twitter: input.twitter } : {}),
		...(input.telegram ? { telegram: input.telegram } : {}),
		...(input.website ? { website: input.website } : {}),
		pairs: input.pairs,
	}
}
