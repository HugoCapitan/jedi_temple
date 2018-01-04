const shortUniqueId = require('short-unique-id')
const suid = new shortUniqueId()

module.exports = {
  createOrdercode(date) {
    return `${date.getDate}-${date.getMonth}-${date.getFullYear}-${suid.randomUUID(8)}`
  }
}