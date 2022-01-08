import { createSession } from "./session.js";
import { createTokens  } from "./token.js";
import { refreshTokens } from './user.js'

export async function logUserIn(userId, request, reply){
    
    const connectionInformation = {
        ip: request.ip,
        userAgent: request.headers["user-agent"],
    }

    // create session
    const sessionToken = await createSession(userId, connectionInformation)
    
    // Create JWT
    // Set cookies
    await refreshTokens(sessionToken, userId, reply)
}
