'use client'

import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useWallet } from '@solana/wallet-adapter-react'
import { useState } from 'react'
import { Copy, ExternalLink, LogOut } from 'lucide-react'

import { ConnectModal } from '@/components/wallet/connect-modal'
import { SOLANA_EXPLORER_ADDRESS_URL } from '@/lib/pump/constants'
import { cn, truncateAddress } from '@/lib/utils'

export function ConnectButton() {
	const { publicKey, disconnect, connected } = useWallet()
	const [open, setOpen] = useState(false)

	async function handleCopy() {
		if (!publicKey) return
		await navigator.clipboard.writeText(publicKey.toBase58())
	}

	if (!connected || !publicKey) {
		return (
			<>
				<button
					type="button"
					onClick={() => setOpen(true)}
					className={cn(
						'inline-flex h-9 items-center rounded-lg bg-accent px-4',
						'text-sm font-medium text-accent-foreground transition-all',
						'hover:bg-accent/90 hover:shadow-[0_0_24px_rgba(134,239,172,0.25)]',
					)}
				>
					Connect
				</button>
				<ConnectModal open={open} onOpenChange={setOpen} />
			</>
		)
	}

	const address = publicKey.toBase58()

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild>
				<button
					type="button"
					className={cn(
						'inline-flex h-9 items-center rounded-lg border border-border',
						'bg-card/50 px-4 font-mono text-sm text-foreground',
						'transition-colors hover:border-accent/30 hover:bg-card',
					)}
				>
					{truncateAddress(address)}
				</button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Portal>
				<DropdownMenu.Content
					align="end"
					className={cn(
						'z-50 min-w-[180px] rounded-xl border border-border',
						'bg-card p-1 shadow-xl',
					)}
				>
					<DropdownMenu.Item
						className={cn(
							'flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2',
							'text-sm text-muted-foreground outline-none',
							'transition-colors hover:bg-secondary hover:text-foreground',
						)}
						onSelect={() => void handleCopy()}
					>
						<Copy className="size-3.5" />
						Copy address
					</DropdownMenu.Item>
					<DropdownMenu.Item asChild>
						<a
							href={`${SOLANA_EXPLORER_ADDRESS_URL}/${address}`}
							target="_blank"
							rel="noopener noreferrer"
							className={cn(
								'flex items-center gap-2 rounded-lg px-3 py-2',
								'text-sm text-muted-foreground transition-colors',
								'hover:bg-secondary hover:text-foreground',
							)}
						>
							<ExternalLink className="size-3.5" />
							View on Solscan
						</a>
					</DropdownMenu.Item>
					<DropdownMenu.Separator className="my-1 h-px bg-border" />
					<DropdownMenu.Item
						className={cn(
							'flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2',
							'text-sm text-muted-foreground outline-none',
							'transition-colors hover:bg-secondary hover:text-foreground',
						)}
						onSelect={() => disconnect()}
					>
						<LogOut className="size-3.5" />
						Disconnect
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	)
}
