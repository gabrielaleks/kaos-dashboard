import { createServer } from 'http'
import { execSync } from 'child_process'

function getContainerStatuses() {
	try {
		const output = execSync("docker ps -a --format '{{.Names}}\t{{.State}}'", {
			encoding: 'utf8',
		}).trim()
		if (!output) return {}
		return Object.fromEntries(
			output.split('\n').map((line) => {
				const [name, state] = line.split('\t')
				return [name.trim(), state.trim()]
			}),
		)
	} catch {
		return {}
	}
}

createServer((req, res) => {
	res.setHeader('Content-Type', 'application/json')
	if (req.method === 'GET' && req.url === '/api/status') {
		res.writeHead(200)
		res.end(JSON.stringify(getContainerStatuses()))
		return
	}
	res.writeHead(404)
	res.end(JSON.stringify({ error: 'Not found' }))
}).listen(3001, () => console.log('status-api on :3001'))
