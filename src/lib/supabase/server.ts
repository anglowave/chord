import { createClient, type SupabaseClient } from '@supabase/supabase-js'

import type { Database } from '@/lib/supabase/types'

export function hasSupabaseConfig() {
	return Boolean(
		process.env.NEXT_PUBLIC_SUPABASE_URL
		&& process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
	)
}

export function createServiceClient() {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL
	const key = process.env.SUPABASE_SERVICE_ROLE_KEY

	if (!url || !key) {
		throw new Error('Missing Supabase service environment variables')
	}

	return createClient<Database>(url, key, {
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
	}) as SupabaseClient<Database>
}

export function createAnonServerClient() {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL
	const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

	if (!url || !key) {
		return null
	}

	return createClient<Database>(url, key)
}
