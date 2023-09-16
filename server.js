const dotenv = require('dotenv');
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const mongoose = require('mongoose');
const { merge } = require('lodash');
const { applyMiddleware } = require ('graphql-middleware');

const { makeExecutableSchema } = require('@graphql-tools/schema');

const { userTypeDef } = require('./graphql/users/user_typdefs')
const { userResolver } = require('./graphql/users/user_resolver')
const { middlewareAuth } = require('./graphql/middleware/auth');

// ***** Set up Global configuration access
dotenv.config();

const typeDefs = [
  userTypeDef
]

const resolvers = merge(
  userResolver
)

const schema = makeExecutableSchema({ typeDefs, resolvers });
const schemaWithMiddleware = applyMiddleware(schema, middlewareAuth);
const server = new ApolloServer({
  schema: schemaWithMiddleware,
});

startServer()

// ***** function start server
async function startServer(){
  const serverUrl = process.env.DB_URL;
  const database = process.env.DB_NAME;
  const port = process.env.PORT;
  const atlas = process.env.DB_ATLAS

  // ***** connect to db
  try {
    // await mongoose.connect(`${serverUrl}/${database}`);
    await mongoose.connect(`${atlas}`);    
    console.log(`🚀 Connected to ${database}: atlas`);
  } catch (err) {
    console.log('Failed to connect to MongoDB', err);
  }
    
  const { url } = await startStandaloneServer(server, {
    listen: { port: port },
    context: ( {req} ) => ({req}),
  });

  console.log(`🚀 Server ready at: ${url}`);
}

