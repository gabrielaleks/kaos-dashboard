import {
	AppBar,
	Box,
	InputBase,
	Link,
	Toolbar,
	Typography,
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import GitHubIcon from '@mui/icons-material/GitHub'
import SearchIcon from '@mui/icons-material/Search'

interface HeaderProps {
	onSearch: (query: string) => void
}

export function Header({ onSearch }: HeaderProps) {
	return (
		<AppBar position="static">
			<Toolbar
				disableGutters
				sx={{ bgcolor: '#282a36', px: { xs: 2, md: 10 } }}
			>
				<Link
					href="/"
					underline="none"
					color="inherit"
					sx={{
						display: 'flex',
						alignItems: 'center',
						gap: 0.5,
						minWidth: 0,
						'&:hover': { opacity: 0.75 },
					}}
				>
					<Box
						component="img"
						src="/kaos-logo.png"
						alt="KAOS"
						sx={{
							width: { xs: 36, md: 48 },
							height: { xs: 36, md: 48 },
							mr: 2,
							flexShrink: 0,
						}}
					/>
					<Typography
						fontWeight="bold"
						noWrap
						sx={{ fontSize: { xs: '1.25rem', md: '2.125rem' } }}
					>
						KAOS Dashboard - cicd test
					</Typography>
				</Link>
			</Toolbar>

			<Toolbar
				disableGutters
				sx={{
					bgcolor: '#2f3142',
					minHeight: '48px !important',
					px: { xs: 2, md: 10 },
					gap: 2,
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
				<Link
					href="https://github.com/gabrielaleks"
					underline="none"
					color="inherit"
					target="_blank"
					sx={{
						display: 'flex',
						alignItems: 'center',
						gap: 0.5,
						'&:hover': { opacity: 0.75 },
					}}
				>
					<GitHubIcon fontSize="small" />
					<Typography variant="body2">Github</Typography>
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
						sx={{ color: 'inherit', width: '5em' }}
						onChange={(e) => onSearch(e.target.value)}
					/>
				</Box>
			</Toolbar>
		</AppBar>
	)
}
