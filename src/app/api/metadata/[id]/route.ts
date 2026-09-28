import { NextResponse } from 'next/server'

import { getTokenAsset } from '@/lib/assets'

interface MetadataRouteProps {
	params: Promise<{ id: string }>
}

export async function GET(
	_request: Request,
	{ params }: MetadataRouteProps,
) {
	const { id } = await params
	const asset = await getTokenAsset(id)

	if (!asset) {
		return NextResponse.json({ error: 'Not found' }, { status: 404 })
	}

	return NextResponse.json(asset.metadata, {
		headers: {
			'Cache-Control': 'public, max-age=31536000, immutable',
		},
	})
}
