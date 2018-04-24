const axios = require('axios')

const CustomField = require('../models/CustomField')
const paypalCtrl = require('../controllers/paypalCtrl')

const experiences = require('./initial_data/paypal_experiences')

module.exports = async () => {
  try {
    const PriceCustom   = await CustomField.findOne({ slug: 'kampamocha__price' }).exec()
    const HMModelCustom = await CustomField.findOne({ slug: 'kampamocha__hmmodel' }).exec()
    const MaterialCustom = await CustomField.findOne({ slug: 'kampamocha__material' }).exec()
    
    if (!PriceCustom) await savePriceCustom()
    if (!HMModelCustom) await saveHMModelCustom()
    if (!MaterialCustom) await saveMaterialCustom()

    await cleanExperiences()
    
  } catch (e) {
    console.log('ERROR ON DATA INIT: ', e)
  }
}

async function saveHMModelCustom () {
  const HMModelCustom = await new CustomField({ 
    name: 'HMModel',
    type: 'string',
    store: 'kampamocha',
    show: false,
    values: [{ value: 'Niño, Niña' }]
  }).save()
  .catch(e => { throw e })
}

async function saveMaterialCustom() {
  const MaterialCustom = await new CustomField({
    name: 'Material',
    type: 'string',
    store: 'kampamocha',
    values: [{ value: '24K Gold' }, { value: '14K Gold' }],
    show: true,
    filter: true
  }).save()
  .catch(e => { throw e })
}

async function savePriceCustom () {
  const PriceCustom = await new CustomField({
    name: 'Price',
    type: 'number',
    store: 'kampamocha',
    show: false,
    filter: true,
    min: 'auto',
    max: 'auto',
    unit: 'US$ ',
    unit_place: 'before'    
  }).save()
  .catch(e => { throw e })
}

async function cleanExperiences() {
  try {
    paypalCtrl.removeExperience('unahil')
    paypalCtrl.removeExperience('kampamocha')
    paypalCtrl.removeExperience('tucha_designs')

    paypalCtrl.createExperience(experiences.unahil)
    paypalCtrl.createExperience(experiences.kampamocha)
    paypalCtrl.createExperience(experiences.tucha_designs)
  } catch(e) {
    console.log(e)
  }
}
