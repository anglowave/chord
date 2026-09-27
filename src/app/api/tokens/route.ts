import {
	OnlinePumpSdk,
	bondingCurveMarketCap,
} from '@pump-fun/pump-sdk'
import { Connection, PublicKey } from '@solana/web3.js'
import { NextResponse } from 'next/server'

import { STOCK_BY_MINT } from '@/lib/stocks'
import { createServiceClient } from '@/lib/supabase/server'
import type { TokenRecord } from '@/lib/supabase/types'
import {
	fetchTokenMetadata,
	verifyTokenCreation,
} from '@/lib/pump/verify-token'

function getConnection() {
	const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL
		?? 'https://api.mainnet-beta.solana.com'

	return new Connection(rpcUrl, 'confirmed')
}

export async function POST(request: Request) {
	try {
		const body = await request.json() as {
			mint?: string
			signature?: string
			metadataUri?: string
			creator?: string
		}

		const { mint, signature, metadataUri, creator } = body

		if (!mint || !signature || !metadataUri || !creator) {
			return NextResponse.json(
				{ error: 'mint, signature, metadataUri, and creator are required' },
				{ status: 400 },
			)
		}

		const connection = getConnection()
		await verifyTokenCreation(connection, mint, signature, creator)

		const metadata = await fetchTokenMetadata(metadataUri)

		if (!metadata.pairs?.length) {
			return NextResponse.json(
				{ error: 'Metadata is missing stock pairings' },
				{ status: 400 },
			)
		}

		const stockIds = metadata.pairs
			.map((pair) => STOCK_BY_MINT[pair.mint]?.id)
			.filter(Boolean)

		if (stockIds.length !== metadata.pairs.length) {
			return NextResponse.json(
				{ error: 'Metadata contains unsupported stock pairings' },
				{ status: 400 },
			)
		}

		const supabase = createServiceClient()
		const insertPayload: Omit<TokenRecord, 'created_at'> = {
			mint,
			name: metadata.name,
			symbol: metadata.symbol,
			description: metadata.description ?? null,
			image_url: metadata.image,
			metadata_uri: metadataUri,
			creator,
			stocks: stockIds,
			signature,
		}

		const { data, error } = await supabase
			.from('tokens')
			.upsert(insertPayload as never, { onConflict: 'mint' })
			.select()
			.single()

		if (error) {
			throw new Error(error.message)
		}

		return NextResponse.json({ token: data })
	} catch (error) {
		console.error('Token registration failed:', error)
		return NextResponse.json(
			{
				error: error instanceof Error
					? error.message
					: 'Token registration failed',
			},
			{ status: 500 },
		)
	}
}

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url)
		const mint = searchParams.get('mint')

		if (!mint) {
			return NextResponse.json(
				{ error: 'mint query param is required' },
				{ status: 400 },
			)
		}

		const connection = getConnection()
		const onlineSdk = new OnlinePumpSdk(connection)
		const bondingCurve = await onlineSdk.fetchBondingCurve(new PublicKey(mint))
		const marketCap = bondingCurveMarketCap({
			mintSupply: bondingCurve.tokenTotalSupply,
			virtualQuoteReserves: bondingCurve.virtualQuoteReserves,
			virtualTokenReserves: bondingCurve.virtualTokenReserves,
		})

		return NextResponse.json({
			marketCap: marketCap.toString(),
			complete: bondingCurve.complete,
		})
	} catch (error) {
		console.error('Bonding curve fetch failed:', error)
		return NextResponse.json(
			{
				error: error instanceof Error
					? error.message
					: 'Failed to fetch bonding curve',
			},
			{ status: 500 },
		)
	}
}
