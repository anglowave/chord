import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'gateway.pinata.cloud',
			},
			{
				protocol: 'https',
				hostname: 'ipfs.io',
			},
			{
				protocol: 'https',
				hostname: '**.supabase.co',
				pathname: '/storage/v1/object/public/**',
			},
			{
				protocol: 'https',
				hostname: 'xstocks-metadata.backed.fi',
			},
		],
	},
}

export default nextConfig
