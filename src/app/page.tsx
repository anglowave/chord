import { Footer } from '@/components/landing/footer'
import { Header } from '@/components/landing/header'
import { Hero } from '@/components/landing/hero'
import { HowItWorks } from '@/components/landing/how-it-works'
import { RecentLaunches } from '@/components/landing/recent-launches'

export default function Home() {
	return (
		<div className="relative flex flex-1 flex-col">
			<div
				aria-hidden
				className="pointer-events-none absolute left-1/2 -top-16 z-0 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-accent/[0.08] blur-[110px]"
			/>
			<Header />
			<main className="relative z-10 flex-1">
				<Hero />
				<HowItWorks />
				<RecentLaunches />
			</main>
			<Footer />
		</div>
	)
}
