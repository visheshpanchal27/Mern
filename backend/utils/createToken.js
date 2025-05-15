import jwt from 'jsonwebtoken';

const createToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  // Set cookie
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  // Also return token for header-based auth
  return token;
};

export default createToken;