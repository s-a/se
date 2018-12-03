#!/usr/bin/env node

const Application = require('./application.js')
const app = new Application()

const gracefullShutDown = function gracefullShutDown() {
	app.http.log.error('got SIGTERM or SIGINT. startGraceful shutdown...')
	app.stop()
	process.exit(0)
}

process.on('unhandledRejection', (reason, p) => {
	const PrettyError = require('pretty-error')
	const pe = new PrettyError()
	pe.skipNodeFiles()
	const renderedError = pe.render(reason)
	app.http.log.fatal(p)
	app.http.log.fatal(renderedError)
	process.exit(1)
})

process.on('SIGTERM', gracefullShutDown)
process.on('SIGINT', gracefullShutDown)

async function apiServerBootProcess() {
	await app.start()
	app.http.log.info(`API server listening on port ${app.http.url}`)
}

apiServerBootProcess()