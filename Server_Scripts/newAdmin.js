const mongoose = require('mongoose')
const readline = require('readline')
const Admin    = require('../app/api/models/Admin')

let newAdmin = {}

// Connect to mongodb
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/test', {
  useMongoClient: true
}).catch(e => { throw e })

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const askEmail = () => new Promise((resolve, reject) => {
  rl.question('New admin email: ', (email) => {
    newAdmin.email = email
    resolve()
  })
})

const askPassword = () => new Promise((resolve, reject) => {
  rl.question('New admin password: ', (pswd) => {
    newAdmin.password = pswd
    resolve()
  })
})

askEmail()
.then(askPassword)
.then(res => {
  rl.close()

  return new Admin(newAdmin).save()
})
.then(created => {
  console.log('New Admin successfully created: \n', created)
  process.exit()
})
.catch(e => {
  console.log(e)
  process.exit()
})
