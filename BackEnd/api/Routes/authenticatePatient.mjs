import { verifyToken } from '../Utils/jwtUtils.mjs';

const authenticatePatient = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'Missing token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token); 

    if (decoded.role !== 'patient') {
      return res.status(403).json({ msg: 'Access denied: Not a patient' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return res.status(401).json({ msg: 'Invalid token' });
  }
};

export default authenticatePatient;
