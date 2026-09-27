'use client'

import Image from 'next/image'

import { STOCKS, type StockId } from '@/lib/stocks'

const WIDE_LOGOS = new Set<StockId>(['INTC', 'GME'])
import { cn } from '@/lib/utils'

interface StockPickerProps {
	selected: StockId[]
	onChange: (selected: StockId[]) => void
	max?: number
}

export function StockPicker({
	selected,
	onChange,
	max = 3,
}: StockPickerProps) {
	function handleToggle(id: StockId) {
		if (selected.includes(id)) {
			onChange(selected.filter((item) => item !== id))
			return
		}

		if (selected.length >= max) return
		onChange([...selected, id])
	}

	return (
		<div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
			{STOCKS.map((stock) => {
				const isSelected = selected.includes(stock.id)
				const isDisabled = !isSelected && selected.length >= max

				return (
					<button
						key={stock.id}
						type="button"
						disabled={isDisabled}
						onClick={() => handleToggle(stock.id)}
						className={cn(
							'flex flex-col items-center gap-2 rounded-xl border p-4',
							'transition-colors',
							isSelected
								? 'border-accent/30 bg-accent/10'
								: 'border-border bg-card/30 hover:border-accent/15 hover:bg-card/50',
							isDisabled && 'cursor-not-allowed opacity-40',
						)}
					>
						<Image
							src={stock.logo.replace('/stocks/', '/stocks/color/')}
							alt=""
							width={40}
							height={40}
							className={cn(
								'object-contain',
								WIDE_LOGOS.has(stock.id)
									? 'h-5 w-auto max-w-[4.5rem]'
									: 'size-9',
							)}
						/>
						<span className="text-center text-sm font-medium text-foreground">
							{stock.name}
						</span>
					</button>
				)
			})}
		</div>
	)
}
