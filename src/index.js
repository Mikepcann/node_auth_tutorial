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
import { getUserFromCookies } from "./accounts/user.js";

// ESM specific features
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = fastify(); // creates the app

// this is accessing the environment variable without hard coding it
//console.log(process.env.MONGO_URL);

async function startApp() {
  try {

    app.register(fastifyCookie, {
      secret: process.env.COOKIE_SIGNATURE
    })

    // try catch is used with the async await
    app.register(fastifyStatic, {
      // sets up the path for the routing by registering a public directory of files
      root: path.join(__dirname, "public"),
    });



    app.post("/api/register", {}, async (request, reply) => {
      try {
        const userID = await registerUser(
          request.body.email, 
          request.body.password
        )
        //console.log(userID)
        reply.send({
          data: "hi mike!"
        })
      } catch (error) {
      // console.error(error)
      }
    });

    app.post("/api/authorize", {}, async (request, reply) => {
      try {
       // console.log(request.body.email, request.body.password)
        
        const { isAuthorized, userId } = await authorizeUser(
          request.body.email,
          request.body.password
        )
        
        if(isAuthorized){
          await logUserIn(userId, request, reply)
          reply.send({
            data: 'User Logged in',
          })
        } else {
          reply.send({
            data: 'User NOT logged in.'
          })
        }

        
      } catch (error) {
         console.error(error)
      }
      });

      app.get('/test',{}, async (request, reply) => {
        try {
           // Verify user login
        const user = await getUserFromCookies(request)
        // Return the user Email if exists, otherwise return unauthorized
        
        if(user?._id){
          reply.send({
            data: user
          })
        } else {
          reply.send({
            stuff: "User lookup failed"
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

connectDb().then(() => {
  startApp(); // starts the app
});
