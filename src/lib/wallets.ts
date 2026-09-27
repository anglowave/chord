export interface WalletOption {
	name: string
	icon: string
	url: string
	deepLink?: string
}

export const CURATED_WALLETS: WalletOption[] = [
	{
		name: 'Phantom',
		icon: '/wallets/phantom.svg',
		url: 'https://phantom.app/download',
		deepLink: 'https://phantom.app/ul/browse',
	},
	{
		name: 'Solflare',
		icon: '/wallets/solflare.svg',
		url: 'https://solflare.com/download',
	},
	{
		name: 'Jupiter',
		icon: '/wallets/jupiter.svg',
		url: 'https://jup.ag/wallet',
	},
	{
		name: 'Backpack',
		icon: '/wallets/backpack.svg',
		url: 'https://backpack.app/download',
	},
	{
		name: 'OKX Wallet',
		icon: '/wallets/okx.svg',
		url: 'https://www.okx.com/web3',
	},
]
