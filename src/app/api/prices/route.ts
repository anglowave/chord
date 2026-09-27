import { NextResponse } from 'next/server'

import { STOCKS } from '@/lib/stocks'

export const dynamic = 'force-dynamic'
export const revalidate = 60

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url)
		const idsParam = searchParams.get('ids')

		const mints = idsParam
			? idsParam.split(',').filter(Boolean)
			: STOCKS.map((stock) => stock.mint)

		if (mints.length === 0) {
			return NextResponse.json({ prices: {} })
		}

		const response = await fetch(
			`https://lite-api.jup.ag/price/v3?ids=${mints.join(',')}`,
			{ next: { revalidate: 60 } },
		)

		if (!response.ok) {
			throw new Error('Jupiter price fetch failed')
		}

		const data = await response.json() as Record<
			string,
			{ usdPrice?: number; priceChange24h?: number }
		>

		const prices = Object.fromEntries(
			Object.entries(data).map(([mint, value]) => [
				mint,
				{
					usdPrice: value.usdPrice ?? null,
					priceChange24h: value.priceChange24h ?? null,
				},
			]),
		)

		return NextResponse.json({ prices })
	} catch (error) {
		console.error('Price fetch failed:', error)
		return NextResponse.json(
			{
				error: error instanceof Error
					? error.message
					: 'Failed to fetch prices',
			},
			{ status: 500 },
		)
	}
}
