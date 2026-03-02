import { Card, CardContent, Typography, Box, Link } from '@mui/material'
import { iconRegistry } from '../icons'

interface App {
	name: string
	logo: string
	address: string
	description: string
}

interface CategoryCardProps {
	name: string
	icon?: string
	apps: App[]
	logos: Record<string, string>
}

export function CategoryCard({ name, icon, apps, logos }: CategoryCardProps) {
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
							</Box>
						</CardContent>
					</Card>
				</Link>
			))}
		</Box>
	)
}
