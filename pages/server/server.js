const images = require('./database.js')

module.exports = {
  postDataToClient: () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 10张图片不够所以concat一下返回20张图
        resolve(images);
      }, 1000)
    })
  }
}