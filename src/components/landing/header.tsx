import Image from 'next/image'
import Link from 'next/link'

import { ConnectButton } from '@/components/wallet/connect-button'

function Wordmark() {
	return (
		<span className="font-heading text-lg font-bold tracking-tight">
			ch<span className="text-accent">ord</span>
		</span>
	)
}

export function Header() {
	return (
		<header className="sticky top-0 z-50 bg-transparent">
			<div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
				<Link href="/" className="group flex items-center gap-2.5">
					<Image
						src="/logo.png"
						alt=""
						width={144}
						height={100}
						priority
						className="h-9 w-auto transition-transform group-hover:scale-105"
					/>
					<Wordmark />
				</Link>

				<nav className="hidden items-center gap-8 md:flex">
					<Link
						href="/explore"
						className="text-sm text-muted-foreground transition-colors hover:text-foreground"
					>
						Explore
					</Link>
					<Link
						href="/create"
						className="text-sm text-muted-foreground transition-colors hover:text-foreground"
					>
						Launch
					</Link>
					<a
						href="#how-it-works"
						className="text-sm text-muted-foreground transition-colors hover:text-foreground"
					>
						How it works
					</a>
				</nav>

				<ConnectButton />
			</div>
		</header>
	)
}
