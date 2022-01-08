import jwt from 'jsonwebtoken'
const JWTSignature = process.env.JWT_SIGNATURE

export async function logUserOut(request, reply){
    try {
        const { session } = await import('../session/session.js')

        if(request?.cookies?.refreshToken){
            // Get refresh Token
            const { refreshToken } = request.cookies 

            // Decode refresh token
            const  { sessionToken } =  jwt.verify(refreshToken, JWTSignature)
            
            // delete DB record for session
            await session.deleteOne({ sessionToken })
        }

        // Remove cookies
        reply.clearCookie('refreshToken').clearCookie('accessToken')
        
    } catch (e) {
        console.error(e)
    }
}
