import jwt from 'jsonwebtoken'
import mongo from 'mongodb'
const { ObjectId } = mongo

const JWTSignature = process.env.JWT_SIGNATURE
export async function getUserFromCookies(request){
    try {
        const { user } = await import('../user/user.js')
        // check to make sure access token exists
            //this uses option chaining ?.
        if(request?.cookies?.accessToken){
             // If access Token
            const { accessToken } = request.cookies
            // Decode access token
            const decodedAccessToken = jwt.verify(accessToken, JWTSignature)
            console.log  ('decodedAccessToken', decodedAccessToken)
            // return user from record
            return await user.findOne({
                _id: ObjectId(decodedAccessToken?.userId),
            }) 
          
        }
    
       
        // Get the access and refresh tokens
       
       
       
        // Decode refresh token
        // lookup session
        // confirm session is valid
        // if session is valid 
        // look up current user
        // refresh tokens
        // return current user
    } catch (e) {
        console.error(e)
    }
}

export async function refreshTokens(){
    try {
        
    } catch (e) {
        console.error(e)
    }
}
