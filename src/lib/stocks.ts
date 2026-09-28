export interface Stock {
	id: string
	symbol: string
	name: string
	mint: string
	logo: string
}

export const STOCKS = [
	{
		id: 'NVDA',
		symbol: 'NVDAx',
		name: 'NVIDIA',
		mint: 'Xsc9qvGR1efVDFGLrVsmkzv3qi45LTBjeUKSPmx9qEh',
		logo: '/stocks/nvda.svg',
	},
	{
		id: 'AAPL',
		symbol: 'AAPLx',
		name: 'Apple',
		mint: 'XsbEhLAtcf6HdfpFZ5xEMdqW8nfAvcsP5bdudRLJzJp',
		logo: '/stocks/aapl.svg',
	},
	{
		id: 'META',
		symbol: 'METAx',
		name: 'Meta',
		mint: 'Xsa62P5mvPszXL1krVUnU5ar38bBSVcWAB6fmPCo5Zu',
		logo: '/stocks/meta.svg',
	},
	{
		id: 'GOOGL',
		symbol: 'GOOGLx',
		name: 'Google',
		mint: 'XsCPL9dNWBMvFtTmwcCA5v3xWPSMEBCszbQdiLLq6aN',
		logo: '/stocks/googl.svg',
	},
	{
		id: 'MSFT',
		symbol: 'MSFTx',
		name: 'Microsoft',
		mint: 'XspzcW1PRtgf6Wj92HCiZdjzKCyFekVD8P5Ueh3dRMX',
		logo: '/stocks/msft.svg',
	},
	{
		id: 'SPACEX',
		symbol: 'SPCXx',
		name: 'SpaceX',
		mint: 'Xs3oZwbHvqis4NYcf4YKWmEia2eC84wSiVrcYcTqpH8',
		logo: '/stocks/spacex.svg',
	},
	{
		id: 'TSLA',
		symbol: 'TSLAx',
		name: 'Tesla',
		mint: 'XsDoVfqeBukxuZHWhdvWHBhgEHjGNst4MLodqsJHzoB',
		logo: '/stocks/tsla.svg',
	},
	{
		id: 'MCD',
		symbol: 'MCDx',
		name: 'McDonald\'s',
		mint: 'XsqE9cRRpzxcGKDXj1BJ7Xmg4GRhZoyY1KpmGSxAWT2',
		logo: '/stocks/mcd.svg',
	},
	{
		id: 'INTC',
		symbol: 'INTCx',
		name: 'Intel',
		mint: 'XshPgPdXFRWB8tP1j82rebb2Q9rPgGX37RuqzohmArM',
		logo: '/stocks/intc.svg',
	},
	{
		id: 'GME',
		symbol: 'GMEx',
		name: 'GameStop',
		mint: 'Xsf9mBktVB9BSU5kf4nHxPq5hCBJ2j2ui3ecFGxPRGc',
		logo: '/stocks/gme.svg',
	},
] as const satisfies readonly Stock[]

export type StockId = (typeof STOCKS)[number]['id']

export const STOCK_IDS = STOCKS.map((stock) => stock.id)

export const STOCK_ID_ENUM = STOCK_IDS as [StockId, ...StockId[]]

type StockById = {
	[K in StockId]: Extract<(typeof STOCKS)[number], { id: K }>
}

export const STOCK_BY_ID = Object.fromEntries(
	STOCKS.map((stock) => [stock.id, stock]),
) as StockById

export const STOCK_BY_MINT = Object.fromEntries(
	STOCKS.map((stock) => [stock.mint, stock]),
) as Record<string, Stock>

export function isValidStockId(id: string): id is StockId {
	return id in STOCK_BY_ID
}

export function getStockMints(ids: string[]) {
	return ids.map((id) => STOCK_BY_ID[id as StockId]?.mint).filter(Boolean)
}

export const HERO_COMBOS: Array<[StockId, StockId, StockId]> = [
	['NVDA', 'TSLA', 'AAPL'],
	['META', 'GOOGL', 'MSFT'],
	['SPACEX', 'NVDA', 'TSLA'],
	['AAPL', 'MSFT', 'GOOGL'],
	['GME', 'INTC', 'MCD'],
	['TSLA', 'MCD', 'SPACEX'],
]
