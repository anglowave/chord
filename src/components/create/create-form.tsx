'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { StockPicker } from '@/components/create/stock-picker'
import { ConnectModal } from '@/components/wallet/connect-modal'
import { createPumpToken } from '@/lib/pump/create-token'
import { STOCK_ID_ENUM } from '@/lib/stocks'
import { cn } from '@/lib/utils'

const createSchema = z.object({
	name: z.string().min(1, 'Name is required').max(32),
	symbol: z.string().min(1, 'Ticker is required').max(10),
	description: z.string().max(500).optional(),
	twitter: z.string().url().optional().or(z.literal('')),
	telegram: z.string().url().optional().or(z.literal('')),
	website: z.string().url().optional().or(z.literal('')),
	devBuySol: z.coerce.number().min(0).max(10).optional(),
	stocks: z
		.array(z.enum(STOCK_ID_ENUM))
		.min(1, 'Select at least one stock')
		.max(3, 'Select up to three stocks'),
})

type CreateFormValues = z.infer<typeof createSchema>

type Step =
	| 'idle'
	| 'uploading'
	| 'signing'
	| 'confirming'
	| 'registering'
	| 'done'
	| 'error'

const STEP_LABELS: Record<Step, string> = {
	idle: '',
	uploading: 'Uploading metadata to IPFS…',
	signing: 'Sign the transaction in your wallet…',
	confirming: 'Confirming on Solana…',
	registering: 'Registering your token…',
	done: 'Token launched successfully',
	error: 'Something went wrong',
}

