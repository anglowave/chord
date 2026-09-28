'use client'

import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import { HERO_COMBOS, STOCK_BY_ID, type StockId } from '@/lib/stocks'
import { cn } from '@/lib/utils'

const WIDE_LOGOS = new Set<StockId>(['INTC', 'GME'])
const COMBO_HOLD_MS = 3800
const COMBO_FADE_MS = 900

export function Hero() {
	const [index, setIndex] = useState(0)
	const [previousIndex, setPreviousIndex] = useState<number | null>(null)
	const indexRef = useRef(0)

	useEffect(() => {
		const interval = setInterval(() => {
			const current = indexRef.current
			const next = (current + 1) % HERO_COMBOS.length
			indexRef.current = next
			setPreviousIndex(current)
			setIndex(next)
		}, COMBO_HOLD_MS)

		return () => clearInterval(interval)
	}, [])

	useEffect(() => {
		if (previousIndex === null) return

		const timeout = setTimeout(() => {
			setPreviousIndex(null)
		}, COMBO_FADE_MS)

		return () => clearTimeout(timeout)
	}, [previousIndex, index])

	return (
		<section className="relative pt-16 pb-8 md:pt-24 md:pb-12">
			<div className="relative mx-auto max-w-6xl px-6">
				<div className="mx-auto max-w-5xl text-center">
					<h1
						className={cn(
							'animate-fade-up font-heading text-4xl font-extrabold',
							'leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl',
						)}
					>
						<span className="block">Pair your tokens with</span>
						<span
							aria-live="polite"
							className="relative mt-3 grid min-h-[1.25em]"
						>
							{previousIndex !== null && (
								<ComboLine
									key={`leaving-${previousIndex}`}
									comboIndex={previousIndex}
									className="animate-combo-exit"
								/>
							)}
							<ComboLine
								key={`combo-${index}`}
								comboIndex={index}
								className={
									previousIndex === null
										? undefined
										: 'animate-combo-enter'
								}
							/>
						</span>
					</h1>

					<p className="animate-fade-up-delay-1 mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
						Launch on pump.fun with SOL, then tag your token with up to
						three tokenized stocks. Trade the narrative, not just the chart.
					</p>

					<div className="animate-fade-up-delay-2 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
						<Link
							href="/create"
							className={cn(
								'group inline-flex h-12 w-full items-center justify-center gap-2',
								'rounded-lg bg-accent px-8 text-base font-semibold',
								'text-accent-foreground transition-all hover:bg-accent/90',
								'hover:shadow-[0_0_32px_rgba(134,239,172,0.3)] sm:w-auto',
							)}
						>
							Launch a token
							<ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
						</Link>
						<Link
							href="/explore"
							className={cn(
								'inline-flex h-12 w-full items-center justify-center rounded-lg',
								'border border-border bg-card/50 px-8 text-base font-medium',
								'text-foreground backdrop-blur-sm transition-colors',
								'hover:border-accent/30 hover:bg-card sm:w-auto',
							)}
						>
							Explore
						</Link>
					</div>
				</div>
			</div>
		</section>
	)
}

function ComboLine({
	comboIndex,
	className,
}: {
	comboIndex: number
	className?: string
}) {
	const combo = HERO_COMBOS[comboIndex]
	const isLeaving = className?.includes('combo-exit')

	return (
		<span
			aria-hidden={isLeaving}
			className={cn(
				'col-start-1 row-start-1 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:gap-x-4',
				className,
			)}
		>
			{combo.map((id, index) => (
				<span key={id} className="contents">
					{index > 0 && (
						<span className="text-muted-foreground">+</span>
					)}
					<StockPairItem stock={STOCK_BY_ID[id]} />
				</span>
			))}
		</span>
	)
}

function StockPairItem({
	stock,
}: {
	stock: (typeof STOCK_BY_ID)[keyof typeof STOCK_BY_ID]
}) {
	return (
		<span className="inline-flex items-center gap-[0.18em]">
			<Image
				src={stock.logo.replace('/stocks/', '/stocks/color/')}
				alt=""
				width={80}
				height={80}
				className={cn(
					'shrink-0 object-contain',
					WIDE_LOGOS.has(stock.id)
						? 'h-[0.38em] w-auto'
						: 'h-[0.78em] w-[0.78em]',
				)}
			/>
			{stock.name}
		</span>
	)
}
