const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Obtener el token del header
  const token = req.header('Authorization');

  // Comprobar si no hay token
  if (!token) {
    return res.status(401).json({ message: 'No hay token, autorización denegada.' });
  }

  try {
    // Verificar token (Bearer token)
    const tokenParts = token.split(' ');
    const tokenToVerify = tokenParts.length === 2 ? tokenParts[1] : tokenParts[0];
    
    const decoded = jwt.verify(tokenToVerify, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'El token no es válido.' });
  }
};
