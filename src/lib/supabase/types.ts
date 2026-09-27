export interface TokenRecord {
	mint: string
	name: string
	symbol: string
	description: string | null
	image_url: string
	metadata_uri: string
	creator: string
	stocks: string[]
	signature: string
	created_at: string
}

export interface Database {
	public: {
		Tables: {
			tokens: {
				Row: TokenRecord
				Insert: Omit<TokenRecord, 'created_at'> & {
					created_at?: string
				}
				Update: Partial<TokenRecord>
				Relationships: []
			}
		}
		Views: Record<string, never>
		Functions: Record<string, never>
		Enums: Record<string, never>
		CompositeTypes: Record<string, never>
	}
}
