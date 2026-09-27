'use client'

import { WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react'
import { ConnectionProvider } from '@solana/wallet-adapter-react'
import { useMemo } from 'react'

export function WalletProvider({ children }: { children: React.ReactNode }) {
	const endpoint = useMemo(
		() => process.env.NEXT_PUBLIC_RPC_URL
			?? 'https://api.mainnet-beta.solana.com',
		[],
	)

	return (
		<ConnectionProvider endpoint={endpoint}>
			<SolanaWalletProvider wallets={[]} autoConnect>
				{children}
			</SolanaWalletProvider>
		</ConnectionProvider>
	)
}
