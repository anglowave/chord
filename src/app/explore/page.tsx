import { Suspense } from 'react'

import { TokenCard } from '@/components/explore/token-card'
import { StockFilter } from '@/components/explore/stock-filter'
import { Footer } from '@/components/landing/footer'
import { Header } from '@/components/landing/header'
import { STOCK_BY_ID, isValidStockId } from '@/lib/stocks'
import { getTokens } from '@/lib/tokens'

export const metadata = {
	title: 'Explore | chord',
}

interface ExplorePageProps {
	searchParams: Promise<{ stock?: string }>
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
	const params = await searchParams
	const stock = params.stock && isValidStockId(params.stock)
		? params.stock
		: undefined

	const tokens = await getTokens(stock)

	return (
		<div className="flex flex-1 flex-col">
			<Header />
			<main className="flex-1 py-16 md:py-24">
				<div className="mx-auto max-w-6xl px-6">
					<h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
						Explore
					</h1>
					<p className="mt-4 max-w-md text-muted-foreground">
						{stock
							? `Tokens paired with ${STOCK_BY_ID[stock].name}.`
							: 'All tokens launched on Chord.'}
					</p>

					<div className="mt-8">
						<Suspense fallback={null}>
							<StockFilter />
						</Suspense>
					</div>

					{tokens.length > 0 ? (
						<div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{tokens.map((token) => (
								<TokenCard key={token.mint} token={token} />
							))}
						</div>
					) : (
						<div className="mt-10 rounded-2xl border border-border bg-card/30 p-12 text-center">
							<p className="text-muted-foreground">
								No tokens found{stock ? ` for ${stock}` : ''}.
							</p>
						</div>
					)}
				</div>
			</main>
			<Footer />
		</div>
	)
}
