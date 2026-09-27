'use client'

import {
	getBuyTokenAmountFromSolAmount,
	OnlinePumpSdk,
	PUMP_SDK,
} from '@pump-fun/pump-sdk'
import { NATIVE_MINT } from '@solana/spl-token'
import {
	ComputeBudgetProgram,
	Connection,
	Keypair,
	PublicKey,
	Transaction,
} from '@solana/web3.js'
import BN from 'bn.js'

export interface CreateTokenParams {
	name: string
	symbol: string
	uri: string
	creator: PublicKey
	devBuySol?: number
}

export interface CreateTokenResult {
	mint: string
	signature: string
}

export async function createPumpToken(
	connection: Connection,
	wallet: {
		publicKey: PublicKey
		signTransaction: (tx: Transaction) => Promise<Transaction>
	},
	params: CreateTokenParams,
): Promise<CreateTokenResult> {
	const mintKeypair = Keypair.generate()
	const onlineSdk = new OnlinePumpSdk(connection)
	const global = await onlineSdk.fetchGlobal()

	const instructions = params.devBuySol && params.devBuySol > 0
		? await buildCreateAndBuyInstructions(
			global,
			mintKeypair.publicKey,
			params,
			params.devBuySol,
		)
		: [
			await PUMP_SDK.createV2Instruction({
				mint: mintKeypair.publicKey,
				name: params.name,
				symbol: params.symbol,
				uri: params.uri,
				creator: params.creator,
				user: params.creator,
				mayhemMode: false,
				cashback: false,
			}),
		]

	const transaction = new Transaction().add(
		ComputeBudgetProgram.setComputeUnitLimit({ units: 350_000 }),
		ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 100_000 }),
		...instructions,
	)

	const { blockhash, lastValidBlockHeight } =
		await connection.getLatestBlockhash('confirmed')

	transaction.recentBlockhash = blockhash
	transaction.feePayer = params.creator
	transaction.partialSign(mintKeypair)

	const signed = await wallet.signTransaction(transaction)
	const signature = await connection.sendRawTransaction(
		signed.serialize(),
		{ skipPreflight: false },
	)

	await connection.confirmTransaction(
		{ signature, blockhash, lastValidBlockHeight },
		'confirmed',
	)

	return {
		mint: mintKeypair.publicKey.toBase58(),
		signature,
	}
}

async function buildCreateAndBuyInstructions(
	global: Awaited<ReturnType<OnlinePumpSdk['fetchGlobal']>>,
	mint: PublicKey,
	params: CreateTokenParams,
	devBuySol: number,
) {
	const solAmount = new BN(Math.floor(devBuySol * 1e9))
	const amount = getBuyTokenAmountFromSolAmount({
		global,
		feeConfig: null,
		mintSupply: null,
		bondingCurve: null,
		amount: solAmount,
		quoteMint: NATIVE_MINT,
	})

	return PUMP_SDK.createV2AndBuyInstructions({
		global,
		mint,
		name: params.name,
		symbol: params.symbol,
		uri: params.uri,
		creator: params.creator,
		user: params.creator,
		amount,
		solAmount,
		mayhemMode: false,
		cashback: false,
	})
}
