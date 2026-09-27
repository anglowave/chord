import Image from 'next/image'
import Link from 'next/link'

import { STOCK_BY_ID } from '@/lib/stocks'
import {
	PUMP_FUN_COIN_URL,
	SOLANA_EXPLORER_ADDRESS_URL,
	SOLANA_EXPLORER_TX_URL,
} from '@/lib/pump/constants'
import type { TokenRecord } from '@/lib/supabase/types'
import { cn, formatUsd, truncateAddress } from '@/lib/utils'

interface StockPrice {
	usdPrice: number | null
	priceChange24h: number | null
}

interface TokenDetailProps {
	token: TokenRecord
	marketCap?: string | null
	prices: Record<string, StockPrice>
}

export function TokenDetail({
	token,
	marketCap,
	prices,
}: TokenDetailProps) {
	const marketCapSol = marketCap
		? Number(marketCap) / 1e9
		: null

	return (
		<div className="grid gap-8 lg:grid-cols-[320px_1fr]">
			<div className="space-y-6">
				<div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-card">
					<Image
						src={token.image_url}
						alt={token.name}
						fill
						className="object-cover"
						sizes="320px"
						priority
					/>
				</div>

				<div className="rounded-2xl border border-border bg-card/40 p-5">
					<p className="text-sm text-muted-foreground">Creator</p>
					<a
						href={`${SOLANA_EXPLORER_ADDRESS_URL}/${token.creator}`}
						target="_blank"
						rel="noopener noreferrer"
						className="mt-1 inline-block font-mono text-sm text-accent transition-colors hover:text-accent/80"
					>
						{truncateAddress(token.creator, 6)}
					</a>
					<p className="mt-4 text-sm text-muted-foreground">Mint</p>
					<p className="mt-1 break-all font-mono text-xs text-foreground">
						{token.mint}
					</p>
					{marketCapSol !== null && (
						<>
							<p className="mt-4 text-sm text-muted-foreground">
								Market cap
							</p>
							<p className="mt-1 font-mono text-lg text-accent">
								{marketCapSol.toFixed(2)} SOL
							</p>
						</>
					)}
				</div>
			</div>

			<div className="space-y-8">
				<div>
					<h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
						{token.name}
					</h1>
					<p className="mt-2 font-mono text-xl text-accent">
						${token.symbol}
					</p>
					{token.description && (
						<p className="mt-4 max-w-2xl text-muted-foreground">
							{token.description}
						</p>
					)}
				</div>

				<div>
					<h2 className="font-heading text-xl font-semibold">
						Stock pairings
					</h2>
					<p className="mt-2 text-sm text-muted-foreground">
						Tagged on Chord. On-chain quote is SOL via pump.fun.
					</p>
					<div className="mt-6 grid gap-4 sm:grid-cols-2">
						{token.stocks.map((stockId) => {
							const stock = STOCK_BY_ID[stockId as keyof typeof STOCK_BY_ID]
							if (!stock) return null

							const price = prices[stock.mint]

							return (
								<div
									key={stockId}
									className={cn(
										'flex items-center gap-4 rounded-xl border',
										'border-border bg-card/40 p-4',
									)}
								>
									<div className="flex size-12 items-center justify-center rounded-lg bg-secondary">
										<Image
											src={stock.logo}
											alt=""
											width={28}
											height={28}
											className="size-7 object-contain"
										/>
									</div>
									<div className="flex-1">
										<p className="font-heading font-semibold">
											{stock.name}
										</p>
										<p className="font-mono text-xs text-muted-foreground">
											{stock.symbol}
										</p>
									</div>
									<div className="text-right">
										<p className="font-mono text-sm text-foreground">
											{price?.usdPrice
												? formatUsd(price.usdPrice)
												: '—'}
										</p>
										{price?.priceChange24h != null && (
											<p
												className={cn(
													'font-mono text-xs',
													price.priceChange24h >= 0
														? 'text-accent'
														: 'text-destructive',
												)}
											>
												{price.priceChange24h >= 0 ? '+' : ''}
												{price.priceChange24h.toFixed(2)}%
											</p>
										)}
									</div>
								</div>
							)
						})}
					</div>
				</div>

				<div className="flex flex-wrap gap-4">
					<a
						href={`${PUMP_FUN_COIN_URL}/${token.mint}`}
						target="_blank"
						rel="noopener noreferrer"
						className={cn(
							'inline-flex h-11 items-center rounded-lg bg-accent px-6',
							'text-sm font-semibold text-accent-foreground transition-all',
							'hover:bg-accent/90 hover:shadow-[0_0_24px_rgba(134,239,172,0.25)]',
						)}
					>
						Trade on pump.fun
					</a>
					<a
						href={`${SOLANA_EXPLORER_TX_URL}/${token.signature}`}
						target="_blank"
						rel="noopener noreferrer"
						className={cn(
							'inline-flex h-11 items-center rounded-lg border border-border',
							'bg-card/50 px-6 text-sm font-medium text-foreground',
							'transition-colors hover:border-accent/30 hover:bg-card',
						)}
					>
						View transaction
					</a>
					<Link
						href="/explore"
						className={cn(
							'inline-flex h-11 items-center rounded-lg border border-border',
							'bg-card/50 px-6 text-sm font-medium text-foreground',
							'transition-colors hover:border-accent/30 hover:bg-card',
						)}
					>
						Back to explore
					</Link>
				</div>
			</div>
		</div>
	)
}
