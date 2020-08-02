const OktaJwtVerifier = require('@okta/jwt-verifier');

const oktaJwtVerifier = new OktaJwtVerifier({ issuer: process.env.ISSUER });

module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization)
      throw new Error('You must send an Authorization header');

    const [authType, token] = authorization.trim().split(' ');
    if (authType !== 'Bearer') throw new Error('Expected a Bearer token');

    const result = await oktaJwtVerifier.verifyAccessToken(
      token,
      'api://default'
    );
    console.log('Auth result', result);
    const { claims } = result;
    if (!claims.scp.includes(process.env.SCOPE)) {
      throw new Error('Could not verify the proper scope');
    }
    req.userClaims = claims;
    next();
  } catch (error) {
    res.status(401);
    return res.json(error);
  }
};
