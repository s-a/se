const restify = require('restify')
const Routes = require('./routes')
const Plugins = require('./plugins')
const pkg = require('./../package.json')
const bunyan = require('bunyan')
const Storage = require('./storage.js')
const bformat = require('bunyan-format')
const formatOut = bformat({
	outputMode: 'long'
})

const Application = function Application() {
	const defaultSetup = {
		port: process.env.PORT || 9999,
		logLevel: process.env.LOGLEVEL || 'debug' // trace, debug, info, warn, error, and fatal
	}
	this.settings = Object.assign({}, defaultSetup, {})

	const logOptions = {
		level: this.settings.logLevel,
		name: `API-v${pkg.version}`,
		src: true,
		serializers: restify.serializers,
		formatters: {
			'application/json': restify.formatters['application/json q=0.4'],
			'application/vnd.api+json': restify.formatters['application/json; q=0.4'],
			'application/octet-stream': restify.formatters['application/json; q=0.4']
		},
		stream: formatOut
	}

	this.http = restify.createServer({
		log: bunyan.createLogger(logOptions),
		handleUncaughtExceptions: true
	})

	this.port = this.settings.port
	this.http.log.info('warmup', this.settings, process.env.NODE_ENV)

	return this
}

Application.prototype.tryRoute = function tryRoute(routeHandler) {
	const self = this
	const wrapperMethod = async function wrapperMethod(req, res, next) {
		try {
			await routeHandler.bind(self)(req, res, next)
		} catch (error) {
			const response = new self.Response()
			response.error = true
			response.errorDetails = error.errors || error.errorDetails || [error.toString()]
			response.payload = null
			self.http ? self.http.log.error(error) : console.error(error) // eslint-disable-line no-console
			res.send(response)
			next()
		}
	}

	return wrapperMethod
}

Application.prototype.start = async function start() {
	const self = this
	self.storage = new Storage(self)
	await self.storage.init()

	const plugins = new Plugins(self)
	plugins.register()

	const routes = new Routes(self)
	await routes.register()

	await self.http.listen(self.port)
}

Application.prototype.stop = function stop() {
	this.http.log.warn(`csx server tear down...`)

	this.http.log.warn(`shut down database connection...`)
	this.storage.close()

	this.http.log.warn(`shut down http server...`)
	this.http.close()
	this.http = null
}

module.exports = Application