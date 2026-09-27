import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function truncateAddress(address: string, chars = 4) {
	return `${address.slice(0, chars)}...${address.slice(-chars)}`
}

export function formatUsd(value: number) {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		maximumFractionDigits: 2,
	}).format(value)
}

export function formatSol(value: number) {
	return `${value.toFixed(value >= 1 ? 2 : 4)} SOL`
}
