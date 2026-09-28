import { NextResponse } from 'next/server'

import { getTokenAsset } from '@/lib/assets'

interface MediaRouteProps {
	params: Promise<{ id: string }>
}

export async function GET(_request: Request, { params }: MediaRouteProps) {
	const { id } = await params
	const asset = await getTokenAsset(id)

	if (!asset) {
		return NextResponse.json({ error: 'Not found' }, { status: 404 })
	}

	return new NextResponse(Buffer.from(asset.image), {
		headers: {
			'Content-Type': asset.imageType,
			'Cache-Control': 'public, max-age=31536000, immutable',
		},
	})
}
