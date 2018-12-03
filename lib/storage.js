const MongoClient = require('mongodb').MongoClient
/* const ObjectID = require('mongodb').ObjectID */

let db
const testMode = typeof global.it === 'function'

function Storage(application) {
	this.app = application
	this.log = this.app.http.log
}

Storage.prototype.init = async function initStorage() {
	this.log.debug('initialize storage middleware')
	this.client = await this.client()
	const databaseName = (testMode ? 'forever_test' : 'forever')
	db = this.client.db(databaseName)
	const collection = db.collection('log')
	await collection.insert({
		text: 'initStorage',
		datetime: new Date()
	})
	this.log.info('mongo database connection established')
}

Storage.prototype.client = async function client() {
	const MONGODB_URI = (process.env.MONGODB_URI || 'mongodb://localhost:27017')
	const connectionOptions = {
		useNewUrlParser: true,
		reconnectTries: Number.MAX_VALUE,
		reconnectInterval: 1000,
		keepAlive: 1,
		connectTimeoutMS: 30000
	}
	const cli = await MongoClient.connect(MONGODB_URI, connectionOptions)
	return cli
}

Storage.prototype.close = async function closeStorage(collectionName) {
	this.client.close()
}

module.exports = Storage