import { createAnonServerClient } from '@/lib/supabase/server'
import type { TokenRecord } from '@/lib/supabase/types'

export async function getRecentTokens(limit = 6) {
	const supabase = createAnonServerClient()
	if (!supabase) return []

	const { data, error } = await supabase
		.from('tokens')
		.select('*')
		.order('created_at', { ascending: false })
		.limit(limit)

	if (error) {
		console.error('Failed to fetch recent tokens:', error.message)
		return []
	}

	return data as TokenRecord[]
}

export async function getTokens(stock?: string) {
	const supabase = createAnonServerClient()
	if (!supabase) return []

	let query = supabase
		.from('tokens')
		.select('*')
		.order('created_at', { ascending: false })

	if (stock) {
		query = query.contains('stocks', [stock])
	}

	const { data, error } = await query

	if (error) {
		console.error('Failed to fetch tokens:', error.message)
		return []
	}

	return data as TokenRecord[]
}

export async function getTokenByMint(mint: string) {
	const supabase = createAnonServerClient()
	if (!supabase) return null

	const { data, error } = await supabase
		.from('tokens')
		.select('*')
		.eq('mint', mint)
		.maybeSingle()

	if (error) {
		console.error('Failed to fetch token:', error.message)
		return null
	}

	return data as TokenRecord | null
}
