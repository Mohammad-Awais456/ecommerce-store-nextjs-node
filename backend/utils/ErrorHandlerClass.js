export class ErrorHandlerClass extends Error
{
     constructor(msg,status_code)
     {
      super(msg);
      this.statusCode = status_code || 500;
     //  this.code = msg.code ? msg.code : 0;
      // Capture the stack trace
    if (Error.captureStackTrace) {
     Error.captureStackTrace(this, this.constructor);
   }
     }
}

