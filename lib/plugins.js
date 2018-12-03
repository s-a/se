const restify = require('restify')

const Plugins = function (application) {
	this.app = application
	this.http = application.http
	return this
}

Plugins.prototype.register = function () {
	const os = require('os')

	this.http.pre(restify.pre.sanitizePath())
	this.http.use(restify.plugins.acceptParser(this.http.acceptable))
	this.http.use(restify.plugins.queryParser({
		mapParams: true
	}))
	this.http.use(restify.plugins.bodyParser({
		maxBodySize: 0,
		mapParams: true,
		mapFiles: false,
		overrideParams: false,
		keepExtensions: false,
		uploadDir: os.tmpdir(),
		multiples: true,
		hash: 'sha1',
		rejectUnknown: true,
		requestBodyOnGet: false,
		reviver: undefined,
		maxFieldsSize: 2 * 1024 * 1024
	}))
}

module.exports = Plugins