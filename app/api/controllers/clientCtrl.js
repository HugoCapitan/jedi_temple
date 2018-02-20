const _ = require('lodash')

const Client = require('../models/Client')

const { sendError } = require('../utils/http')

module.exports = {
  apiAll, 
  apiCreate,
  apiRead, 
  apiRemove, 
  apiUpdate
}

async function apiAll(req, res) {
  try {
    let all = await Client.find().exec()
    res.status(200).json(all.map(removePswd))
  } catch (e) {
    sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiCreate(req, res) {
  try {
    let newClient = await new Client(req.body).save()
    res.status(200).json(removePswd(newClient))
  } catch (e) {
    if (e.name === 'ValidationError')
      sendError(403, 'Validation Error', e, res)
    else if (e.code === 11000)
      sendError(409, 'Duplicated Email', e, res)
    else
      sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiRead(req, res) {
  try {
    const foundClient = await Client.findById(req.params.id).exec()
    if (!foundClient) {
      let notFoundError = new Error(`Client with id: ${req.params.id}, not found`)
      notFoundError.name = 'NotFoundError'
      throw notFoundError
    }

    res.status(200).json(removePswd(foundClient))
  } catch(e) {
    if (e.name === 'NotFoundError')
      sendError(404, `Client with id: ${req.params.id}, not found`, e, res)
    else
      sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiRemove(req, res) {
  try {
    const removedClient = await Client.findByIdAndRemove(req.params.id).exec()

    if (!removedClient) {
      let notFoundError = new Error(`Client with id: ${req.params.id}, not found`)
      notFoundError.name = "NotFoundError"
      throw notFoundError
    }

    res.status(200).json(removePswd(removedClient))
  } catch (e) {
    if (e.name === 'CastError' || e.name === 'NotFoundError')
      sendError(404, `Client with id: ${req.params.id}, not found`, e, res)
    else
      sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiUpdate(req, res) {
  try {
    let updatedClient = await Client.findByIdAndUpdate(req.params.id, req.body, {new: true}).exec()
    res.status(200).json(removePswd(updatedClient))
  } catch (e) {
    if (e.name === 'ValidationError')
      sendError(403, 'Validation Error', e, res)
    else if (e.name === 'CastError')
      sendError(404, `Client with id: ${req.params.id}, not found`, e, res)
    else if (e.code === 11000)
      sendError(409, 'Duplicated Name', e, res)
    else
      sendError(500, 'Unexpected Error', e, res)

  }
}


function removePswd(client) {
  return Object.assign(client, { password: undefined, salt: undefined })
}
