import Image from 'next/image'
import Link from 'next/link'

import { STOCK_BY_ID } from '@/lib/stocks'
import type { TokenRecord } from '@/lib/tokens'
import { cn } from '@/lib/utils'

interface TokenCardProps {
	token: TokenRecord
}

export function TokenCard({ token }: TokenCardProps) {
	return (
		<Link
			href={`/token/${token.mint}`}
			className={cn(
				'group flex flex-col rounded-2xl border border-border',
				'bg-card/40 p-5 transition-colors',
				'hover:border-accent/20 hover:bg-card/60',
			)}
		>
			<div className="flex items-start gap-4">
				<div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-secondary">
					<Image
						src={token.image_url}
						alt={token.name}
						fill
						className="object-cover"
						sizes="56px"
					/>
				</div>
				<div className="min-w-0 flex-1">
					<h3 className="truncate font-heading text-lg font-semibold">
						{token.name}
					</h3>
					<p className="font-mono text-sm text-accent">${token.symbol}</p>
				</div>
			</div>

			{token.description && (
				<p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
					{token.description}
				</p>
			)}

			<div className="mt-4 flex flex-wrap gap-2">
				{token.stocks.map((stockId) => {
					const stock = STOCK_BY_ID[stockId as keyof typeof STOCK_BY_ID]
					if (!stock) return null

					return (
						<div
							key={stockId}
							className={cn(
								'flex items-center gap-1.5 rounded-lg border',
								'border-border bg-secondary px-2 py-1',
							)}
						>
							<Image
								src={stock.logo}
								alt=""
								width={14}
								height={14}
								className="size-3.5 object-contain"
							/>
							<span className="text-xs text-muted-foreground">
								{stock.id}
							</span>
						</div>
					)
				})}
			</div>
		</Link>
	)
}
