import { NextResponse } from 'next/server'

import { buildTokenMetadata } from '@/lib/metadata'
import { STOCK_BY_ID, isValidStockId } from '@/lib/stocks'

const MAX_IMAGE_SIZE = 4 * 1024 * 1024

async function pinToIpfs(
	name: string,
	file: Blob,
	metadata?: Record<string, string>,
) {
	const jwt = process.env.PINATA_JWT

	if (!jwt) {
		throw new Error('PINATA_JWT is not configured')
	}

	const formData = new FormData()
	formData.append('file', file, name)

	if (metadata) {
		formData.append('pinataMetadata', JSON.stringify({ name, keyvalues: metadata }))
	}

	const response = await fetch(
		'https://api.pinata.cloud/pinning/pinFileToIPFS',
		{
			method: 'POST',
			headers: {
				Authorization: `Bearer ${jwt}`,
			},
			body: formData,
		},
	)

	if (!response.ok) {
		const error = await response.text()
		throw new Error(`Pinata upload failed: ${error}`)
	}

	const data = await response.json() as { IpfsHash: string }
	return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`
}

async function pinJsonToIpfs(name: string, json: unknown) {
	const jwt = process.env.PINATA_JWT

	if (!jwt) {
		throw new Error('PINATA_JWT is not configured')
	}

	const response = await fetch(
		'https://api.pinata.cloud/pinning/pinJSONToIPFS',
		{
			method: 'POST',
			headers: {
				Authorization: `Bearer ${jwt}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				pinataMetadata: { name },
				pinataContent: json,
			}),
		},
	)

	if (!response.ok) {
		const error = await response.text()
		throw new Error(`Pinata JSON upload failed: ${error}`)
	}

	const data = await response.json() as { IpfsHash: string }
	return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`
}

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

		const imageUrl = await pinToIpfs(
			`${symbol}-image`,
			image,
			{ type: 'token-image', symbol },
		)

		const pairs = stockIds.map((id) => ({
			symbol: STOCK_BY_ID[id].symbol,
			mint: STOCK_BY_ID[id].mint,
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

		const uri = await pinJsonToIpfs(`${symbol}-metadata`, metadata)

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
