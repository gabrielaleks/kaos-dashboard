import { ThemeProvider, CssBaseline } from '@mui/material'
import { theme } from './theme'

export function App() {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
		</ThemeProvider>
	)
}
