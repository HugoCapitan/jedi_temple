const environment = process.env.NODE_ENV
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
    executeUrl: getUrl('kampa', 'exec'), cancelUrl: getUrl('kampa', 'canc')
  },
  tuchaOpts: {
    executeUrl: getUrl('tucha', 'exec'), cancelUrl: getUrl('tucha', 'canc')
  },
  unahilOpts: {
    executeUrl: getUrl('unahil', 'exec'), cancelUrl: getUrl('unahil', 'canc')
  },
  tuchaOpts: {},
  unahilOpts: {},
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
  if (environment === 'development') start = devHost
  if (environment === 'production' && store === 'kampa')  start = prodKpHost
  if (environment === 'production' && store === 'tucha')  start = prodTcHost
  if (environment === 'production' && store === 'unahil') start = prodUhHost
  end = opt === 'exec' ? '/payment/confirm' : '/payment/cancel'
  return `${start}${end}`
}
