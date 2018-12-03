require('should')

describe('#/posts', function () {
	it('should get posts sorted by given property asc', async function () {
		const res = await HTTP().get('/posts/?sortOrderProperty=title')
		res.data.length.should.be.above(0)
		const firstItem = res.data[0].title
		const lastItem = res.data[res.data.length - 1].title

		firstItem.should.not.be.above(lastItem)
	})

	it('should get posts sorted by given property desc', async function () {
		const res = await HTTP().get('/posts/?sortOrderProperty=-title')
		res.data.length.should.be.above(0)
		const firstItem = res.data[0].title
		const lastItem = res.data[res.data.length - 1].title

		firstItem.should.be.above(lastItem)
	})
})