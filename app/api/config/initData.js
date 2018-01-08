const CustomField = require('../models/CustomField')
const CustomFieldCtrl = require('../controllers/customFieldCtrl')

module.exports = async () => {
  const PriceCustom   = await CustomField.findOne({ slug: 'price' })
  const HMModelCustom = await CustomField.findOne({ slug: 'hmmodel' })

  try {
    
    if (!PriceCustom) savePriceCustom()
    if (!HMModelCustom) saveHMModelCustom()

  } catch (e) {
    console.log('ERROR ON DATA INIT: ', e)
  }
}

async function saveHMModelCustom () {
  const HMModelCustom = await CustomFieldCtrl.create({ 
    name: 'HMModel',
    type: 'string',
    show: false,
    values: ['Niño, Niña']
  })
}

async function savePriceCustom () {
  const PriceCustom = await CustomFieldCtrl.create({
    name: 'Price',
    type: 'number',
    show: false,
    min: 'auto',
    max: 'auto',
    unit: 'US$ ',
    unit_place: 'before'    
  })
}