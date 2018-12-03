require('should')

describe('#/ping', function () {
	it('should get signs of life and service information', async function () {
		const res = await HTTP().get('/ping')
		res.data.responseText.should.equal('Hello World')
	})
})