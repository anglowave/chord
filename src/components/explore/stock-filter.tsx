'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

import { STOCKS } from '@/lib/stocks'
import { cn } from '@/lib/utils'

export function StockFilter() {
	const searchParams = useSearchParams()
	const active = searchParams.get('stock')

	return (
		<div className="flex flex-wrap gap-2">
			<FilterLink href="/explore" active={!active}>
				All
			</FilterLink>
			{STOCKS.map((stock) => (
				<FilterLink
					key={stock.id}
					href={`/explore?stock=${stock.id}`}
					active={active === stock.id}
				>
					<Image
						src={stock.logo}
						alt=""
						width={14}
						height={14}
						className="size-3.5 object-contain"
					/>
					{stock.id}
				</FilterLink>
			))}
		</div>
	)
}

function FilterLink({
	href,
	active,
	children,
}: {
	href: string
	active: boolean
	children: React.ReactNode
}) {
	return (
		<Link
			href={href}
			className={cn(
				'inline-flex items-center gap-1.5 rounded-lg border px-3 py-2',
				'text-sm transition-colors',
				active
					? 'border-accent/30 bg-accent/10 text-accent'
					: 'border-border bg-card/30 text-muted-foreground hover:border-accent/15 hover:bg-card/50 hover:text-foreground',
			)}
		>
			{children}
		</Link>
	)
}
