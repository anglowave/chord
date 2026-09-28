import Image from 'next/image'
import Link from 'next/link'

import { SITE_TWITTER_URL } from '@/lib/pump/constants'

function Wordmark() {
	return (
		<span className="font-heading text-sm font-bold tracking-tight">
			ch<span className="text-accent">ord</span>
		</span>
	)
}

export function Footer() {
	return (
		<footer className="border-t border-border/60 py-12">
			<div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
				<div className="flex items-center gap-2.5">
					<Image
						src="/logo.png"
						alt=""
						width={112}
						height={78}
						className="h-7 w-auto"
					/>
					<Wordmark />
				</div>

				<p className="text-center text-xs text-muted-foreground">
					Pair your tokens with tokenized stocks
				</p>

				<div className="flex items-center gap-6 text-xs text-muted-foreground">
					<Link
						href="/explore"
						className="transition-colors hover:text-foreground"
					>
						Explore
					</Link>
					<Link
						href="/create"
						className="transition-colors hover:text-foreground"
					>
						Launch
					</Link>
					<a
						href={SITE_TWITTER_URL}
						target="_blank"
						rel="noopener noreferrer"
						className="transition-colors hover:text-accent"
					>
						X
					</a>
					<a
						href="https://pump.fun"
						target="_blank"
						rel="noopener noreferrer"
						className="transition-colors hover:text-accent"
					>
						pump.fun
					</a>
				</div>
			</div>
		</footer>
	)
}
