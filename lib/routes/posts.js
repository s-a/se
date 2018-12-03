const axios = require('axios')

function dynamicSort(property) {
	let sortOrder = 1
	if (property[0] === '-') {
		sortOrder = -1
		property = property.substr(1) // eslint-disable-line no-param-reassign
	}
	return function (a, b) {
		const result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0
		return result * sortOrder
	}
}

const route = (application) => {
	application.http.get({
		path: '/posts',
		version: '1.0.0'
	}, application.tryRoute(async function (req, res, next) {
		const response = []
		const http = axios.create({
			baseURL: 'https://jsonplaceholder.typicode.com/'
		})

		const sortOrderProperty = req.query.sortOrderProperty || '-title'

		const posts = await http.get('posts')
		for (let i = 0; i < posts.data.length; i++) {
			const post = posts.data[i]
			if (post.title.indexOf('minima') !== -1) {
				response.push(post)
			}
		}

		response.sort(dynamicSort(sortOrderProperty))
		res.send(response)
		return next()
	}))
}

module.exports = route