describe('#/verify-order', function () {
	it('should return invalid order for more quantity than available', async function () {
		const products = await global.server.storage.find({
			collection: 'products'
		})
		const product = products[0]

		const res = await HTTP().post('/verify-order', {
			product_id: product.product_id,
			quantity: (product.stock_available + 1)
		})
		res.data.valid.should.equal(false)
	})

	it('should return valid order a quantity that is available', async function () {
		const products = await global.server.storage.find({
			collection: 'products'
		})
		const product = products[0]

		const res = await HTTP().post('/verify-order', {
			product_id: product.product_id,
			quantity: (product.stock_available)
		})
		res.data.valid.should.equal(true)
	})

	it('should return invalid order a negative quantity', async function () {
		const products = await global.server.storage.find({
			collection: 'products'
		})
		const product = products[0]

		const res = await HTTP().post('/verify-order', {
			product_id: product.product_id,
			quantity: -1
		})
		res.data.valid.should.equal(false)
	})

	it('should throw an error for invalid product_id', async function () {
		const res = await HTTP().post('/verify-order', {
			product_id: 'x',
			quantity: 1
		})
		res.data.error.should.equal(true)
	})
})