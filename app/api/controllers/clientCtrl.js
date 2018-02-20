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
    // all = all.map(removePswd)

    res.status(200).json(all)
  } catch (e) {
    sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiCreate(req, res) {
  try {
    let newClient = await new Client(req.body).save()
    newClient = removePswd(newClient)
    res.status(200).json(newClient)
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

    Object.assign(foundClient, {password: undefined, salt: undefined})

    res.status(200).json(foundClient)
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

    res.status(200).json(removedClient)
  } catch (e) {
    if (e.name === 'CastError' || e.name === 'NotFoundError')
      sendError(404, `Client with id: ${req.params.id}, not found`, e, res)
    else
      sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiUpdate(req, res) {
  try {
    const clientToUpdate = await Client.findById(req.params.id).exec()
    Object.assign(clientToUpdate, req.body)
    const updatedClient = await clientToUpdate.save()
    // let updatedClient = await Client.findByIdAndUpdate(req.params.id, req.body, {new: true}).exec()
    // updatedClient = removePswd(updatedClient)
    res.status(200).json(updatedClient)
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
  Object.assign(client, { password: undefined, salt: undefined })

  return client
}
