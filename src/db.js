import mongo from "mongodb";
const { MongoClient } = mongo;

const url = process.env.MONGO_URL; // loads in the DB connection string variable

export const client = new MongoClient(url, { useNewUrlParser: true }); // exports the client connections string etc

// function used to connect to the DB
export async function connectDb() {
  try {
    await client.connect(); // creates the connection to the mongo DB 

    // confirm the connection
    await client.db("admin").command({ ping: 1 });
    console.log("🗄 Connected to DB Success!");
  } catch (error) {
    // if there is a problem , this will log it and close the DB connection
    console.error(error);
    await client.close();
  }
}
