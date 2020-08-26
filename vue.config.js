const path = require('path')
function resolve(dir) {
    return path.join(__dirname, dir)
}
module.exports = {
    publicPath: './',
    assetsDir: './static',
    productionSourceMap: false,
}
