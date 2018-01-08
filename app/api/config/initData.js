const CustomField = require('../models/CustomField')
const CustomFieldCtrl = require('../controllers/customFieldCtrl')

module.exports = async () => {
  const PriceCustom   = await CustomField.findOne({ slug: 'price' })
  const HMModelCustom = await CustomField.findOne({ slug: 'hmmodel' })
  const MaterialCustom = await CustomField.findOne({ slug: 'material' })

  try {
    
    if (!PriceCustom) savePriceCustom()
    if (!HMModelCustom) saveHMModelCustom()
    if (!MaterialCustom) saveMaterialCustom()

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

async function saveMaterialCustom() {
  const MaterialCustom = await CustomFieldCtrl.create({
    name: 'Material',
    type: 'string',
    values: ['24K Gold', '14K Gold'],
    show: true
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