require('dotenv').config();
const jwt = require('jsonwebtoken');

function isUserLoggedIn(req, res, next) {
  const authorizationHeader = req.headers.authorization;

  console.log(authorizationHeader);

  if (!authorizationHeader) {
    return res.status(401).json({ message: `No authorization header` });
  }
  const authorizationValue = authorizationHeader.split(' ');

  const tokenType = authorizationValue[0];

  const tokenValue = authorizationValue[1];

  try {
    if (tokenType == 'Bearer') {
      const decoded = jwt.verify(tokenValue, process.env.SECRET);
      req.decoded = decoded;
      next();
      return;
    }
    res.status(401).json({ message: `Not authorized to access this route.` });
  } catch (error) {
    console.log(`JWT configuration error:`, error);
    return res.status(401).json({ message: `Invalid token` });
  }
}

module.exports = { isUserLoggedIn };
