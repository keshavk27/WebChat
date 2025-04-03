class ErrorHandler extends Error{
    constructor(message, statusCode ){           //it will take message and statuscode
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this,this.constructor)
    }
}

export const errorHandler=ErrorHandler;