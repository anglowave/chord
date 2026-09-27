import { createClient } from '@supabase/supabase-js'

import type { Database } from '@/lib/supabase/types'

export function createBrowserClient() {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL
	const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

	if (!url || !key) {
		throw new Error('Missing Supabase environment variables')
	}

	return createClient<Database>(url, key)
}
