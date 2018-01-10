const Client = require('../models/Client')

const { sendError } = require('../utils/http')

module.exports = {
  create, 
  remove, 
  update,
  apiAll, 
  apiCreate, 
  apiRead, 
  apiRemove, 
  apiUpdate
}

async function create(newClient) {
  try {
    const addedClient = await new Client(newClient).save()
    return addedClient
  } catch (e) {
    e.customOrigin = 'Client'
    if (e.name === 'ValidationError')
      e.customMessage = 'Validation Error'
    else if (e.code === 11000)
      e.customMessage = 'Duplicated Name'
    else
      e.customMessage = 'Unexpected Error'

    throw e
  }
}

async function remove(id) {
  try {
    const deletedClient = await Client.findByIdAndRemove(id)
    return deletedClient
  } catch (e) {
    e.customOrigin = 'Client'
    if (e.name === 'CastError')
      e.customMessage = `Client ${id} not found`
    else
      e.customMessage = 'Unexpected Error'

    throw e
  }
}

async function update(id, newClient) {
  try {
    await Client.find ({_id: slug}, newClient)
    const updatedClient = await Client.findById(id)
    return updatedClient
  } catch (e) {
    e.customOrigin = 'Client'
    if (e.name === 'ValidationError')
      e.customMessage = 'Validation Error'
    else if (e.name === "CastError")
      e.customMessage = `Client ${id} not found`
    else if (e.code === 11000)
      e.customMessage = 'Duplicated Name'
    else
      e.customMessage = 'Unexpected Error'
    
    throw e
  }
}

async function apiAll(req, res) {
  try {
    let all = await Client.find()
    res.status(200).json(all)
  } catch (e) {
    sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiCreate(req, res) {
  try {
    let newClient = await new Client(req.body).save()
    res.status(200).json(newClient)
  } catch (e) {
    if (e.name === 'ValidationError')
      sendError(403, 'Validation Error', e, res)
    else if (e.code === 11000)
      sendError(409, 'Duplicated Name', e, res)
    else
      sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiRead(req, res) {
  try {
    const foundClient = await Client.findById(req.params.id)
    if (!foundClient) {
      let notFoundError = new Error(`Client ${req.params.id} not found`)
      notFoundError.name = 'NotFoundError'
      throw notFoundError
    }

    res.status(200).json(foundClient)
  } catch(e) {
    if (e.name === 'NotFoundError')
      sendError(404, `Client ${req.params.id} not found`, e, res)
    else
      sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiRemove(req, res) {
  try {
    const removedClient = await Client.findByIdAndRemove(req.params.id)

    if (!removedClient) {
      let notFoundError = new Error(`Client ${req.params.id} not found`)
      notFoundError.name = "NotFoundError"
      throw notFoundError
    }

    res.status(200).send(`Client ${removedClient._id} deleted`)
  } catch (e) {
    if (e.name === 'CastError' || e.name === 'NotFoundError')
      sendError(404, `Client ${req.params.id} not found`, e, res)
    else
      sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiUpdate(req, res) {
  try {
    await Client.findByIdAndUpdate(req.params.id, req.body)
    const updatedClient = await Client.findById(req.params.id)

    res.status(200).json(updatedClient)
  } catch (e) {
    if (e.name === 'ValidationError')
      sendError(403, 'Validation Error', e, res)
    else if (e.name === 'CastError')
      sendError(404, `Client ${req.params.id} not found`, e, res)
    else if (e.code === 11000)
      sendError(409, 'Duplicated Name', e, res)
    else
      sendError(500, 'Unexpected Error', e, res)

  }
}
