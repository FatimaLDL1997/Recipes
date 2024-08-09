import { StatusCodes } from "http-status-codes";

//404
export class NotFoundError extends Error {
    constructor(message){
        super(message); 
        this.name = 'NotFoundError'; 
        this.StatusCode = StatusCodes.NOT_FOUND; 
    }
}
//400
export class BadRequestError extends Error {
    constructor(message){
        super(message); 
        this.name = 'BadRequestError'; 
        this.StatusCode = StatusCodes.BAD_REQUEST; 
    }
}


//401
export class UnauthenticatedError extends Error {
    constructor(message){
        super(message); 
        this.name = 'UnauthenticatedError'; 
        this.StatusCode = StatusCodes.UNAUTHORIZED; 
    }
}

//401
export class UnauthorizedError extends Error {
    constructor(message){
        super(message); 
        this.name = 'UnauthorizedError'; 
        this.StatusCode = StatusCodes.FORBIDDEN; 
    }
}

