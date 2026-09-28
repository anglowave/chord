import { Layers, Rocket, TrendingUp } from 'lucide-react'

const STEPS = [
	{
		icon: Layers,
		title: 'Pick your stocks',
		description:
			'Choose up to three tokenized stocks. NVIDIA, Tesla, Apple, and more.',
	},
	{
		icon: Rocket,
		title: 'Pair your token',
		description:
			'Launch your token on pump.fun and pair it with the stocks you picked.',
	},
	{
		icon: TrendingUp,
		title: 'Trade it',
		description:
			'Your token trades on pump.fun, paired with those stocks.',
	},
]

export function HowItWorks() {
	return (
		<section
			id="how-it-works"
			className="border-t border-border/60 py-24 md:py-32"
		>
			<div className="mx-auto max-w-6xl px-6">
				<div className="mx-auto max-w-2xl text-center">
					<h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
						How it works
					</h2>
					<p className="mt-4 text-muted-foreground">
						Pair your token with up to three tokenized stocks.
					</p>
				</div>

				<div className="mt-16 grid gap-8 md:grid-cols-3">
					{STEPS.map((step, index) => (
						<div
							key={step.title}
							className={[
								'group relative rounded-2xl border border-border',
								'bg-card/40 p-8 transition-colors',
								'hover:border-accent/20 hover:bg-card/60',
							].join(' ')}
						>
							<div className="mb-6 flex items-center justify-between">
								<div className="flex size-12 items-center justify-center rounded-xl bg-accent/10 ring-1 ring-accent/20 transition-colors group-hover:bg-accent/15">
									<step.icon className="size-5 text-accent" />
								</div>
								<span className="font-mono text-3xl font-bold text-border transition-colors group-hover:text-accent/30">
									{String(index + 1).padStart(2, '0')}
								</span>
							</div>
							<h3 className="font-heading text-xl font-semibold">
								{step.title}
							</h3>
							<p className="mt-3 text-sm leading-relaxed text-muted-foreground">
								{step.description}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}
