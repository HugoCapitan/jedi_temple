const jwt  = require('express-jwt')
const jwks = require('jwks-rsa')

module.exports = router => {
  const jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: 'https://hookahdev.auth0.com/.well-known/jwks.json'
    }),
    audience: 'https://ventadmin.unahil.com',
    issuer: 'https://hookahdev.auth0.com/',
    algorithms: ['RS256']
  })

  const sendUnauthorized = (err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      res.status(401).json({message:'Missing or invalid token'});
    }
  }

  const guard = (req, res, next) => {
    const generalPerms = {
      'GET':    ['clients', 'paypal', 'pictures', 'stores', 'texts', 'messages', 'tops'],
      'POST':   ['clients', 'paypal', 'messages'],
      'PUT':    ['clients'],
      'DELETE': ['clients']
    }
    const storePerms = {
      'GET':  ['custom_fields', 'hm_products', 'orders', 'products'],
      'POST': ['orders'],
      'PUT':  ['orders']
    }
    const unahilPerms = {
      'GET':  ['reservations'],
      'POST': ['reservations'],
      'PUT':  ['reservations']
    }

    const scope  = req.user.scope
    const method = req.method
    const path   = req.path.split('/')[1]
    
    if (scope === 'admin' || generalPerms[method].includes(path) || 
       (scope === 'store' && storePerms[method].includes(path)) ||
       (scope === 'unahil' && unahilPerms[method].includes(path)) )
      next()
    else
      res.status(403).send({message: 'Forbidden'})
  }

  const validateOptions = (req, res, next) => {
    if (req.method === 'OPTIONS')
      res.status(200).send('all good boi')

    next()
  }
  
  router.use(validateOptions)
  router.use(jwtCheck)
  router.use(sendUnauthorized)
  router.use(guard)
}
