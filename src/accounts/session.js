import { randomBytes } from 'crypto'

export async function createSession(userId, connection){
    try {
        // Generate a session Token
        const sessionToken = randomBytes(43).toString('hex')

        // retrieve connection information
        const { ip, userAgent } = connection

        // Insert session into to the DB
        const { session } = await import('../session/session.js')

        await session.insertOne({
            sessionToken,
            userId,
            valid : true,
            userAgent,
            ip,
            updatedAt: new Date(),
            createdAt: new Date(),
        })
        
        // Return session token
        return sessionToken
        
    } catch (error) {
        throw new Error('Session creation Failed')    
    }
}