export function CreateForm() {
	const router = useRouter()
	const { connection } = useConnection()
	const { publicKey, connected, signTransaction } = useWallet()
	const [image, setImage] = useState<File | null>(null)
	const [imagePreview, setImagePreview] = useState<string | null>(null)
	const [step, setStep] = useState<Step>('idle')
	const [error, setError] = useState<string | null>(null)
	const [connectOpen, setConnectOpen] = useState(false)

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<CreateFormValues>({
		resolver: zodResolver(createSchema),
		defaultValues: {
			stocks: [],
			devBuySol: 0,
		},
	})

	const selectedStocks = watch('stocks')
	const devBuySol = watch('devBuySol')

	function handleDevBuyStep(direction: 1 | -1) {
		const current = Number(devBuySol) || 0
		const next = Math.min(
			10,
			Math.max(0, Math.round((current + direction * 0.01) * 100) / 100),
		)
		setValue('devBuySol', next, { shouldValidate: true, shouldDirty: true })
	}

	function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0]
		if (!file) return

		setImage(file)
		setImagePreview(URL.createObjectURL(file))
	}

	async function onSubmit(values: CreateFormValues) {
		if (!connected || !publicKey) {
			setConnectOpen(true)
			return
		}

		if (!image) {
			setError('Token image is required')
			return
		}

		if (!signTransaction) {
			setError('Wallet does not support signing transactions')
			return
		}

		setError(null)

		try {
			setStep('uploading')
			const formData = new FormData()
			formData.append('name', values.name)
			formData.append('symbol', values.symbol)
			formData.append('description', values.description ?? '')
			formData.append('twitter', values.twitter ?? '')
			formData.append('telegram', values.telegram ?? '')
			formData.append('website', values.website ?? '')
			formData.append('stocks', JSON.stringify(values.stocks))
			formData.append('image', image)

			const uploadResponse = await fetch('/api/upload', {
				method: 'POST',
				body: formData,
			})

			const uploadData = await uploadResponse.json() as {
				uri?: string
				error?: string
			}

			if (!uploadResponse.ok || !uploadData.uri) {
				throw new Error(uploadData.error ?? 'Upload failed')
			}

			setStep('signing')
			const result = await createPumpToken(
				connection,
				{
					publicKey,
					signTransaction,
				},
				{
					name: values.name,
					symbol: values.symbol,
					uri: uploadData.uri,
					creator: publicKey,
					devBuySol: values.devBuySol,
				},
			)

			setStep('registering')
			const registerResponse = await fetch('/api/tokens', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					mint: result.mint,
					signature: result.signature,
					metadataUri: uploadData.uri,
					creator: publicKey.toBase58(),
				}),
			})

			const registerData = await registerResponse.json() as {
				error?: string
			}

			if (!registerResponse.ok) {
				throw new Error(registerData.error ?? 'Registration failed')
			}

			setStep('done')
			router.push(`/token/${result.mint}`)
		} catch (submitError) {
			console.error(submitError)
			setStep('error')
			setError(
				submitError instanceof Error
					? submitError.message
					: 'Launch failed',
			)
		}
	}

	const isBusy = step !== 'idle' && step !== 'done' && step !== 'error'

	return (
		<>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="space-y-8"
			>
				<div className="grid items-stretch gap-6 sm:grid-cols-[180px_1fr]">
					<div className="flex flex-col">
						<label className="text-sm font-medium text-foreground">
							Token image
						</label>
						<label
							className={cn(
								'mt-2 flex min-h-44 flex-1 cursor-pointer flex-col',
								'items-center justify-center rounded-2xl border',
								'border-dashed border-border bg-card/30 px-3 text-center',
								'transition-colors hover:border-accent/20 hover:bg-card/50',
							)}
						>
							{imagePreview ? (
								// eslint-disable-next-line @next/next/no-img-element
								<img
									src={imagePreview}
									alt="Preview"
									className="size-full rounded-2xl object-cover"
								/>
							) : (
								<span className="text-sm text-muted-foreground">
									Upload image
									<span className="mt-1 block text-xs">Max 4MB</span>
								</span>
							)}
							<input
								type="file"
								accept="image/*"
								className="hidden"
								onChange={handleImageChange}
							/>
						</label>
					</div>

					<div className="space-y-5">
						<div className="grid gap-5 sm:grid-cols-2">
							<Field label="Name" error={errors.name?.message}>
								<input
									{...register('name')}
									className={inputClassName}
									placeholder="My Token"
								/>
							</Field>

							<Field label="Ticker" error={errors.symbol?.message}>
								<input
									{...register('symbol')}
									className={cn(inputClassName, 'font-mono uppercase')}
									placeholder="TICKER"
								/>
							</Field>
						</div>

						<Field label="Description" error={errors.description?.message}>
							<textarea
								{...register('description')}
								rows={3}
								className={cn(inputClassName, 'h-auto resize-none py-3')}
								placeholder="What is this token about?"
							/>
						</Field>
					</div>
				</div>

				<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
					<Field label="X" error={errors.twitter?.message}>
						<input
							{...register('twitter')}
							className={inputClassName}
							placeholder="https://x.com/..."
						/>
					</Field>
					<Field label="Telegram" error={errors.telegram?.message}>
						<input
							{...register('telegram')}
							className={inputClassName}
							placeholder="https://t.me/..."
						/>
					</Field>
					<Field label="Website" error={errors.website?.message}>
						<input
							{...register('website')}
							className={inputClassName}
							placeholder="https://..."
						/>
					</Field>
					<Field
						label="Dev buy (SOL)"
						error={errors.devBuySol?.message}
					>
						<div
							className={cn(
								'flex h-11 overflow-hidden rounded-lg border border-input',
								'bg-card/50 transition-colors focus-within:border-ring',
							)}
						>
							<input
								{...register('devBuySol')}
								type="number"
								min={0}
								max={10}
								step={0.01}
								placeholder="0"
								className={cn(
									'w-full bg-transparent px-3 font-mono text-sm text-foreground',
									'outline-none placeholder:text-muted-foreground',
									'[appearance:textfield]',
									'[&::-webkit-inner-spin-button]:appearance-none',
									'[&::-webkit-outer-spin-button]:appearance-none',
								)}
							/>
							<div className="flex w-8 shrink-0 flex-col border-l border-input">
								<button
									type="button"
									aria-label="Increase dev buy"
									onClick={() => handleDevBuyStep(1)}
									className={cn(
										'flex flex-1 items-center justify-center text-muted-foreground',
										'transition-colors hover:bg-accent/10 hover:text-accent',
									)}
								>
									<ChevronUp className="size-3.5" />
								</button>
								<button
									type="button"
									aria-label="Decrease dev buy"
									onClick={() => handleDevBuyStep(-1)}
									className={cn(
										'flex flex-1 items-center justify-center border-t border-input',
										'text-muted-foreground transition-colors',
										'hover:bg-accent/10 hover:text-accent',
									)}
								>
									<ChevronDown className="size-3.5" />
								</button>
							</div>
						</div>
					</Field>
				</div>

				<div>
					<div className="mb-4 flex items-center justify-between">
						<label className="text-sm font-medium text-foreground">
							Stock pairings (1–3)
						</label>
						<span className="font-mono text-xs text-muted-foreground">
							{selectedStocks.length}/3 selected
						</span>
					</div>
					<StockPicker
						selected={selectedStocks}
						onChange={(stocks) =>
							setValue('stocks', stocks, { shouldValidate: true })}
					/>
					{errors.stocks?.message && (
						<p className="mt-2 text-sm text-destructive">
							{errors.stocks.message}
						</p>
					)}
				</div>

				{(step !== 'idle' || error) && (
					<div
						className={cn(
							'rounded-xl border px-4 py-3 text-sm',
							step === 'error' || error
								? 'border-destructive/30 bg-destructive/10 text-destructive'
								: 'border-accent/20 bg-accent/5 text-accent',
						)}
					>
						{error ?? STEP_LABELS[step]}
					</div>
				)}

				<button
					type="submit"
					disabled={isSubmitting || isBusy}
					className={cn(
						'inline-flex h-12 w-full items-center justify-center rounded-lg',
						'bg-accent px-8 text-base font-semibold text-accent-foreground',
						'transition-all hover:bg-accent/90',
						'hover:shadow-[0_0_32px_rgba(134,239,172,0.3)]',
						'disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto',
					)}
				>
					{isBusy ? 'Launching…' : 'Launch token'}
				</button>
			</form>

			<ConnectModal open={connectOpen} onOpenChange={setConnectOpen} />
		</>
	)
}

function Field({
	label,
	error,
	children,
}: {
	label: string
	error?: string
	children: React.ReactNode
}) {
	return (
		<div>
			<label className="text-sm font-medium text-foreground">{label}</label>
			<div className="mt-2">{children}</div>
			{error && (
				<p className="mt-1 text-sm text-destructive">{error}</p>
			)}
		</div>
	)
}

const inputClassName = cn(
	'h-11 w-full rounded-lg border border-input bg-card/50 px-3',
	'text-sm text-foreground placeholder:text-muted-foreground',
	'outline-none transition-colors focus:border-ring',
)
