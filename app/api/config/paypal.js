

module.exports = {
  clientId: process.env.PP_CLIENT_ID,
  clientSecret: process.env.PP_CLIENT_SECRET,
  tokenUrl: 'https://api.sandbox.paypal.com/v1/oauth2/token',
  xpUrl: 'https://api.sandbox.paypal.com/v1/payment-experience/web-profiles',
  payUrl: 'https://api.sandbox.paypal.com/v1/payments/payment',
  xpUnahilJson: JSON.stringify({
    name: 'Unahil Payment Test',
    temporary: true,
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
