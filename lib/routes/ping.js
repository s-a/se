/* const Response = require('./../Response.js')  */
const route = (application) => {
	application.http.get({
		path: '/ping',
		version: '1.0.0'
	}, application.tryRoute(async function (req, res, next) {
		const dt = (new Date()).toISOString()

		res.send(dt)
		return next()
	}))
}

module.exports = route