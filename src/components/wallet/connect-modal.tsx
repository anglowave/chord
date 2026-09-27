'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { useWallet, type Wallet } from '@solana/wallet-adapter-react'
import Image from 'next/image'
import { useMemo } from 'react'
import { X } from 'lucide-react'

import { CURATED_WALLETS } from '@/lib/wallets'
import { cn } from '@/lib/utils'

interface ConnectModalProps {
	open: boolean
	onOpenChange: (open: boolean) => void
}

function getWalletInstallUrl(name: string) {
	return CURATED_WALLETS.find(
		(wallet) => wallet.name.toLowerCase().includes(name.toLowerCase()),
	)?.url
}

export function ConnectModal({ open, onOpenChange }: ConnectModalProps) {
	const { wallets, select, connect, connecting } = useWallet()

	const detectedWallets = useMemo(
		() => wallets.filter((wallet) => wallet.readyState === 'Installed'),
		[wallets],
	)

	const otherWallets = useMemo(
		() => wallets.filter((wallet) => wallet.readyState !== 'Installed'),
		[wallets],
	)

	async function handleSelectWallet(wallet: Wallet) {
		try {
			select(wallet.adapter.name)
			await connect()
			onOpenChange(false)
		} catch (error) {
			console.error('Wallet connect failed:', error)
		}
	}

	return (
		<Dialog.Root open={open} onOpenChange={onOpenChange}>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
				<Dialog.Content
					className={cn(
						'fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md',
						'-translate-x-1/2 -translate-y-1/2 rounded-2xl border',
						'border-border bg-card p-6 shadow-xl',
					)}
				>
					<div className="mb-6 flex items-start justify-between">
						<div>
							<Dialog.Title className="font-heading text-xl font-semibold">
								Connect wallet
							</Dialog.Title>
							<Dialog.Description className="mt-1 text-sm text-muted-foreground">
								Choose a Solana wallet to launch tokens
							</Dialog.Description>
						</div>
						<Dialog.Close
							className="rounded-lg p-1 text-muted-foreground transition-colors hover:text-foreground"
							aria-label="Close"
						>
							<X className="size-4" />
						</Dialog.Close>
					</div>

					<div className="space-y-2">
						{CURATED_WALLETS.map((curated) => {
							const detected = detectedWallets.find((wallet) =>
								wallet.adapter.name
									.toLowerCase()
									.includes(curated.name.split(' ')[0].toLowerCase()),
							)

							return (
								<button
									key={curated.name}
									type="button"
									disabled={connecting}
									onClick={() => {
										if (detected) {
											void handleSelectWallet(detected)
											return
										}

										window.open(curated.url, '_blank', 'noopener,noreferrer')
									}}
									className={cn(
										'flex w-full items-center gap-3 rounded-xl border',
										'border-border bg-card/40 p-4 text-left transition-colors',
										'hover:border-accent/20 hover:bg-card/60',
										connecting && 'opacity-60',
									)}
								>
									<div className="flex size-10 items-center justify-center rounded-lg bg-secondary">
										<Image
											src={curated.icon}
											alt=""
											width={24}
											height={24}
											className="size-6 object-contain"
										/>
									</div>
									<div className="flex-1">
										<p className="font-medium text-foreground">
											{curated.name}
										</p>
										<p className="text-xs text-muted-foreground">
											{detected ? 'Detected' : 'Install to connect'}
										</p>
									</div>
								</button>
							)
						})}
					</div>

					{otherWallets.length > 0 && (
						<div className="mt-6">
							<p className="mb-2 text-xs text-muted-foreground">
								Other wallets
							</p>
							<div className="space-y-2">
								{otherWallets.map((wallet) => (
									<button
										key={wallet.adapter.name}
										type="button"
										disabled={connecting}
										onClick={() => void handleSelectWallet(wallet)}
										className={cn(
											'flex w-full items-center justify-between rounded-xl',
											'border border-border bg-card/30 px-4 py-3 text-left',
											'transition-colors hover:border-accent/15 hover:bg-card/50',
										)}
									>
										<span className="text-sm text-foreground">
											{wallet.adapter.name}
										</span>
										<span className="text-xs text-muted-foreground">
											{wallet.readyState}
										</span>
									</button>
								))}
							</div>
						</div>
					)}

					{detectedWallets.length === 0 && (
						<p className="mt-4 text-center text-xs text-muted-foreground">
							No wallet detected? Install one above, then refresh.
						</p>
					)}
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	)
}

export { getWalletInstallUrl }
