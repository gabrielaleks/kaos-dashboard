import { useMemo, useState, useEffect } from 'react'
import { Box } from '@mui/material'
import Fuse from 'fuse.js'
import dashboardConfig from '../dashboard.json'
import { CategoryCard } from '../components/CategoryCard'

const logos = import.meta.glob('../assets/*.svg', {
	eager: true,
	query: '?url',
	import: 'default',
}) as Record<string, string>

const allApps = dashboardConfig.categories.flatMap((cat) =>
	cat.apps.map((app) => ({ ...app, categoryId: cat.id })),
)

const fuse = new Fuse(allApps, {
	keys: ['name', 'description'],
	threshold: 0.3,
})

interface DashboardProps {
	searchQuery: string
}

export function Dashboard({ searchQuery }: DashboardProps) {
	const [containerStatus, setContainerStatus] = useState<
		Record<string, string>
	>({})

	useEffect(() => {
		async function fetchStatus() {
			try {
				const res = await fetch('/api/status')
				if (res.ok) setContainerStatus(await res.json())
			} catch {
				// keep last known state
			}
		}
		fetchStatus()
		const interval = setInterval(fetchStatus, 30_000)
		return () => clearInterval(interval)
	}, [])

	const filteredCategories = useMemo(() => {
		if (!searchQuery) return dashboardConfig.categories

		const matchingNames = new Set(
			fuse.search(searchQuery).map((r) => r.item.name),
		)

		return dashboardConfig.categories
			.map((cat) => ({
				...cat,
				apps: cat.apps.filter((app) => matchingNames.has(app.name)),
			}))
			.filter((cat) => cat.apps.length > 0)
	}, [searchQuery])

	return (
		<Box
			sx={{
				py: 4,
				px: 10,
				display: 'grid',
				gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' },
				gap: 1,
				alignItems: 'start',
			}}
		>
			{filteredCategories.map((category) => (
				<CategoryCard
					key={category.id}
					name={category.name}
					icon={category.icon}
					apps={category.apps}
					logos={logos}
					containerStatus={containerStatus}
				/>
			))}
		</Box>
	)
}
