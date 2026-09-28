import { NextResponse } from 'next/server'

import {
	createAssetId,
	deleteTokenAsset,
	imageExtension,
	saveTokenAsset,
} from '@/lib/assets'
import { buildTokenMetadata } from '@/lib/metadata'
import { STOCK_BY_ID, isValidStockId } from '@/lib/stocks'

const MAX_IMAGE_SIZE = 4 * 1024 * 1024

export async function POST(request: Request) {
	try {
		const formData = await request.formData()
		const name = String(formData.get('name') ?? '').trim()
		const symbol = String(formData.get('symbol') ?? '').trim().toUpperCase()
		const description = String(formData.get('description') ?? '').trim()
		const twitter = String(formData.get('twitter') ?? '').trim()
		const telegram = String(formData.get('telegram') ?? '').trim()
		const website = String(formData.get('website') ?? '').trim()
		const stocksRaw = String(formData.get('stocks') ?? '')
		const image = formData.get('image')

		if (!name || !symbol) {
			return NextResponse.json(
				{ error: 'Name and symbol are required' },
				{ status: 400 },
			)
		}

		if (!(image instanceof File)) {
			return NextResponse.json(
				{ error: 'Image is required' },
				{ status: 400 },
			)
		}

		if (image.size > MAX_IMAGE_SIZE) {
			return NextResponse.json(
				{ error: 'Image must be 4MB or smaller' },
				{ status: 400 },
			)
		}

		let stockIds: string[]

		try {
			stockIds = JSON.parse(stocksRaw) as string[]
		} catch {
			return NextResponse.json(
				{ error: 'Invalid stocks payload' },
				{ status: 400 },
			)
		}

		if (!Array.isArray(stockIds) || stockIds.length < 1 || stockIds.length > 3) {
			return NextResponse.json(
				{ error: 'Select 1 to 3 stocks' },
				{ status: 400 },
			)
		}

		if (!stockIds.every(isValidStockId)) {
			return NextResponse.json(
				{ error: 'Invalid stock selection' },
				{ status: 400 },
			)
		}

		const uniqueStocks = new Set(stockIds)
		if (uniqueStocks.size !== stockIds.length) {
			return NextResponse.json(
				{ error: 'Duplicate stocks are not allowed' },
				{ status: 400 },
			)
		}

		if (!imageExtension(image.type)) {
			return NextResponse.json(
				{ error: 'Image must be a PNG, JPG, WEBP, or GIF' },
				{ status: 400 },
			)
		}

		const id = createAssetId()
		const origin = new URL(request.url).origin
		const imageUrl = `${origin}/api/media/${id}`
		const uri = `${origin}/api/metadata/${id}`
		const imageType = image.type === 'image/jpg'
			? 'image/jpeg'
			: image.type

		const pairs = stockIds.map((stockId) => ({
			symbol: STOCK_BY_ID[stockId].symbol,
			mint: STOCK_BY_ID[stockId].mint,
		}))

		const metadata = buildTokenMetadata({
			name,
			symbol,
			description,
			image: imageUrl,
			twitter: twitter || undefined,
			telegram: telegram || undefined,
			website: website || undefined,
			pairs,
		})

		try {
			await saveTokenAsset({
				id,
				image: Buffer.from(await image.arrayBuffer()),
				imageType,
				metadata,
			})
		} catch (error) {
			await deleteTokenAsset(id)
			throw error
		}

		return NextResponse.json({ uri, imageUrl })
	} catch (error) {
		console.error('Upload failed:', error)
		return NextResponse.json(
			{
				error: error instanceof Error
					? error.message
					: 'Upload failed',
			},
			{ status: 500 },
		)
	}
}
