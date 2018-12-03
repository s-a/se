const route = (application) => {
	application.http.get({
		path: '/products',
		version: '1.0.0'
	}, application.tryRoute(async function (req, res, next) {
		const products = await this.storage.find({
			collection: 'products'
		})
		const response = []

		for (let i = 0; i < products.length; i++) {
			const product = products[i]
			delete product.stock_available
			delete product.created_at
			delete product.updated_at
			response.push(product)
		}
		res.send(response)
		return next()
	}))
}

module.exports = route