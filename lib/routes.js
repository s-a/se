const fs = require('fs')
const path = require('path')

const Routes = function (application) {
	this.app = application
	this.http = application.http

	return this
}

Routes.prototype.register = function () {
	const self = this
	return new Promise(function (resolve, reject) {
		const routesFolder = path.join(__dirname, 'routes')
		fs.readdir(routesFolder, function (err, files) {
			if (err) {
				reject(err)
			} else {
				files.forEach(function (file) {
					if (path.extname(file) === '.js') {
						const routeHandlerFilename = path.join(__dirname, './routes/', file)
						self.http.log.info(`registering route ${routeHandlerFilename}`)
						require(routeHandlerFilename)(self.app)
					}
				})
				resolve()
			}
		})
	})
}

module.exports = Routes