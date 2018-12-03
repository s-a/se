const route = (application) => {
	application.http.post({
		path: '/verify-order',
		version: '1.0.0'
	}, application.tryRoute(async function (req, res, next) {
		const products = await this.storage.find({
			collection: 'products',
			filter: {
				product_id: req.body.product_id
			}
		})

		if (products.length === 0) {
			throw new Error(`product ${req.body.product_id} found`)
		}
		const response = {
			valid: (req.body.quantity > 0 && products[0].stock_available >= req.body.quantity)
		}
		res.send(response)
		return next()
	}))
}

module.exports = route