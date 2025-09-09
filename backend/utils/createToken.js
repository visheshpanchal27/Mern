import jwt from 'jsonwebtoken';

const createToken = (res, userId, clientType = 'web') => {
  const isWeb = clientType === 'web';
  const secret = isWeb ? process.env.JWT_WEB_SECRET : process.env.JWT_MOBILE_SECRET;
  const cookieName = isWeb ? 'webToken' : 'mobileToken';
  
  const token = jwt.sign({ userId, clientType }, secret, {
    expiresIn: '30d',
  });

  // Don't set cookies - use only localStorage tokens

  return token;
};

export default createToken;