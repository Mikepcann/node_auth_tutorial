import bcrypt from 'bcryptjs'
//import { user } from '../user/user.js'
const { genSalt, hash } = bcrypt

export async function  registerUser(email, password) {

    // this is a dynamic import of the user, only called when its needed
    // uses import as a function, where the path is passed in as a param 
    const { user } = await import('../user/user.js')

    // generate salt
    const salt =  await genSalt(10)
   // console.log("salt " + salt)

    // hash with salt
    const hashedPassword =  await hash(password, salt)
    //console.log("Hashed Password " + hashedPassword)
    
    // store in DB
    const result = await user.insertOne({
        email: {
            address: email,
            verified: false
        },
        password: hashedPassword
    })
    
    // return user from database
    return result.insertedId
} 
    
