const _ = require('lodash')

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
    all = all.map(removePswd)

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
    const updatedClient = await Client.findByIdAndUpdate(req.params.id, req.body, {new: true}).exec()

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

async function apiCreateAddress(req, res) {
  try {
    const clientToUpdate = await Client.findById(req.params.client_id).exec()
    if (!clientToUpdate) {
      let notFoundError = new Error(`Client with id: ${req.params.client_id}, not found`)
      notFoundError.name = "NotFoundError"
      throw notFoundError
    }
    clientToUpdate.addresses.push(req.body)
    await clientToUpdate.save()
    res.status(200).json(clientToUpdate)
  } catch (e) {
    if (e.name === 'NotFoundError')
      sendError(404, e.message, e, res)
    else if (e.name === 'ValidationError')
      sendError(403, 'Validation Error', e, res)
    else
      sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiRemoveAddress(req, res) {
  try {
    const clientToUpdate = await Client.findById(req.params.client_id).exec()
    if (!clientToUpdate) {
      const notFoundError = new Error(`Client with id: ${req.params.client_id}, not found`)
      notFoundError.name = "NotFoundError"
      throw notFoundError
    }
    clientToUpdate.addresses.pull({ _id: req.params.address_id })

    await clientToUpdate.save()
    res.status(200).json(clientToUpdate)
  } catch (e) {
    if (e.name === 'NotFoundError')
      sendError(404, e.message, e, res)
    else
      sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiUpdateAddress(req, res) {
  try {
    const clientToUpdate = await Client.findById(req.params.client_id).exec()
    if (!clientToUpdate) {
      const notFoundError = new Error(`Client with id: ${req.params.client_id}, not found`)
      notFoundError.name = "NotFoundError"
      throw notFoundError
    }

    const addressToUpdate = clientToUpdate.addresses.find((address) => address._id == req.params.address_id)
    if (!addressToUpdate) {
      const notFoundError = new Error(`Address with id: ${req.params.address_id}, not found for client with id: ${req.params.client_id}`)
      notFoundError.name = 'NotFoundError'
      throw notFoundError
    }
    Object.assign(addressToUpdate, req.body)

    clientToUpdate.addresses.pull({_id:  req.params.address_id})
    clientToUpdate.addresses.push(addressToUpdate)
    await clientToUpdate.save()
    res.status(200).json(clientToUpdate)
  } catch (e) {
    if (e.name === 'NotFoundError')
      sendError(404, e.message, e, res)
    else if (e.name === 'ValidationError')
      sendError(403, 'Validation Error', e, res)
    else
      sendError(500, 'Unexpected Error', e, res)
  }
}



async function apiAddOrder(req, res) {
  try {
    const clientToUpdate = await Client.findById(req.params.client_id).exec()
    if (!clientToUpdate) {
      const notFoundError = new Error(`Client with id: ${req.params.client_id}, not found`)
      notFoundError.name = "NotFoundError"
      throw notFoundError
    }

    clientToUpdate.orders.push(req.params.order_id)
    await clientToUpdate.save()
    res.status(200).json(clientToUpdate)
  } catch (e) {
    if (e.name === 'NotFoundError')
      sendError(404, e.message, e, res)
    else if (e.name === 'ValidationError')
      sendError(403, 'Validation Error', e, res)
    else
      sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiAddReservation(req, res) {
  try {
    const clientToUpdate = await Client.findById(req.params.client_id).exec()
    if (!clientToUpdate) {
      const notFoundError = new Error(`Client with id: ${req.params.client_id}, not found`)
      notFoundError.name = "NotFoundError"
      throw notFoundError
    }

    clientToUpdate.reservations.push(req.params.reservation_id)
    await clientToUpdate.save()
    res.status(200).json(clientToUpdate)
  } catch (e) {
    if (e.name === 'NotFoundError')
      sendError(404, e.message, e, res)
    else if (e.name === 'ValidationError')
      sendError(403, 'Validation Error', e, res)
    else
      sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiAddWish(req, res) {
  try {
    const clientToUpdate = await Client.findById(req.params.client_id).exec()
    if (!clientToUpdate) {
      const notFoundError = new Error(`Client with id: ${req.params.client_id}, not found`)
      notFoundError.name = "NotFoundError"
      throw notFoundError
    }

    clientToUpdate.wishlist.push(req.params.wish_id)
    await clientToUpdate.save()
    res.status(200).json(clientToUpdate)
  } catch (e) {
    if (e.name === 'NotFoundError')
      sendError(404, e.message, e, res)
    else if (e.name === 'ValidationError')
      sendError(403, 'Validation Error', e, res)
    else
      sendError(500, 'Unexpected Error', e, res)
  }
}



async function apiRemoveOrder(req, res) {
  try {
    const clientToUpdate = await Client.findById(req.params.client_id).exec()
    if (!clientToUpdate) {
      const notFoundError = new Error(`Client with id: ${req.params.client_id}, not found`)
      notFoundError.name = "NotFoundError"
      throw notFoundError
    }

    clientToUpdate.orders.pull(req.params.order_id)
    await clientToUpdate.save()
    res.status(200).json(clientToUpdate)
  } catch (e) {
    if (e.name === 'NotFoundError')
      sendError(404, e.message, e, res)
    else
      sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiRemoveReservation(req, res) {
  try {
    const clientToUpdate = await Client.findById(req.params.client_id).exec()
    if (!clientToUpdate) {
      const notFoundError = new Error(`Client with id: ${req.params.client_id}, not found`)
      notFoundError.name = "NotFoundError"
      throw notFoundError
    }

    clientToUpdate.reservations.pull(req.params.reservation_id)
    await clientToUpdate.save()
    res.status(200).json(clientToUpdate)
  } catch (e) {
    if (e.name === 'NotFoundError')
      sendError(404, e.message, e, res)
    else
      sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiRemoveWish(req, res) {
  try {
    const clientToUpdate = await Client.findById(req.params.client_id).exec()
    if (!clientToUpdate) {
      const notFoundError = new Error(`Client with id: ${req.params.client_id}, not found`)
      notFoundError.name = "NotFoundError"
      throw notFoundError
    }

    clientToUpdate.wishlist.pull(req.params.wish_id)
    await clientToUpdate.save()
    res.status(200).json(clientToUpdate)
  } catch (e) {
    if (e.name === 'NotFoundError')
      sendError(404, e.message, e, res)
    else
      sendError(500, 'Unexpected Error', e, res)
  }
}


function removePswd(client) {
  Object.assign(client, { password: undefined, salt: undefined })

  return client
}
