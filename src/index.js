import "./env.js"; // lets you use the .env file
import { fastify } from "fastify"; //server library
import fastifyStatic from "fastify-static"; // plugin for static file library
import path from "path"; // default node library
import { fileURLToPath } from "url";
import { connectDb } from "./db.js";
import { registerUser } from "./accounts/register.js";

// ESM specific features
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = fastify(); // creates the app

// this is accessing the environment variable without hard coding it
//console.log(process.env.MONGO_URL);

async function startApp() {
  try {
    // try catch is used with the async await
    app.register(fastifyStatic, {
      // sets up the path for the routing by registering a public directory of files
      root: path.join(__dirname, "public"),
    });

    app.post("/api/register", {}, async (request, reply) => {
    try {
      const userID = await registerUser(request.body.email, request.body.password)
      console.log(userID)
    } catch (error) {
      console.error(error)
    }
    });

    /* 
        This just automatically sets up the server to listen to a get request on the /
        and sent it a specific response
    */
    // app.get('/', {}, (request, reply) =>{
    //     reply.send({
    //         data: 'Hello world',
    //     })
    // }) // type of request to handle

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
