const Store = require('../models/Store')

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

async function create(newStore) {
  try {
    const addedStore = await new Store(newStore).save()
    return addedStore
  } catch (e) {
    e.customOrigin = 'Store'
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
    const deletedStore = await Store.findByIdAndRemove(id)
    return deletedStore
  } catch (e) {
    e.customOrigin = 'Store'
    if (e.name === 'CastError')
      e.customMessage = `Store ${id} not found`
    else
      e.customMessage = 'Unexpected Error'

    throw e
  }
}

async function update(id, newStore) {
  try {
    await Store.find ({_id: slug}, newStore)
    const updatedStore = await Store.findById(id)
    return updatedStore
  } catch (e) {
    e.customOrigin = 'Store'
    if (e.name === 'ValidationError')
      e.customMessage = 'Validation Error'
    else if (e.name === "CastError")
      e.customMessage = `Store ${id} not found`
    else if (e.code === 11000)
      e.customMessage = 'Duplicated Name'
    else
      e.customMessage = 'Unexpected Error'
    
    throw e
  }
}

async function apiAll(req, res) {
  try {
    let all = await Store.find()
    res.status(200).json(all)
  } catch (e) {
    sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiCreate(req, res) {
  try {
    let newStore = await new Store(req.body).save()
    res.status(200).json(newStore)
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
    const foundStore = await Store.findById(req.params.id)
    if (!foundStore) {
      let notFoundError = new Error(`Store ${req.params.id} not found`)
      notFoundError.name = 'NotFoundError'
      throw notFoundError
    }

    res.status(200).json(foundStore)
  } catch(e) {
    if (e.name === 'NotFoundError')
      sendError(404, `Store ${req.params.id} not found`, e, res)
    else
      sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiRemove(req, res) {
  try {
    const removedStore = await Store.findByIdAndRemove(req.params.id)

    if (!removedStore) {
      let notFoundError = new Error(`Store ${req.params.id} not found`)
      notFoundError.name = "NotFoundError"
      throw notFoundError
    }

    res.status(200).send(`Store ${removedStore._id} deleted`)
  } catch (e) {
    if (e.name === 'CastError' || e.name === 'NotFoundError')
      sendError(404, `Store ${req.params.id} not found`, e, res)
    else
      sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiUpdate(req, res) {
  try {
    await Store.findByIdAndUpdate(req.params.id, req.body)
    const updatedStore = await Store.findById(req.params.id)

    res.status(200).json(updatedStore)
  } catch (e) {
    if (e.name === 'ValidationError')
      sendError(403, 'Validation Error', e, res)
    else if (e.name === 'CastError')
      sendError(404, `Store ${req.params.id} not found`, e, res)
    else if (e.code === 11000)
      sendError(409, 'Duplicated Name', e, res)
    else
      sendError(500, 'Unexpected Error', e, res)

  }
}
