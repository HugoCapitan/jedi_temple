const Picture = require('../models/Picture')

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

async function create(newPicture) {
  try {
    const addedPicture = await new Picture(newPicture).save()
    return addedPicture
  } catch (e) {
    e.customOrigin = 'Picture'
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
    const deletedPicture = await Picture.findByIdAndRemove(id)
    return deletedPicture
  } catch (e) {
    e.customOrigin = 'Picture'
    if (e.name === 'CastError')
      e.customMessage = `Picture ${id} not found`
    else
      e.customMessage = 'Unexpected Error'

    throw e
  }
}

async function update(id, newPicture) {
  try {
    await Picture.find ({_id: slug}, newPicture)
    const updatedPicture = await Picture.findById(id)
    return updatedPicture
  } catch (e) {
    e.customOrigin = 'Picture'
    if (e.name === 'ValidationError')
      e.customMessage = 'Validation Error'
    else if (e.name === "CastError")
      e.customMessage = `Picture ${id} not found`
    else if (e.code === 11000)
      e.customMessage = 'Duplicated Name'
    else
      e.customMessage = 'Unexpected Error'
    
    throw e
  }
}

async function apiAll(req, res) {
  try {
    let all = await Picture.find()
    res.status(200).json(all)
  } catch (e) {
    sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiCreate(req, res) {
  try {
    let newPicture = await new Picture(req.body).save()
    res.status(200).json(newPicture)
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
    const foundPicture = await Picture.findById(req.params.id)
    if (!foundPicture) {
      let notFoundError = new Error(`Picture ${req.params.id} not found`)
      notFoundError.name = 'NotFoundError'
      throw notFoundError
    }

    res.status(200).json(foundPicture)
  } catch(e) {
    if (e.name === 'NotFoundError')
      sendError(404, `Picture ${req.params.id} not found`, e, res)
    else
      sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiRemove(req, res) {
  try {
    const removedPicture = await Picture.findByIdAndRemove(req.params.id)

    if (!removedPicture) {
      let notFoundError = new Error(`Picture ${req.params.id} not found`)
      notFoundError.name = "NotFoundError"
      throw notFoundError
    }

    res.status(200).send(`Picture ${removedPicture._id} deleted`)
  } catch (e) {
    if (e.name === 'CastError' || e.name === 'NotFoundError')
      sendError(404, `Picture ${req.params.id} not found`, e, res)
    else
      sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiUpdate(req, res) {
  try {
    await Picture.findByIdAndUpdate(req.params.id, req.body)
    const updatedPicture = await Picture.findById(req.params.id)

    res.status(200).json(updatedPicture)
  } catch (e) {
    if (e.name === 'ValidationError')
      sendError(403, 'Validation Error', e, res)
    else if (e.name === 'CastError')
      sendError(404, `Picture ${req.params.id} not found`, e, res)
    else if (e.code === 11000)
      sendError(409, 'Duplicated Name', e, res)
    else
      sendError(500, 'Unexpected Error', e, res)

  }
}
