process.env.PORT = 9000
process.env.LOGLEVEL = 'fatal'
process.env.API_URL = `http://localhost:${process.env.PORT}`

const ServerApplication = require('./../lib/application.js')
const server = global.server = new ServerApplication()

const axios = require('axios')
axios.defaults.baseURL = process.env.API_URL
global.HTTP = function (options) {
	const defaults = {
		baseURL: process.env.API_URL,
		timeout: 2000
	}
	const config = Object.assign(options || {}, defaults)
	const instance = axios.create(config)
	return instance
}

before(async function () {
	const result = await server.start()
	return result
})

after(async function () {
	await server.stop()
})