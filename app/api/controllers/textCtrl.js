const Text = require('../models/Text')

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
    let all = await Text.find()
    res.status(200).json(all)
  } catch (e) {
    sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiCreate(req, res) {
  try {
    let newText = await new Text(req.body).save()
    res.status(200).json(newText)
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
    const foundText = await Text.findById(req.params.id)
    if (!foundText) {
      let notFoundError = new Error(`Text ${req.params.id} not found`)
      notFoundError.name = 'NotFoundError'
      throw notFoundError
    }

    res.status(200).json(foundText)
  } catch(e) {
    if (e.name === 'NotFoundError')
      sendError(404, `Text ${req.params.id} not found`, e, res)
    else
      sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiRemove(req, res) {
  try {
    const removedText = await Text.findByIdAndRemove(req.params.id)

    if (!removedText) {
      let notFoundError = new Error(`Text ${req.params.id} not found`)
      notFoundError.name = "NotFoundError"
      throw notFoundError
    }

    res.status(200).send(`Text ${removedText._id} deleted`)
  } catch (e) {
    if (e.name === 'CastError' || e.name === 'NotFoundError')
      sendError(404, `Text ${req.params.id} not found`, e, res)
    else
      sendError(500, 'Unexpected Error', e, res)
  }
}

async function apiUpdate(req, res) {
  try {
    await Text.findByIdAndUpdate(req.params.id, req.body)
    const updatedText = await Text.findById(req.params.id)

    res.status(200).json(updatedText)
  } catch (e) {
    if (e.name === 'ValidationError')
      sendError(403, 'Validation Error', e, res)
    else if (e.name === 'CastError')
      sendError(404, `Text ${req.params.id} not found`, e, res)
    else if (e.code === 11000)
      sendError(409, 'Duplicated Name', e, res)
    else
      sendError(500, 'Unexpected Error', e, res)

  }
}
