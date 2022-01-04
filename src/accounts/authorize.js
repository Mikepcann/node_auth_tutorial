import bcrypt from 'bcryptjs'
const { compare } = bcrypt

export async function authorizeUser(email,password){
    // import user collection
    const { user } = await import('../user/user.js')

    // Loop up user
    const userData = await user.findOne({
        'email.address': email
    })
    console.log("user data: ",userData)
    // Get user password
    const savedPassword = userData.password

    // Compare the password with one in the DB
    const isAuthorized = await compare(password, savedPassword)
    console.log("Authorized", isAuthorized)
    // return boolean of if Password is correct
    return isAuthorized
}
