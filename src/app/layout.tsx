import type { Metadata } from 'next'
import {
	Be_Vietnam_Pro,
	Inconsolata,
	Poppins,
} from 'next/font/google'

import { WalletProvider } from '@/components/wallet/wallet-provider'

import './globals.css'

const beVietnamPro = Be_Vietnam_Pro({
	variable: '--font-heading',
	subsets: ['latin'],
	weight: ['400', '500', '600', '700', '800'],
})

const poppins = Poppins({
	variable: '--font-sans',
	subsets: ['latin'],
	weight: ['300', '400', '500', '600'],
})

const inconsolata = Inconsolata({
	variable: '--font-mono',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'chord | Pair your tokens with stocks',
	description:
		'Pair your token with up to three tokenized stocks.',
	icons: {
		apple: '/logo.png',
	},
	twitter: {
		site: '@UseChord',
	},
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
	return (
		<html
			lang="en"
			className={`${beVietnamPro.variable} ${poppins.variable} ${inconsolata.variable} dark h-full antialiased`}
		>
			<body className="flex min-h-full flex-col font-sans">
				<WalletProvider>{children}</WalletProvider>
			</body>
		</html>
	)
}
