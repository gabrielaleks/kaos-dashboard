import { useState } from 'react'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { theme } from './theme'
import { Header } from './components/Header'
import { Dashboard } from './pages/Dashboard'

export function App() {
	const [searchQuery, setSearchQuery] = useState('')

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Header onSearch={setSearchQuery} />
			<Dashboard searchQuery={searchQuery} />
		</ThemeProvider>
	)
}
