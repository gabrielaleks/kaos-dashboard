import {
	AppBar,
	Box,
	InputBase,
	Link,
	Toolbar,
	Typography,
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import SearchIcon from '@mui/icons-material/Search'

interface HeaderProps {
	onSearch: (query: string) => void
}

export function Header({ onSearch }: HeaderProps) {
	return (
		<AppBar position="static">
			<Toolbar disableGutters sx={{ bgcolor: '#282a36', px: 10 }}>
				<Box
					component="img"
					src="/kaos-logo.png"
					alt="KAOS"
					sx={{ width: 48, height: 48, mr: 2 }}
				/>
				<Typography variant="h4" fontWeight="bold">
					KAOS Dashboard
				</Typography>
			</Toolbar>

			<Toolbar
				disableGutters
				sx={{
					bgcolor: '#2f3142',
					minHeight: '48px !important',
					px: 10,
				}}
			>
				<Link
					href="/"
					underline="none"
					color="inherit"
					sx={{
						display: 'flex',
						alignItems: 'center',
						gap: 0.5,
						'&:hover': { opacity: 0.75 },
					}}
				>
					<HomeIcon fontSize="small" />
					<Typography variant="body2">Home</Typography>
				</Link>

				<Box sx={{ flexGrow: 1 }} />

				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						gap: 1,
						bgcolor: 'rgba(20,30,40,0.5)',
						borderRadius: 1,
						px: 1.5,
						py: 0.5,
					}}
				>
					<SearchIcon />
					<InputBase
						placeholder="Search…"
						sx={{ color: 'inherit' }}
						onChange={(e) => onSearch(e.target.value)}
					/>
				</Box>
			</Toolbar>
		</AppBar>
	)
}
