'use client'

import Image from 'next/image'

import { STOCKS, type StockId } from '@/lib/stocks'
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
		<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
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
						<div className="flex size-10 items-center justify-center rounded-lg bg-secondary">
							<Image
								src={stock.logo}
								alt=""
								width={24}
								height={24}
								className="size-6 object-contain"
							/>
						</div>
						<span className="font-mono text-xs text-foreground">
							{stock.id}
						</span>
						<span className="text-center text-[11px] leading-tight text-muted-foreground">
							{stock.name}
						</span>
					</button>
				)
			})}
		</div>
	)
}
