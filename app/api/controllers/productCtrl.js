const INSERTMODEL = require('../models/INSERTMODEL')

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

async function create(newINSERTMODEL) {
  try {
    const addedINSERTMODEL = await new INSERTMODEL(newINSERTMODEL).save()
    return addedINSERTMODEL
  } catch (e) {
    e.customOrigin = 'INSERTMODEL'
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
    const deletedINSERTMODEL = await INSERTMODEL.findByIdAndRemove(id)
    return deletedINSERTMODEL
  } catch (e) {
    e.customOrigin = 'INSERTMODEL'
    if (e.name === 'CastError')
      e.customMessage = `INSERTMODEL ${id} not found`
    else
      e.customMessage = 'Unexpected Error'

    throw e
  }
}

async function update(id, newINSERTMODEL) {
  try {
    await INSERTMODEL.find ({_id: slug}, newINSERTMODEL)
    const updatedINSERTMODEL = await INSERTMODEL.findById(id)
    return updatedINSERTMODEL
  } catch (e) {
    e.customOrigin = 'INSERTMODEL'
    if (e.name === 'ValidationError')
      e.customMessage = 'Validation Error'
    else if (e.name === "CastError")
      e.customMessage = `INSERTMODEL ${id} not found`
    else if (e.code === 11000)
      e.customMessage = 'Duplicated Name'
    else
      e.customMessage = 'Unexpected Error'
    
    throw e
  }
}

async function apiAll(req, res) {
  try {
    let all = await INSERTMODEL.find()
    res.status(200).json(all)
  } catch (e) {
    sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiCreate(req, res) {
  try {
    let newINSERTMODEL = await new INSERTMODEL(req.body).save()
    res.status(200).json(newINSERTMODEL)
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
    const foundINSERTMODEL = await INSERTMODEL.findById(req.params.id)
    if (!foundINSERTMODEL) {
      let notFoundError = new Error(`INSERTMODEL ${req.params.id} not found`)
      notFoundError.name = 'NotFoundError'
      throw notFoundError
    }

    res.status(200).json(foundINSERTMODEL)
  } catch(e) {
    if (e.name === 'NotFoundError')
      sendError(404, `INSERTMODEL ${req.params.id} not found`, e, res)
    else
      sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiRemove(req, res) {
  try {
    const removedINSERTMODEL = await INSERTMODEL.findByIdAndRemove(req.params.id)

    if (!removedINSERTMODEL) {
      let notFoundError = new Error(`INSERTMODEL ${req.params.id} not found`)
      notFoundError.name = "NotFoundError"
      throw notFoundError
    }

    res.status(200).send(`INSERTMODEL ${removedINSERTMODEL._id} deleted`)
  } catch (e) {
    if (e.name === 'CastError' || e.name === 'NotFoundError')
      sendError(404, `INSERTMODEL ${req.params.id} not found`, e, res)
    else
      sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiUpdate(req, res) {
  try {
    await INSERTMODEL.findByIdAndUpdate(req.params.id, req.body)
    const updatedINSERTMODEL = await INSERTMODEL.findById(req.params.id)

    res.status(200).json(updatedINSERTMODEL)
  } catch (e) {
    if (e.name === 'ValidationError')
      sendError(403, 'Validation Error', e, res)
    else if (e.name === 'CastError')
      sendError(404, `INSERTMODEL ${req.params.id} not found`, e, res)
    else if (e.code === 11000)
      sendError(409, 'Duplicated Name', e, res)
    else
      sendError(500, 'Unexpected Error', e, res)

  }
}
