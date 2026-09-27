import {
	OnlinePumpSdk,
	PUMP_PROGRAM_ID,
} from '@pump-fun/pump-sdk'
import { Connection, PublicKey } from '@solana/web3.js'

export interface MetadataPair {
	symbol: string
	mint: string
}

export interface TokenMetadata {
	name: string
	symbol: string
	description?: string
	image: string
	pairs?: MetadataPair[]
}

export async function verifyTokenCreation(
	connection: Connection,
	mintAddress: string,
	signature: string,
	expectedCreator: string,
) {
	const mint = new PublicKey(mintAddress)
	const tx = await connection.getTransaction(signature, {
		maxSupportedTransactionVersion: 0,
		commitment: 'confirmed',
	})

	if (!tx || tx.meta?.err) {
		throw new Error('Transaction failed or not found')
	}

	const accountKeys = tx.transaction.message.getAccountKeys().staticAccountKeys
	const involvesPumpProgram = accountKeys.some(
		(key) => key.equals(PUMP_PROGRAM_ID),
	)

	if (!involvesPumpProgram) {
		throw new Error('Transaction does not involve pump.fun program')
	}

	const feePayer = accountKeys[0]?.toBase58()
	if (feePayer !== expectedCreator) {
		throw new Error('Creator does not match transaction fee payer')
	}

	const onlineSdk = new OnlinePumpSdk(connection)
	await onlineSdk.fetchBondingCurve(mint)

	return true
}

export async function fetchTokenMetadata(uri: string): Promise<TokenMetadata> {
	const response = await fetch(uri, { next: { revalidate: 60 } })

	if (!response.ok) {
		throw new Error('Failed to fetch token metadata')
	}

	return response.json() as Promise<TokenMetadata>
}
