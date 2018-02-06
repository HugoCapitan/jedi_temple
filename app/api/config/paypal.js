const devHost = 'http://localhost:3000'
const prodKpHost = 'https://kampamocha.com'
const prodTcHost = 'https://tuchadesigns.com'
const prodUhHost = 'https://unahil.com'

module.exports = {
  clientId: process.env.PP_CLIENT_ID,
  clientSecret: process.env.PP_CLIENT_SECRET,
  tokenUrl: 'https://api.sandbox.paypal.com/v1/oauth2/token',
  xpUrl: 'https://api.sandbox.paypal.com/v1/payment-experience/web-profiles',
  payUrl: 'https://api.sandbox.paypal.com/v1/payments/payment',
  kampaOpts: {
    executeUrl: getUrl('kampamocha', 'exec'), cancelUrl: getUrl('kampamocha', 'canc')
  },
  tuchaOpts: {
    executeUrl: getUrl('tuchadesigns', 'exec'), cancelUrl: getUrl('tuchadesigns', 'canc')
  },
  unahilOpts: {
    executeUrl: getUrl('unahil', 'exec'), cancelUrl: getUrl('unahil', 'canc')
  },
  xpKampaReq: JSON.stringify({
    name: 'Kampamocha Store Payment',
    presentation: {
      brand_name: 'Kampamocha',
      locale_code: 'MX'
    },
    input_fields: {
      allow_note: false,
      no_shipping: 0,
      address_override: 1
    },
    flow_config: {
      landing_page_type: 'Billing',
      bank_txn_pending_url: "https://kampamocha.com"
    }
  }),
  xpTuchaReq: JSON.stringify({
    name: 'TuchaDesigns Store Payment',
    presentation: {
      brand_name: 'TuchaDesigns',
      locale_code: 'MX'
    },
    input_fields: {
      allow_note: false,
      no_shipping: 0,
      address_override: 1
    },
    flow_config: {
      landing_page_type: 'Billing',
      bank_txn_pending_url: "https://tuchadesigns.com"
    }
  }),
  xpUnahilReq: JSON.stringify({
    name: 'Unahil Payment',
    presentation: {
      brand_name: 'Unahil',
      locale_code: 'MX'
    },
    input_fields: {
      allow_note: false,
      no_shipping: 1,
      address_override: 0
    },
    flow_config: {
      landing_page_type: 'Billing',
      bank_txn_pending_url: "https://unahil.com"
    }
  })
}

function getUrl(store, opt) {
  let start = '', end = ''
  if (process.env.NODE_ENV === 'development') start = 'http://localhost:8080'
  if (process.env.NODE_ENV != 'development' && store === 'kampamocha')  start = prodKpHost
  if (process.env.NODE_ENV != 'development' && store === 'tuchadesigns')  start = prodTcHost
  if (process.env.NODE_ENV != 'development' && store === 'unahil') start = prodUhHost
  end = opt === 'exec' ? '/payment/success' : '/payment/failed'
  console.log(store)
  return `${start}${end}`
}
