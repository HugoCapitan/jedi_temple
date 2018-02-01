const Store = require('../models/Store')

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
    let all = await Store.find().exec()
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
    const foundStore = await Store.findById(req.params.id).exec()
    if (!foundStore) {
      let notFoundError = new Error(`Store with id: ${req.params.id}, not found`)
      notFoundError.name = 'NotFoundError'
      throw notFoundError
    }

    res.status(200).json(foundStore)
  } catch(e) {
    if (e.name === 'NotFoundError')
      sendError(404, `Store with id: ${req.params.id}, not found`, e, res)
    else
      sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiRemove(req, res) {
  try {
    const removedStore = await Store.findByIdAndRemove(req.params.id).exec()

    if (!removedStore) {
      let notFoundError = new Error(`Store with id: ${req.params.id}, not found`)
      notFoundError.name = "NotFoundError"
      throw notFoundError
    }

    res.status(200).json(removedStore)
  } catch (e) {
    if (e.name === 'CastError' || e.name === 'NotFoundError')
      sendError(404, `Store with id: ${req.params.id}, not found`, e, res)
    else
      sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiUpdate(req, res) {
  try {
    const updatedStore = await Store.findByIdAndUpdate(req.params.id, req.body, {new:true}).exec()
    res.status(200).json(updatedStore)
  } catch (e) {
    if (e.name === 'ValidationError')
      sendError(403, 'Validation Error', e, res)
    else if (e.name === 'CastError')
      sendError(404, `Store with id: ${req.params.id}, not found`, e, res)
    else if (e.code === 11000)
      sendError(409, 'Duplicated Name', e, res)
    else
      sendError(500, 'Unexpected Error', e, res)

  }
}
