const axios = require('axios')

const CustomField = require('../models/CustomField')
const paypalCtrl = require('../controllers/paypalCtrl')

module.exports = async () => {
  try {
    const PriceCustom   = await CustomField.findOne({ slug: 'price' }).exec()
    const HMModelCustom = await CustomField.findOne({ slug: 'hmmodel' }).exec()
    const MaterialCustom = await CustomField.findOne({ slug: 'material' }).exec()
    
    if (!PriceCustom) await savePriceCustom()
    if (!HMModelCustom) await saveHMModelCustom()
    if (!MaterialCustom) await saveMaterialCustom()

    // get esperiences within this paypal app
    const experiences = await paypalCtrl.getRemoteExperiences()
    // reduce to get store experiences
    const storesXps = experiences.reduce((acc, current) => {
      if (current.name === 'TuchaDesigns Store Payment'
       || current.name === 'Kampamocha Store Payment'
       || current.name === 'Unahil Payment')
        acc.push(current)

      return acc
    }, [])

    // if stores not complete, destroy all and create all
    const destroys = []
    if (storesXps.length != 3) {
      for (const xp of experiences) { destroys.push(paypalCtrl.destroyExperience(xp)) }
      await Promise.all(destroys)
      await paypalCtrl.initXps()
    } else {
      for (const xp of experiences) {
        if (xp.name === 'Kampamocha Store Payment') process.env.NODE_PP_KAMPA_XP = JSON.stringify(xp)
        if (xp.name === 'TuchaDesigns Store Payment') process.env.NODE_PP_TUCHA_XP = JSON.stringify(xp)
        if (xp.name === 'Unahil Payment') process.env.NODE_PP_UNAHIL_XP = JSON.stringify(xp)
      }
    }
    
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