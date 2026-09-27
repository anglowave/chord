import { Footer } from '@/components/landing/footer'
import { Header } from '@/components/landing/header'
import { CreateForm } from '@/components/create/create-form'

export const metadata = {
	title: 'Launch token | chord',
}

export default function CreatePage() {
	return (
		<div className="flex flex-1 flex-col">
			<Header />
			<main className="flex-1 py-16 md:py-24">
				<div className="mx-auto max-w-5xl px-6">
					<h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
						Launch a token
					</h1>
					<p className="mt-4 text-muted-foreground">
						Create on pump.fun with SOL, then tag up to three
						tokenized stocks on Chord.
					</p>
					<div className="mt-10">
						<CreateForm />
					</div>
				</div>
			</main>
			<Footer />
		</div>
	)
}
