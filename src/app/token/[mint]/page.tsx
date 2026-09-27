import { notFound } from 'next/navigation'

import { Footer } from '@/components/landing/footer'
import { Header } from '@/components/landing/header'
import { TokenDetail } from '@/components/token/token-detail'
import { STOCK_BY_ID } from '@/lib/stocks'
import { getTokenByMint } from '@/lib/supabase/tokens'

interface TokenPageProps {
	params: Promise<{ mint: string }>
}

async function fetchPrices(mints: string[]) {
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
	const response = await fetch(
		`${baseUrl}/api/prices?ids=${mints.join(',')}`,
		{ next: { revalidate: 60 } },
	)

	if (!response.ok) return {}

	const data = await response.json() as {
		prices: Record<string, { usdPrice: number | null; priceChange24h: number | null }>
	}

	return data.prices ?? {}
}

async function fetchMarketCap(mint: string) {
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
	const response = await fetch(
		`${baseUrl}/api/tokens?mint=${mint}`,
		{ next: { revalidate: 30 } },
	)

	if (!response.ok) return null

	const data = await response.json() as { marketCap?: string }
	return data.marketCap ?? null
}

export async function generateMetadata({ params }: TokenPageProps) {
	const { mint } = await params
	const token = await getTokenByMint(mint)

	if (!token) {
		return { title: 'Token not found | chord' }
	}

	return {
		title: `${token.name} ($${token.symbol}) | chord`,
		description: token.description ?? `Token paired with ${token.stocks.join(', ')}`,
	}
}

export default async function TokenPage({ params }: TokenPageProps) {
	const { mint } = await params
	const token = await getTokenByMint(mint)

	if (!token) {
		notFound()
	}

	const stockMints = token.stocks
		.map((id) => STOCK_BY_ID[id as keyof typeof STOCK_BY_ID]?.mint)
		.filter(Boolean)

	const [prices, marketCap] = await Promise.all([
		fetchPrices(stockMints),
		fetchMarketCap(mint),
	])

	return (
		<div className="flex flex-1 flex-col">
			<Header />
			<main className="flex-1 py-16 md:py-24">
				<div className="mx-auto max-w-6xl px-6">
					<TokenDetail
						token={token}
						prices={prices}
						marketCap={marketCap}
					/>
				</div>
			</main>
			<Footer />
		</div>
	)
}
