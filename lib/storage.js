const MongoClient = require('mongodb').MongoClient
/* const ObjectID = require('mongodb').ObjectID */

let db

function Storage(application) {
	this.app = application
	this.log = this.app.http.log
}

Storage.prototype.init = async function initStorage() {
	this.log.debug('initialize storage middleware')
	this.client = await this.client()
	const databaseName = ('forever')
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

Storage.prototype.insert = async function insertStorage(data) {
	const collection = db.collection(data.collectionName)
	let documents = data.document
	if (!Array.isArray(data.document)) {
		documents = [data.document]
	}
	/*
	skip schema validation
	for (let i = 0; i < documents.length; i++) {
		const doc = documents[i]
		await this.validateSchema(data.collectionName, doc)
	}
	*/
	const result = await collection.insert(documents)
	return result
}

Storage.prototype.find = async function find(queryOptions) {
	const collection = db.collection(queryOptions.collection)
	const found = await collection.find()

	const result = await found.toArray()
	return result
}

Storage.prototype.close = async function closeStorage(collectionName) {
	this.client.close()
}

module.exports = Storage