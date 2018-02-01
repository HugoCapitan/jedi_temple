const CustomField = require('../models/CustomField')

module.exports = async () => {
  try {
    const PriceCustom   = await CustomField.findOne({ slug: 'price' }).exec()
    const HMModelCustom = await CustomField.findOne({ slug: 'hmmodel' }).exec()
    const MaterialCustom = await CustomField.findOne({ slug: 'material' }).exec()
    
    if (!PriceCustom) await savePriceCustom()
    if (!HMModelCustom) await saveHMModelCustom()
    if (!MaterialCustom) await saveMaterialCustom()

  } catch (e) {
    console.log('ERROR ON DATA INIT: ', e)
  }
}

async function saveHMModelCustom () {
  const HMModelCustom = await new CustomField({ 
    name: 'HMModel',
    type: 'string',
    show: false,
    values: [{ value: 'Niño, Niña' }]
  }).save()
  .catch(e => { throw e })
}

async function saveMaterialCustom() {
  const MaterialCustom = await new CustomField({
    name: 'Material',
    type: 'string',
    values: [{ value: '24K Gold' }, { value: '14K Gold' }],
    show: true
  }).save()
  .catch(e => { throw e })
}

async function savePriceCustom () {
  const PriceCustom = await new CustomField({
    name: 'Price',
    type: 'number',
    show: false,
    min: 'auto',
    max: 'auto',
    unit: 'US$ ',
    unit_place: 'before'    
  }).save()
  .catch(e => { throw e })
}