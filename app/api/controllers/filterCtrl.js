const Filter = require('../models/Filter')

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

async function create(newFilter) {
  try {
    const addedFilter = await new Filter(newFilter).save()
    return addedFilter
  } catch (e) {
    e.customOrigin = 'Filter'
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
    const deletedFilter = await Filter.findByIdAndRemove(id)
    return deletedFilter
  } catch (e) {
    e.customOrigin = 'Filter'
    if (e.name === 'CastError')
      e.customMessage = `Filter ${id} not found`
    else
      e.customMessage = 'Unexpected Error'

    throw e
  }
}

async function update(id, newFilter) {
  try {
    await Filter.find ({_id: slug}, newFilter)
    const updatedFilter = await Filter.findById(id)
    return updatedFilter
  } catch (e) {
    e.customOrigin = 'Filter'
    if (e.name === 'ValidationError')
      e.customMessage = 'Validation Error'
    else if (e.name === "CastError")
      e.customMessage = `Filter ${id} not found`
    else if (e.code === 11000)
      e.customMessage = 'Duplicated Name'
    else
      e.customMessage = 'Unexpected Error'
    
    throw e
  }
}

async function apiAll(req, res) {
  try {
    let all = await Filter.find()
    res.status(200).json(all)
  } catch (e) {
    sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiCreate(req, res) {
  try {
    let newFilter = await new Filter(req.body).save()
    res.status(200).json(newFilter)
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
    const foundFilter = await Filter.findById(req.params.id)
    if (!foundFilter) {
      let notFoundError = new Error(`Filter ${req.params.id} not found`)
      notFoundError.name = 'NotFoundError'
      throw notFoundError
    }

    res.status(200).json(foundFilter)
  } catch(e) {
    if (e.name === 'NotFoundError')
      sendError(404, `Filter ${req.params.id} not found`, e, res)
    else
      sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiRemove(req, res) {
  try {
    const removedFilter = await Filter.findByIdAndRemove(req.params.id)

    if (!removedFilter) {
      let notFoundError = new Error(`Filter ${req.params.id} not found`)
      notFoundError.name = "NotFoundError"
      throw notFoundError
    }

    res.status(200).send(`Filter ${removedFilter._id} deleted`)
  } catch (e) {
    if (e.name === 'CastError' || e.name === 'NotFoundError')
      sendError(404, `Filter ${req.params.id} not found`, e, res)
    else
      sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiUpdate(req, res) {
  try {
    await Filter.findByIdAndUpdate(req.params.id, req.body)
    const updatedFilter = await Filter.findById(req.params.id)

    res.status(200).json(updatedFilter)
  } catch (e) {
    if (e.name === 'ValidationError')
      sendError(403, 'Validation Error', e, res)
    else if (e.name === 'CastError')
      sendError(404, `Filter ${req.params.id} not found`, e, res)
    else if (e.code === 11000)
      sendError(409, 'Duplicated Name', e, res)
    else
      sendError(500, 'Unexpected Error', e, res)

  }
}
