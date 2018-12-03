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

Storage.prototype.upsert = async function upsertStorage(data) {
	let result = null
	if (data.document._id) {
		const set = data.document
		const _id = data.document._id
		delete set._id
		result = await this.update(data.collectionName, _id, set)
	} else {
		result = await this.insert({
			collectionName: data.collectionName,
			document: data.document.body
		})
	}
	return result
}

Storage.prototype.close = async function closeStorage(collectionName) {
	this.client.close()
}

module.exports = Storage