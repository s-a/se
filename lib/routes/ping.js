/* const Response = require('./../Response.js')  */
const route = (application) => {
	application.http.get({
		path: '/ping',
		version: '1.0.0'
	}, application.tryRoute(async function (req, res, next) {
		const response = {
			responseText: 'Hello World',
			dateTime: (new Date()).toISOString()
		}

		res.send(response)
		return next()
	}))
}

module.exports = route