process.env.PORT = 6666
const ServerApplication = require('./lib/application.js')
const server = global.server = new ServerApplication()
const ObjectID = require('mongodb').ObjectID

async function mockData() {
	await server.start()
	server.http.log.info('mocking products collection')
	for (let i = 0; i < 100; i++) {
		const id = ObjectID()
		const dt = new Date()
		const stockAvailable = Math.floor(Math.random() * 10) + 1
		const product = {
			id: i,
			product_id: id,
			product_name: `mocked product ${id}`,
			stock_available: stockAvailable,
			created_at: dt,
			updated_at: dt
		}
		await server.storage.insert({
			collectionName: 'products',
			document: product
		})
	}

	server.http.log.info('mocking products collection done')
	await server.stop()
}

mockData()