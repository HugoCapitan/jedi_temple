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
  apiUpdate,

  apiCreateAddress,
  apiAddOrder,
  apiAddReservation,
  apiAddWish,

  apiRemoveAddress,
  apiRemoveOrder,
  apiRemoveReservation,
  apiRemoveWish,

  apiUpdateAddress
}

async function create(newClient) {
  try {
    const addedClient = await new Client(newClient).save()
    return addedClient
  } catch (e) {
    if (!e.customOrigin) e.customOrigin = 'Client'

    if (e.name === 'ValidationError') {
      e.customMessage = 'Validation Error'
    } else if (e.code === 11000) {
      e.name = 'DuplicationError'
      e.customMessage = 'Duplicated Email'
    } else
      e.customMessage = 'Unexpected Error'

    throw e
  }
}

async function remove(id) {
  try {
    const deletedClient = await Client.findByIdAndRemove(id).exec()
    return deletedClient
  } catch (e) {
    if (!e.customOrigin) e.customOrigin = 'Client'
    if (e.name === 'CastError')
      e.customMessage = `Client with id: ${id}, not found`
    else
      e.customMessage = 'Unexpected Error'

    throw e
  }
}

async function update(id, newClient) {
  try {
    const updatedClient = await Client.findByIdAndUpdate(id, newClient).exec()
    return Object.assign(updatedClient, newClient)
  } catch (e) {
    if (!e.customOrigin) e.customOrigin = 'Client'
    if (e.name === 'ValidationError')
      e.customMessage = 'Validation Error'
    else if (e.name === "CastError")
      e.customMessage = `Client with id: ${id}, not found`
    else if (e.code === 11000) {
      e.customMessage = 'Duplicated Email'
      e.name = 'DuplicationError'
    }
    else
      e.customMessage = 'Unexpected Error'
    
    throw e
  }
}

async function apiAll(req, res) {
  try {
    let all = await Client.find().exec()
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
      sendError(409, 'Duplicated Email', e, res)
    else
      sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiRead(req, res) {
  try {
    const foundClient = await Client.findById(req.params.id).exec()
    if (!foundClient) {
      let notFoundError = new Error(`Client ${req.params.id} not found`)
      notFoundError.name = 'NotFoundError'
      throw notFoundError
    }

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
      let notFoundError = new Error(`Client ${req.params.id} not found`)
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
    await Client.findByIdAndUpdate(req.params.id, req.body).exec()
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

async function apiCreateAddress(req, res) {
  
}

async function apiRemoveAddress(req, res) {
  
}

async function apiUpdateAddress(req, res) {
  
}



async function apiAddOrder(req, res) {

}

async function apiAddReservation(req, res) {

}

async function apiAddWish(req, res) {
  
}



async function apiRemoveOrder(req, res) {
  
}

async function apiRemoveReservation(req, res) {
  
}

async function apiRemoveWish(req, res) {
  
}
