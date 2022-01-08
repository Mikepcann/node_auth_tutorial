import "./env.js"; // lets you use the .env file
import { fastify } from "fastify"; //server library
import fastifyStatic from "fastify-static"; // plugin for static file library
import fastifyCookie  from "fastify-cookie";
import path from "path"; // default node library
import { fileURLToPath } from "url";
import { connectDb } from "./db.js";
import { registerUser } from "./accounts/register.js";
import { authorizeUser } from "./accounts/authorize.js";
import { logUserIn } from "./accounts/logUserIn.js";
import { logUserOut } from "./accounts/logUserOut.js";
import { getUserFromCookies } from "./accounts/user.js";

// ESM specific features
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = fastify(); // creates the app

// Connects the database and then turns on the server
connectDb().then(() => {
  startApp(); // starts the app
});


// starts the application 
async function startApp() {
  try {
    // Registers middleware functions
    app.register(fastifyCookie, {
      secret: process.env.COOKIE_SIGNATURE
    })

    // try catch is used with the async await
    app.register(fastifyStatic, {
      // sets up the path for the routing by registering a public directory of files
      root: path.join(__dirname, "public"),
    });

    // post request path to register a new user
    app.post("/api/register", {}, async (request, reply) => {
      try {
        const userId = await registerUser(
          request.body.email, 
          request.body.password
        )
       
        if(userId){
          await logUserIn(userId, request,reply)

          reply.send({
            data: {
              status: 'SUCCESS',
              userId
            }
          })
        } 
      } catch (e) {
        console.error(e)
        reply.send({
          data: {
            status: 'FAILED',
          }
        })
      }
    });

    // used to Authorize a user
    app.post("/api/authorize", {}, async (request, reply) => {
      try {
        const { isAuthorized, userId } = await authorizeUser(
          request.body.email,
          request.body.password
        )
        
        if(isAuthorized){
          await logUserIn(userId, request, reply)
          reply.send({
            data: {
              status: 'SUCCESS',
              userId
            }
          })
        } 
          
      

      } catch (e) {
         console.error(e)
         reply.send({
          data: {
            status: 'FAILED',
          }
        })
      }
      });

       // post request to log the user out
    app.post("/api/logout", {}, async (request, reply) => {
      try {
        await logUserOut(request, reply)
        reply.send({
          data: {
            status: 'SUCCESS'
          }
        })
      } catch (e) {
        console.error(e)
        reply.send({
          data: {
            status: 'FAILED',
          }
        })
      }
    });

      // test route to check user cookies
      app.get('/test',{}, async (request, reply) => {
        try {
            // Verify user login
            const user = await getUserFromCookies(request, reply)
            // Return the user Email if exists, otherwise return unauthorized
            
            if(user?._id){
              reply.send({
                data: user
              })
            } else {
              reply.send({
                data: "User lookup failed"
              })

            }
        } catch (e) {
          throw new Error(e)
        }
       
      })

    // tell the app to listen
    await app.listen(3000); // returns a promise, thats why we are using the await
    console.log("🚀 Server listening at port: 3000");
  } catch (e) {
    console.error(e); // this just catches the errors
  }
}


