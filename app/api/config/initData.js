const CustomField = require('../models/CustomField')

module.exports = async () => {
  const PriceCustom = await CustomField.findOne({ slug: 'price' })
  const HMModelCustom = await CustomField.findOne({ slug: 'hmmodel' })

  try {
    
    if (!PriceCustom) savePriceCustom()
    if (!HMModelCustom) saveHMModelCustom()

  } catch (e) {
    console.log('ERROR ON DATA INIT: ', e)
  }
}

function saveHMModelCustom () {
  console.log('Saving HMModelCustom')
}

function savePriceCustom () {
  console.log('Saving PriceCustom')  
}