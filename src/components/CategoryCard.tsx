import { Card, CardContent, Typography, Box, Link } from '@mui/material'
import { iconRegistry } from '../icons'

interface App {
	id?: string
	name: string
	logo: string
	address: string
	description: string
	isContainer?: boolean
}

interface CategoryCardProps {
	name: string
	icon?: string
	apps: App[]
	logos: Record<string, string>
	containerStatus?: Record<string, string>
}

function getStatusColor(status: string | undefined): string {
	if (!status) return '#6272a4'
	if (status === 'running') return '#50fa7b'
	return '#ff5555'
}

export function CategoryCard({
	name,
	icon,
	apps,
	logos,
	containerStatus = {},
}: CategoryCardProps) {
	const Icon = icon ? iconRegistry[icon] : null

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
			<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, px: 1 }}>
				{Icon && <Icon fontSize="medium" />}
				<Typography variant="h6">{name}</Typography>
			</Box>
			{apps.map((app) => (
				<Link
					key={app.name}
					href={app.address}
					target="_blank"
					rel="noopener noreferrer"
					underline="none"
					color="inherit"
				>
					<Card sx={{ '&:hover': { opacity: 0.7 } }}>
						<CardContent>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
								{app.logo ? (
									<Box
										component="img"
										src={logos[`../assets/${app.logo}`]}
										alt={app.name}
										sx={{ width: 32, height: 32, flexShrink: 0 }}
									/>
								) : (
									<Box sx={{ width: 32, height: 32, flexShrink: 0 }} />
								)}
								<Box>
									<Typography variant="body2" fontWeight="bold">
										{app.name}
									</Typography>
									<Typography variant="caption" color="text.secondary">
										{app.description}
									</Typography>
								</Box>
								{app.isContainer !== false && (
									<Box
										title={
											app.id
												? (containerStatus[app.id] ?? 'unknown')
												: 'unknown'
										}
										sx={{
											ml: 'auto',
											flexShrink: 0,
											width: 8,
											height: 8,
											borderRadius: '50%',
											bgcolor: app.id
												? getStatusColor(containerStatus[app.id])
												: '#6272a4',
										}}
									/>
								)}
							</Box>
						</CardContent>
					</Card>
				</Link>
			))}
		</Box>
	)
}
