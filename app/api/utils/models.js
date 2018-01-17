const crypto = require('crypto')
const shortUniqueId = require('short-unique-id')
const suid = new shortUniqueId()

module.exports = {
  createOrdercode(date) {
    return `${date.getDate}-${date.getMonth}-${date.getFullYear}-${suid.randomUUID(8)}`
  },
  hashPassword(password) {
    return new Promise((resolve, reject) => {
      const salt = crypto.randomBytes(512).toString('hex')
      const iterations = 1000 //process.env.ITERATIONS
      crypto.pbkdf2(password, salt, iterations, 512, 'sha512', (err, derivedKey) => {
        if (err) reject(err)

        resolve({
          salt, 
          hash: derivedKey.toString('hex')
        })
      })
    })
  },
  isPasswordRight(savedHash, savedSalt, passwordAttempt) {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(passwordAttempt, savedSalt, 1000, 512, 'sha512', (err, derivedKey) => {
        if (err) reject(err)

        resolve( derivedKey.toString('hex') == savedHash )
      })
    })
  }
}
