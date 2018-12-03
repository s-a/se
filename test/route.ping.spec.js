require('should')

describe('#/ping', function () {
	it('should get server date time', async function () {
		const res = await HTTP().get('/ping')
		const date = (new Date()).toISOString().split('T')[0]
		res.data.split('T')[0].should.equal(date)
	})
})