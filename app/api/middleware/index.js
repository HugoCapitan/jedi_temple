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
      'GET':    ['clients', 'paypal', 'pictures', 'stores', 'texts'],
      'POST':   ['clients', 'paypal'],
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

    console.log('path')
    
    if (scope === 'admin' || generalPerms[method].includes(path) || 
       (scope === 'store' && storePerms[method].includes(path)) ||
       (scope === 'unahil' && unahilPerms[method].includes(path)) )
      next()
    else
      res.status(403).send({message: 'Forbidden'})
     
  }
  
  router.use(jwtCheck)
  router.use(sendUnauthorized)
  router.use(guard)
}
