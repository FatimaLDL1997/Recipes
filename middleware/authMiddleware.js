import {
  UnauthenticatedError,
  UnauthorizedError,
  BadRequestError,
} from "../errors/customError.js";
import { verifyJWT } from "../utils/tokenUtils.js";

export const authenticateUser = (req, res, next) => {
  console.log("auth middleware");
  console.log(req.cookies);
  const { token } = req.cookies;
  if (!token) {
    throw new UnauthenticatedError("authentication invalid1");
  }
  // verify if jwt is valid, then grab user id and role transmitted in the payload
  try {
    const { userId, role } = verifyJWT(token);
    const testUser = userId === '66a33d778ece353192b30b0c'
    req.user = { userId, role, testUser };
    next(); // so it can pass on to the next middleware
  } catch (error) {
    throw new UnauthenticatedError("authentication invalid2");
  }
};
export const authorizePermissions = (...roles) => {
  console.log(roles);
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      // if roles 'admin' sent through the argument in userRouter matches the role of the user, then its ok
      throw new UnauthorizedError("Unauthorized to access this route");
    }
    next();
  };
};

export const checkForTestUser = (req, res, next) =>{
  if(req.user.testUser) throw new BadRequestError('Demo User. Read Only!'); 
  next()
}