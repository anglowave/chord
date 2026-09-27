import Link from 'next/link'

import { TokenCard } from '@/components/explore/token-card'
import { getRecentTokens } from '@/lib/supabase/tokens'

export async function RecentLaunches() {
	const tokens = await getRecentTokens(6)

	return (
		<section className="border-t border-border/60 bg-card/10 py-24 md:py-32">
			<div className="mx-auto max-w-6xl px-6">
				<div className="flex items-end justify-between gap-4">
					<div>
						<h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
							Recent launches
						</h2>
						<p className="mt-3 max-w-md text-muted-foreground">
							Tokens launched on Chord with stock pairings.
						</p>
					</div>
					<Link
						href="/explore"
						className="hidden text-sm text-muted-foreground transition-colors hover:text-accent sm:block"
					>
						View all
					</Link>
				</div>

				{tokens.length > 0 ? (
					<div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{tokens.map((token) => (
							<TokenCard key={token.mint} token={token} />
						))}
					</div>
				) : (
					<div className="mt-12 rounded-2xl border border-border bg-card/30 p-12 text-center">
						<p className="text-muted-foreground">
							No tokens launched yet. Be the first.
						</p>
						<Link
							href="/create"
							className="mt-4 inline-flex text-sm text-accent transition-colors hover:text-accent/80"
						>
							Launch a token
						</Link>
					</div>
				)}
			</div>
		</section>
	)
}
