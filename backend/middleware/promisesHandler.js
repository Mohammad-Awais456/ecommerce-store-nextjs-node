
export const promisesHandler = (promisesHandlerMiddleWare) => (req,res,next)=>
{
 Promise.resolve(promisesHandlerMiddleWare(req,res,next)).catch(next);
}