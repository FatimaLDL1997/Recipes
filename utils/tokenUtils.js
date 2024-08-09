import jwt from "jsonwebtoken";
//will send with cookies to securely transmit information back and forth

//we can pass anything we want in payload
//in this case it will be user id
// will send the jwt to the front end
// then front end will send it back with every request
// since jwt will be located in the cookie
// and it will be decoded in the server

export const createJWT = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

//verifyJWT will verify the payload being sent through createJWT
export const verifyJWT = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded;
};
