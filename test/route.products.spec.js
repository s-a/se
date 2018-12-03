const should = require('should')

describe('#/products', function () {
	it('should get a product list', async function () {
		const res = await HTTP().get('/products')
		res.data.length.should.be.above(50)
		should.exist(res.data[0].id)
		should.exist(res.data[0].product_id)
		should.exist(res.data[0].product_name)
	})
})